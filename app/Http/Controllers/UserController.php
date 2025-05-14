<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getUserById($id)
    {
        // Check if the user exists
        $userExists = DB::table('users')->where('user_id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }
        // Fetch the user data
        $user = DB::table('users')
            ->select('name', 'email')
            ->where('user_id', $id)
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
        $userExists = DB::table('users')->where('user_id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update the user's name
        DB::table('users')
            ->where('user_id', $id)
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
        $userExists = DB::table('users')->where('user_id', $id)->exists();
        if (!$userExists) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update the user's email
        DB::table('users')
            ->where('user_id', $id)
            ->update(['email' => $request->input('email')]);

        return response()->json(['message' => 'Email updated successfully']);
    }

    public function updatePassword(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'old_password' => 'required|string',
            'password' => 'required|string|min:8|'
        ]);
        // Check if the user exists
        $user = DB::table('users')->where('user_id', $id)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check the old password
        if (!Hash::check($request->input('old_password'), $user->password)) {
            return response()->json(['error' => 'Old password is incorrect'], 400);
        }

        // Update the user's password
        DB::table('users')
            ->where('user_id', $id)
            ->update(['password' => bcrypt($request->input('password'))]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
