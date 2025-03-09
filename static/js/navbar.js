// =========== THIS SCRIPT CONTAINS THE FUNCTIONS FOR THE NAVBAR ==========

// Dropdown Script

const dropdown = document.getElementById("fileDropdown");

function toggleDropdown(event) {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav li")) {
        dropdown.style.display = "none";
    }
});

//Load PDB file (Import file from local device and show in visualizer)

function loadPDBFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            viewer.clear();  // Clear previous structures
            viewer.addModel(e.target.result, "pdb");

            // Apply predefined styles from viewer.js
            applyPDBStyles(viewer);

            // Adjust view and render
            viewer.zoomTo();
            viewer.render();
        };
        reader.readAsText(file);
    }
}

//Fetch PDB from web function (Get with PDB ID)
//Open Modal to enter PDB ID

function openModal() {
    let modal = document.getElementById("pdbModal");
    modal.style.display = "block";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
}

//Close modal funciton

function closeModal() {
    document.getElementById("pdbModal").style.display = "none";
}

//Fetch PDB using PDB ID and show in visualizer

function fetchPDB() {
    let pdbId = (document.getElementById("pdbInputNavbar")?.value.trim() || 
                 document.getElementById("pdbInputManual")?.value.trim() || 
                 document.getElementById("pdbInputAuto")?.value.trim() || 
                 "").trim();
    if (!pdbId) {
        alert("Please enter a valid PDB ID");
        return;
    }
    console.log(`Fetching PDB ID: ${pdbId}`);

    fetch(`https://files.rcsb.org/download/${pdbId}.pdb`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch PDB file.");
            }
            return response.text();
        })
        .then(pdbData => {
            viewer.clear();
            viewer.addModel(pdbData, "pdb");  // Corrected function
            
            // Apply predefined styles from viewer.js
            applyPDBStyles(viewer);

            console.log("PDB model loaded successfully.");
            closeModal();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to load PDB file. Please check the ID.");
        });
}

//Make modal draggable

let modal = document.getElementById("pdbModal");
let offsetX, offsetY, isDragging = false;

modal.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;
});

document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        modal.style.left = (e.clientX - offsetX) + "px";
        modal.style.top = (e.clientY - offsetY) + "px";
    }
});

document.addEventListener("mouseup", function () {
    isDragging = false;
});