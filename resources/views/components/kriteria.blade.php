<div id="kriteria" class="page hidden">
    <div class="bg-white p-6 rounded shadow mb-8">
        <h2 class="text-2xl font-bold text-center mb-4">
            Kriterias
        </h2>
        @include('.components.edit_kriteria')
        <div class="mt-6">
            <form id="kriteria-form" class="mb-6">
                @csrf
                @method('PUT') {{-- Or @method('PATCH') --}}
                <div class="mb-4">
                    <label for="nama" class="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                    <input type="text" id="nama" placeholder="Nama" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <label for="bobot" class="block text-gray-700 text-sm font-bold mb-2">Bobot</label>
                    <input type="number" step="0.01" id="bobot" placeholder="Bobot" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Keterangan</label>
                    <div class="flex items-center">
                        <input type="radio" id="benefit" name="keterangan" value="benefit" class="mr-2">
                        <label for="benefit" class="mr-4">Benefit</label>
                        <input type="radio" id="cost" name="keterangan" value="cost" class="mr-2">
                        <label for="cost">Cost</label>
                    </div>
                </div>
                <button id="add-kriteria-button" type="button" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </form>
            <table class="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th class="border px-4 py-2">Nama</th>
                        <th class="border px-4 py-2">Bobot</th>
                        <th class="border px-4 py-2">Keterangan</th>
                        <th class="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody id="kriteria-table">
                </tbody>
            </table>
        </div>
    </div>

    JUST MAKE TI SIMPLE, ALL THE KRITERIA WILL AUTOMATICALLY ADDED TO ALTERNATIF-KRITERIA-VALUE WITH VALUE 0, AND BELOW USER JUST NEED TO CHANGE THE VALUE
    <div class="bg-white p-6 rounded shadow">
        <h2 class="text-2xl font-bold text-center mb-4">
            Kriteria Values
        </h2>
        <select
            id="alternatif-select"
            class="mb-4 w-full p-2 border rounded"
            onchange="handleAlternatifSelect()">
            <option value="">Select Alternatif</option>
        </select>

        <div id="kriteria-value-form-container">
        </div>
    </div>
</div>