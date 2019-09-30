let useThisRange = 'infant';
let grandTotal = 0;
let fourthTotal = 0;
let thirdTotal = 0;
let secondTotal = 0;
let patientSex = null;
let inputArgs = null;

Date.prototype.toDateInputValue = (function () {
    let local = new Date(this);
    return local.toJSON().slice(0, 10);
});

Date.prototype.toTimeInputValue = (function () {
    let local = new Date(this);
    return `${local.getHours() > 9 ? local.getHours() : `0${local.getHours()}`}:${local.getMinutes() > 9 ? local.getMinutes() : `0${local.getMinutes()}`}`;
});

$(document).ready(() => {
    renderTableCells();
    $('#todayDate').val(new Date().toDateInputValue());
    setTimeForNow();
    initializeCanvas('canvasDiv', 'canvas', 'infant-canvas');
    setRadios();
    setFormType('burn');
    const args = require('electron').remote.process.argv;
    inputArgs = args;
    console.log('arguments passed...... ', args);
});

function setRadios() {
    const fill1 = document.getElementById('fill1');
    const tool1 = document.getElementById('tool1');
    const burn = document.getElementById('burnRadio');
    tool1.click();
    fill1.click();
    burn.click();
}

function setTimeForNow() {
    setInterval(() => {
        $('#currentTime').val(new Date().toTimeInputValue());
    }, 1000);
}

function resetCanvas() {
    let canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const tool1 = document.getElementById('tool1');
    tool1.click();
}

function initializeCanvas(c, d, e) {

    let canvasDiv = document.getElementById(c);
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', 400);
    canvas.setAttribute('height', 400);
    canvas.setAttribute('id', d);
    canvas.className = e;
    canvasDiv.appendChild(canvas);

    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }

    context = canvas.getContext("2d");
    let ctx = canvas.getContext('2d');
    let last_mousex = last_mousey = 0;
    let mousex = mousey = 0;
    let mousedown = false;

    //Mousedown
    $(`#${c}`).on('mousedown', (e) => {
        let canvasx = $(`#${c}`).offset().left;
        let canvasy = $(`#${c}`).offset().top;
        last_mousex = mousex = parseInt(e.pageX) - parseInt(canvasx);
        last_mousey = mousey = parseInt(e.pageY) - parseInt(canvasy);
        mousedown = true;
    });

    //Mouseup
    $(`#${c}`).on('mouseup', (e) => {
        mousedown = false;
    });


    //Mousemove
    $(`#${c}`).on('mousemove', (e) => {
        let canvasx = $(`#${c}`).offset().left;
        let canvasy = $(`#${c}`).offset().top;
        mousex = parseInt(e.pageX - canvasx);
        mousey = parseInt(e.pageY - canvasy);
        if (mousedown) {
            ctx.beginPath();
            if (tooltype == 'draw') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = canvasFillColor;
                ctx.lineWidth = 3;
            } else if (tooltype === 'erase') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 5;
            }
            ctx.moveTo(last_mousex, last_mousey);
            ctx.lineTo(mousex, mousey);
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.stroke();
        }
        last_mousex = mousex;
        last_mousey = mousey;
    });
}

function setSex(sex) {
    if (sex === 'm') {
        patientSex = 'male';
        let box = document.getElementById('femaleBox');
        box.checked = false;
    } else {
        patientSex = 'female';
        let box = document.getElementById('maleBox');
        box.checked = false;
    }
}

function calculateTotals() {

    const tableRows = [
        { name: 'head', infant: 19, oneToFour: 12, fiveToNine: 13, tenToFourteen: 11, fifteen: 8, adult: 7 },
        { name: 'neck', infant: 2, oneToFour: 2, fiveToNine: 2, tenToFourteen: 2, fifteen: 2, adult: 2 },
        { name: 'anteriorTrunk', infant: 13, oneToFour: 13, fiveToNine: 13, tenToFourteen: 13, fifteen: 13, adult: 13 },
        { name: 'posteriorTrunk', infant: 13, oneToFour: 13, fiveToNine: 13, tenToFourteen: 13, fifteen: 13, adult: 13 },
        { name: 'rightButtock', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
        { name: 'leftButtock', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
        { name: 'genetalia', infant: 1, oneToFour: 1, fiveToNine: 1, tenToFourteen: 1, fifteen: 1, adult: 1 },
        { name: 'rightUpperArm', infant: 4, oneToFour: 4, fiveToNine: 4, tenToFourteen: 4, fifteen: 4, adult: 4 },
        { name: 'leftUpperArm', infant: 4, oneToFour: 4, fiveToNine: 4, tenToFourteen: 4, fifteen: 4, adult: 4 },
        { name: 'rightLowerArm', infant: 3, oneToFour: 3, fiveToNine: 3, tenToFourteen: 3, fifteen: 3, adult: 3 },
        { name: 'leftLowerArm', infant: 3, oneToFour: 3, fiveToNine: 3, tenToFourteen: 3, fifteen: 3, adult: 3 },
        { name: 'rightHand', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
        { name: 'leftHand', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
        { name: 'rightThigh', infant: 5.5, oneToFour: 6.5, fiveToNine: 8, tenToFourteen: 8.5, fifteen: 9, adult: 9.5 },
        { name: 'leftThigh', infant: 5.5, oneToFour: 6.5, fiveToNine: 8, tenToFourteen: 8.5, fifteen: 9, adult: 9.5 },
        { name: 'rightLeg', infant: 5, oneToFour: 5, fiveToNine: 5.5, tenToFourteen: 6, fifteen: 6.5, adult: 7 },
        { name: 'leftLeg', infant: 5, oneToFour: 5, fiveToNine: 5.5, tenToFourteen: 6, fifteen: 6.5, adult: 7 },
        { name: 'rightFoot', infant: 3.5, oneToFour: 3.5, fiveToNine: 3.5, tenToFourteen: 3.5, fifteen: 3.5, adult: 3.5 },
        { name: 'leftFoot', infant: 3.5, oneToFour: 3.5, fiveToNine: 3.5, tenToFourteen: 3.5, fifteen: 3.5, adult: 3.5 }
    ];

    grandTotal = 0;
    secondTotal = 0;
    thirdTotal = 0;
    fourthTotal = 0;
    tableRows.map(row => renderCalculation(row));
}

function renderCalculation(row) {
    const second = $(`#${row.name}SecondDegree`).val();
    const third = $(`#${row.name}ThirdDegree`).val();
    const fourth = $(`#${row.name}FourthDegree`).val();
    const rowTotal = parseFloat(second ? second : 0) + parseFloat(third ? third : 0) + parseFloat(fourth ? fourth : 0);
    const maxAllowed = row[useThisRange];
    let totalBox = document.getElementById(`${row.name}Total`);
    $(`#${row.name}Total`).val(rowTotal > 0 ? rowTotal : null);
    grandTotal += rowTotal;
    $('#grandTotal').val(grandTotal > 0 ? grandTotal : null);
    secondTotal += parseFloat(second ? second : 0);
    $('#secondTotal').val(secondTotal);
    thirdTotal += parseFloat(third ? third : 0);
    $('#thirdTotal').val(thirdTotal > 0 ? thirdTotal : null);
    fourthTotal += parseFloat(fourth ? fourth : 0);
    $('#fourthTotal').val(fourthTotal > 0 ? fourthTotal : null);
    if (rowTotal > maxAllowed) {
        totalBox.style.background = 'red';
        totalBox.style.color = 'white';
    } else {
        totalBox.style.color = 'black';
        totalBox.style.background = 'white';
    }
}

function renderTableCells() {
    patientAge = $('#patientAge').val();
    let infant = Array.from(document.getElementsByClassName('infant'));
    let oneToFour = Array.from(document.getElementsByClassName('oneToFour'));
    let fiveToNine = Array.from(document.getElementsByClassName('fiveToNine'));
    let tenToFourteen = Array.from(document.getElementsByClassName('tenToFourteen'));
    let fifteen = Array.from(document.getElementsByClassName('fifteen'));
    let adult = Array.from(document.getElementsByClassName('adult'));
    if (patientAge < 1) {
        const noGos = adult.concat(oneToFour, fiveToNine, tenToFourteen, fifteen);
        alterTableDisplay(noGos, true);
        alterTableDisplay(infant, false);
        useThisRange = 'infant';
        removeAllClasses('infant-canvas');
        $('#canvas').addClass('infant-canvas');
    } else if (patientAge >= 1 && patientAge < 5) {
        const noGos = adult.concat(infant, fiveToNine, tenToFourteen, fifteen);
        alterTableDisplay(noGos, true);
        alterTableDisplay(oneToFour, false);
        useThisRange = 'oneToFour';
        removeAllClasses('oneToFour-canvas');
        $('#canvas').addClass('oneToFour-canvas');
    } else if (patientAge >= 5 && patientAge < 10) {
        const noGos = adult.concat(infant, oneToFour, tenToFourteen, fifteen);
        alterTableDisplay(noGos, true);
        alterTableDisplay(fiveToNine, false);
        useThisRange = 'fiveToNine';
        removeAllClasses('fiveToNine-canvas');
        $('#canvas').addClass('fiveToNine-canvas');
    } else if (patientAge >= 10 && patientAge < 15) {
        const noGos = adult.concat(infant, oneToFour, fiveToNine, fifteen);
        alterTableDisplay(noGos, true);
        alterTableDisplay(tenToFourteen, false);
        removeAllClasses('tenToFourteen-canvas');
        useThisRange = 'tenToFourteen';
        $('#canvas').addClass('tenToFourteen-canvas');
    } else if (patientAge == 15) {
        const noGos = adult.concat(infant, oneToFour, fiveToNine, tenToFourteen);
        alterTableDisplay(noGos, true);
        alterTableDisplay(fifteen, false);
        removeAllClasses('fifteen-canvas');
        useThisRange = 'fifteen';
        determineBackgroundAdult(patientAge);
    } else if (patientAge > 15) {
        const noGos = fifteen.concat(infant, oneToFour, fiveToNine, tenToFourteen);
        alterTableDisplay(noGos, true);
        alterTableDisplay(adult, false);
        removeAllClasses('adult-canvas');
        useThisRange = 'adult';
        determineBackgroundAdult(patientAge);
    }
}

function determineBackgroundAdult(age) {
    if (age < 18) {
        $('#canvas').removeClass('adult-canvas');
        $('#canvas').addClass('fifteen-canvas');
    } else {
        $('#canvas').removeClass('fifteen-canvas');
        $('#canvas').addClass('adult-canvas');
    }
}

function removeAllClasses(except) {
    const arr = ['infant-canvas', 'oneToFour-canvas', 'fiveToNine-canvas', 'tenToFourteen-canvas', 'fifteen-canvas', 'adult-canvas'];
    const canvas = document.getElementById('canvas');
    arr.forEach((c) => {
        if (canvas && c !== except) {
            $('#canvas').removeClass(c);
        }
    });
}

function alterTableDisplay(arr, hide) {
    arr.forEach((el) => {
        el.style.display = hide ? 'none' : 'table-cell';
    });
}

function generatePDF() {
    const ogWidth = document.body.style.width;
    let tools = document.getElementById('canvasTools');
    let resetCanvasButton = document.getElementById('resetCanvasButton');
    let ogTools = tools.style.display;
    tools.style.display = 'none';
    resetCanvasButton.style.display = 'none';
    document.body.style.width = '1400px';
    makeCellsDarker(false);
    html2canvas(document.body).then((canvas) => {
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth / canvas.width);
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4', true); // A4 size page of PDF
        let position = window.innerWidth < 500 ? -75 : window.innerWidth > 500 && window.innerWidth < 1200 ? -4 : -8;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        // let blob = pdf.output('blob');
        pdf.save();
        document.body.style.width = ogWidth;
        tools.style.display = ogTools;
        resetCanvasButton.style.display = 'none';
        makeCellsDarker(true);
    }).catch((err) => {
        document.body.style.width = ogWidth;
        tools.style.display = ogTools;
        resetCanvasButton.style.display = 'none';
        makeCellsDarker(true);
    });
}

function makeCellsDarker(def) {
    const tds = Array.from(document.getElementsByTagName('td'));
    const ths = Array.from(document.getElementsByTagName('th'));
    tds.map(t => executeStyleUpdate(t, def));
    ths.map(t => executeStyleUpdate(t, def));
}

function executeStyleUpdate(el, def) {
    if (!def) {
        el.style.border = "1px solid rgba(0, 0, 0, 0.5)";
    } else {
        el.style.border = "1px solid rgba(0, 0, 0, 0.12)";
    }
}