let useThisRange = 'infant';
let grandTotal = 0;
let fourthTotal = 0;
let thirdTotal = 0;
let secondTotal = 0;
let slideIndex = 1;
let manualMode = false;
const sql = require('mssql');
let envId = null;
let editMode = false;
let setFakeData = true;
const { ipcRenderer } = require('electron');

let dataObject = {
    tableData: null,
    formType: null,
    burnType: null,
    skinType: null,
    createdBy: null,
    dateOfInjury: null,
    timeOfInjury: null,
    amendmentHistory: []
};

let userData = {
    userName: null,
    userEsig: null,
    userId: null
};

let patientInfo = {
    patientName: null,
    medRecno: null,
    acctNo: null,
    patientAge: null,
    birthDate: null,
    patientSex: null,
    admitDate: null
};

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

let tableData = [
    { name: 'head', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'neck', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'anteriorTrunk', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'posteriorTrunk', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightButtock', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftButtock', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'genetalia', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightUpperArm', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftUpperArm', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightLowerArm', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftLowerArm', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightHand', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftHand', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightThigh', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftThigh', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightLeg', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftLeg', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'rightFoot', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 },
    { name: 'leftFoot', secondDegree: 0, thirdDegree: 0, fourthDegree: 0, total: 0 }
];

const fakeImageData = [
    {
        "wound_no": "Wound-4",
        "wound_desc": "PI; Medial; Forearm; Left; POA = ?; ",
        "wound_dos": "04/03/2019",
        "src": "https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019062018142500992012_07F4EBFE;jpg"
    },
    {
        "wound_no": "Wound-1",
        "wound_desc": "PI; Plantar; Finger; 2nd left; POA = ?; ",
        "wound_dos": "04/22/2019",
        "src": "https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019052217245303388001_C7864049;jpg"
    },
    {
        "wound_no": "Wound-5",
        "wound_desc": "PI; Anterior; Arm Lower; Left; POA = ?; ",
        "wound_dos": "09/10/2019", "src": "https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019091018100801184004_2A635C72;jpg"
    },
    {
        "wound_no": "Wound-11", "wound_desc": "PI; Inferior; Forearm; Right; POA = ?; ",
        "wound_dos": "09/18/2019",
        "src": "https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019101422241500592000_54D956AB;jpg"
    },
    {
        "wound_no": "Wound-9",
        "wound_desc": "PI; Anterior; Arm Lower; Right; POA = ?; ",
        "wound_dos": "09/20/2019", "src": "https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019092712394000892006_7CB1F16E;jpg"
    }
];

// format the date and time inputs to local setting
Date.prototype.toDateInputValue = (function () {
    let local = new Date(this);
    return local.toJSON().slice(0, 10);
});

Date.prototype.toTimeInputValue = (function () {
    let local = new Date(this);
    return `${local.getHours() > 9 ? local.getHours() : `0${local.getHours()}`}:${local.getMinutes() > 9 ? local.getMinutes() : `0${local.getMinutes()}`}`;
});

// once the doc loads....
$(document).ready(() => {
    renderTableCells(); // build the table
    $('#todayDate').val(new Date().toDateInputValue()); // set date
    setTimeForNow(); // set time
    initializeCanvas('canvasDiv', 'canvas', 'infant-canvas'); // build canvas
    setRadios(); // enable radios and preset form
    setFormType('burn');
    const args = require('electron').remote.process.argv; // get args passed from command line
    connectDB(args); // connect to db 
    const cancelSession = document.getElementById('cancelSession');
    cancelSession.addEventListener('click', () => { // add click listener to cancel and exit program
        ipcRenderer.send('cancel');
    });
    const openWoundImages = document.getElementById('openWoundImages');
    openWoundImages.addEventListener('click', () => { // launches the images view from patient history... should probably upddate this
        ipcRenderer.send('open-images', fakeImageData); // to hide the button if nothing is passed but meh for now
    });
    const undoButton = document.getElementById('undoCanvasReset');
    undoButton.style.display = 'none';
});

function connectDB(args) { // get the envelope id from args passed or use test id
    envId = args && args[3] ? args[3].slice(5) : 'c7a19bba-abdb-4ff0-b6e4-fe8528c8a1ae';
    const config = { // construct the connection config
        user: 'wfadmin',
        password: 'hiswfadmin',
        server: 'localhost',
        database: 'HealthlineWorkflow',
    }

    // get current userId passed and build query
    const userId = args && args[4] ? args[4].slice(6) : '';
    userData.userId = userId; // set for later
    const queryStringuserName = `
                        select name, esig_placeholder
                        from personnel 
                        where personnel_id = convert(varbinary(max), '${userId}', 1)
                        `;

    const queryStringpatName = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'PATIENT NAME'
                        `;

    const queryStringpatBirthdate = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'BIRTHDATE'
                        `;

    const queryStringpatientSex = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'SEX'
                        `;

    const queryStringmedRecno = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'MED REC NO'
                        `;

    const queryStringpatientAge = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'PATIENT AGE'
                        `;

    const queryStringacctNo = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'ACCT NO'
                        `;

    const queryStringadmitDate = `
                        select content_value
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'ADMISSION DATE'
                        `;
    const queryStringcanvasData = `
                        select content_cblob
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'LB Form Canvas'
                        `;

    const queryStringtableData = `
                        select content_cblob
                        From envelope_content
                        Where envelope_id = convert(uniqueidentifier, '${envId}') and
                        content_description = 'LB Form Data'
                        `;

    // send a connection request....
    sql.connect(config).then(res => {
        // whew.... on connection make all these queries
        // and set the data retured..... should probably find a way to cut these down

        sql.query(queryStringuserName).then(username => {
            userData.userName = username.recordset[0].esig_placeholder;
            userData.userEsig = username.recordset[0].esig_placeholder;
            initFields();
        }).catch(err => {
            console.log('query error retrieving User Info.... ', err);
        });

        sql.query(queryStringpatName).then(name => {
            patientName = name.recordset[0].content_value;
            patientInfo.patientName = name.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving Patient Name in query.... ', err);
        });

        sql.query(queryStringmedRecno).then(med => {
            medRecno = med.recordset[0].content_value;
            patientInfo.medRecno = med.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving med rec no in query.... ', err);
        });

        sql.query(queryStringacctNo).then(acc => {
            acctNo = acc.recordset[0].content_value;
            patientInfo.acctNo = acc.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving acct number in query.... ', err);
        });

        sql.query(queryStringpatientAge).then(age => {
            patientAge = age.recordset[0].content_value;
            patientInfo.patientAge = age.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving patient age in query.... ', err);
        });

        sql.query(queryStringpatBirthdate).then(bday => {
            birthDate = bday.recordset[0].content_value;
            patientInfo.birthDate = bday.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving patient DOB in query.... ', err);
        });

        sql.query(queryStringpatientSex).then(sex => {
            patientSex = sex.recordset[0].content_value;
            patientInfo.patientSex = sex.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving patient sex in query.... ', err);
        });

        sql.query(queryStringadmitDate).then(admit => {
            admitDate = admit.recordset[0].content_value;
            patientInfo.admitDate = admit.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving admit date in query.... ', err);
        });

        sql.query(queryStringcanvasData).then(canvasData => { // look to see if we had a canvas already
            if (canvasData.recordset.length && canvasData.recordset[0].content_cblob) {
                canvasExists = true; // if so redraw the canvas and set the form state to amended
                reDrawCanvas(canvasData.recordset[0].content_cblob);
                setEstimationChart('a');
            }
        }).catch(err => {
            console.log('error retrieving canvas data in query.... ', err);
        });

        sql.query(queryStringtableData).then(qd => { // if there was data from request
            if (qd.recordset.length && qd.recordset[0].content_cblob) {
                try { // try to parse the json and set info.....
                    const d = JSON.parse(qd.recordset[0].content_cblob);
                    dataObject = d;
                    tableData = d.tableData;
                    formType = d.formType;
                    editMode = true;
                    constructTable();
                    setEstimationChart('a');
                    setFormType(formType);
                    $('#dateOfInjury').val(dataObject.dateOfInjury);
                    $('#timeOfInjury').val(dataObject.timeOfInjury);
                    if (dataObject.burnType) { setBurnType(dataObject.burnType); }
                    if (dataObject.skinType) { setSkinType(dataObject.skinType); }
                    if (dataObject.createdBy && dataObject.amendmentHistory.length) { buildAmendmentHistory(); }
                } catch (e) {
                    console.log('error parsing json.... ', e);
                }
            } else { // there was no form yet so set initial state
                setEstimationChart('i'); console.log('there was no table data');
                dataObject.createdBy = userData.userName;
            }
        }).catch(err => {
            console.log('error retrieving table data in query.... ', err);
        });

    }).catch(e => { // on connection failure.... log the error and set fake data
        console.log('error connecting to database.... ', e); // ...if we're in debug mode
        if (setFakeData == true) {
            patientInfo = {
                patientName: 'Russ Lane',
                medRecno: 'M12345678',
                acctNo: 'A12345678890',
                patientAge: '56',
                birthDate: '04/25/1963',
                patientSex: 'M',
                admitDate: '01/01/2019'
            };
            userData.userEsig = 'wubalubbadubdub';
            patientAge = '56'
            initFields();
            fakeTable();
            // renderFakeImages();
            setEstimationChart('a');
            setBurnType('friction');
            const toggle = document.getElementById('toggleViewWrapper');
            toggle.style.display = 'block';
        } else { // render a blank form for them to fill out... hide save button
            const manual = document.getElementById('manualPatientData');
            const preset = document.getElementById('presetPatientData');
            const save = document.getElementById('submitData');
            manual.style.display = 'block';
            preset.style.display = 'none';
            save.style.display = 'none';
            manualMode = true;
            setEstimationChart('i');
        }
    });
}

function fakeTable() {
    const str = [
        { "name": "head", "secondDegree": "1", "thirdDegree": "2", "fourthDegree": "3", "total": 6 },
        { "name": "neck", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "anteriorTrunk", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "posteriorTrunk", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "rightButtock", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "leftButtock", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "genetalia", "secondDegree": "", "thirdDegree": "", "total": 0 },
        { "name": "rightUpperArm", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "leftUpperArm", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "rightLowerArm", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 },
        { "name": "leftLowerArm", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "rightHand", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "leftHand", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "rightThigh", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "leftThigh", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "rightLeg", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "leftLeg", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "rightFoot", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }, { "name": "leftFoot", "secondDegree": "", "thirdDegree": "", "fourthDegree": "", "total": 0 }];
    tableData = str;
    constructTable();
}

function buildAmendmentHistory() { // construct a section to display everyone
    const div = document.getElementById('amendment_history'); // thats edited the form
    dataObject.amendmentHistory.forEach((item) => {
        const snip = ` <h6>${item.userData.userName === dataObject.createdBy ? 'Created' : 'Amended '} by ${item.userData.userName} on ${item.date}</h6><br />`;
        div.innerHTML += snip;
    });
}

function initFields() { 
    $('#patientName').text(patientInfo.patientName);
    $('#patientAge').text(patientInfo.patientAge);
    $('#patientDOB').text(patientInfo.birthDate);
    $('#patientSex').text(patientInfo.patientSex);
    $('#medNum').text(patientInfo.medRecno);
    $('#accNum').text(patientInfo.acctNo);
    $('#dateOfAdmission').text(patientInfo.admitDate);
    $('#completedBy').val(userData.userEsig);
    renderTableCells();
}

function setRadios() {
    const fill1 = document.getElementById('fill1');
    const tool1 = document.getElementById('tool1');
    const burn = document.getElementById('burnRadio');
    tool1.click();
    fill1.click();
    burn.click();
}

function setBurnType(type) {
    const el = document.getElementById(`${type}_radio`);
    dataObject.burnType = type;
    el.checked = true;
}

function setSkinType(type) {
    const el = document.getElementById(`${type}_radio`);
    dataObject.skinType = type;
    el.checked = true;
}

function setEstimationChart(type) {
    const initial = document.getElementById('initialEstimate');
    const amended = document.getElementById('amendedEstimate');
    const discharge = document.getElementById('dischargeEstimate');
    if (type && type === 'i') {
        initial.checked = true;
    } else if (type && type === 'a') {
        amended.checked = true;
    } else if (type && type === 'd') {
        discharge.checked = true;
    } else {
        initial.checked = true;
    }
}

function setTimeForNow() {
    setInterval(() => {
        $('#currentTime').val(new Date().toTimeInputValue());
    }, 1000);
}

function resetCanvas(noReset) {
    if (!noReset) { saveCanvasStorage(); }
    let canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const tool1 = document.getElementById('tool1');
    tool1.click();
    if (localStorage.getItem('prevCanvas') && !noReset) {
        const undoButton = document.getElementById('undoCanvasReset');
        undoButton.style.display = 'block';
    }
}

function saveCanvasStorage() {
    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL();
    if (localStorage.getItem('prevCanvas')) { localStorage.removeItem('prevCanvas'); }
    localStorage.setItem('prevCanvas', url);
}

function undoCanvasClear() {
    const img = localStorage.getItem('prevCanvas');
    reDrawCanvas(img);
    const undoButton = document.getElementById('undoCanvasReset');
    undoButton.style.display = 'none';
}

function reDrawCanvas(img) {
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    drawDataURIOnCanvas(img, ctx);
}

function drawDataURIOnCanvas(strDataURI, context) {
    'use strict';
    let img = new window.Image();
    img.addEventListener('load', () => {
        context.drawImage(img, 0, 0);
    });
    img.setAttribute('src', strDataURI);
}

function initializeCanvas(c, d, e) {

    let canvasDiv = document.getElementById(c);
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', 400);
    canvas.setAttribute('height', 500);
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

    // Mousedown
    $(`#${c}`).on('mousedown', (e) => {
        let canvasx = $(`#${c}`).offset().left;
        let canvasy = $(`#${c}`).offset().top;
        last_mousex = mousex = parseInt(e.pageX) - parseInt(canvasx);
        last_mousey = mousey = parseInt(e.pageY) - parseInt(canvasy);
        mousedown = true;
    });

    // Mouseup
    $(`#${c}`).on('mouseup', (e) => {
        mousedown = false;
    });

    // Mousemove
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
    grandTotal = 0;
    secondTotal = 0;
    thirdTotal = 0;
    fourthTotal = 0; // reset the totals and reder calc for each row
    tableRows.map(row => renderCalculation(row));
}

function constructTable() {
    let count = tableData.length;
    tableData.forEach(row => {
        count--;
        $(`#${row.name}SecondDegree`).val(row.secondDegree);
        $(`#${row.name}ThirdDegree`).val(row.thirdDegree);
        $(`#${row.name}FourthDegree`).val(row.fourthDegree);
        if (count === 0) { calculateTotals(); }
    });
}

function renderCalculation(row) { // get the row total
    let dataRow = tableData.find(r => r.name === row.name);
    const second = $(`#${row.name}SecondDegree`).val();
    const third = $(`#${row.name}ThirdDegree`).val();
    const fourth = $(`#${row.name}FourthDegree`).val();
    const rowTotal = parseFloat(second ? second : 0) + parseFloat(third ? third : 0) + parseFloat(fourth ? fourth : 0);
    dataRow.secondDegree = second; // set the values
    dataRow.thirdDegree = third;
    dataRow.fourthDegree = fourth;
    dataRow.total = rowTotal;
    const maxAllowed = row[useThisRange]; // get the max allowed for the current range
    let totalBox = document.getElementById(`${row.name}Total`);
    $(`#${row.name}Total`).val(rowTotal > 0 ? rowTotal : null);
    grandTotal += rowTotal; // update the totals 
    $('#grandTotal').val(grandTotal > 0 ? grandTotal : null);
    secondTotal += parseFloat(second ? second : 0);
    $('#secondTotal').val(secondTotal);
    thirdTotal += parseFloat(third ? third : 0);
    $('#thirdTotal').val(thirdTotal > 0 ? thirdTotal : null);
    fourthTotal += parseFloat(fourth ? fourth : 0);
    $('#fourthTotal').val(fourthTotal > 0 ? fourthTotal : null);
    if (rowTotal > maxAllowed) { // check if the row total exceeds the max allowed
        totalBox.style.background = 'red'; // and render if its an error or not
        totalBox.style.color = 'white';
    } else {
        totalBox.style.color = 'black';
        totalBox.style.background = 'white';
    }
}

function renderTableCells() { // based on the patients age we need to update the table to use their age range
    if (manualMode == true) { patientAge = $('#patientAge').val(); } // and change the background in the canvas
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

function submitData() { // you guessed it... submit the form
    dataObject.tableData = tableData; // set the data to save and update amendmentHistory
    dataObject.amendmentHistory.push({ userData: userData, date: `${new Date().toISOString()}` });
    if (dataObject.createdBy === null) { dataObject.createdBy = userData.userName; }
    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL();
    const insert1 = `INSERT INTO [dbo].[envelope_content] ([envelope_id],[content_description],[content_value], [content_type],[content_cblob]) 
    VALUES (convert(uniqueidentifier, '${envId}'), 'LB Form Canvas', 'Canvas Data', 'canvas','${url}')`
    const insert2 = `INSERT INTO [dbo].[envelope_content] ([envelope_id],[content_description],[content_value], [content_type],[content_cblob]) 
    VALUES (convert(uniqueidentifier, '${envId}'), 'LB Form Data', 'Form Data', 'json','${JSON.stringify(dataObject)}')`
    const update1 = `UPDATE [dbo].[envelope_content] 
    SET [content_value] = 'Canvas Data', 
        [content_cblob] = '${url}' 
        WHERE envelope_id = (convert(uniqueidentifier, '${envId}')) 
            AND content_description = 'LB Form Canvas'`
    const update2 = `UPDATE [dbo].[envelope_content] 
    SET [content_value] = 'Form Data', 
        [content_cblob] = '${JSON.stringify(dataObject)}' 
        WHERE envelope_id = (convert(uniqueidentifier, '${envId}')) 
            AND content_description = 'LB Form Data'`
    // if in editMode do an update else insert new
    sql.query(editMode ? update1 : insert1).then(res => {
        console.log('result from inserting Canvas data.... ', res);
        sql.query(editMode ? update2 : insert2).then(res2 => {
            console.log('result from 2nd insert of table data..... ', res2);
            ipcRenderer.send('saved');
        }).catch(err2 => { console.log('error inserting table data.... ', err2); });
    }).catch(err => {
        console.log('query error inserting Canvas data.... ', err);
    });
}

function generatePDF() { // to generate a pdf to save
    const ogWidth = document.body.style.width;
    let tools = document.getElementById('canvasTools');
    let ogTools = tools.style.display;
    alterViewForPdf(false); // alter the view
    html2canvas(document.body).then((canvas) => { 
        const imgWidth = 210; // create a canvas of doc to append to pdf as img
        const imgHeight = (canvas.height * imgWidth / canvas.width) + 20;
        setTimeout(() => {
            const contentDataURL = canvas.toDataURL('image/png');
            let pdf = new jsPDF('p', 'mm', 'a4', true); // A4 size page of PDF
            // let position = window.innerWidth < 500 ? -90 : window.innerWidth > 500 && window.innerWidth < 1200 ? -4 : -8;
            // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
            pdf.addImage(contentDataURL, 'PNG', 0, null, imgWidth, imgHeight, '', 'FAST');
            pdf.save(`L&B_Form_${patientInfo.acctNo}_${new Date().toDateInputValue()}_${new Date().toTimeInputValue()}`);
            alterViewForPdf(true, ogWidth, ogTools); // set view back when done
        }, 300);
    }).catch((err) => { // if there's an error just reset form
        alterViewForPdf(true, ogWidth, ogTools);
    });
}

// we need to hide and rearrange some elements to get everything
// to fit and look clean so alter display for these elements.....
function alterViewForPdf(reset, ogWidth, ogTools) {
    let tools = document.getElementById('canvasTools');
    let resetCanvasButton = document.getElementById('resetCanvasButton');
    let toggleViewWrapper = document.getElementById('toggleViewWrapper');
    let formTypeWrapper = document.getElementById('formTypeWrapper');
    let openWoundImages = document.getElementById('openWoundImages');
    let toolbar = document.getElementById('toolbar');
    let burnLegend = document.getElementById('burnLegend');
    let skinLegend = document.getElementById('skinLegend');
    let formActions = document.getElementById('formActions');
    let amendmentHistory = document.getElementById('amendment_history');

    if (!reset) {
        makeCellsDarker(false);
        if (formType === 'burn') {
            burnLegend.style.display = 'block';
            skinLegend.style.display = 'none';
        } else {
            skinLegend.style.display = 'block';
            burnLegend.style.display = 'none';
        }
        document.body.style.width = '1400px';
        tools.style.display = 'none';
        toggleViewWrapper.style.display = 'none';
        resetCanvasButton.style.display = 'none';
        formTypeWrapper.style.display = 'none';
        openWoundImages.style.display = 'none';
        toolbar.style.display = 'none';
        formActions.style.display = 'none';
        amendmentHistory.style.display = 'none';
    } else {
        document.body.style.width = ogWidth;
        tools.style.display = ogTools;
        resetCanvasButton.style.display = 'block';
        toggleViewWrapper.style.display = 'block';
        formTypeWrapper.style.display = 'block';
        openWoundImages.style.display = 'block';
        toolbar.style.display = 'block';
        formActions.style.display = 'block';
        amendmentHistory.style.display = 'block';
        if (burnLegend) { burnLegend.style.display = 'none'; }
        if (skinLegend) { skinLegend.style.display = 'none'; }
        makeCellsDarker(true);
    }
}

function makeCellsDarker(def) {
    const tds = Array.from(document.getElementsByTagName('td'));
    const ths = Array.from(document.getElementsByTagName('th'));
    const hrs = Array.from(document.getElementsByTagName('hr'));
    tds.map(t => executeStyleUpdate(t, def));
    ths.map(t => executeStyleUpdate(t, def));
    hrs.map(t => executeStyleUpdate(t, def));
}

function executeStyleUpdate(el, def) {
    if (!def) {
        el.style.border = '1px solid rgba(0, 0, 0, 0.5)';
    } else {
        el.style.border = '1px solid rgba(0, 0, 0, 0.12)';
    }
}
