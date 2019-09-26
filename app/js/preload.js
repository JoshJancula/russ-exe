var patientAge = 0;
var tooltype = 'draw';
var canvasFillColor = "#000306";
var formType = 'burn';

function setCanvasFill(color) {
    canvasFillColor = color;
}

function useTool(tool) {
    tooltype = tool; //update
}

function setFormType(type) {
    var burn = document.getElementById('burnTypes');
    var skin = document.getElementById('skinTypes');
    var lowerBurn = document.getElementById('lowerBurn');
    var burnAnnotations = document.getElementById('burnAnnotations');
    var skinAnnotations = document.getElementById('skinAnnotations');
    var fill1 = document.getElementById('fill1');
    var fill3 = document.getElementById('fill3');

    console.log('location.... ', window.location);

    if (type === 'burn') {
        formType = 'burn';
        burn.style.display = 'inline';
        lowerBurn.style.display = 'inline';
        skin.style.display = 'none';
        burnAnnotations.style.display = 'inline';
        skinAnnotations.style.display = 'none';
        fill1.click();
    } else {
        formType = 'skinDisease';
        burn.style.display = 'none';
        lowerBurn.style.display = 'none';
        skin.style.display = 'inline';
        burnAnnotations.style.display = 'none';
        skinAnnotations.style.display = 'inline';
        fill3.click();
    }
}