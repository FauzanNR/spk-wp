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
                <label class="block text-sm font-medium text-gray-700">Update Password</label>
                <label for="user-password-old" class="block text-sm font-medium text-gray-400">Old Password</label>
                <input type="password" id="user-password-old" name="old password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" require />
                <label for="user-password-new" class="block text-sm font-medium text-gray-400">New Password</label>
                <input type="password" id="user-password-new" name="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" require />

            </div>
            <div class="flex justify-end">
                <button type="button" id="save-profile-btn" onclick="updateUserProfile()" class="bg-blue-500 text-white px-4 py-2 rounded mr-2 hidden">Save</button>
                <button type="button" onclick="closeProfileModal()" class="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </form>
    </div>
</div>

<script>
    // Store original values for change detection
    let originalProfile = {
        name: '',
        email: '',
        password: ''
    };

    function showSaveButtonIfChanged() {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password-new').value;
        const saveBtn = document.getElementById('save-profile-btn');

        // Show Save button only if any field is changed (password is special: only if not empty)
        if (
            name !== originalProfile.name ||
            email !== originalProfile.email ||
            password.length > 0
        ) {
            saveBtn.classList.remove('hidden');
        } else {
            saveBtn.classList.add('hidden');
        }
    }

    // Attach input listeners for change detection
    function attachProfileInputListeners() {
        document.getElementById('user-name').addEventListener('input', showSaveButtonIfChanged);
        document.getElementById('user-email').addEventListener('input', showSaveButtonIfChanged);
        document.getElementById('user-password-new').addEventListener('input', showSaveButtonIfChanged);
    }

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
            document.getElementById('user-password-new').value = ''; // Password should not be pre-filled for security reasons

            // Store original values for change detection
            originalProfile = {
                name: userData.name || '',
                email: userData.email || '',
                password: ''
            };

            // Hide Save button initially
            document.getElementById('save-profile-btn').classList.add('hidden');
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to load user data.', error);
        }

        document.getElementById('profile-modal').classList.add('active');
        document.getElementById('profile-modal').classList.remove('hidden');

        attachProfileInputListeners();
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
        const password = document.getElementById('user-password-new').value;
        const oldPassword = document.getElementById('user-password-old').value;

        // Only update changed fields
        const updatePromises = [];

        if (name !== originalProfile.name) {
            updatePromises.push(
                fetch(`/api/user/${userId}/name`, {
                    method: 'PUT',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        name
                    })
                })
            );
        }

        if (email !== originalProfile.email) {
            updatePromises.push(
                fetch(`/api/user/${userId}/email`, {
                    method: 'PUT',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        email
                    })
                })
            );
        }

        if (password.length > 0) {
            updatePromises.push(
                fetch(`/api/user/${userId}/password`, {
                    method: 'PUT',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        old_password: oldPassword,
                        password: password
                    })
                })
            );
        }

        if (updatePromises.length === 0) {
            alert('No changes to save.');
            return;
        }

        try {
            const results = await Promise.all(updatePromises.map(p => p.then(res => {
                if (!res.ok) throw res; // Throw the response to handle error JSON later
                return res;
            })));

            alert('Profile updated successfully!');
            closeProfileModal();
        } catch (errorResponse) {
            let errorMsg = 'Failed to update profile.';

            if (errorResponse instanceof Response) {
                // It's a fetch Response object
                try {
                    const errorData = await errorResponse.json();
                    if (errorData && errorData.errors) {
                        // Laravel sends validation errors in this format
                        const validationMessages = Object.values(errorData.errors)
                            .flat()
                            .join('\n');
                        errorMsg += '\n' + validationMessages;
                    } else if (errorData.message) {
                        errorMsg += '\n' + errorData.message;
                    }
                } catch (jsonError) {
                    errorMsg += '\nUnable to read error message.';
                }
            } else if (errorResponse instanceof Error) {
                errorMsg += '\n' + errorResponse.message;
            }

            alert(errorMsg);
        }
    }
</script>