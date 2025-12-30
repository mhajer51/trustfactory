<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->orderBy('name')
            ->paginate(9, ['id', 'name', 'price', 'stock_quantity'])
            ->withQueryString();

        $cartItems = $request->user()
            ->cartItems()
            ->with('product:id,name,price,stock_quantity')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'cartItems' => $cartItems,
        ]);
    }
}
