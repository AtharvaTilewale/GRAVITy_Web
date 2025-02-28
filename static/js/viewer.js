let viewer = $3Dmol.createViewer("viewer", { backgroundColor: "black" });

function applyPDBStyles(viewer) {
    // Get all atoms in the structure
    const allAtoms = viewer.getModel().selectedAtoms({});

    // Check for ligands, membrane lipids, ions, and water molecules
    const hasLigands = allAtoms.some(atom => atom.hetflag && atom.resn !== "HOH");
    const hasWater = allAtoms.some(atom => atom.resn === "HOH" || atom.resn === "SOL");
    const lipidResidues = ["POPC", "POPE", "DOPC", "DPPC", "DMPC"];
    const hasMembrane = allAtoms.some(atom => lipidResidues.includes(atom.resn));
    
    const ionResidues = ["NA", "K", "CA", "MG", "ZN", "FE", "CL", "MN", "CU", "CO"];
    const hasIons = allAtoms.some(atom => ionResidues.includes(atom.resn));

    // If only protein is present, apply a simple cartoon style
    if (!hasLigands && !hasWater && !hasMembrane && !hasIons) {
        viewer.setStyle({ cartoon: { color: 'spectrum' } });
    } else {
        // Protein - Cartoon representation
        viewer.setStyle({ atom: "CA" }, { cartoon: { style: "trace", color: 'spectrum' } });

        // Detect and display ligands (HETATM entries except HOH)
        viewer.setStyle({ hetflag: true, resn: ["HOH"] }, {}); // Exclude water
        viewer.setStyle({ hetflag: true }, { stick: { colorscheme: "Jmol" } });

        // Detect and display water molecules
        viewer.setStyle({ resn: "HOH" }, { sphere: { radius: 0.3, color: "red" } });
        viewer.setStyle({ resn: "SOL" }, { sphere: { radius: 0.2, color: "blue" } });

        // Detect and display membrane lipids
        viewer.setStyle({ resn: lipidResidues }, { stick: { colorscheme: "greenCarbon" } });

        // Detect and display common ions with distinct colors
        const ionColors = {
            "NA": "purple",  // Sodium
            "K": "violet",   // Potassium
            "CA": "orange",  // Calcium
            "MG": "green",   // Magnesium
            "ZN": "blue",    // Zinc
            "FE": "brown",   // Iron
            "CL": "cyan",    // Chlorine
            "MN": "gray",    // Manganese
            "CU": "teal",    // Copper
            "CO": "pink"     // Cobalt
        };

        Object.keys(ionColors).forEach(ion => {
            viewer.setStyle({ resn: ion }, { sphere: { radius: 0.8, color: ionColors[ion] } });
        });
    }
    
    updateHierarchy();

    // Adjust view and render
    viewer.zoomTo();
    viewer.render();
}