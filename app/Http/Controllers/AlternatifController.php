<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use Illuminate\Http\Request;

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
            'name' => 'required|string|max:255',
            'value' => 'required|string|max:255', // Adjust validation rules as needed
        ]);

        $alternatif = Alternatif::create($request->all());
        return response()->json($alternatif, 201); // 201 Created
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
