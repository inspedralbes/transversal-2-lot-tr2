<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function challenge(){
        return $this->belongsTo(Challenge::class);
    }
}
