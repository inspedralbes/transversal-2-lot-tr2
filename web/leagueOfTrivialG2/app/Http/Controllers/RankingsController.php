<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Ranking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RankingsController extends Controller
{
    public function store(Request $request)
    {
        $game =  DB::table('games')->latest('id')->value('id');
        $ranking = new Ranking();
        $ranking->idGame = $game;
        $ranking->idUser = $request->idUser;
        $ranking->puntuacio = $request->score;
        $ranking->save();
    }
    public function index()
    {
        // $rankings = Ranking::orderBy('puntuacio', 'desc')->get();
        $rankings = DB::select('SELECT SUM(rankings.puntuacio) AS score, users.userName FROM rankings JOIN users ON users.id=rankings.idUser JOIN games ON games.id=rankings.idGame WHERE games.type="normal" GROUP BY users.userName ORDER BY rankings.puntuacio DESC;');

        // for ($i = 0; $i < sizeof($rankings); $i++) {
        //     $rankings[$i]->userEmail = $userEmail[$i]->email;
        // }
        // $rankings = json_encode($rankings);

        return response()->json($rankings);
    }
    public function storeDaily(Request $request){
        $game = DB::table('games')->where('type', 'daily')->value('id');
        $ranking = new Ranking();
        $ranking->idGame = $game;
        $ranking->idUser = $request->idUser;
        $ranking->puntuacio = $request->score;
        $ranking->save();
    }
    public function checkDaily(Request $request){
        $status = DB::select('SELECT COUNT(rankings.idUser) AS timesPlayed FROM `rankings` JOIN `users` ON users.id=rankings.idUser JOIN `games` ON games.id = rankings.idGame WHERE rankings.idUser='.$request->idUser.' && games.type="daily"');
        
        return response()->json($status);
    }
}
