const sql = require('mssql');
let canvasString = null;
let userId = null;
let envId = null;
let mssqlConnected = false;
let mssqlQueryCount = 0;
let debug = true;

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
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('query error retrieving User Info.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringpatName).then(name => {
            patientInfo.patientName = name.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving Patient Name in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringmedRecno).then(med => {
            patientInfo.medRecno = med.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving med rec no in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringacctNo).then(acc => {
            patientInfo.acctNo = acc.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving acct number in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringpatientAge).then(age => {
            patientInfo.patientAge = age.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving patient age in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringpatBirthdate).then(bday => {
            patientInfo.birthDate = bday.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving patient DOB in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringpatientSex).then(sex => {
            patientInfo.patientSex = sex.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving patient sex in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringadmitDate).then(admit => {
            patientInfo.admitDate = admit.recordset[0].content_value;
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving admit date in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringcanvasData).then(canvasData => { // look to see if we had a canvas already
            if (canvasData.recordset.length && canvasData.recordset[0].content_cblob) {
                canvasString = canvasData.recordset[0].content_cblob;
            }
            mssqlQueryCount++;
            if (mssqlQueryCount >= 10) { resolve(); }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving canvas data in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });

        sql.query(queryStringtableData).then(qd => { // if there was data from request
            if (qd.recordset.length && qd.recordset[0].content_cblob) {
                try { // try to parse the json and set info.....
                    const d = JSON.parse(qd.recordset[0].content_cblob);
                    dataObject = d;
                } catch (e) {
                    console.log('error parsing json.... ', e);
                }
                mssqlQueryCount++;
                if (mssqlQueryCount >= 10) { resolve(); }
            } else { // there was no form yet so set initial state
                dataObject.createdBy = userData.userName;
                mssqlQueryCount++;
                if (mssqlQueryCount >= 10) { resolve(); }
            }
        }).catch(err => {
            mssqlQueryCount++;
            console.log('error retrieving table data in query.... ', err);
            if (mssqlQueryCount >= 10) { resolve(); }
        });
    });
}

function connectMsSql() {
    return new Promise((resolve, reject) => {

        const config = { // construct the connection config
            user: 'wfadmin',
            password: 'hiswfadmin',
            server: 'localhost',
            database: 'HealthlineWorkflow',
        };

        sql.connect(config).then(res => {
            mssqlConnected = true;
            resolve();
        }).catch(e => {
            console.log('err... ', e);
            reject();
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
        sql.query(edit ? update1 : insert1).then(res => {
            sql.query(edit ? update2 : insert2).then(res2 => {
                // ipcRenderer.send('saved');
                resolve()
            }).catch(err2 => { reject(err2); console.log('error inserting table data.... ', err2); });
        }).catch(err => {
            reject(err);
            console.log('query error inserting Canvas data.... ', err);
        });
    });
}

module.exports = function (app) {

    // returns all devices 
    app.get("/api/electron/args", (req, res) => {
        const args = process.argv;
        if (args !== null && args !== undefined) {
            res.json(args);
            if (!debug) {
                connectMsSql(args);
            }
        } else {
            res.status(409).send({ success: false, msg: 'Failed to retrieve args' });
        }
    });

    // returns all devices 
    app.get("/api/mssql/saved-info", (req, res) => {
        if (debug) {
            res.status(409).send({ success: false, msg: 'Failed to connect to mssql' });
        } else if (mssqlQueryCount >= 10) {
            res.json({
                user_data: userData,
                patient_data: patientInfo,
                data_object: dataObject,
                canvas_string: canvasString
            });
        } else {
            if (mssqlConnected == true) {
                executeMsSqlQueries().then(() => {
                    res.json({
                        user_data: userData,
                        patient_data: patientInfo,
                        data_object: dataObject,
                        canvas_string: canvasString
                    });
                });
            } else {
                connectMsSql().then(() => {
                    executeMsSqlQueries().then(() => {
                        res.json({
                            user_data: userData,
                            patient_data: patientInfo,
                            data_object: dataObject,
                            canvas_string: canvasString
                        });
                    });
                }).catch(e => {
                    res.status(401).send({ success: false, msg: 'Failed to connect to mssql' });
                });
            }
        }
    });

    app.post("/api/mssql/submit", (req, res) => {
        console.log('req.body.... ', req.body);
        if (!debug) {
            submitMsSql(req.body.editMode, req.body.canvasUrl, req.body.data).then(() => {
                res.status(200).send({ success: true, msg: 'Submitted Data' });
            }).catch(e => {
                res.status(403).send({ success: false, msg: e });
            });
        }
    });

};