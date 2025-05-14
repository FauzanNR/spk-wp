<!-- Profile Modal -->
<div id="profile-modal" class="modal hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">User Profile</h2>

        <form id="profile-form">
            <div class="mb-4">
                <label for="user-name" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="user-name" name="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div class="mb-4">
                <label for="user-email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="user-email" name="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div class="mb-4">
                <label for="user-password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="user-password" name="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="updateUserProfile()" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                <button type="button" onclick="closeProfileModal()" class="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </form>
    </div>
</div>

<script>
    // Script to open and close profile modal
    async function openProfileModal(event) {
        event.preventDefault();
        event.stopPropagation();
        const userId = parseInt(
            document.getElementById("current_user_id").value.trim()
        );

        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();

            // Populate the modal fields with user data
            document.getElementById('user-name').value = userData.name || '';
            document.getElementById('user-email').value = userData.email || '';
            document.getElementById('user-password').value = ''; // Password should not be pre-filled for security reasons
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to load user data.', error);
        }

        document.getElementById('profile-modal').classList.add('active');
        document.getElementById('profile-modal').classList.remove('hidden');
    }

    function closeProfileModal() {
        document.getElementById('profile-modal').classList.remove('active');
        document.getElementById('profile-modal').classList.add('hidden');
    }

    async function updateUserProfile() {
        const userId = parseInt(
            document.getElementById("current_user_id").value.trim()
        );
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;

        try {
            if (name) {
                await fetch(`/api/user/${userId}/name`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name
                    })
                });
            }

            if (email) {
                await fetch(`/api/user/${userId}/email`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email
                    })
                });
            }

            if (password) {
                await fetch(`/api/user/${userId}/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password
                    })
                });
            }

            alert('Profile updated successfully!');
            closeProfileModal();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    }
</script>