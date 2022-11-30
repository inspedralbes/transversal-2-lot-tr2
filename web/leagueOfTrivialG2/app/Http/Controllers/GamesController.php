<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
        // $game->type = $request->type;
        foreach (json_decode($request) as $data) {
            $game->difficulty = $data['difficulty'];
            $game->category = $data['category'];
            $game->type = "normal";
            $game->quiz = $data['quiz'];
            print $data;
        }
        // $game->difficulty = $request->difficulty;
        // $game->category = $request->category;
        // $game->type = "normal";
        // $game->difficulty = "easy";
        // $game->category = "music";
        // $api_url = 'https://the-trivia-api.com/api/questions?limit=5';
        // $game->quiz = $request->quiz;

        $game->save();
    }
}
