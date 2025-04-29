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

async function fetchKriteriaById(kriteriaId) {
    try {
        const responsePromise = await fetch(`/api/kriteria/${kriteriaId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
        });

        if (!responsePromise.ok) {
            throw new Error(`HTTP error! status: ${responsePromise.status}`);
        }

        const kriteria = await responsePromise.json();
        return kriteria;
    } catch (error) {
        console.error("Error fetching kriteria by ID:", error);
        alert(`Failed to fetch kriteria by ID: ${error.message}`);
    }
}

async function addKriteriaValue($data) {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    fetchDataByUser().then(() => {
        if (window.data && Array.isArray(window.data)) {
            window.data.forEach((alternatif) => {
                const alternatifId = alternatif.alternatif_id;
                const kriteriaId = $data.kriteria_ID;
                const value = 0;
                $data.alternatif_id = alternatifId;
                if (userId && alternatifId && kriteriaId) {
                    new_kriteria_value = JSON.stringify({
                        user_id: userId,
                        alternatif_id: alternatifId,
                        kriteria_id: kriteriaId,
                        value: value,
                    });
                    try {
                        const responsePromise = fetch("/api/kriteria-value", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "content-type": "application/json",
                                "X-CSRF-TOKEN": document
                                    .querySelector('meta[name="csrf-token"]')
                                    .getAttribute("content"),
                            },
                            body: new_kriteria_value,
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
                                const contentType =
                                    response.headers.get("content-type");
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
                                renderKriteriaTable();
                                document
                                    .getElementById("kriteria-form")
                                    .reset();
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                                alert(
                                    `Failed to add kriteria. Please try again ${error.message}.`
                                );
                            });
                    } catch (error) {
                        console.error("Error:", error);
                        alert(
                            `Failed to add kriteria. Please try again: ${error.message}`
                        );
                    }
                }
            });
        }
    });
}

async function addKriteria() {
    const userId = parseInt(
        document.getElementById("current_user_id").value.trim()
    );
    const nama = document.getElementById("nama").value;
    const bobot = document.getElementById("bobot").value;
    const keteranganElement = document.querySelector(
        'input[name="keterangan"]:checked'
    );
    const keterangan = keteranganElement ? keteranganElement.value : null;

    if (!nama || !bobot || !keterangan) {
        alert("Please fill in all fields.");
        return;
    }

    if (nama && bobot && keterangan) {
        data = JSON.stringify({
            user_id: userId,
            nama: nama,
            bobot: bobot,
            tipe: keterangan,
        });
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
                    fetchKriteriaDataByUser();
                    renderKriteriaTable();
                    addKriteriaValue(data);
                    document.getElementById("kriteria-form").reset();
                    alert("Kriteria added successfully!");
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(
                        `Failed to add kriteria. Please try again ${error.message}.`
                    );
                    return;
                });
        } catch (error) {
            console.error("Error:", error);
            alert(`Failed to add kriteria. Please try again: ${error.message}`);
        }
    } else {
        alert("Please fill in all fields.");
        return;
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
