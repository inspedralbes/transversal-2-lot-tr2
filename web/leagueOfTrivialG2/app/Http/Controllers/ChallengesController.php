<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChallengesController extends Controller
{
    public function store(Request $request)
    {
        $challenge = new Challenge();
        $challenge->seen = false;
        $challenge->winner = $request->winner;
        $challenge->idChallenger = $request->idChallenger;
        $challenge->idChallenged = $request->idChallenged;
        $challenge->idGame=$request->idGame;

        $challenge->save();
    }
    public function index()
    {
        $challenges = Challenge::all();
        $challenges = json_encode($challenges);

        return response()->json($challenges);
    }
    public function getGametoChallenge(Request $request)
    {
        $game = DB::table('games')->where('id', $request->idGame)->value('quiz');

        return response()->json($game);
    }
}
