<!-- Edit Modal -->
<div
    id="edit-alternatif-modal"
    class="modal fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center hidden">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto">
        <h2 class="text-xl font-bold mb-4">Edit Alternatif</h2>
        <input type="hidden" id="data-id-on-edit" />
        <form id="edit-form" onsubmit="return false;">
            <div class="mb-4">
                <label for="edit-alternatif-name" class="block text-gray-700">Name</label>
                <input
                    type="text"
                    id="edit-alternatif-name"
                    class="w-full p-2 border rounded"
                    required />
            </div>
            <div class="mb-4">
                <label for="edit-alternatif-code" class="block text-gray-700">Code</label>
                <input
                    type="text"
                    id="edit-alternatif-code"
                    class="w-full p-2 border rounded"
                    required />
            </div>
            <div class="flex justify-end">
                <button
                    type="button"
                    onclick="closeEditModal()"
                    class="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Cancel
                </button>
                <button
                    type="button"
                    onclick="editData()"
                    class="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        </form>
    </div>
</div>