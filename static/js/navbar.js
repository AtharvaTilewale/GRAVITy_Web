const dropdown = document.getElementById("fileDropdown");

function importFile() {
    alert("Import File function triggered");
    // Add file import functionality here
}

function loadPDBFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            viewer.clear();
            viewer.addModel(e.target.result, "pdb");
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            viewer.zoomTo();
            viewer.render();
        };
        reader.readAsText(file);
    }
}

function toggleDropdown(event) {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav li")) {
        dropdown.style.display = "none";
    }
});

let viewer = $3Dmol.createViewer("viewer", { backgroundColor: "black" });
function openModal() {
    let modal = document.getElementById("pdbModal");
    modal.style.display = "block";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
}
function closeModal() {
    document.getElementById("pdbModal").style.display = "none";
}
function fetchPDB() {
    let pdbId = document.getElementById("pdbInput").value.trim();
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
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            viewer.zoomTo();
            viewer.render();
            console.log("PDB model loaded successfully.");
            closeModal();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to load PDB file. Please check the ID.");
        });
}
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