<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaValue extends Model
{
    use HasFactory;

    protected $primaryKey = 'kriteria_value_id';
    protected $fillable = ['alternatif_id', 'kriteria_id', 'value'];

    public function alternatif()
    {
        return $this->belongsTo(Alternatif::class, 'alternatif_id');
    }

    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class, 'kriteria_id');
    }
}
