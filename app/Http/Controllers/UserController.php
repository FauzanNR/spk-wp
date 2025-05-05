<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getUserById($id)
    {
        Log::info('Fetching user with ID: ' . $id);
        // Check if the user exists
        $userExists = DB::table('users')->where('id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }
        // Fetch the user data
        $user = DB::table('users')
            ->select('username', 'email')
            ->where('id', $id)
            ->first();

        return response()->json($user);
    }
    public function updateName(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Check if the user exists
        $userExists = DB::table('users')->where('id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update the user's name
        DB::table('users')
            ->where('id', $id)
            ->update(['name' => $request->input('name')]);

        return response()->json(['message' => 'Name updated successfully']);
    }

    public function updateEmail(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);

        // Check if the user exists
        $userExists = DB::table('users')->where('id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update the user's email
        DB::table('users')
            ->where('id', $id)
            ->update(['email' => $request->input('email')]);

        return response()->json(['message' => 'Email updated successfully']);
    }

    public function updatePassword(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check if the user exists
        $userExists = DB::table('users')->where('id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update the user's password
        DB::table('users')
            ->where('id', $id)
            ->update(['password' => bcrypt($request->input('password'))]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
