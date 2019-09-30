const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minHeight: 300,
    minWidth: 460,
    icon: __dirname + '/app/assets/healthline_logo.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.setTitle('Lund & Browder Form');

  // and load the index.html of the app.
  mainWindow.loadFile('./app/index.html');
  mainWindow.webContents.openDevTools();
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

