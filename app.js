// ===============================
// USER ACCOUNT SYSTEM (No Firebase)
// ===============================

// Save user
function signup() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        alert("Account already exists!");
        return;
    }

    users.push({ email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! You can now login.");
}

// Login user
function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === pass);

    if (found) {
        localStorage.setItem("loggedInUser", email);
        alert("Logged in successfully!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}

// Logout user
function logout() {
    localStorage.removeItem("loggedInUser");
    updateNavbar(); // refresh navbar immediately
    window.location.href = "login.html";
}

// ===============================
// NAVBAR DYNAMIC UPDATE (SHOW PHOTO IF SET)
// ===============================
function updateNavbar() {
    const navUserIcon = document.getElementById("navUserIcon");
    if (!navUserIcon) return;

    const loggedUser = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === loggedUser);
    const updateLink = document.getElementById("updateLink");

    if (loggedUser) {
        // Show Update Queue link if exists
        if (updateLink) updateLink.style.display = "inline";

        navUserIcon.classList.add("logged-in");
        navUserIcon.href = "profile.html";
        navUserIcon.title = "Logged in as " + loggedUser;

        if (user && user.photo) {
            navUserIcon.innerHTML = `<img src="${user.photo}" alt="Profile" class="nav-profile-img">`;
        } else {
            navUserIcon.innerHTML = `<span class="nav-profile-initial">${loggedUser.charAt(0).toUpperCase()}</span>`;
        }
    } else {
        // Not logged in → show default icon
        if (updateLink) updateLink.style.display = "none";
        navUserIcon.classList.remove("logged-in");
        navUserIcon.href = "login.html";
        navUserIcon.title = "Login";
        navUserIcon.innerHTML = `<i class="fa fa-user fa-lg"></i>`;
    }
}

// Call updateNavbar on page load
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

// ===============================
// REDIRECT LOGIN PAGE IF ALREADY LOGGED IN
// ===============================
if (window.location.pathname.includes("login.html") && localStorage.getItem("loggedInUser")) {
    window.location.href = "dashboard.html";
}

// =====================================
// QUEUE SYSTEM — Stored in localStorage
// =====================================
if (!localStorage.getItem("locations")) {
    const defaultLocations = [
        { id: "advising", name: "Academic Advising", currentQueue: 5, avgWaitTime: 12, crowdLevel: "yellow", lastUpdated: "Just now" },
        { id: "dining-student-centre", name: "CAW Student Centre (Dining / Marketplace)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "library-help-desk", name: "Leddy Library Help Desk", currentQueue: 8, avgWaitTime: 15, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "international-student-centre", name: "International Student Centre (ISC)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "registrar-office", name: "Registrar's Office", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "financial-aid", name: "Financial Aid Office", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "career-services", name: "Career Services Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "student-accounts", name: "Student Accounts / Payments", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "campus-police", name: "Campus Police / Security Desk", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "recreation-centre", name: "University Recreation Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "student-life", name: "Student Life Office", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "housing-services", name: "Housing / Residence Services", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "it-support", name: "IT Help Desk / Support", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "bookstore", name: "Campus Bookstore", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "writing-support", name: "Writing Support Desk", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "peer-support", name: "Peer Support Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "uw-career-centre", name: "Career Centre (CDEL – JEC)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "co-op-career-employment", name: "Co‑op, Career & Employment Services (CCES)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "entrepreneurship-innovation-centre", name: "EPICentre – Entrepreneurship Practice & Innovation Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" }
    ];
    localStorage.setItem("locations", JSON.stringify(defaultLocations));
}

// ==========================
// LOAD LOCATIONS ON HOME/DASHBOARD
// ==========================
function loadLocations() {
    const container = document.getElementById("locations");
    if (!container) return;

    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    container.innerHTML = "";

    locations.forEach(loc => {
        container.innerHTML += `
            <div class="card ${loc.crowdLevel}">
                <h3>${loc.name}</h3>
                <p><b>Queue:</b> ${loc.currentQueue}</p>
                <p><b>Wait Time:</b> ${loc.avgWaitTime} mins</p>
                <p><i>Updated: ${loc.lastUpdated}</i></p>
            </div>
        `;
    });
}

// ==========================
// LOAD LOCATIONS IN DROPDOWN (UPDATE PAGE)
// ==========================
function loadLocationList() {
    const select = document.getElementById("locationSelect");
    if (!select) return;

    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    select.innerHTML = "";

    locations.forEach(loc => {
        select.innerHTML += `<option value="${loc.id}">${loc.name}</option>`;
    });
}

// ==========================
// UPDATE QUEUE (UPDATE PAGE)
// ==========================
function updateQueue() {
    const loggedUser = localStorage.getItem("loggedInUser");
    if (!loggedUser) {
        alert("You must login first to update queue.");
        return;
    }

    const id = document.getElementById("locationSelect").value;
    const queue = Number(document.getElementById("queueNum").value);
    const wait = Number(document.getElementById("waitTime").value);
    const crowd = document.getElementById("crowdLevel").value;

    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    const index = locations.findIndex(l => l.id === id);

    if (index !== -1) {
        locations[index].currentQueue = queue;
        locations[index].avgWaitTime = wait;
        locations[index].crowdLevel = crowd;
        locations[index].lastUpdated = new Date().toLocaleString();
    }

    localStorage.setItem("locations", JSON.stringify(locations));
    alert("Queue updated!");
    loadLocations();
}

// ===============================
// PROFILE PAGE PHOTO UPLOAD & SAVE
// ===============================
function setupProfilePhoto() {
    const loggedUser = localStorage.getItem("loggedInUser");
    if (!loggedUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.email === loggedUser);

    const photoInput = document.getElementById("photoUpload");
    const profileImg = document.getElementById("profilePhoto");

    // Load existing photo if set
    if (currentUser && currentUser.photo) {
        profileImg.src = currentUser.photo;
    }

    // Upload new photo
    if (photoInput) {
        photoInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function() {
                const photoData = reader.result;
                profileImg.src = photoData;

                if (currentUser) {
                    currentUser.photo = photoData;
                    localStorage.setItem("users", JSON.stringify(users));
                }

                updateNavbar(); // update navbar photo immediately
            };
            reader.readAsDataURL(file);
        });
    }
}

// Call setupProfilePhoto only on profile page
if (window.location.pathname.includes("profile.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        setupProfilePhoto();
    });
}













/*// ===============================
// USER ACCOUNT SYSTEM (No Firebase)
// ===============================

// Save user
function signup() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        alert("Account already exists!");
        return;
    }

    users.push({ email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! You can now login.");
}

// Login user
function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === pass);

    if (found) {
        localStorage.setItem("loggedInUser", email);
        alert("Logged in successfully!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}

// Logout user
function logout() {
    localStorage.removeItem("loggedInUser");
    updateNavbar(); // refresh navbar immediately
    window.location.href = "login.html";
}

// ===============================
// NAVBAR DYNAMIC UPDATE
// ===============================
function updateNavbar() {
    const navUserIcon = document.getElementById("navUserIcon");
    const navLinks = document.getElementById("navLinks");
    const loggedUser = localStorage.getItem("loggedInUser");
    const profilePhoto = localStorage.getItem("profilePhoto");

    let updateLink = document.getElementById("updateLink");

    if (loggedUser) {
        // Add "Update Queue" link if missing
        if (!updateLink && navLinks) {
            updateLink = document.createElement("a");
            updateLink.href = "admin.html";
            updateLink.id = "updateLink";
            updateLink.textContent = "Update Queue";
            navLinks.insertBefore(updateLink, navUserIcon);
        }

        if (navUserIcon) {
            navUserIcon.classList.add("logged-in");
            navUserIcon.href = "profile.html";
            navUserIcon.title = "Logged in as " + loggedUser;

            // Show profile photo if exists, otherwise initial
            if (profilePhoto) {
                navUserIcon.innerHTML = `<img src="${profilePhoto}" alt="Profile" class="nav-profile-img">`;
            } else {
                navUserIcon.innerHTML = `<span class="nav-profile-initial">${loggedUser.charAt(0).toUpperCase()}</span>`;
            }
        }
    } else {
        // LOGGED OUT → show Font Awesome user icon
        if (updateLink) updateLink.remove();
        if (navUserIcon) {
            navUserIcon.classList.remove("logged-in");
            navUserIcon.href = "login.html";
            navUserIcon.title = "Login";
            navUserIcon.innerHTML = `<i class="fa fa-user fa-lg"></i>`;
        }
    }
}

// ===============================
// REDIRECT LOGIN PAGE IF ALREADY LOGGED IN
// ===============================
if (window.location.pathname.includes("login.html") && localStorage.getItem("loggedInUser")) {
    window.location.href = "profile.html";
}

// ===============================
// CALL UPDATE NAVBAR AFTER DOM LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

// =====================================
// QUEUE SYSTEM — Stored in localStorage
// =====================================

// Initialize default locations if empty
if (!localStorage.getItem("locations")) {
    const defaultLocations = [
        { id: "advising", name: "Academic Advising", currentQueue: 5, avgWaitTime: 12, crowdLevel: "yellow", lastUpdated: "Just now" },
        { id: "dining-student-centre", name: "CAW Student Centre (Dining / Marketplace)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "library-help-desk", name: "Leddy Library Help Desk", currentQueue: 8, avgWaitTime: 15, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "international-student-centre", name: "International Student Centre (ISC)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "registrar-office", name: "Registrar's Office", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "financial-aid", name: "Financial Aid Office", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "career-services", name: "Career Services Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "student-accounts", name: "Student Accounts / Payments", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "campus-police", name: "Campus Police / Security Desk", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "recreation-centre", name: "University Recreation Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "student-life", name: "Student Life Office", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "housing-services", name: "Housing / Residence Services", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "it-support", name: "IT Help Desk / Support", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "bookstore", name: "Campus Bookstore", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "writing-support", name: "Writing Support Desk", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "peer-support", name: "Peer Support Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "uw-career-centre", name: "Career Centre (CDEL – JEC)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "co-op-career-employment", name: "Co‑op, Career & Employment Services (CCES)", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" },
        { id: "entrepreneurship-innovation-centre", name: "EPICentre – Entrepreneurship Practice & Innovation Centre", currentQueue: 0, avgWaitTime: 0, crowdLevel: "green", lastUpdated: "Just now" }
    ];
    localStorage.setItem("locations", JSON.stringify(defaultLocations));
}

// ==========================
// LOAD LOCATIONS ON HOME/DASHBOARD
// ==========================
function loadLocations() {
    const container = document.getElementById("locations");
    if (!container) return;

    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    container.innerHTML = "";

    locations.forEach(loc => {
        container.innerHTML += `
            <div class="card ${loc.crowdLevel}">
                <h3>${loc.name}</h3>
                <p><b>Queue:</b> ${loc.currentQueue}</p>
                <p><b>Wait Time:</b> ${loc.avgWaitTime} mins</p>
                <p><i>Updated: ${loc.lastUpdated}</i></p>
            </div>
        `;
    });
}

// ==========================
// LOAD LOCATIONS IN DROPDOWN (UPDATE PAGE)
// ==========================
function loadLocationList() {
    const select = document.getElementById("locationSelect");
    if (!select) return;

    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    select.innerHTML = "";

    locations.forEach(loc => {
        select.innerHTML += `<option value="${loc.id}">${loc.name}</option>`;
    });
}

// ==========================
// UPDATE QUEUE (UPDATE PAGE)
// ==========================
function updateQueue() {
    const loggedUser = localStorage.getItem("loggedInUser");
    if (!loggedUser) {
        alert("You must login first to update queue.");
        return;
    }

    const id = document.getElementById("locationSelect").value;
    const queue = Number(document.getElementById("queueNum").value);
    const wait = Number(document.getElementById("waitTime").value);
    const crowd = document.getElementById("crowdLevel").value;

    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    const index = locations.findIndex(l => l.id === id);

    if (index !== -1) {
        locations[index].currentQueue = queue;
        locations[index].avgWaitTime = wait;
        locations[index].crowdLevel = crowd;
        locations[index].lastUpdated = new Date().toLocaleString();
    }

    localStorage.setItem("locations", JSON.stringify(locations));
    alert("Queue updated!");
    loadLocations();
}



/*photo upload and preview for profile page*/
