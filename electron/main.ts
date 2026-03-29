import { app, BrowserWindow } from 'electron'
import { join } from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 970,
    height: 820,
    icon: 'images/icon.png',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.ts')
    }
  })

  win.setMenu(null)
  // In development, load from the dev server
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    // In production, load the built index.html
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)