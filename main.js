global.window = { document: { createElementNS: () => { return {} } } };
const { app, BrowserWindow } = require('electron');
let mainWindow = null;
let imageWindow = null;
let hasOpenImageWindow = false;
let imageData = null;
const { ipcMain } = require('electron');
// const server = require('./server'); // just importing this will launch server to create api bridge
const { protocol } = require('electron');
const nfs = require('fs');
const npjoin = require('path').join;
const es6Path = npjoin(__dirname, '/ion_app/www');
// const debug = require('electron-debug');
const ffmpeg = require('ffmpeg-static-electron');
// const jsPDF = require('jspdf');
// const html2canvas = require('html2canvas');
const sql = require('mssql');
let canvasString = null;
let userId = null;
let envId = null;
let mssqlConnected = false;
let mssqlQueryCount = 0;
const maxQueryCount = 10;
let connectionInProgress = false;
let debugMode = false;
// const ElectronPDF = require('electron-pdf');


let dataObject = {
  tableData: null,
  formType: 'burn',
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

let bypassStandard = false;

// debug({ isEnabled: false, showDevTools: false});

// if (process.argv) {
//   // console.log('args... ', process.argv);
//   let id = process.argv && process.argv[2] ? process.argv[2].slice(8) : null;
//   let id2 = process.argv && process.argv[3] ? process.argv[3].slice(5) : null;
//   console.log('id... ', id);
//   console.log('id2... ', id2);
// }


if (process.platform !== 'darwin' || bypassStandard) {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'es6', privileges: { standard: true } }
  ]);
} else {
  protocol.registerStandardSchemes(['es6']);
}


app.on('ready', () => {
  protocol.registerBufferProtocol('es6', (req, cb) => {
    nfs.readFile(
      npjoin(es6Path, req.url.replace('es6://', '')),
      (e, b) => { cb({ mimeType: 'text/javascript', data: b }) }
    );
  });
  createWindow();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 300,
    minWidth: 460,
    icon: __dirname + '/app/assets/healthline_logo.ico',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  mainWindow.setTitle('Lund & Browder Form');
  // mainWindow.loadFile('./app/index.html'); // jquery build
  // mainWindow.loadURL('http://localhost:4200'); // angular dev 
  mainWindow.loadFile('./ion_app/www/index.html'); // angular build
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
    imageWindow = null;
  });
}

ipcMain.on('cancel', (evt, arg) => {
  app.exit(0);
});

ipcMain.on('saved', (evt, arg) => {
  app.exit(1);
});

ipcMain.on('open-images', async (evt, arg) => {
  if (!hasOpenImageWindow) {
    imageData = arg;
    await createImageWindow(arg);
  } else {
    imageWindow.hide();
    imageWindow.show();
  }
});

ipcMain.on('image-window-loaded', (evt, arg) => {
  evt.sender.send('loaded-response', imageData);
});

ipcMain.on('close-images', (evt, arg) => {
  // imageWindow.exit();
});

ipcMain.on('request-ffmpeg', (evt, arg) => {
  evt.sender.send('ffmpeg-response', ffmpeg);
});

// app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

// app.on('activate', () => {
//   if (mainWindow === null) createWindow();
// });

async function createImageWindow(imgs) {
  hasOpenImageWindow = true;
  imageWindow = new BrowserWindow({
    width: 600,
    height: 460,
    minHeight: 460,
    minWidth: 600,
    maxHeight: 460,
    maxWidth: 600,
    x: 9999,
    y: 0,
    icon: __dirname + '/app/assets/healthline_logo.ico',
    webPreferences: {
      nodeIntegration: true,
      additionalArguments: [`--imageData=${imgs}`]
    }
  });

  imageWindow.setTitle('Patient Wound Images');
  imageWindow.loadFile('./app/images.html');
  // imageWindow.webContents.openDevTools();
  imageWindow.setMenu(null);

  imageWindow.on('closed', () => {
    imageWindow = null;
    hasOpenImageWindow = false;
  });
}

// mssql connections and queries
// ==========================================

ipcMain.on('get-args', (evt, arg) => {
  evt.sender.send('args-response', process.argv);
});

ipcMain.on('connect-mssql', (evt, arg) => {
  if (!debugMode) { // not in debugMode mode
    if (!mssqlConnected && mssqlQueryCount < 10 && !connectionInProgress) { // connection not established
      if (process.argv) {
        connectMsSql(process.argv).then(() => {
          executeMsSqlQueries(process.argv).then(() => {
            const d = {
              user_data: userData,
              patient_data: patientInfo,
              data_object: dataObject,
              canvas_string: canvasString
            };
            evt.sender.send('mssql-response', d);
          }).catch(e => {
            evt.sender.send('mssql-response', { success: false, msg: 'Failed to connect to mssql', err: e });
          });
        }).catch(err => {
          evt.sender.send('mssql-response', { success: false, msg: 'Failed to connect to mssql', err: err });
        });
      } else {
        evt.sender.send('mssql-response', { success: false, msg: 'Failed to connect to mssql, args were null' });
      }
    } else { // mssql already connected...
      const d = {
        user_data: userData,
        patient_data: patientInfo,
        data_object: dataObject,
        canvas_string: canvasString
      };
      evt.sender.send('mssql-response', d);
    }
  } else {
    evt.sender.send('mssql-response', { success: false, msg: 'Failed to connect to mssql' });
  }
});

ipcMain.on('submit-mssql', (evt, arg) => {
  // console.log('evt... ', evt);
  // console.log('args... ', arg);
  if (!debugMode) {
    console.log('arg.edit.... ', arg.editMode);
    console.log('arg.canvas.... ', arg.canvasUrl);
    console.log('arg.data.... ', arg.data);

    submitMsSql(arg.editMode, arg.canvasUrl, arg.data).then(() => {
      evt.sender.send('submit-response', { success: true, msg: 'we saved data????' });
    }).catch(err => {
      console.log('failed to submit... ', err);
      evt.sender.send('submit-response', { success: false, msg: 'Failed to submit data to mssql', err: err });
    });
  } else {
    // not sure what to do...
  }
});

ipcMain.on('save-pdf', (evt, arg) => {
  // handlePdf().then(() => {
  //   evt.sender.send('pdf-complete', { success: true, msg: 'Saved pdf' });
  // }).catch(e => {
    // evt.sender.send('pdf-complete', { success: false, msg: 'Failed to save pdf', err: e });
  // });
});

// function handlePdf(data) {
//   return new Promise((resolve, reject) => {
//     const exporter = new ElectronPDF();

//     const jobOptions = {
//       inMemory: false
//     };

//     const options = {
//       pageSize: "A4"
//     };

//     exporter.createJob(source, target, options, jobOptions).then(job => {
//       job.on('job-complete', (r) => {
//         console.log('pdf files:', r.results);
//         // Process the PDF file(s) here
//       })
//       job.render()
//     })
//   });
// }

function executeMsSqlQueries(args) { // get the envelope id from args passed or use test id
  return new Promise((resolve, reject) => {
    envId = args && args[3] ? args[3].slice(5) : 'c7a19bba-abdb-4ff0-b6e4-fe8528c8a1ae';
    // get current userId passed and build query
    userId = args && args[4] ? args[4].slice(6) : '';
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

    sql.query(queryStringuserName).then(username => {
      userData.userName = username.recordset[0].esig_placeholder;
      userData.userEsig = username.recordset[0].esig_placeholder;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('query error retrieving User Info.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringpatName).then(name => {
      patientInfo.patientName = name.recordset[0].content_value;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving Patient Name in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringmedRecno).then(med => {
      patientInfo.medRecno = med.recordset[0].content_value;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving med rec no in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringacctNo).then(acc => {
      patientInfo.acctNo = acc.recordset[0].content_value;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving acct number in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringpatientAge).then(age => {
      patientInfo.patientAge = age.recordset[0].content_value;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving patient age in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringpatBirthdate).then(bday => {
      patientInfo.birthDate = bday.recordset[0].content_value;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving patient DOB in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringpatientSex).then(sex => {
      patientInfo.patientSex = sex.recordset[0].content_value;
      console.log('patient sex is.... ', patientInfo.patientSex)
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving patient sex in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringadmitDate).then(admit => {
      patientInfo.admitDate = admit.recordset[0].content_value;
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch(err => {
      mssqlQueryCount++;
      console.log('error retrieving admit date in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringcanvasData).then((canvasData) => { // look to see if we had a canvas already
      if (canvasData.recordset.length && canvasData.recordset[0].content_cblob) {
        canvasString = canvasData.recordset[0].content_cblob;
      }
      mssqlQueryCount++;
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    }).catch((err) => {
      mssqlQueryCount++;
      console.log('error retrieving canvas data in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });

    sql.query(queryStringtableData).then((qd) => { // if there was data from request
      if (qd.recordset.length && qd.recordset[0].content_cblob) {
        try { // try to parse the json and set info.....
          const d = JSON.parse(qd.recordset[0].content_cblob);
          dataObject = d;
        } catch (e) {
          console.log('error parsing json.... ', e);
        }
        mssqlQueryCount++;
        if (mssqlQueryCount >= maxQueryCount) { resolve(); }
      } else { // there was no form yet so set initial state
        // dataObject.createdBy = userData.userName;
        mssqlQueryCount++;
        if (mssqlQueryCount >= maxQueryCount) { resolve(); }
      }
    }).catch((err) => {
      mssqlQueryCount++;
      console.log('error retrieving table data in query.... ', err);
      if (mssqlQueryCount >= maxQueryCount) { resolve(); }
    });
  });
}

function connectMsSql() {
  connectionInProgress = true;
  let serverId = process.argv && process.argv[8] ? process.argv[8].slice(8) : 'localhost';
  return new Promise((resolve, reject) => {
    const config = { // construct the connection config
      user: 'wfadmin',
      password: 'hiswfadmin',
      server: serverId,
      database: 'HealthlineWorkflow',
    };
    sql.connect(config).then((res) => {
      mssqlConnected = true;
      connectionInProgress = false;
      resolve();
    }).catch((e) => {
      connectionInProgress = false;
      console.log('err... ', e);
      reject(m,);
    });
  });
}

function submitMsSql(edit, url, obj) {
  return new Promise((resolve, reject) => {
    const insert1 = `
        INSERT INTO [dbo].[envelope_content] ([envelope_id],[content_description],[content_value], [content_type],[content_cblob]) 
        VALUES (convert(uniqueidentifier, '${envId}'), 'LB Form Canvas', 'Canvas Data', 'canvas','${url}')
        `;
    const insert2 = `
        INSERT INTO [dbo].[envelope_content] ([envelope_id],[content_description],[content_value], [content_type],[content_cblob]) 
        VALUES (convert(uniqueidentifier, '${envId}'), 'LB Form Data', 'Form Data', 'json','${JSON.stringify(obj)}')
        `;
    const update1 = `
        UPDATE [dbo].[envelope_content] 
        SET [content_value] = 'Canvas Data', 
        [content_cblob] = '${url}' 
        WHERE envelope_id = (convert(uniqueidentifier, '${envId}')) 
        AND content_description = 'LB Form Canvas'
        `;
    const update2 = `
        UPDATE [dbo].[envelope_content] 
        SET [content_value] = 'Form Data', 
        [content_cblob] = '${JSON.stringify(obj)}' 
        WHERE envelope_id = (convert(uniqueidentifier, '${envId}')) 
        AND content_description = 'LB Form Data'
        `;
    // if in editMode do an update else insert new
    sql.query(edit ? update1 : insert1).then(() => {
      sql.query(edit ? update2 : insert2).then(() => {
        ipcRenderer.send('saved');
        resolve()
      }).catch((err2) => {
        reject(err2);
        console.log('error inserting table data.... ', err2);
      });
    }).catch((err) => {
      connectMsSql().then(() => {
        submitMsSql(edit, url, obj);
      }).catch(err2 => {
        reject(err);
        console.log('query error inserting Canvas data.... ', err);
      });
    });
  });
}