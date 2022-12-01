<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GamesController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'quiz' => 'required',
        //     'difficulty' => 'required',
        //     'category' => 'required'
        // ]);
        $game = new Game();
        $game->type = "normal";
        $game->difficulty = $request->difficulty;
        $game->category = $request->category;
        $game->quiz = json_encode($request->quiz);
        $game->save();
    }
    public function index()
    {
        $games = Game::all();
        $games = json_encode($games);

        return response()->json($games);
    }
}
