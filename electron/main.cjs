const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');

const isDevelopment = Boolean(process.env.VITE_DEV_SERVER_URL);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      // The renderer must not have direct access to Node.js or Electron APIs.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
  });

  win.once('ready-to-show', () => win.show());

  // Keep navigation inside the application. Open user-requested external links
  // in the system browser instead of granting them renderer privileges.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//i.test(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    const allowedUrl = isDevelopment
      ? url.startsWith(process.env.VITE_DEV_SERVER_URL)
      : url.startsWith('file://');

    if (!allowedUrl) {
      event.preventDefault();
      if (/^https:\/\//i.test(url)) {
        void shell.openExternal(url);
      }
    }
  });

  if (isDevelopment) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Refuse permission requests from pages loaded by the renderer. The app does
  // not currently require camera, microphone, geolocation, or notifications.
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
