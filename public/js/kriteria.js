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

function editKriteria(index) {
    const nama = prompt("Enter new nama:", kriteriaData[index].nama);
    const bobot = prompt("Enter new bobot:", kriteriaData[index].bobot);
    const keterangan = prompt(
        "Enter new keterangan (Benefit/Cost):",
        kriteriaData[index].keterangan
    );

    if (nama && bobot && (keterangan === "Benefit" || keterangan === "Cost")) {
        kriteriaData[index] = {
            nama,
            bobot,
            keterangan,
        };
        renderKriteriaTable();
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
                <button onclick="editKriteria(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
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
