window.kriteriaValueData = [];

async function fetchKriteriaValueDataByUser() {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    try {
        const response = await fetch(`/api/kriteria-value/user/${userId}`, {
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
        window.kriteriaValueData = await response.json();
    } catch (error) {
        console.error("Could not fetch alternatives by user:", error);
    }
}

// Function to populate the alternatif dropdown
function populateAlternatifDropdown() {
    const alternatifSelect = document.getElementById("alternatif-select");
    alternatifSelect.innerHTML = '<option value="">Select Alternatif</option>'; // Clear existing options
    if (window.data && Array.isArray(window.data)) {
        window.data.forEach((alternatif) => {
            const option = document.createElement("option");
            option.value = alternatif.alternatif_id; // Use the correct ID from your model/schema
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

    // Fetch kriteria values for the selected alternatif
    fetchKriteriaValueDataByUser().then(() => {
        if (selectedAlternatifId) {
            // Find the criteria for the selected alternatif from window.kriteriaData
            // Assuming window.kriteriaData is an array of kriteria objects,
            // and each kriteria object has an 'alternatif_id' property.
            const kriteriaForSelectedAlternatif =
                window.kriteriaValueData.filter((kriteria) => {
                    // You might need to adjust how you access the alternatif_id
                    // depending on the structure of your window.kriteriaData
                    // Example: if kriteriaData items have kriteria.alternatif_id
                    return kriteria.alternatif_id == selectedAlternatifId;
                });
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
    });
}

// Function to render the Kriteria Value form table
// Assuming fetchKriteriaById is defined elsewhere and works correctly

// Function to render the Kriteria Value form table
// Made this function async to await fetch calls inside
async function renderKriteriaValueFormTable(
    alternatifId,
    kriteriasValues,
    existingKriteriaValues = []
) {
    const kriteriaValueFormContainer = document.getElementById(
        "kriteria-value-form-container"
    );

    // Clear previous content and show a loading message
    kriteriaValueFormContainer.innerHTML = "<p>Loading criteria details...</p>";

    // Array to hold promises from fetching each kriteria's details
    const fetchPromises = kriteriasValues.map((kriteria_value) =>
        fetchKriteriaById(kriteria_value.kriteria_id)
    );

    // Wait for all fetch promises to resolve
    const allKriteriasDetails = await Promise.all(fetchPromises);
    // Now that we have details for all criteria, build the HTML string
    let formHtml = `
        <form id="kriteria-value-form" onsubmit="event.preventDefault() submitKriteriaValues(this)">
            <input type="hidden" name="_token" value="[the_generated_csrf_token]">
            <input type="hidden" name="_method" value="PUT">
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

    // Iterate through the fetched details and build table rows
    allKriteriasDetails.forEach((kriteria, index) => {
        // Check if fetching details for this kriteria was successful
        if (!kriteria) {
            console.warn(
                `Details not found for kriteria at index ${index}. Skipping row.`
            );
            return; // Skip this iteration if kriteria details are missing
        }
        // Find the corresponding kriteria_value where kriteria_id matches
        const kriteria_value = kriteriasValues.find(
            (kv) => kv.kriteria_id === kriteria.kriteria_id
        );
        formHtml += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
                    kriteria.nama
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    kriteria.tipe
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    kriteria.bobot
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="number"
                           name="kriteria_value[${
                               kriteria_value.kriteria_id
                           }, ${kriteria_value.kriteria_value_id}]"
                           class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                           value="${kriteria_value.value || 0}"
                           required
                           min="0"> 
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

    // Set the innerHTML only after all async fetches are complete and HTML is built
    kriteriaValueFormContainer.innerHTML = formHtml;
}

// Function to submit the Kriteria Value form via AJAX
async function submitKriteriaValues(form) {
    const formData = new FormData(form);
    const alternatifId = formData.get("alternatif_id"); // Get the selected alternatif ID

    // Collect kriteria values and IDs
    const kriteriaValues = [];
    formData.forEach((value, key) => {
        console.log(key, value); // For debugging
        if (key.startsWith("kriteria_value[")) {
            // Extract kriteria_ID from the key
            const kriteriaId = key.substring(
                key.indexOf("[") + 1,
                key.indexOf("]")
            );
            const kriteriaValueId = key.substring(
                key.indexOf(",") + 1,
                key.indexOf("]")
            );
            kriteriaValues.push({
                alternatif_id: parseInt(alternatifId), // Include the selected alternatif ID
                kriteria_id: parseInt(kriteriaId),
                kriteria_value_id: parseInt(kriteriaValueId), // Include the kriteria_value ID
                value: parseFloat(value), // Or parseFloat if your value is decimal
            });
        }
    });

    try {
        const response = await fetch("/api/kriteria-value/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify(kriteriaValues),
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
