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
        //     'type' => 'required' | 'min:3',
        //     'difficulty' => 'required',
        //     'category' => 'required'
        // ]);
        $game = new Game();
        //Como se llaman los campos en BD
        // $game->type = $request->type;
        // $game->difficulty = $request->difficulty;
        // $game->category = $request->category;        
        $game->type = "normal";
        $game->difficulty = "easy";
        $game->category = "music";
        $api_url = 'https://the-trivia-api.com/api/questions?limit=5';
        // $api_url = `https://the-trivia-api.com/api/questions?categories=$request->category&limit=10&difficulty=$request->difficulty`;
        $response = Http::get($api_url);
        $game->quiz = $response;

        $game->save();
    }
}
