<div id="kriteria" class="page hidden">
    <div class="bg-white p-6 rounded shadow">
        <h2 class="text-2xl font-bold text-center">
            Kriteria Page Content
        </h2>

        <div class="mt-6">
            <form id="kriteria-form" class="mb-4">
                <div class="mb-4">
                    <input type="text" id="nama" placeholder="Nama" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <input type="number" step="0.01" id="bobot" placeholder="Bobot" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700">Keterangan</label>
                    <div class="flex items-center">
                        <input type="radio" id="benefit" name="keterangan" value="Benefit" class="mr-2">
                        <label for="benefit" class="mr-4">Benefit</label>
                        <input type="radio" id="cost" name="keterangan" value="Cost" class="mr-2">
                        <label for="cost">Cost</label>
                    </div>
                </div>
                <button type="button" onclick="addKriteria()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
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
                    <!-- Data will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>