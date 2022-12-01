<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;

class ChallengesController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'seen' => 'required',
        //     'winner' => 'required',
        // ]);
        $challenge = new Challenge();
        $challenge->seen = false;
        $challenge->winner = $request->winner;

        $challenge->save();
    }
    public function index()
    {
        $challenges = Challenge::all();
        $challenges = json_encode($challenges);

        return response()->json($challenges);
    }
}
