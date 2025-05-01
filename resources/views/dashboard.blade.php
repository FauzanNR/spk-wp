<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        /* Custom styles for dropdown */
        .dropdown:hover .dropdown-menu {
            display: block;
        }

        /* Make sidebar fixed height and not scrollable */
        #sidebar {
            height: 100vh;
            overflow: hidden;
            flex-shrink: 0;
        }

        /* Make main content scrollable */
        #main-content {
            overflow-y: auto;
            height: 100vh;
            flex-grow: 1;
        }
    </style>
</head>


<body class="bg-gray-200">
    <div class="flex h-screen">
        <input type="hidden" id="current_user_id" value="{{ auth()->id() }}">
        <!-- Sidebar -->
        <div id="sidebar" class="bg-gray-900 text-white w-64 p-4 hidden md:block">
            <div class="text-lg font-bold mb-8">SPK Weight Product</div>
            <nav>
                <ul>
                    <li class="mb-4">
                        <a href="#" class="flex items-center text-green-500" onclick="showPage('dashboard', this)">
                            <i class="fas fa-th-large mr-2"></i>
                            Dashboard
                        </a>
                    </li>
                    <li class="mb-4">
                        <a href="#" class="flex items-center text-gray-400" onclick="showPage('alternatif', this)">
                            <i class="fas fa-folder mr-2"></i>
                            Alternatif
                        </a>
                    </li>
                    <li class="mb-4">
                        <a href="#" class="flex items-center text-gray-400" onclick="showPage('kriteria', this)">
                            <i class="fas fa-list mr-2"></i>
                            Kriteria
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center text-gray-400" onclick="showPage('hasil', this)">
                            <i class="fas fa-chart-bar mr-2"></i>
                            Hasil
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <!-- Mobile Sidebar -->
        <div class="bg-gray-900 text-white w-64 p-4 fixed inset-y-0 left-0 transform -translate-x-full transition-transform duration-200 ease-in-out md:hidden" id="mobile-nav">
            <div class="text-lg font-bold mb-8">SPK Weight Product</div>
            <nav>
                <ul>
                    <li class="mb-4">
                        <a href="#" class="flex items-center text-green-500" onclick="showPage('dashboard', this)">
                            <i class="fas fa-th-large mr-2"></i>
                            Dashboard
                        </a>
                    </li>
                    <li class="mb-4">
                        <a href="#" class="flex items-center text-gray-400" onclick="showPage('alternatif', this)">
                            <i class="fas fa-folder mr-2"></i>
                            Alternatif
                        </a>
                    </li>
                    <li class="mb-4">
                        <a href="#" class="flex items-center text-gray-400" onclick="showPage('kriteria', this)">
                            <i class="fas fa-list mr-2"></i>
                            Kriteria
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center text-gray-400" onclick="showPage('hasil', this)">
                            <i class="fas fa-chart-bar mr-2"></i>
                            Hasil
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <!-- Main content -->
        <div id="main-content" class="flex-1 p-6" onclick="closeMobileNav()">
            <div class="flex justify-between items-center mb-6">
                <div class="md:hidden">
                    <button id="menu-button" class="text-gray-500 focus:outline-none" onclick="toggleMobileNav(event)">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <h1 id="page-title" class="text-xl font-semibold">Dashboard</h1>
                <div class="relative dropdown">
                    <button class="text-gray-500 flex items-center" onclick="toggleDropdown(event)">
                        user <i class="fas fa-chevron-down ml-1"></i>
                    </button>
                    <div class="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 hidden">
                        <div>
                            @include('.components.profile_modal')
                            <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-toggle="modal" onclick="openProfileModal(event)">Profile</a>
                        </div>
                        <div>
                            @auth {{-- Check if user is authenticated --}}
                            <form action="{{ route('logout') }}" method="POST">
                                @csrf
                                <button type="submit" class="block px-6 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
                            </form>
                            @endauth
                        </div>
                        <!-- <a href="{{route('logout')}}" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</a> -->
                    </div>
                </div>
            </div>
            <div id="dashboard" class="page">
                @if (session()->has('success'))
                <div id="login-alert" class=" bg-green-100 text-green-700 p-4 rounded mb-6">
                    You're logged in!
                </div>
                @endif
                <div class="bg-white p-5 rounded shadow">
                    <h3 class="text-2xl font-bold text-center">
                        Sistem Pendukung Keputusan Pemilihan Provider Terbaik Menggunakan Metode Weighted Product
                    </h3>
                </div>
            </div>
            <x-alternatif></x-alternatif> <!-- Include the alternatif component -->
            <x-kriteria></x-kriteria> <!-- Include the kriteria component -->
            <x-hasil></x-hasil> <!-- Include the hasil component -->
        </div>
    </div>
    <script src="js/dashboard.js"></script> <!-- Include the dashboard script -->
    <script src="js/alternatif.js"></script> <!-- Include the alternatif script -->
    <script src="js/kriteria.js"></script> <!-- Include the alternatif script -->
    <script src="js/kriteria_value.js"></script>
    <script src="js/hasil.js"></script>
</body>

</html>