<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;

class ChallengesController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'seen' => 'required',
            'winner' => 'required',
        ]);
        $challenge = new Challenge();
        //Como se llaman los campos en BD
        // $challenge->seen = $request->name;
        // $challenge->winner = $request->email;

        $challenge->save();
    }
}
