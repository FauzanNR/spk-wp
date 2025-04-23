<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaValue extends Model
{
    use HasFactory;

    protected $table = 'kriteria_value'; // Explicitly define table name
    protected $primaryKey = 'kriteria_value_id';
    protected $fillable = ['user_id', 'alternatif_id', 'kriteria_id', 'value'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function alternatif()
    {
        return $this->belongsTo(Alternatif::class, 'alternatif_id');
    }

    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class, 'kriteria_id');
    }
}
