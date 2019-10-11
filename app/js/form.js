let useThisRange = 'infant';
let grandTotal = 0;
let fourthTotal = 0;
let thirdTotal = 0;
let secondTotal = 0;
let patientSex = null;
let inputArgs = null;
let patienName = null;
// patient age is defined elsewhere
let birthDate = null
let medRecno = null;
let acctNo = null;
let serviceDate = null;
let admitDate = null;
let roomBed = null;
let ptLocation = null;
let patientWoundImages = [];
let slideIndex = 1;

let patientInfo = {
    patientName: null,
    medRecno: null,
    acctNo: null,
    patientAge: null,
    birthDate: null,
    patientSex: null,
    admitDate: null
}

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
    console.log('arguments passed...... ', args);
    connectDB(args);
    initWoundImageCarousel();
});

// odbc settings in args[7]
// within odbc settings format: '<key1>=<value1>;<key2>=<value2>;....'
// where keys are:
// odbc: odbc[1],
// dsn: odbc[2],
// user: odbc[3],
// password: odbc[4],
// launchapp: odbc[5] - we want to set focus to this when we close with return code
// machinename: odbc[6],
// server: odbc[7]

const form_data = {
    patient_name: 'bill',
    patient_age: 22,
    sex: 'M',
    pdf: 'data:png base64 string'
}

function connectDB(args) {
    const envId = args && args[3] ? args[3].slice(5) : 'c7a19bba-abdb-4ff0-b6e4-fe8528c8a1ae';
    const sql = require('mssql');
    const config = {
        user: 'wfadmin',
        password: 'hiswfadmin',
        server: 'localhost',
        database: 'HealthlineWorkflow',
    }

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
    /* dont need location
        const queryStringlocation = `
                            select content_value
                            From envelope_content
                            Where envelope_id = convert(uniqueidentifier, '${envId}') and
                            content_description = 'LOCATION'
                            `;    
        const queryStringroomBed = `
                            select content_value
                            From envelope_content
                            Where envelope_id = convert(uniqueidentifier, '${envId}') and
                            content_description = 'ROOM&BED'
                            `;
    
    // service date is user entry
        const queryStringserviceDate = `
                            select content_value
                            From envelope_content
                            Where envelope_id = convert(uniqueidentifier, '${envId}') and
                            content_description = 'SERVICE DATE'
                            `;
    */

    sql.connect(config).then(res => {
        console.log('res from connection.... ', res);
        // below is the line to make a query... whatever queryString is, is what it will search

        /* useful syntax below - extract result from array       
        sql.query(queryString2).then(res2 => { // go get me envIDconverted
            console.log('result from query to convert string... ', res2);
            envIDconverted = res2.recordsets[0][0]['']; // this is now envIDconverted
            console.log('ENVID converted...', envIDconverted); // once you have it execute next query...
 */

        /*   // our winner below
                   sql.query(`select content_value From envelope_content where envelope_id = 
                   convert(uniqueidentifier, '${envId}') and
                   content_description = 'PATIENT NAME' `).then(res4 => {
                       console.log('result from PATIENT NAME query using converted from envid... ', res4);
                       patientName = res4;
       
                   }).catch(err => {
                       console.log('error processing PATIENT NAME query.... ', err);
                   });
       
               }).catch(err => {
                   console.log('error processing convert string query.... ', err);
               });
         */

        sql.query(queryStringpatName).then(name => {
            console.log('result from query name is.... ', name);
            patientName = name.recordset[0].content_value;
            patientInfo.patientName = name.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving Patient Name in query.... ', err);
        });

        sql.query(queryStringmedRecno).then(med => {
            console.log('result from query medRecno is.... ', med);
            medRecno = med.recordset[0].content_value;
            patientInfo.medRecno = med.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving med rec no in query.... ', err);
        });

        sql.query(queryStringacctNo).then(acc => {
            console.log('result from query accNo.... ', acc);
            acctNo = acc.recordset[0].content_value;
            patientInfo.acctNo = acc.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving acct number in query.... ', err);
        });

        sql.query(queryStringpatientAge).then(age => {
            console.log('result from query patient age is.... ', age);
            patientAge = age.recordset[0].content_value;
            patientInfo.patientAge = age.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving patient age in query.... ', err);
        });

        sql.query(queryStringpatBirthdate).then(bday => {
            console.log('result from query bday is.... ', bday);
            birthDate = bday.recordset[0].content_value;
            patientInfo.birthDate = bday.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving patient DOB in query.... ', err);
        });

        sql.query(queryStringpatientSex).then(sex => {
            console.log('result from query sex is.... ', sex);
            patientSex = sex.recordset[0].content_value;
            patientInfo.patientSex = sex.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving patient sex in query.... ', err);
        });

        sql.query(queryStringadmitDate).then(admit => {
            console.log('result from query admit date is.... ', admit);
            admitDate = admit.recordset[0].content_value;
            patientInfo.admitDate = admit.recordset[0].content_value;
            initFields();
        }).catch(err => {
            console.log('error retrieving admit date in query.... ', err);
        });

        /*   dont need location and date of service is entered by user
        sql.query(queryStringlocation).then(res2 => {
            console.log('result from query.... ', res2);
            ptLocation = res2;
        }).catch(err => {
            console.log('error retrieving location in query.... ', err);
        });

        sql.query(queryStringroomBed).then(res2 => {
            console.log('result from query.... ', res2);
            roomBed = res2;
        }).catch(err => {
            console.log('error retrieving room bed no in query.... ', err);
        });
        
        sql.query(queryStringserviceDate).then(res2 => {
            console.log('result from query.... ', res2);
            serviceDate = res2;
        }).catch(err => {
            console.log('error retrieving service date no in query.... ', err);
        }); */


    }).catch(e => {
        console.log('error connecting to database.... ', e);
        patientInfo = {
            patientName: 'Russ Lane',
            medRecno: 'M12345678',
            acctNo: 'A12345678890',
            patientAge: '56',
            birthDate: '04/25/1963',
            patientSex: 'M',
            admitDate: '01/01/2019'
        };
        patientAge = '56'
        initFields();
    });
}

function initFields() {
    $('#dateOfAdmission').text(patientInfo.admitDate);
    $('#patientName').text(patientInfo.patientName);
    $('#patientAge').text(patientInfo.patientAge);
    $('#patientDOB').text(patientInfo.birthDate);
    $('#patientSex').text(patientInfo.patientSex);
    $('#medNum').text(patientInfo.medRecno);
    $('#accNum').text(patientInfo.acctNo);
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
    // patientAge = $('#patientAge').val();
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
    toggleViewImages(false);
    const ogWidth = document.body.style.width;
    let tools = document.getElementById('canvasTools');
    let resetCanvasButton = document.getElementById('resetCanvasButton');
    let toggleViewWrapper = document.getElementById('toggleViewWrapper');
    let ogTools = tools.style.display;
    document.body.style.width = '1400px';
    tools.style.display = 'none';
    toggleViewWrapper.style.display = 'none';
    resetCanvasButton.style.display = 'none';
    makeCellsDarker(false);
    html2canvas(document.body).then((canvas) => {
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth / canvas.width) + 30;
        setTimeout(() => {
            const contentDataURL = canvas.toDataURL('image/png');
            let pdf = new jsPDF('p', 'mm', 'a4', true); // A4 size page of PDF
            let position = window.innerWidth < 500 ? -90 : window.innerWidth > 500 && window.innerWidth < 1200 ? -4 : -8;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
            // let blob = pdf.output('blob');
            pdf.save();
            document.body.style.width = ogWidth;
            tools.style.display = ogTools;
            resetCanvasButton.style.display = 'block';
            toggleViewWrapper.style.display = 'block';
            makeCellsDarker(true);
        }, 300);
    }).catch((err) => {
        document.body.style.width = ogWidth;
        tools.style.display = ogTools;
        resetCanvasButton.style.display = 'block';
        toggleViewWrapper.style.display = 'block';
        makeCellsDarker(true);
    });
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

function toggleViewImages(bool) {
    const divWrapper = document.getElementById('woundImages');
    const formWrapper = document.getElementById('formWrapper');
    if (bool) {
        divWrapper.style.display = 'block';
        formWrapper.style.display = 'none';
    } else {
        divWrapper.style.display = 'none';
        formWrapper.style.display = 'block';
    }
}

function initWoundImageCarousel() {
    const bRoll = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-6Ged2vq4PZF7w4ma2haK0vELUQL-Ti9V3K71ZpneMt_5k4KA',
        'data:image/jpeg;base64,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',
        'data:image/png;base64,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',
    ];
    const toggleWrapper = document.getElementById('toggleViewWrapper');
    const radio = document.getElementById('formWrapperRadio');
    let count = bRoll.length;
    bRoll.forEach(pic => {
        let dot = `<span class="dot" onclick="currentSlide(${count})"></span>`
        let newImage = `
                <div class="mySlides fade">
                    <div class="numbertext">${count} / ${bRoll.length}</div>
                            <img src="${pic}" style="height: 400px; width:100%">
                <div class="text">Caption ${count}</div>
            </div>
      `;
        $('#carouselDiv').prepend(newImage);
        $('#carouselDots').prepend(dot);
        count--;
    });
    toggleWrapper.style.display = 'block';
    radio.click();
    currentSlide(1);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}