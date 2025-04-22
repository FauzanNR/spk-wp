// CRUD operations for Kriteria page
window.kriteriaData = [];

async function fetchKriteriaDataByUser() {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    try {
        const response = await fetch(`/api/kriteria/user/${userId}`, {
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        window.kriteriaData = await response.json();
        renderKriteriaTable();
    } catch (error) {
        console.error("Could not fetch alternatives by user:", error);
    }
}

async function addKriteria() {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    const nama = document.getElementById("nama").value;
    const bobot = document.getElementById("bobot").value;
    const keterangan = document.querySelector(
        'input[name="keterangan"]:checked'
    ).value;
    data = JSON.stringify({
        user_id: userId,
        nama: nama,
        bobot: bobot,
        tipe: keterangan,
    });

    if (nama && bobot && keterangan) {
        try {
            const responsePromise = fetch("/api/kriteria", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "content-type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: data,
            });

            responsePromise
                .then((response) => {
                    if (!response.ok) {
                        // Handle HTTP errors
                        return response.text().then((text) => {
                            throw new Error(
                                `Network response was not ok: ${response.status} - ${text}`
                            );
                        });
                    }
                    // If the response type is not json, throw an error
                    const contentType = response.headers.get("content-type");
                    if (
                        !contentType ||
                        !contentType.includes("application/json")
                    ) {
                        return response.text().then((text) => {
                            throw new Error(
                                `Response is not JSON: ${contentType} - ${text}`
                            );
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    // Handle the response data here
                    console.log("Success:", data);
                    window.kriteriaData.push(data);
                    renderKriteriaTable();
                    document.getElementById("kriteria-form").reset();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(
                        `Failed to add kriteria. Please try again ${error.message}.`
                    );
                });
        } catch (error) {
            console.error("Error:", error);
            alert(`Failed to add kriteria. Please try again: ${error.message}`);
        }
    }
}

async function deleteKriteria(index) {
    const kriteriaId = window.kriteriaData[index].kriteria_id;
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            const response = await fetch(`/api/kriteria/${kriteriaId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error deleting kriteria:", errorData);
                alert(
                    `Error deleting kriteria: ${
                        errorData.message || "Unknown error"
                    }`
                );
                return;
            }
            kriteriaData.splice(index, 1);
            renderKriteriaTable();
            alert("kriteria deleted successfully!");
        } catch (error) {
            alert(`Could not delete kriteria: ${error.message}`);
        }
    }
}

async function editKriteria() {
    index = document.getElementById("kriteria-data-index-on-edit").value;
    const id = window.kriteriaData[index].kriteria_id;
    const kriteriaData = window.kriteriaData[index];

    const newNama = document.getElementById("edit-kriteria-name").value.trim();
    const newBobot = document
        .getElementById("edit-kriteria-bobot")
        .value.trim();
    const newTipe = document.querySelector(
        'input[name="edit-tipe"]:checked'
    ).value;

    if (!newNama || !newBobot || !newTipe) {
        alert("Please fill in all fields.");
        return;
    }

    if (newNama && newBobot && (newTipe === "benefit" || newTipe === "cost")) {
        if (confirm("Are you sure you want to update this item?")) {
            kriteriaData.nama = newNama;
            kriteriaData.bobot = newBobot;
            kriteriaData.tipe = newTipe;
            try {
                const response = await fetch(`/api/kriteria/${id}`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify(kriteriaData),
                });
            } catch (error) {
                console.error("Error updating kriteria:", error);
                alert(`Error updating kriteria: ${error.message}`);
            }
            renderKriteriaTable();
            closeEditKriteriaModal();
        }
    } else {
        alert("Please fill in the Nama, Bobot, and Select the Tipe");
    }
}

function renderKriteriaTable() {
    const tableBody = document.getElementById("kriteria-table");
    tableBody.innerHTML = "";

    window.kriteriaData.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border px-4 py-2">${item.nama}</td>
            <td class="border px-4 py-2">${item.bobot}</td>
            <td class="border px-4 py-2">${item.tipe}</td>
            <td class="border px-4 py-2">
                <button onclick="openEditKriteriaModal(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteKriteria(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    const addButton = document.getElementById("add-kriteria-button");
    const form = document.getElementById("kriteria-form");
    form.reset(); // Reset the form fields
    form.action = "/api/kriteria";
    addButton.textContent = "Add";
    addButton.onclick = addKriteria;
}

// Fetch initial data when the page loads
document.addEventListener("DOMContentLoaded", fetchKriteriaDataByUser);

function openEditKriteriaModal($index) {
    document.getElementById("edit-kriteria-modal").classList.add("active");
    document.getElementById("edit-kriteria-modal").classList.remove("hidden");

    document.getElementById("kriteria-data-index-on-edit").value = $index;
    document.getElementById("edit-kriteria-name").value =
        kriteriaData[$index].nama;
    document.getElementById("edit-kriteria-bobot").value =
        kriteriaData[$index].bobot;
    document.querySelector(
        `input[name="edit-tipe"][value=${kriteriaData[$index].tipe}]`
    ).checked = true;
}

function closeEditKriteriaModal() {
    document.getElementById("edit-kriteria-modal").classList.add("hidden");
    document.getElementById("edit-kriteria-modal").classList.remove("active");
}

// Assuming fetchKriteriaDataByUser and fetchDataByUser are already defined as in your input

// Function to populate the alternatif dropdown
function populateAlternatifDropdown() {
    const alternatifSelect = document.getElementById("alternatif-select");
    alternatifSelect.innerHTML = '<option value="">Select Alternatif</option>'; // Clear existing options

    if (window.data && Array.isArray(window.data)) {
        window.data.forEach((alternatif) => {
            const option = document.createElement("option");
            option.value = alternatif.alternatif_ID; // Use the correct ID from your model/schema
            option.textContent = alternatif.name; // Use the correct name field
            alternatifSelect.appendChild(option);
        });
    }
}

// Function to handle alternatif selection change
function handleAlternatifSelect() {
    const selectedAlternatifId =
        document.getElementById("alternatif-select").value;
    const kriteriaValueFormContainer = document.getElementById(
        "kriteria-value-form-container"
    );

    // Clear previous form table
    kriteriaValueFormContainer.innerHTML = "";

    if (selectedAlternatifId) {
        // Find the criteria for the selected alternatif from window.kriteriaData
        // Assuming window.kriteriaData is an array of kriteria objects,
        // and each kriteria object has an 'alternatif_id' property.
        const kriteriaForSelectedAlternatif = window.kriteriaData.filter(
            (kriteria) => {
                // You might need to adjust how you access the alternatif_id
                // depending on the structure of your window.kriteriaData
                // Example: if kriteriaData items have kriteria.alternatif_id
                return kriteria.alternatif_id == selectedAlternatifId;
            }
        );

        if (kriteriaForSelectedAlternatif.length > 0) {
            renderKriteriaValueFormTable(
                selectedAlternatifId,
                kriteriaForSelectedAlternatif
            );
        } else {
            kriteriaValueFormContainer.innerHTML =
                "<p>No criteria found for this alternatif.</p>";
        }
    }
}

// Function to render the Kriteria Value form table
function renderKriteriaValueFormTable(alternatifId, kriterias) {
    const kriteriaValueFormContainer = document.getElementById(
        "kriteria-value-form-container"
    );

    let formHtml = `
        <form id="kriteria-value-form" onsubmit="event.preventDefault(); submitKriteriaValues(this);">
            @csrf {{-- Include CSRF token for the form --}}
            <input type="hidden" name="alternatif_id" value="${alternatifId}">
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kriteria</th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bobot</th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    kriterias.forEach((kriteria) => {
        formHtml += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${kriteria.nama}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${kriteria.tipe}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${kriteria.bobot}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="number"
                           name="kriteria_values[${kriteria.kriteria_ID}]" {{-- Use kriteria_ID as array key --}}
                           class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                           required
                           min="0"> {{-- Add min/max as appropriate for your values --}}
                    <input type="hidden" name="kriteria_ids[]" value="${kriteria.kriteria_ID}"> {{-- Hidden field for kriteria_id --}}
                </td>
            </tr>
        `;
    });

    formHtml += `
                </tbody>
            </table>
            <div class="mt-4">
                <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Save Kriteria Values
                </button>
            </div>
        </form>
    `;

    kriteriaValueFormContainer.innerHTML = formHtml;
}

// Function to submit the Kriteria Value form via AJAX
async function submitKriteriaValues(form) {
    const formData = new FormData(form);
    const alternatifId = formData.get("alternatif_id"); // Get the selected alternatif ID

    // Collect kriteria values and IDs
    const kriteriaValues = [];
    formData.forEach((value, key) => {
        // Check if the key starts with 'kriteria_values['
        if (key.startsWith("kriteria_values[")) {
            // Extract kriteria_ID from the key
            const kriteriaId = key.substring(
                key.indexOf("[") + 1,
                key.indexOf("]")
            );
            kriteriaValues.push({
                alternatif_id: alternatifId, // Include the selected alternatif ID
                kriteria_id: parseInt(kriteriaId),
                value: parseInt(value), // Or parseFloat if your value is decimal
            });
        }
    });

    // You might need to adjust the data structure sent to the backend
    // based on how your controller expects it.
    // This example sends an array of objects.
    const dataToSend = {
        _token: formData.get("_token"), // Include CSRF token
        kriteria_values: kriteriaValues,
    };

    try {
        const response = await fetch("/api/kriteria-value", {
            // Replace with your actual route
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // CSRF token is already in dataToSend, but can also be in headers if preferred
                // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify(dataToSend),
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Kriteria values saved successfully:", result);
            // Handle success (e.g., show a success message, clear the form, refresh data)
            alert("Kriteria values saved successfully!");
            // Optionally, clear the form or refresh the table
            handleAlternatifSelect(); // Re-render the table to show saved values if you fetch them
        } else {
            console.error("Error saving kriteria values:", result);
            // Handle errors (e.g., display validation errors)
            alert(
                "Error saving kriteria values: " +
                    (result.message || "Unknown error")
            );
        }
    } catch (error) {
        console.error("Network or unexpected error:", error);
        alert("An unexpected error occurred.");
    }
}

// Call fetch functions when the page loads (assuming current_user_id is available)
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("current_user_id")) {
        fetchDataByUser().then(() => {
            populateAlternatifDropdown(); // Populate dropdown after fetching alternatives
        });
        fetchKriteriaDataByUser(); // Fetch kriteria data (assuming it's needed globally)
    } else {
        console.error("Element with ID 'current_user_id' not found.");
    }
});
