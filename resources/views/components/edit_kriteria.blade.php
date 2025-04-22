<!-- Edit Modal -->
<div
    id="edit-kriteria-modal"
    class="modal fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center hidden">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto">
        <h2 class="text-xl font-bold mb-4">Edit Alternatif</h2>
        <input type="hidden" id="kriteria-data-index-on-edit" />
        <form id="edit-form" onsubmit="return false;">
            <div class="mb-4">
                <label for="edit-kriteria-name" class="block text-gray-700">Name</label>
                <input
                    type="text"
                    id="edit-kriteria-name"
                    class="w-full p-2 border rounded"
                    required />
            </div>
            <div class="mb-4">
                <label for="edit-kriteria-code" class="block text-gray-700">Bobot</label>
                <input
                    type="text"
                    id="edit-kriteria-bobot"
                    class="w-full p-2 border rounded"
                    required />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Keterangan</label>
                <div class="flex items-center">
                    <input type="radio" id="benefit" name="edit-tipe" value="benefit" class="mr-2">
                    <label for="benefit" class="mr-4">Benefit</label>
                    <input type="radio" id="cost" name="edit-tipe" value="cost" class="mr-2">
                    <label for="cost">Cost</label>
                </div>
            </div>
            <div class="flex justify-end">
                <button
                    type="button"
                    onclick="closeEditKriteriaModal()"
                    class="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Cancel
                </button>
                <button
                    type="button"
                    onclick="editKriteria()"
                    class="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        </form>
    </div>
</div>