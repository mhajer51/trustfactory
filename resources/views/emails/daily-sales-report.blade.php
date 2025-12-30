<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Daily Sales Report</title>
    </head>
    <body>
        <h1>Daily Sales Report</h1>
        <p>Date: {{ $reportDate }}</p>

        @if ($sales->isEmpty())
            <p>No products were sold today.</p>
        @else
            <table cellpadding="6" cellspacing="0" border="1">
                <thead>
                    <tr>
                        <th align="left">Product</th>
                        <th align="right">Units Sold</th>
                        <th align="right">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($sales as $sale)
                        <tr>
                            <td>{{ $sale['name'] }}</td>
                            <td align="right">{{ $sale['quantity'] }}</td>
                            <td align="right">${{ number_format($sale['revenue'], 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <p><strong>Total Units:</strong> {{ $totalUnits }}</p>
            <p><strong>Total Revenue:</strong> ${{ $totalRevenue }}</p>
        @endif
    </body>
</html>
