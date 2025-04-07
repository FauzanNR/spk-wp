<div id="alternatif" class="page hidden">
    <div class="bg-white p-6 rounded shadow">
        <h2 class="text-2xl font-bold text-center">
            Alternatif Page Content
        </h2>
        <div class="mt-6">
            <form id="alternatif-form" class="mb-4">
                <div class="flex space-x-4">
                    <input type="text" id="name" placeholder="Name" class="w-full p-2 border rounded">
                    <input type="text" id="code" placeholder="Code" class="w-full p-2 border rounded">
                </div>
                <button type="button" onclick="addData()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </form>
            <table class="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th class="border px-4 py-2">Name</th>
                        <th class="border px-4 py-2">Alternatif Code</th>
                        <th class="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody id="alternatif-table">
                    <!-- Data will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>