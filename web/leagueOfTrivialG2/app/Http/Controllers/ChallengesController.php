<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ChallengesController extends Controller
{
    public function users(){
        return $this->hasMany(User::class);
    }
}
