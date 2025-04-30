window.data = [];

async function fetchDataByUser() {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    try {
        const response = await fetch(`/api/alternatif/user/${userId}`, {
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
        window.data = await response.json();
        renderTable();
    } catch (error) {
        console.error("Could not fetch alternatives by user:", error);
    }
}

async function addData() {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    const name = document.getElementById("name").value.trim();
    const code = document.getElementById("code").value.trim();
    if (!name || !code) {
        alert("Please fill in the Name and Code fields.");
        return;
    }
    if (name && code && userId) {
        try {
            const responsePromise = fetch("/api/alternatif", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    user_id: userId,
                    nama: name,
                    code: code,
                }),
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
                    // Process your JSON data (this will be the newly created alternatif)
                    window.data.push(data); // Assuming 'data' is a global array
                    window.renderTable(); // Assuming 'renderTable' is a global function
                    document.getElementById("alternatif-form").reset();
                    alert("Alternatif added successfully!");
                })
                .catch((error) => {
                    // Handle any errors that occurred during the process
                    console.error("Error:", error);
                    alert(`Error adding alternative: ${error}`);
                });
        } catch (error) {
            console.error("Could not add alternative:", error);
            alert(`Could not add alternative: ${error}`);
        }
    }
}

async function editData() {
    index = document.getElementById("alternatif-data-id-on-edit").value;
    alternatifData = window.data[index];
    const newName = document
        .getElementById("edit-alternatif-name")
        .value.trim();
    const newCode = document
        .getElementById("edit-alternatif-code")
        .value.trim();
    if (!newName || !newCode) {
        alert("Please fill in the Name and Code fields.");
        return;
    }
    if (newName && newCode) {
        if (confirm("Are you sure you want to update this item?")) {
            const id = alternatifData.alternatif_id;
            alternatifData.nama = newName;
            alternatifData.code = newCode;
            try {
                const response = await fetch(`/api/alternatif/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"), // Add CSRF token
                    },
                    body: JSON.stringify(alternatifData),
                });
                renderTable();
                closeEditModal();
            } catch (error) {
                console.error("Could not update alternative:", error);
                alert(`Could not update alternative: ${error.message}`);
            }
        }
    } else {
        alert("Please fill in the Name and Code fields.");
    }
}
async function deleteData(index) {
    const id = window.data[index].alternatif_id;
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            const response = await fetch(`/api/alternatif/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"), // Add CSRF token
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error deleting alternative:", errorData);
                alert(
                    `Error deleting alternative: ${
                        errorData.message || "Unknown error"
                    }`
                );
                return;
            }

            // Remove the deleted item from the data array
            data.splice(index, 1);
            renderTable();
            alert("Alternative deleted successfully!");
        } catch (error) {
            console.error("Could not delete alternative:", error);
            alert(`Could not delete alternative: ${error.message}`);
        }
    }
}

function renderTable() {
    const tableBody = document.getElementById("alternatif-table");
    tableBody.innerHTML = "";
    window.data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border px-4 py-2">${item.nama}</td>
            <td class="border px-4 py-2">${item.code}</td>
            <td class="border px-4 py-2">
                <button onclick="openEditModal(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteData(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    // Reset the form and button

    const addButton = document.getElementById("add-button");
    const form = document.getElementById("alternatif-form");
    form.reset(); // Reset the form fields
    form.action = "/api/alternatif";
    addButton.textContent = "Add";
    addButton.onclick = addData;
}

// Fetch initial data when the page loads
document.addEventListener("DOMContentLoaded", fetchDataByUser);

// Modal open/close for edit
function openEditModal($index) {
    document.getElementById("edit-alternatif-modal").classList.add("active");
    document.getElementById("edit-alternatif-modal").classList.remove("hidden");

    document.getElementById("alternatif-data-id-on-edit").value = $index;
    document.getElementById("edit-alternatif-name").value = data[$index].nama;
    document.getElementById("edit-alternatif-code").value = data[$index].code;
}

function closeEditModal() {
    document.getElementById("edit-alternatif-modal").classList.add("hidden");
    document.getElementById("edit-alternatif-modal").classList.remove("active");
}
