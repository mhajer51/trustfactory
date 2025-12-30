<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class DailySalesReport extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $reportDate,
        public Collection $sales,
        public int $totalUnits,
        public string $totalRevenue
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Daily Sales Report - {$this->reportDate}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-sales-report',
        );
    }
}
