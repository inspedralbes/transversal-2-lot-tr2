<?php

namespace App\Console;

use App\Models\Game;
use App\Models\Test;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            // $response = Http::get('http://the-trivia-api.com/api/questions?limit=10');
            $test = Test::find(1);
            $cont = $test->cont;
            DB::table('tests')->where('id', 1)->update(['cont' => $cont + 1]);
        })->dailyAt('13:05');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
