<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $cartItem = CartItem::firstOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        $newQuantity = $cartItem->exists
            ? $cartItem->quantity + $validated['quantity']
            : $validated['quantity'];

        if ($newQuantity > $product->stock_quantity) {
            return back()->withErrors([
                'quantity' => 'Requested quantity exceeds available stock.',
            ]);
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->save();

        return back()->with('notification', [
            'type' => 'success',
            'message' => 'Product added to your cart.',
        ]);
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->ensureOwnership($request, $cartItem);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = $cartItem->product()->firstOrFail();

        if ($validated['quantity'] > $product->stock_quantity) {
            return back()->withErrors([
                'quantity' => 'Requested quantity exceeds available stock.',
            ]);
        }

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return back()->with('notification', [
            'type' => 'success',
            'message' => 'Cart updated successfully.',
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->ensureOwnership($request, $cartItem);

        $cartItem->delete();

        return back()->with('notification', [
            'type' => 'info',
            'message' => 'Item removed from your cart.',
        ]);
    }

    private function ensureOwnership(Request $request, CartItem $cartItem): void
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
