const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { SerialPort } = require("serialport");

let mainWindow;
let db;
let usbPort = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.webContents.openDevTools();
}

function initDatabase() {
  db = new sqlite3.Database("database.db");
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER
  )`,
    () => {
      // Add new columns if they don't exist
      db.run(`ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT 1`, () => {});
      db.run(`ALTER TABLE users ADD COLUMN category TEXT`, () => {});
      db.run(`ALTER TABLE users ADD COLUMN skills TEXT`, () => {});
      db.run(`ALTER TABLE users ADD COLUMN avatar TEXT`, () => {});
      db.run(`ALTER TABLE users ADD COLUMN gender TEXT`, () => {});
      db.run(`ALTER TABLE users ADD COLUMN birthdate TEXT`, () => {});
    }
  );
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// CRUD operations
ipcMain.handle("get-users", () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle("create-user", (event, user) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (name, email, age, active, category, skills, avatar, gender, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.name,
        user.email,
        user.age,
        user.active,
        user.category,
        user.skills,
        user.avatar,
        user.gender,
        user.birthdate,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...user });
      }
    );
  });
});

ipcMain.handle("update-user", (event, user) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET name = ?, email = ?, age = ?, active = ?, category = ?, skills = ?, avatar = ?, gender = ?, birthdate = ? WHERE id = ?",
      [
        user.name,
        user.email,
        user.age,
        user.active,
        user.category,
        user.skills,
        user.avatar,
        user.gender,
        user.birthdate,
        user.id,
      ],
      (err) => {
        if (err) reject(err);
        else resolve(user);
      }
    );
  });
});

ipcMain.handle("delete-user", (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
});

// Luminometer device communication
let deviceConnected = false;
let deviceData = {
  model: "LumiMax-2000",
  serial: "LM2000-001",
  luminescence: null,
  temperature: null,
  timestamp: null,
  lastReading: null,
};

ipcMain.handle("check-luminometer-connection", () => {
  return {
    connected: deviceConnected,
    deviceInfo: deviceConnected ? deviceData : null,
  };
});

ipcMain.handle("connect-luminometer", () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      deviceConnected = true;
      deviceData.timestamp = new Date().toISOString();
      resolve({
        success: true,
        deviceInfo: deviceData,
      });
    }, 1000);
  });
});

ipcMain.handle("send-luminometer-command", (event, command) => {
  return new Promise((resolve, reject) => {
    if (!deviceConnected) {
      reject(new Error("Device not connected"));
      return;
    }

    setTimeout(() => {
      let response = "";
      switch (command.toLowerCase()) {
        case "read":
          response = `RLU: ${Math.floor(Math.random() * 10000)}`;
          break;
        case "status":
          response = "Device ready";
          break;
        case "temp":
          response = `Temperature: ${(20 + Math.random() * 10).toFixed(1)}°C`;
          break;
        default:
          response = `Command '${command}' executed`;
      }
      resolve({ response });
    }, 500);
  });
});

ipcMain.handle("read-luminometer-data", () => {
  return new Promise((resolve, reject) => {
    if (!deviceConnected) {
      reject(new Error("Device not connected"));
      return;
    }

    setTimeout(() => {
      deviceData.luminescence = Math.floor(Math.random() * 10000);
      deviceData.temperature = (20 + Math.random() * 10).toFixed(1);
      deviceData.timestamp = new Date().toISOString();
      deviceData.lastReading = new Date().toLocaleString();

      resolve(deviceData);
    }, 800);
  });
});

// USB Device Communication
ipcMain.handle("scan-usb-devices", async () => {
  try {
    const ports = await SerialPort.list();
    return ports.filter((port) => port.vendorId && port.productId);
  } catch (error) {
    throw new Error("Failed to scan USB devices: " + error.message);
  }
});

ipcMain.handle("connect-usb-device", async (event, devicePath) => {
  try {
    if (usbPort && usbPort.isOpen) {
      usbPort.close();
    }

    usbPort = new SerialPort({
      path: devicePath,
      baudRate: 9600,
      autoOpen: false,
    });

    return new Promise((resolve, reject) => {
      usbPort.open((err) => {
        if (err) {
          reject(new Error("Failed to connect: " + err.message));
        } else {
          // Set up data listener
          usbPort.on("data", (data) => {
            mainWindow.webContents.send("usb-data-received", data.toString());
          });

          resolve({ success: true });
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("disconnect-usb-device", async () => {
  try {
    if (usbPort && usbPort.isOpen) {
      return new Promise((resolve) => {
        usbPort.close(() => {
          usbPort = null;
          resolve({ success: true });
        });
      });
    }
    return { success: true };
  } catch (error) {
    throw new Error("Failed to disconnect: " + error.message);
  }
});

ipcMain.handle("send-usb-data", async (event, data) => {
  try {
    if (!usbPort || !usbPort.isOpen) {
      return { success: false, error: "Device not connected" };
    }

    return new Promise((resolve, reject) => {
      usbPort.write(data + "\n", (err) => {
        if (err) {
          reject(new Error("Failed to send data: " + err.message));
        } else {
          resolve({ success: true });
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("read-usb-data", async () => {
  try {
    if (!usbPort || !usbPort.isOpen) {
      return { success: false, error: "Device not connected" };
    }

    // For immediate read, we'll simulate data since actual USB devices
    // typically send data asynchronously via the 'data' event
    return { success: true, data: "USB device response: " + new Date().toLocaleTimeString() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
