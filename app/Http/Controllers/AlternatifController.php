<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\KriteriaValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
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
        return view('alternatif');
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
        $alternatif = null;
        try {
            $alternatif = Alternatif::create($request->all());

            // Check if kriteria exists for the given user_id
            $kriteriaExists = Kriteria::where('user_id', $request->user_id)->exists();

            if ($kriteriaExists) {
                try {
                    Kriteria::where('user_id', $request->user_id)->each(function ($kriteria) use ($alternatif) {
                        KriteriaValue::create([
                            'kriteria_id' => $kriteria->kriteria_id,
                            'alternatif_id' => $alternatif->alternatif_id,
                            'user_id' => $alternatif->user_id, // Include user_id
                            'value' => 0, // Default value
                        ]);
                    });
                } catch (Exception $e) {
                    Log::error('Error creating kriteria values: ' . $e->getMessage());
                    return response()->json(['error' => 'Failed to create kriteria values.'], 500);
                }
            }
        } catch (Exception $e) {
            Log::error('Error creating alternatif: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create alternatif.'], 500);
        }
        return response()->json($alternatif, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Alternatif $alternatif)
    {
        return response()->json($alternatif);
    }

    /**
     * Display a listing of the resource belonging to a specific user.
     */
    public function getByUser($userId)
    {
        $alternatifs = Alternatif::where('user_id', $userId)->get();
        return response()->json($alternatifs);
    }

    /**
     * Update a specific alternatif item by ID.
     */
    public function updateById(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
        ]);

        $alternatif = Alternatif::find($id);

        if (!$alternatif) {
            return response()->json(['error' => 'Alternatif not found.'], 404); // 404 Not Found
        }

        Alternatif::where('alternatif_id', $id)->update([
            'name' => $request->name,
            'code' => $request->code,
        ]);

        return response()->json([
            'message' => 'Alternatif updated successfully.',
            'alternatif' => $alternatif
        ], 200); // 200 OK
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alternatif $alternatif)
    {
        $alternatif->delete();
        return response()->json(null, 204); // 204 No Content
    }

    /**
     * Remove a specific alternatif item by ID and delete related kriteria values.
     */
    public function destroyById($id)
    {
        $alternatif = Alternatif::find($id);

        if (!$alternatif) {
            return response()->json(['error' => 'Alternatif not found.'], 404); // 404 Not Found
        }

        // Delete related kriteria values
        $kriteriaDeleted = DB::table('kriteria_value')->where('alternatif_id', $id)->delete();

        // Delete the alternatif
        $alternatif->delete();

        return response()->json([
            'message' => 'Alternatif and related kriteria values deleted successfully.',
            'kriteria_deleted_count' => $kriteriaDeleted
        ], 200); // 200 OK
    }
}
