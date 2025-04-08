<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use function Laravel\Prompts\alert;

class AlternatifController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $alternatifs = Alternatif::all();
        return response()->json($alternatifs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
        ]);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_ID',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Check if the user_id exists in the users table
        try {
            alert('User ID: ' . $request->user_id);
            $alternatif = Alternatif::create($request->all());
            return response()->json($alternatif, 201);
        } catch (Exception $e) {
            Log::error('Error creating alternatif: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create alternatif.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Alternatif $alternatif)
    {
        return response()->json($alternatif);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alternatif $alternatif)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|string|max:255', // Adjust validation rules as needed
        ]);

        $alternatif->update($request->all());
        return response()->json($alternatif, 200); // 200 OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alternatif $alternatif)
    {
        $alternatif->delete();
        return response()->json(null, 204); // 204 No Content
    }
}
