<?php

namespace App\Http\Controllers;

use App\Models\Ranking;
use Illuminate\Http\Request;

class RankingsController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'puntuacio' => 'required',
        // ]);
        $ranking = new Ranking();
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
