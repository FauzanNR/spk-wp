
// CRUD operations for Kriteria page
let kriteriaData = [];

function addKriteria() {
    const nama = document.getElementById('nama').value;
    const bobot = document.getElementById('bobot').value;
    const keterangan = document.querySelector('input[name="keterangan"]:checked').value;

    if (nama && bobot && keterangan) {
        kriteriaData.push({
            nama,
            bobot,
            keterangan
        });
        renderKriteriaTable();
        document.getElementById('kriteria-form').reset();
    }
}

function editKriteria(index) {
    const nama = prompt("Enter new nama:", kriteriaData[index].nama);
    const bobot = prompt("Enter new bobot:", kriteriaData[index].bobot);
    const keterangan = prompt("Enter new keterangan (Benefit/Cost):", kriteriaData[index].keterangan);

    if (nama && bobot && (keterangan === 'Benefit' || keterangan === 'Cost')) {
        kriteriaData[index] = {
            nama,
            bobot,
            keterangan
        };
        renderKriteriaTable();
    }
}

function deleteKriteria(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        kriteriaData.splice(index, 1);
        renderKriteriaTable();
    }
}

function renderKriteriaTable() {
    const tableBody = document.getElementById('kriteria-table');
    tableBody.innerHTML = '';

    kriteriaData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2">${item.nama}</td>
            <td class="border px-4 py-2">${item.bobot}</td>
            <td class="border px-4 py-2">${item.keterangan}</td>
            <td class="border px-4 py-2">
                <button onclick="editKriteria(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteKriteria(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}