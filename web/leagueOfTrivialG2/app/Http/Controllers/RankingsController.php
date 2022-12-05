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
        $rankings = Ranking::orderBy('puntuacio', 'desc')->get();
        $userEmail = DB::select('SELECT users.email FROM `rankings` JOIN `users` WHERE users.id=rankings.idUser');

        for ($i = 0; $i < sizeof($rankings); $i++) {
            $rankings[$i]->userEmail = $userEmail[$i]->email;
        }
        $rankings = json_encode($rankings);

        return response()->json($rankings);
    }
}
