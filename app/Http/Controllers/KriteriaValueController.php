<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\KriteriaValue;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Validator;

class KriteriaValueController extends Controller
{


    public function kriteriaValueByAlternatif($alternatifId)
    {
        $kriteriaValues = KriteriaValue::where('alternatif_id', $alternatifId)->get();
        return response()->json($kriteriaValues);
    }

    public function kriteriaValueByKriteria($kriteriaId)
    {
        $kriteriaValues = KriteriaValue::where('kriteria_id', $kriteriaId)->get();
        return response()->json($kriteriaValues);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $kriteriaValues = KriteriaValue::all();
        return response()->json($kriteriaValues);
    }
    public function getByUser($userId)
    {
        $kriterias = KriteriaValue::where('user_id', $userId)->get();
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
            'alternatif_id' => 'required|exists:alternatif,alternatif_id',
            'kriteria_id' => 'required|exists:kriteria,kriteria_id',
            'value' => 'required|integer',
        ]);

        $validator = Validator::make($request->all(), [
            'alternatif_id' => 'required|integer|exists:alternatif,alternatif_id',
            'kriteria_id' => 'required|integer|exists:kriteria,kriteria_id',
            'value' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $kriteriaValue = KriteriaValue::create($request->all());
            return response()->json($kriteriaValue, 201);
        } catch (Exception $e) {
            Log::error('Error creating kriteria value: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create kriteria value.'], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\KriteriaValue  $kriteriaValue
     * @return \Illuminate\Http\Response
     */
    public function show(KriteriaValue $kriteriaValue)
    {
        return response()->json($kriteriaValue);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\KriteriaValue  $kriteriaValue
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, KriteriaValue $kriteriaValue)
    {
        $request->validate([
            'alternatif_id' => 'sometimes|required|exists:alternatif,alternatif_id',
            'kriteria_id' => 'sometimes|required|exists:kriteria,kriteria_id',
            'value' => 'sometimes|required|integer',
        ]);

        $kriteriaValue->update($request->all());
        return response()->json($kriteriaValue, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\KriteriaValue  $kriteriaValue
     * @return \Illuminate\Http\Response
     */
    public function destroy(KriteriaValue $kriteriaValue)
    {
        $kriteriaValue->delete();
        return response()->json(null, 204);
    }
}
