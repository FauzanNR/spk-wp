<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Kriteria;
use App\Models\KriteriaValue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class KriteriaController extends Controller
{

    public function index()
    {
        return view('kriteria');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getByUser($userId)
    {
        $kriterias = Kriteria::where('user_id', $userId)->get();
        return response()->json($kriterias);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
            'nama' => 'required|string|max:255',
            'bobot' => 'required|integer',
            'tipe' => 'required|in:cost,benefit',
        ]);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_ID',
            'nama' => 'required|string|max:255',
            'bobot' => 'required|integer',
            'tipe' => 'required|in:cost,benefit',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $kriteria = Kriteria::create($request->all());
            return response()->json($kriteria, 201);
        } catch (Exception $e) {
            Log::error('Error creating alternatif: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create kriteria.'], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Kriteria  $kriteria
     * @return \Illuminate\Http\Response
     */
    public function show(Kriteria $kriteria)
    {
        return response()->json($kriteria);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kriteria  $kriteria
     * @return \Illuminate\Http\Response
     */
    public function updateById(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
            'nama' => 'sometimes|required',
            'bobot' => 'sometimes|required|integer',
            'tipe' => 'sometimes|required|in:cost,benefit',
        ]);

        $kriteria = Kriteria::findOrFail($id);
        if (!$kriteria) {
            return response()->json(['error' => 'Kriteria not found'], 404);
        }
        Kriteria::where('kriteria_id', $id)->update([
            'nama' => $request->nama,
            'bobot' => $request->bobot,
            'tipe' => $request->tipe,
            'updated_at' => Carbon::now(),
        ]);


        return response()->json([
            'message' => 'Alternatif updated successfully.',
            'alternatif' => $kriteria
        ], 200); // 200 OK
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Kriteria  $kriteria
     * @return \Illuminate\Http\Response
     */
    public function destroyById($kriteria_id)
    {
        $kriteria = Kriteria::findOrFail($kriteria_id);
        if (!$kriteria) {
            return response()->json(['error' => 'Kriteria not found'], 404);
        }
        // Check if the kriteria is associated with any kriteria_value
        $kriteriaValue = DB::table('kriteria_value')
            ->where('kriteria_id', $kriteria_id)
            ->exists();
        // Check if the kriteria is associated with any kriteria_value
        if ($kriteriaValue) {
            return response()->json(['error' => 'Kriteria cannot be deleted because it is associated with a kriteria_value'], 422);
        }
        // Delete the kriteria
        // $kriteria->delete();
        // Use the delete method to remove the kriteria
        // $kriteria->delete();
        // Or use the where method to delete the kriteria by ID
        Kriteria::where('kriteria_id', $kriteria_id)->delete();

        return response()->json([
            'message' => 'kriteria deleted successfully.',
            'kriteria_deleted' => $kriteria
        ], 200); // 200 OK
    }
}
