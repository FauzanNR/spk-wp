    <!-- Profile Modal -->
    <div id="profile-modal" class="modal hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 class="text-xl font-bold mb-4">User Profile</h2>
            <p class="mb-4">This is the user profile modal content.</p>
            <div class="flex justify-end">
                <button type="button" onclick="closeProfileModal()" class="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    </div>

    <script>
        // Script to open and close profile modal
        function openProfileModal(event) {
            event.preventDefault();
            event.stopPropagation();
            document.getElementById('profile-modal').classList.add('active');
            document.getElementById('profile-modal').classList.remove('hidden');
        }

        function closeProfileModal() {
            document.getElementById('profile-modal').classList.remove('active');
            document.getElementById('profile-modal').classList.add('hidden');
        }
    </script>