<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KriteriaValue;

class KriteriaValueController extends Controller
{
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

        $kriteriaValue = KriteriaValue::create($request->all());
        return response()->json($kriteriaValue, 201);
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
