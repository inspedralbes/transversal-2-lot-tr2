<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
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
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required | email',
                'password' => 'required'
            ]
            // ,[
            //     'password.required' => 'No hay password'
            // ]
        );
        if ($validator->fails()) {
            return response(["error" => "Campo/s vacío/s o formato incorrecto", "code" => Response::HTTP_BAD_REQUEST], Response::HTTP_BAD_REQUEST);
        }
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);
            return response()->json(Auth::user(), Response::HTTP_OK);
        } else {
            return response(["error" => "Credenciales incorrectas", "code" => Response::HTTP_UNAUTHORIZED], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function dailyPlayed(Request $request)
    {
        User::where('id', $request->idUser)->update(['dailyPlayed' => 1]);
    }
    public function logout()
    {
        $cookie = Cookie::forget('cookie_token');
        Auth::logout();
    }
    public function userInfo(Request $request)
    {
        $user = $request->idUser;
        $info = DB::select('SELECT rankings.idGame, rankings.puntuacio, users.name, users.userName, users.email, users.status, games.date from users JOIN rankings ON rankings.idUser=users.id JOIN games ON games.id=rankings.idGame  WHERE users.id=' . $user . 'ORDER BY games.date DESC;');
        return response()->json($info);
    }
}
