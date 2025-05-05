<?php

use App\Http\Controllers\AlternatifController;
use Illuminate\Http\Request;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RegisterController;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\KriteriaValueController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('login');
});

Route::get('/regis', [RegisterController::class, 'showRegistrationForm'])->name('regis');
Route::post('/regis', [RegisterController::class, 'register'])->name('regis.post');

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::post('/login', [LoginController::class, 'login'])->name('login.post');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');


// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/api/alternatif/user/{userId}', [AlternatifController::class, 'getByUser'])->name('alternatif.user');
    Route::put('/api/alternatif/{id}', [AlternatifController::class, 'updateById'])->name('alternatif.updateById');
    Route::delete('/api/alternatif/{id}', [AlternatifController::class, 'destroyById'])->name('alternatif.destroy');
    Route::post('/api/alternatif', [AlternatifController::class, 'store'])->name('alternatif.store');

    Route::get('/api/kriteria/user/{userId}', [KriteriaController::class, 'getByUser'])->name('kriteria.user');
    Route::get('/api/kriteria/{id}', [KriteriaController::class, 'showById'])->name('kriteria.getById');
    Route::post('/api/kriteria', [KriteriaController::class, 'store'])->name('kriteria.store');
    Route::delete('/api/kriteria/{id}', [KriteriaController::class, 'destroyById'])->name('kriteria.destroy');
    Route::put('/api/kriteria/{id}', [KriteriaController::class, 'updateById'])->name('kriteria.updateById');


    Route::post('/api/kriteria-value', [KriteriaValueController::class, 'store'])->name('kriteria-value.store');
    Route::get('/api/kriteria-value/user/{userId}', [KriteriaValueController::class, 'getByUser'])->name('kriteria-value.user');
    Route::delete('/api/kriteria-value/{id}', [KriteriaValueController::class, 'destroyById'])->name('kriteria-value.destroy');
    Route::put('/api/kriteria-value', [KriteriaValueController::class, 'update'])->name('kriteria-value.updateById');
    Route::get('/api/kriteria-value-detail/{id}', [KriteriaValueController::class, 'kriteriaValueWithDetail'])->name('kriteria-value-detail');




    Route::get('/api/user/{id}', [UserController::class, 'getUserById'])->name('user.getById');
    Route::put('/api/user/{id}/name', [UserController::class, 'updateName'])->name('user.updateName');
    Route::put('/api/user/{id}/email', [UserController::class, 'updateEmail'])->name('user.updateEmail');
    Route::put('/api/user/{id}/password', [UserController::class, 'updatePassword'])->name('user.updatePassword');
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
