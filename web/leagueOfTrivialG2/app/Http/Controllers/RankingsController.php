<?php

namespace App\Http\Controllers;

use App\Models\Ranking;
use Illuminate\Http\Request;

class RankingsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'puntuacio' => 'required',
        ]);
        $ranking = new Ranking();
        //Como se llaman los campos en BD
        $ranking->type = $request->type;
        //El timestamp no hace falta porque lo inserta solo
        $ranking->save();
    }
}
