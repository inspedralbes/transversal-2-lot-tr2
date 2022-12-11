<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GamesController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\RankingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//RUTES PER A GUARDAR
Route::post('/store-user', [UsersController::class, 'store']);
Route::post('/dailyPlayed', [UsersController::class, 'dailyPlayed']);
Route::post('/store-data', [GamesController::class, 'store']);
Route::post('/store-score', [RankingsController::class, 'store']);
Route::post('/store-dailyScore', [RankingsController::class, 'storeDaily']);
Route::post('/checkDaily', [RankingsController::class, 'checkDaily']);
Route::post('/store-challenge', [ChallengesController::class, 'store']);


//RUTES PER A MOSTRAR
Route::get('/get-users', [UsersController::class, 'index']);
Route::get('/get-games', [GamesController::class, 'index']);
Route::get('/get-daily', [GamesController::class, 'getDaily']);
Route::get('/get-demo', [GamesController::class, 'getDemo']);
Route::get('/get-rankings', [RankingsController::class, 'index']);
Route::get('/get-challenges', [ChallengesController::class, 'index']);

//LOGIN
// Route::get('/login-get/{username}', [UsersController::class, 'getUserInfo']);
Route::post('/login', [UsersController::class, 'login']);
Route::post('/logout', [UsersController::class, 'logout']);


//REGISTER
