<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $cartItems = $user->cartItems()
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->with('notification', [
                'type' => 'info',
                'message' => 'Your cart is empty.',
            ]);
        }

        return DB::transaction(function () use ($cartItems, $user) {
            foreach ($cartItems as $cartItem) {
                if ($cartItem->quantity > $cartItem->product->stock_quantity) {
                    return back()->withErrors([
                        'quantity' => "Requested quantity exceeds available stock for {$cartItem->product->name}.",
                    ]);
                }
            }

            $totalAmount = $cartItems->reduce(function ($total, $cartItem) {
                return $total + ($cartItem->quantity * $cartItem->product->price);
            }, 0);

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'completed',
            ]);

            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                $unitPrice = $product->price;
                $totalPrice = $unitPrice * $cartItem->quantity;

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);

                $product->decrement('stock_quantity', $cartItem->quantity);
            }

            $user->cartItems()->delete();

            return back()->with('notification', [
                'type' => 'success',
                'message' => 'Order placed successfully.',
            ]);
        });
    }
}
