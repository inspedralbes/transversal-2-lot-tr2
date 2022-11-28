<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;

class RankingsController extends Controller
{
    public function users(){
        return $this->belongsToMany(User::class);
    }
    public function games(){
        return $this->belongsToMany(Game::class);
    }
}
