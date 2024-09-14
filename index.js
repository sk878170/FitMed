document.addEventListener("DOMContentLoaded", () => {
    let navbar = document.querySelector(".navbar");
    let searchBox = document.querySelector(".search-box i");
    let input = document.querySelector("#input");
    let suggestionBox = document.createElement('div');
    suggestionBox.classList.add('suggestion-box');
    document.body.appendChild(suggestionBox);

    // List of items to search from with actual links
    let items = [
        { name: "gym", link: "#" },
        { name: "", link: "#" },
        { name: "", link: "#" },
        { name: "", link: "#" },
        { name: "", link: "#" },
        { name: "", link: "#" },
        { name: "", link: "#" },
        { name: "", link: "#" },
    ];

    // Toggle search box on icon click
    searchBox.addEventListener("click", () => {
        navbar.classList.toggle("showInput");
        if (navbar.classList.contains("showInput")) {
            searchBox.classList.replace("bx-search", "bx-x");
            input.focus();
        } else {
            searchBox.classList.replace("bx-x", "bx-search");
            suggestionBox.style.display = 'none';
        }
    });

    // Show suggestions on input
    input.addEventListener("input", () => {
        let value = input.value.toLowerCase();
        suggestionBox.innerHTML = '';
        if (value) {
            let suggestions = items.filter(item => item.name.toLowerCase().includes(value));
            suggestions.forEach(suggestion => {
                let suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.innerHTML = `<a href="${suggestion.link}">${suggestion.name}</a>`;
                suggestionBox.appendChild(suggestionItem);
            });
            suggestionBox.style.display = 'block';
        } else {
            suggestionBox.style.display = 'none';
        }
    });

    // Hide suggestions when clicking outside the search box
    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && !suggestionBox.contains(e.target)) {
            navbar.classList.remove("showInput");
            searchBox.classList.replace("bx-x", "bx-search");
            suggestionBox.style.display = 'none';
        }
    });
});


// -------------- sidebar open close js code
let navLinks = document.querySelector(".nav-links");
let menuOpenBtn = document.querySelector(".navbar .bx-menu");
let menuCloseBtn = document.querySelector(".nav-links .bx-x");
menuOpenBtn.onclick = function () {
    navLinks.style.left = "0";
}
menuCloseBtn.onclick = function () {
    navLinks.style.left = "-100%";
}


// sidebar submenu open close js code
let htmlcssArrow = document.querySelector(".htmlcss-arrow");
htmlcssArrow.onclick = function () {
    navLinks.classList.toggle("show1");
}
let moreArrow = document.querySelector(".more-arrow");
moreArrow.onclick = function () {
    navLinks.classList.toggle("show2");
}
let jsArrow = document.querySelector(".js-arrow");
jsArrow.onclick = function () {
    navLinks.classList.toggle("show3");
}
const body = document.querySelector("body"),
    nav = document.querySelector("nav"),
    modeToggle = document.querySelector(".dark-light"),
    searchToggle = document.querySelector(".searchToggle"),
    sidebarOpen = document.querySelector(".sidebarOpen"),
    sidebarClose = document.querySelector(".siderbarClose");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
    body.classList.add("dark");
}

modeToggle.addEventListener("click", () => {
    modeToggle.classList.toggle("active");
    body.classList.toggle("dark");

    if (!body.classList.contains("dark")) {
        localStorage.setItem("mode", "light-mode");
    } else {
        localStorage.setItem("mode", "dark-mode");
    }
});

searchToggle.addEventListener("click", () => {
    searchToggle.classList.toggle("active");
});

sidebarOpen.addEventListener("click", () => {
    nav.classList.add("active");
});

sidebarClose.addEventListener("click", () => {
    nav.classList.remove("active");
});

body.addEventListener("click", e => {
    let clickedElm = e.target;

    if (!clickedElm.classList.contains("sidebarOpen") && !clickedElm.closest('.nav-bar')) {
        nav.classList.remove("active");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const serviceLinks = document.querySelectorAll('.nav-link.services > a');

    serviceLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const dropdown = this.nextElementSibling;
            const dropdownIcon = this.querySelector('.dropdown-icon');

            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                dropdownIcon.style.transform = 'rotate(0deg)';
            } else {
                // Close other open dropdowns
                document.querySelectorAll('.drop-down').forEach(dd => dd.style.display = 'none');
                document.querySelectorAll('.dropdown-icon').forEach(icon => icon.style.transform = 'rotate(0deg)');

                dropdown.style.display = 'block';
                dropdownIcon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Close the dropdown when clicking outside, but not inside the dropdown
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav-link.services') && !event.target.closest('.drop-down')) {
            document.querySelectorAll('.drop-down').forEach(dd => dd.style.display = 'none');
            document.querySelectorAll('.dropdown-icon').forEach(icon => icon.style.transform = 'rotate(0deg)');
        }
    });
});
