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
    Route::get('/api/alternatif', [AlternatifController::class, 'index']);
    Route::get('/api/alternatif/{alternatif}', [AlternatifController::class, 'show']);
    Route::put('/api/alternatif/{id}', [AlternatifController::class, 'updateById'])->name('alternatif.updateById');
    Route::delete('/api/alternatif/{id}', [AlternatifController::class, 'destroyById'])->name('alternatif.destroy');
    Route::post('/api/alternatif', [AlternatifController::class, 'store'])->name('alternatif.store');

    Route::resource('kriteria', KriteriaController::class);
    Route::resource('kriteria-value', KriteriaValueController::class);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
