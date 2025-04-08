// Script to toggle dropdown menu
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdownMenu = event.currentTarget.nextElementSibling;
    dropdownMenu.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        if (!menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
        }
    });
});

// Script to toggle mobile sidebar
function toggleMobileNav(event) {
    event.stopPropagation();
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav.classList.contains('-translate-x-full')) {
        mobileNav.classList.remove('-translate-x-full');
        mobileNav.classList.add('translate-x-0');
    } else {
        mobileNav.classList.remove('translate-x-0');
        mobileNav.classList.add('-translate-x-full');
    }
}

function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav.classList.contains('-translate-x-full')) {
        mobileNav.classList.add('-translate-x-full');
        mobileNav.classList.remove('translate-x-0');
    }
}

// Script to show pages and change button color
function showPage(pageId, element) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('hidden');
        } else {
            page.classList.add('hidden');
        }
    });

    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.classList.remove('text-green-500');
        link.classList.add('text-gray-400');
    });

    element.classList.remove('text-gray-400');
    element.classList.add('text-green-500');

    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageId === 'dashboard') {
        pageTitle.textContent = 'Dashboard';
    } else if (pageId === 'alternatif') {
        pageTitle.textContent = 'Alternatif';
    } else if (pageId === 'kriteria') {
        pageTitle.textContent = 'Kriteria';
    } else if (pageId === 'hasil') {
        pageTitle.textContent = 'Hasil';
    }
}

// CRUD operations for Alternatif page
// let data = [];

// function addData() {
//     const name = document.getElementById('name').value;
//     const code = document.getElementById('code').value;

//     if (name && code) {
//         data.push({
//             name,
//             code: code
//         });
//         renderTable();
//         document.getElementById('alternatif-form').reset();
//     }
// }

// function editData(index) {
//     const name = prompt("Enter new name:", data[index].name);
//     const code = prompt("Enter new value:", data[index].code);

//     if (name && code) {
//         data[index] = {
//             name,
//             value: code
//         };
//         renderTable();
//     }
// }

// function deleteData(index) {
//     if (confirm("Are you sure you want to delete this item?")) {
//         data.splice(index, 1);
//         renderTable();
//     }
// }

// function renderTable() {
//     const tableBody = document.getElementById('alternatif-table');
//     tableBody.innerHTML = '';

//     data.forEach((item, index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td class="border px-4 py-2">${item.name}</td>
//             <td class="border px-4 py-2">${item.code}</td>
//             <td class="border px-4 py-2">
//                 <button onclick="editData(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
//                 <button onclick="deleteData(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
//             </td>
//         `;
//         tableBody.appendChild(row);
//     });
// }

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
setTimeout(() => {
    const loginAlert = document.getElementById('login-alert');
    if (loginAlert) {
        loginAlert.style.display = 'none';
    }
}, 5000);