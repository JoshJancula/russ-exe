const { app, BrowserWindow } = require('electron');
let mainWindow = null;
let imageWindow = null;
let hasOpenImageWindow = false;
let imageData = null;
let printData = null;
const fs = require('fs');
const { ipcMain } = require('electron');
const { shell } = require('electron');

const server = require('../server');
const { protocol } = require( 'electron' )
const nfs = require( 'fs' )
const npjoin = require( 'path' ).join
const es6Path = npjoin( __dirname, '/ion_app/www' )

protocol.registerStandardSchemes( [ 'es6' ] )

app.on( 'ready', () => {
  protocol.registerBufferProtocol( 'es6', ( req, cb ) => {
    nfs.readFile(
      npjoin( es6Path, req.url.replace( 'es6://', '' ) ),
      (e, b) => { cb( { mimeType: 'text/javascript', data: b } ) }
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
  mainWindow.loadFile('./www/index.html');
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

ipcMain.on('print', (evt, arg) => {
  // print(arg);
  // mainWindow.webContents.print({silent:true, printBackground:true});
  // console.log('arg.... ', arg);
  // shell.openItem(arg);
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