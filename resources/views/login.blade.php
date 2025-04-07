<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
    @vite(['./resources/css/app.css'])
</head>

<body class="flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-center">
            <x-title></x-title>
            <div class="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3">
                @if (session()->has('error'))
                <div class="bg-red-500 p-4 rounded-lg mb-6 text-white text-center">
                    {{ session('error') }}
                </div>
                @endif
                @if (session()->has('success'))
                <div class="bg-green-500 p-4 rounded-lg mb-6 text-white text-center">
                    {{ session('success') }}
                </div>
                @endif
                <h3 class="text-2xl font-semibold mb-6">Login</h3>
                <form method="POST" action="{{ route('login.post') }}">
                    @csrf
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700">Email</label>
                        <input type="email" id="email" name="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required />
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-gray-700">Password</label>
                        <input type="password" id="password" name="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required />
                    </div>
                    <div class="flex items-center justify-between">
                        <a href="{{ route('regis') }}" class="text-sm text-gray-600 hover:text-gray-800">Belum punya akun?</a>
                        <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">LOGIN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>

</html>