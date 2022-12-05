<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{

    public function store(Request $request)
    {
        $user = $request->validate([
            'name' => 'required | min:3',
            'username' => 'required | min:3',
            'email' => 'required|min:10|email|unique:users',
            'password' => 'required',
        ]);
        $user = new User();
        //Como se llaman los campos en BD
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->userName = $request->username;

        $user->save();
    }
    public function getUserInfo($username)
    {
        $user = User::where('userName', $username)->get();
        $user = json_encode($user[0]);

        return response()->json($user);
    }
    public function index()
    {
        $users = User::all();
        $users = json_encode($users);

        return response()->json($users);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required | email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json(Auth::user(), 200);
        }
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect. Please try again.']
        ]);
    }
    public function logout()
    {
        Auth::logout();
    }
}
