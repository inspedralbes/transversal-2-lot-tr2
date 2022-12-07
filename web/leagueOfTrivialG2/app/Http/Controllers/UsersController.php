<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required | min:3',
            'username' => 'required | min:3 | unique:users',
            'email' => 'required|min:10|email|unique:users',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
            // return response()->json($validator->messages(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            // if ($validator->fails()) {
            //     return response()->json(['error' => 'Error']);
            // } else {
            $user = new User();
            //Como se llaman los campos en BD
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->userName = $request->username;

            $user->save();
            return response($user, Response::HTTP_CREATED);
            // return response()->json(['success' => 'User registered correctly']);
            // }
        }
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
        $validator = Validator::make($request->all(), [
            'email' => 'required | email',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response(["error" => "Campo/s vacío/s", "code" => Response::HTTP_BAD_REQUEST], Response::HTTP_BAD_REQUEST);
        } else if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);
            return response()->json(Auth::user(), 200);
        } else {
            return response(["error" => "Credenciales incorrectas", "code" => Response::HTTP_UNAUTHORIZED], Response::HTTP_UNAUTHORIZED);
        }

        // if (Auth::attempt($request->only('email', 'password'))) {
        //     $user = Auth::user();
        //     $token = $user->createToken('token')->plainTextToken;
        //     $cookie = cookie('cookie_token', $token, 60 * 24);
        //     // return response(["token" => $token], Response::HTTP_OK)->withoutCookie($cookie);
        //     return response()->json(Auth::user(), 200);
        // } else {
        //     return response(["error" => "Credenciales incorrectas"], Response::HTTP_UNAUTHORIZED);
        // }
    }
    public function logout()
    {
        $cookie = Cookie::forget('cookie_token');
        Auth::logout();
    }
}
