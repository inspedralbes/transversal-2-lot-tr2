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
            $id_game = DB::table('games')->where('type', 'daily')->value('id');
            // $id_game=$game->id;

            DB::table('rankings')->where('idGame', $id_game)->delete();
            // DB::table('games')->where('type', 'daily')->delete();

            $response = Http::get('http://the-trivia-api.com/api/questions?limit=10');
            DB::table('games')->where('type', 'daily')->update(['quiz' => $response]);

            // $test = Test::find(1);
            // $cont = $test->cont;
            // DB::table('tests')->where('id', 1)->update(['cont' => $cont + 1]);
            // $data=array("difficulty"=>null,"quiz"=>$response,"category"=>null,"type"=>'daily');
            // DB::table('games')->insert($data);
        })->everyMinute();
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
