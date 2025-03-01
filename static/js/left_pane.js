function manual() {
    document.getElementById("askSimType").style.display="none"
    document.getElementById("simulationTaskMan").style.display="block"
}

function automated() {
    document.getElementById("askSimType").style.display="none"
    document.getElementById("simulationTaskAuto").style.display="block"
}

function updateHierarchy() {
    let parentDiv = document.getElementById("structureInfo");
    const model = viewer.getModel();

    function addInfoDiv(id, text) {
        let existingDiv = document.getElementById(id);

        if (!existingDiv) {
            let newDiv = document.createElement("div");
            newDiv.id = id;
            newDiv.classList.add("heirarchyRow")
            newDiv.innerHTML = text;
            parentDiv.appendChild(newDiv);
        }
    }

    // Clear previous elements inside parentDiv
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }

    if (model.length === 0) {
        parentDiv.innerHTML = "No structure file available"
    }

    const allAtoms = viewer.getModel().selectedAtoms({});
    const hasProtein = allAtoms.some(atom => atom.hetflag === false);
    const hasLigands = allAtoms.some(atom => atom.hetflag && !["HOH", "SOL"].includes(atom.resn));
    const hasWater = allAtoms.some(atom => ["HOH", "SOL"].includes(atom.resn));
    const lipidResidues = ["POPC", "POPE", "DOPC", "DPPC", "DMPC", "CHOL", "PLPC", "PA", "PS", "PE", "PG", "PC", "SM"];
    const hasMembrane = allAtoms.some(atom => lipidResidues.includes(atom.resn));
    const ionResidues = ["NA", "K", "CA", "MG", "ZN", "FE", "CL", "MN", "CU", "CO"];
    const hasIons = allAtoms.some(atom => ionResidues.includes(atom.resn));

    if (hasProtein) addInfoDiv("prot", "Protein");
    if (hasLigands) addInfoDiv("lig", "Ligand");
    if (hasWater) addInfoDiv("water", "Water");
    if (hasMembrane) addInfoDiv("membrane", "Membrane");
    if (hasIons) addInfoDiv("ions", "Ions");
}