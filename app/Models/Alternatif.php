<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Alternatif extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'alternatifs'; // Explicitly define table name

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'alternatif_id'; // Explicitly define primary key

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'alternatif_id', // Include primary key if it's not auto-incrementing and you need to mass-assign it
        'user_id',
        'name',
    ];

    /**
     * Get the user that owns the alternatif.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the kriteria associated with the alternatif.
     */
    public function kriterias(): HasMany
    {
        return $this->hasMany(Kriteria::class, 'alternatif_id', 'alternatif_ID');
    }
}
