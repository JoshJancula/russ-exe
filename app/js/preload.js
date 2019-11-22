let patientAge = 0;
let tooltype = 'draw';
let canvasFillColor = "#000306";
let formType = 'burn';

function setCanvasFill(color) {
    canvasFillColor = color;
    const tool1 = document.getElementById('tool1');
    tool1.click();
}

function useTool(tool) {
    tooltype = tool; //update
}

function setFormType(type) {
    let burn = document.getElementById('burnTypes');
    let skin = document.getElementById('skinTypes');
    let lowerBurn = document.getElementById('lowerBurn');
    let burnAnnotations = document.getElementById('burnAnnotations');
    let skinAnnotations = document.getElementById('skinAnnotations');
    let selectFill = document.getElementById('selectFill');
    let fill1 = document.getElementById('fill1');
    let fill3 = document.getElementById('fill3');

    if (type === 'burn') {
        formType = 'burn';
        burn.style.display = 'inline';
        lowerBurn.style.display = 'inline';
        skin.style.display = 'none';
        burnAnnotations.style.display = 'inline';
        skinAnnotations.style.display = 'none';
        selectFill.style.display = 'block';
        fill1.click();
    } else {
        formType = 'skinDisease';
        burn.style.display = 'none';
        lowerBurn.style.display = 'none';
        skin.style.display = 'inline';
        burnAnnotations.style.display = 'none';
        skinAnnotations.style.display = 'inline';
        selectFill.style.display = 'none';
        fill3.click();
    }
    dataObject.formType = type;
    resetCanvas(true);
}