<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required' | 'min:3',
            'username' => 'required' | 'min:3',
            'email' => 'required|min:10|email|unique',
            'password' => 'required',
        ]);
        $user = new User();
        //Como se llaman los campos en BD
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->userName = $request->userName;

        $user->save();
    }
}
