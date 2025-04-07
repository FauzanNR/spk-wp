<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function regis()
    {
        return view('login');
    }
}
