const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getUsers: () => ipcRenderer.invoke("get-users"),
  createUser: (user) => ipcRenderer.invoke("create-user", user),
  updateUser: (user) => ipcRenderer.invoke("update-user", user),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", id),

  // Luminometer API
  checkLuminometerConnection: () => ipcRenderer.invoke("check-luminometer-connection"),
  connectLuminometer: () => ipcRenderer.invoke("connect-luminometer"),
  sendLuminometerCommand: (command) => ipcRenderer.invoke("send-luminometer-command", command),
  readLuminometerData: () => ipcRenderer.invoke("read-luminometer-data"),

  // USB Device API
  scanUSBDevices: () => ipcRenderer.invoke("scan-usb-devices"),
  connectUSBDevice: (devicePath) => ipcRenderer.invoke("connect-usb-device", devicePath),
  disconnectUSBDevice: () => ipcRenderer.invoke("disconnect-usb-device"),
  sendUSBData: (data) => ipcRenderer.invoke("send-usb-data", data),
  readUSBData: () => ipcRenderer.invoke("read-usb-data"),
  onUSBDataReceived: (callback) => ipcRenderer.on("usb-data-received", callback),
});
