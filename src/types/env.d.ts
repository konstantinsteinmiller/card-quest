export interface IElectronAPI {
  quitApp: () => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}