<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GamesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required' | 'min:3',
            'difficulty' => 'required' | 'min:3',
            // 'json'=>'required',
        ]);
        $game = new Game();
        //Como se llaman los campos en BD
        $game->type = $request->type;
        $game->difficulty = $request->difficulty;
        //El timestamp no hace falta porque lo inserta solo
        $game->save();
    }
}
