// Script to toggle dropdown menu
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdownMenu = event.currentTarget.nextElementSibling;
    dropdownMenu.classList.toggle("hidden");
}

document.addEventListener("click", function (event) {
    const dropdownMenus = document.querySelectorAll(".dropdown-menu");
    dropdownMenus.forEach((menu) => {
        if (!menu.classList.contains("hidden")) {
            menu.classList.add("hidden");
        }
    });
});

// Script to toggle mobile sidebar
function toggleMobileNav(event) {
    event.stopPropagation();
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav.classList.contains("-translate-x-full")) {
        mobileNav.classList.remove("-translate-x-full");
        mobileNav.classList.add("translate-x-0");
    } else {
        mobileNav.classList.remove("translate-x-0");
        mobileNav.classList.add("-translate-x-full");
    }
}

function closeMobileNav() {
    const mobileNav = document.getElementById("mobile-nav");
    if (!mobileNav.classList.contains("-translate-x-full")) {
        mobileNav.classList.add("-translate-x-full");
        mobileNav.classList.remove("translate-x-0");
    }
}

// Script to show pages and change button color
function showPage(pageId, element) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        if (page.id === pageId) {
            page.classList.remove("hidden");
        } else {
            page.classList.add("hidden");
        }
    });

    const links = document.querySelectorAll("nav a");
    links.forEach((link) => {
        link.classList.remove("text-green-500");
        link.classList.add("text-gray-400");
    });

    element.classList.remove("text-gray-400");
    element.classList.add("text-green-500");

    // Update page title
    const pageTitle = document.getElementById("page-title");
    if (pageId === "dashboard") {
        pageTitle.textContent = "Dashboard";
    } else if (pageId === "alternatif") {
        // fetchDataByUser();
        pageTitle.textContent = "Alternatif";
    } else if (pageId === "kriteria") {
        // fetchKriteriaDataByUser();
        pageTitle.textContent = "Kriteria";
    } else if (pageId === "hasil") {
        pageTitle.textContent = `Hasil${q++}`;
        a = async function () {
            await generateHasilTable();
        };
        a();
    }
}
q = 0;
setTimeout(() => {
    const loginAlert = document.getElementById("login-alert");
    if (loginAlert) {
        loginAlert.style.display = "none";
    }
}, 5000);
