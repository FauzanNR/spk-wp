<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kriteria extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kriteria'; // Explicitly define table name

    /**
     * The primary key for the model.
     *
     * @var string
     */
    use HasFactory;

    protected $primaryKey = 'kriteria_ID';
    protected $fillable = ['user_id', 'nama', 'bobot', 'tipe'];

    public function kriteriaValues()
    {
        return $this->hasMany(KriteriaValue::class, 'kriteria_ID');
    }
}
