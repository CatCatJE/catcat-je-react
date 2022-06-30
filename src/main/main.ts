/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path, { join } from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  nativeTheme,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { getHTMLPathBySearchKey, resolveHtmlPath } from './util';
import { icons } from 'react-icons';

const store = new Store();

let settingWindow: BrowserWindow | null = null;
let jeWindow: BrowserWindow | null = null;
let starterWindow: BrowserWindow | null = null;

// IPC listener
ipcMain.on('electron-store-get', (event, val) => {
  settingWindow?.webContents.send('main-process-message', store.path);
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async (arg: any) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  jeWindow = new BrowserWindow({
    title: 'paper Windwow',
    height: 936,
    useContentSize: false,
    width: 599,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  jeWindow.setMenuBarVisibility(false);
  jeWindow.loadURL(getHTMLPathBySearchKey('jeWindow'));
  jeWindow.webContents.send(
    'main-process-message',
    resolveHtmlPath('index.html')
  );
  jeWindow.on('ready-to-show', () => {
    if (!jeWindow) {
      throw new Error('"jeWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      jeWindow.minimize();
    } else {
      jeWindow.show();
      jeWindow?.webContents.send('score-data', arg[0]);
    }
  });

  jeWindow.on('closed', () => {
    globalShortcut.unregisterAll();
    jeWindow = null;
  });

  // const menuBuilder = new MenuBuilder(settingWindow);
  // menuBuilder.builjeWindowenu();

  // Open urls in the user's browser
  jeWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
  globalShortcut.register('pageUp', () => {
    console.log('pgUp is pressed');
    jeWindow?.webContents.send('page-up', 'pageUp');
  });
  globalShortcut.register('pageDown', () => {
    console.log('pgDown is pressed');
    jeWindow?.webContents.send('page-down', 'pageDown');
  });
};

const createSettingWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  settingWindow = new BrowserWindow({
    title: '设置',
    height: 600,
    useContentSize: false,
    width: 455,
    frame: true,
    transparent: true,
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  settingWindow.setMenuBarVisibility(false);
  settingWindow.loadURL(getHTMLPathBySearchKey('settingWindow'));
  settingWindow.webContents.session.on(
    'select-hid-device',
    (event, details, callback) => {
      event.preventDefault();
      if (details.deviceList && details.deviceList.length > 0) {
        callback(details.deviceList[0].deviceId);
      }
    }
  );

  settingWindow.webContents.session.on('hid-device-added', (event, device) => {
    console.log('hid-device-added FIRED WITH', device);
  });

  settingWindow.webContents.session.on(
    'hid-device-removed',
    (event, device) => {
      console.log('hid-device-removed FIRED WITH', device);
    }
  );
  settingWindow.webContents.session.setPermissionCheckHandler(
    (_webContents, permission, _requestingOrigin, details) => {
      console.info(details);
      if (permission === 'hid') {
        return true;
      }
      return false;
    }
  );

  settingWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid' && details.device.productId === 2834) {
      console.info('come in hid true');
      return true;
    }
    return false;
  });
  settingWindow.on('ready-to-show', () => {
    if (!settingWindow) {
      throw new Error('"settingWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      settingWindow.minimize();
    } else {
      settingWindow.show();
    }
  });

  settingWindow.on('closed', () => {
    settingWindow = null;
  });

  // const menuBuilder = new MenuBuilder(settingWindow);
  // menuBuilder.builjeWindowenu();

  // Open urls in the user's browser
  settingWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
};

const createStarterWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  starterWindow = new BrowserWindow({
    title: 'Starter Windwow',
    height: 679,
    useContentSize: false,
    width: 1022,
    frame: false,
    transparent: true,
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  starterWindow.setMenuBarVisibility(false);
  starterWindow.loadURL(getHTMLPathBySearchKey('starterWindow'));
  starterWindow.on('ready-to-show', () => {
    if (!starterWindow) {
      throw new Error('"starterWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      starterWindow.minimize();
    } else {
      starterWindow.show();
    }
  });

  starterWindow.on('closed', () => {
    starterWindow = null;
  });

  // const menuBuilder = new MenuBuilder(settingWindow);
  // menuBuilder.builjeWindowenu();

  // Open urls in the user's browser
  starterWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    console.log('CommandOrControl+Shift+M is pressed');
    if (jeWindow != null) {
      jeWindow.webContents.openDevTools();
    }
    if (settingWindow != null) {
      settingWindow.webContents.openDevTools();
    }
    if (starterWindow != null) {
      starterWindow.webContents.openDevTools();
    }
  });
};

ipcMain.on('open-setting-window', () => {
  if (settingWindow == null) {
    createSettingWindow();
  }
});

ipcMain.on('createWindow', function (event, arg) {
  if (jeWindow == null) {
    createWindow(arg);
  } else {
    jeWindow?.webContents.send('score-data', arg[0]);
  } // 发送消息给主进程
});
ipcMain.on('dark-mode:toggle', (event, arg) => {
  console.info('come in dark toggle');
  console.info(nativeTheme.themeSource);
  if (arg) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});

ipcMain.on('setOnTop:setting', (event, arg) => {
  console.info(`setOnTop:setting ${arg[0]}`);
  if (arg) {
    jeWindow?.setAlwaysOnTop(arg[0]);
  }
});
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createStarterWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (starterWindow === null) createStarterWindow();
    });
  })
  .catch(console.log);
