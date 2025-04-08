window.data = [];

async function fetchData() {
    try {
        const response = await fetch('/api/alternatif');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        renderTable();
    } catch (error) {
        console.error("Could not fetch alternatives:", error);
    }
}

async function addData() {
    const userId = parseInt(document.getElementById('current_user_id').value.trim());
    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();
    if (!name || !code) {
        alert('Please fill in the Name and Code fields.');
        return;
    }
    if (name && code && userId) {
        try {
            const responsePromise = fetch('/api/alternatif', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ user_id: userId, name: name, code: code }),
            });

            responsePromise
                .then(response => {
                    if (!response.ok) {
                        // Handle HTTP errors
                        return response.text().then(text => {
                            throw new Error(`Network response was not ok: ${response.status} - ${text}`);
                        });
                    }
                    // If the response type is not json, throw an error
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        return response.text().then(text => {
                            throw new Error(`Response is not JSON: ${contentType} - ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    // Process your JSON data (this will be the newly created alternatif)
                    console.log('Data added successfully:', data);
                    window.data.push(data); // Assuming 'data' is a global array
                    window.renderTable(); // Assuming 'renderTable' is a global function
                    document.getElementById('alternatif-form').reset();
                    alert('Alternatif added successfully!');
                })
                .catch(error => {
                    // Handle any errors that occurred during the process
                    console.error('Error:', error);
                    alert(`Error adding alternative: ${error}`);
                });

        } catch (error) {
            console.error("Could not add alternative:", error);
            alert(`Could not add alternative: ${error}`);
        }
    }
}

async function editData(index) {
    const id = data[index].alternatif_ID; // Assuming your API returns the ID
    const newName = prompt("Enter new name:", data[index].name);
    const newCode = prompt("Enter new code:", data[index].code);

    if (newName && newCode) {
        try {
            const response = await fetch(`/api/alternatifs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Add CSRF token
                },
                body: JSON.stringify({ name: newName, code: newCode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating alternative:", errorData);
                // Optionally display error messages
                return;
            }

            const updatedAlternatif = await response.json();
            data[index] = updatedAlternatif;
            renderTable();

        } catch (error) {
            console.error("Could not update alternative:", error);
        }
    }
}

async function deleteData(index) {
    const id = data[index].alternatif_ID; // Assuming your API returns the ID
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            const response = await fetch(`/api/alternatifs/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Add CSRF token
                },
            });

            if (!response.ok) {
                console.error("Error deleting alternative:", response.status);
                // Optionally display an error message
                return;
            }

            data.splice(index, 1);
            renderTable();

        } catch (error) {
            console.error("Could not delete alternative:", error);
        }
    }
}

function renderTable() {
    const tableBody = document.getElementById('alternatif-table');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2">${item.name}</td>
            <td class="border px-4 py-2">${item.code}</td>
            <td class="border px-4 py-2">
                <button onclick="editData(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteData(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch initial data when the page loads
// document.addEventListener('DOMContentLoaded', fetchData);