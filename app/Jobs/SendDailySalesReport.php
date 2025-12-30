<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();

        if (! $admin) {
            Log::warning('Daily sales report skipped because the admin user was not found.');

            return;
        }

        $startOfDay = now()->startOfDay();
        $endOfDay = now()->endOfDay();
        $reportDate = $startOfDay->toDateString();

        $sales = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as total_quantity'), DB::raw('SUM(total_price) as total_revenue'))
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->groupBy('product_id')
            ->with('product')
            ->get()
            ->map(function (OrderItem $item) {
                return [
                    'name' => $item->product->name,
                    'quantity' => (int) $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

        $totalUnits = $sales->sum('quantity');
        $totalRevenue = number_format($sales->sum('revenue'), 2);

        Mail::to($admin->email)->send(new DailySalesReport(
            reportDate: $reportDate,
            sales: $sales,
            totalUnits: $totalUnits,
            totalRevenue: $totalRevenue,
        ));
    }
}
