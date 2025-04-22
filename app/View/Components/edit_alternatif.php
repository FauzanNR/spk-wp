<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use function Laravel\Prompts\alert;

class edit_alternatif extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.edit_alternatif');
    }

    public function editAlternatif($alternatif)
    {
        alert('Edit Alternatif', 'Berhasil mengedit alternatif', 'success');
        dd($alternatif);
    }
}
