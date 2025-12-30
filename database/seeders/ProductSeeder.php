<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::insert([
            [
                'name' => 'Canvas Backpack',
                'price' => 59.00,
                'stock_quantity' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wireless Headphones',
                'price' => 129.00,
                'stock_quantity' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Travel Mug',
                'price' => 24.00,
                'stock_quantity' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Yoga Mat',
                'price' => 35.00,
                'stock_quantity' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
