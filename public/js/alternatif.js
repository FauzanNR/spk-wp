let data =[];

async function fetchData() {
    try {
        const response = await fetch('/api/alternatifs');
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
    const name = document.getElementById('name').value;
    const value = document.getElementById('value').value;

    if (name && value) {
        try {
            const response = await fetch('/api/alternatifs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Add CSRF token
                },
                body: JSON.stringify({ name: name, value: value }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error adding alternative:", errorData);
                // Optionally display error messages to the user
                return;
            }

            const newAlternatif = await response.json();
            data.push(newAlternatif);
            renderTable();
            document.getElementById('alternatif-form').reset();

        } catch (error) {
            console.error("Could not add alternative:", error);
        }
    }
}

async function editData(index) {
    const id = data[index].alternatif_ID; // Assuming your API returns the ID
    const newName = prompt("Enter new name:", data[index].name);
    const newValue = prompt("Enter new value:", data[index].value);

    if (newName && newValue) {
        try {
            const response = await fetch(`/api/alternatifs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Add CSRF token
                },
                body: JSON.stringify({ name: newName, value: newValue }),
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
            <td class="border px-4 py-2">${item.value}</td>
            <td class="border px-4 py-2">
                <button onclick="editData(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteData(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch initial data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);