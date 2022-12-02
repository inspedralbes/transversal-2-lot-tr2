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
        // $request->validate([
        //     'puntuacio' => 'required',
        // ]);
        $user = DB::table('users')->where('id', 2)->value('id');
        $game =  DB::table('games')->latest('id')->value('id');
        $ranking = new Ranking();
        $ranking->idGame = $game;
        $ranking->idUser = $user;
        $ranking->puntuacio = $request->score;
        $ranking->save();
    }
    public function index()
    {
        $rankings = Ranking::all();
        $rankings = json_encode($rankings);

        return response()->json($rankings);
    }
}
