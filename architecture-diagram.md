# Technical Architecture Diagram

## Luminometer AQ - Electron React Application

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐  │
│  │   User Management   │    │   Navigation Tabs   │    │  Luminometer Screen │  │
│  │      Screen         │    │                     │    │                     │  │
│  │                     │    │  ┌───┐    ┌───┐    │    │                     │  │
│  │ ┌─────────────────┐ │    │  │👥 │    │🔬 │    │    │ ┌─────────────────┐ │  │
│  │ │ Material-UI     │ │    │  └───┘    └───┘    │    │ │ Device Status   │ │  │
│  │ │ Components:     │ │    │                     │    │ │ Panel           │ │  │
│  │ │ • Table         │ │    │                     │    │ │                 │ │  │
│  │ │ • Dialog        │ │    │                     │    │ │ ┌─────────────┐ │ │  │
│  │ │ • TextField     │ │    │                     │    │ │ │ Data Display│ │ │  │
│  │ │ • Buttons       │ │    │                     │    │ │ │ Panel       │ │ │  │
│  │ └─────────────────┘ │    │                     │    │ │ └─────────────┘ │ │  │
│  │                     │    │                     │    │ │                 │ │  │
│  │ CRUD Operations:    │    │                     │    │ │ ┌─────────────┐ │ │  │
│  │ • Create User       │    │                     │    │ │ │ Command     │ │ │  │
│  │ • Read Users        │    │                     │    │ │ │ Interface   │ │ │  │
│  │ • Update User       │    │                     │    │ │ └─────────────┘ │ │  │
│  │ • Delete User       │    │                     │    │ └─────────────────┘ │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ React Components
                                        │ State Management
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              RENDERER PROCESS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                           React Application                                 ││
│  │                                                                             ││
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ ││
│  │  │    App.js       │    │ LuminometerScreen│    │   Material-UI Theme     │ ││
│  │  │                 │    │      .js        │    │      Provider           │ ││
│  │  │ • Tab Navigation│    │                 │    │                         │ ││
│  │  │ • State Mgmt    │    │ • Device Comm   │    │ • Global Styling        │ ││
│  │  │ • User CRUD     │    │ • Data Display  │    │ • Component Theming     │ ││
│  │  └─────────────────┘    │ • Command Send  │    └─────────────────────────┘ ││
│  │                         └─────────────────┘                                ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ IPC Communication
                                        │ (Context Bridge)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               PRELOAD SCRIPT                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                            preload.js                                      ││
│  │                                                                             ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐   ││
│  │  │                    Context Bridge API                                │   ││
│  │  │                                                                     │   ││
│  │  │  User Management APIs:          Luminometer APIs:                  │   ││
│  │  │  • getUsers()                   • checkLuminometerConnection()     │   ││
│  │  │  • createUser()                 • connectLuminometer()             │   ││
│  │  │  • updateUser()                 • sendLuminometerCommand()         │   ││
│  │  │  • deleteUser()                 • readLuminometerData()            │   ││
│  │  └─────────────────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Secure IPC Channel
                                        │ (ipcRenderer.invoke)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                MAIN PROCESS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                              main.js                                       ││
│  │                                                                             ││
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ ││
│  │  │ Window Manager  │    │  IPC Handlers   │    │  Device Simulator       │ ││
│  │  │                 │    │                 │    │                         │ ││
│  │  │ • Create Window │    │ User CRUD:      │    │ • Connection Status     │ ││
│  │  │ • Load URL      │    │ • get-users     │    │ • Data Generation       │ ││
│  │  │ • Dev Tools     │    │ • create-user   │    │ • Command Processing    │ ││
│  │  │                 │    │ • update-user   │    │ • Response Simulation   │ ││
│  │  │                 │    │ • delete-user   │    │                         │ ││
│  │  │                 │    │                 │    │ Device Data:            │ ││
│  │  │                 │    │ Luminometer:    │    │ • Model: LumiMax-2000   │ ││
│  │  │                 │    │ • check-conn    │    │ • Serial: LM2000-001    │ ││
│  │  │                 │    │ • connect       │    │ • Luminescence (RLU)    │ ││
│  │  │                 │    │ • send-command  │    │ • Temperature (°C)      │ ││
│  │  │                 │    │ • read-data     │    │ • Timestamp             │ ││
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Database Operations
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               DATA LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                          SQLite Database                                   ││
│  │                           (database.db)                                    ││
│  │                                                                             ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐   ││
│  │  │                        Users Table                                  │   ││
│  │  │                                                                     │   ││
│  │  │  Columns:                                                           │   ││
│  │  │  • id (INTEGER PRIMARY KEY AUTOINCREMENT)                          │   ││
│  │  │  • name (TEXT NOT NULL)                                            │   ││
│  │  │  • email (TEXT NOT NULL)                                           │   ││
│  │  │  • age (INTEGER)                                                    │   ││
│  │  │                                                                     │   ││
│  │  │  Operations:                                                        │   ││
│  │  │  • SELECT * FROM users                                             │   ││
│  │  │  • INSERT INTO users (name, email, age) VALUES (?, ?, ?)          │   ││
│  │  │  • UPDATE users SET ... WHERE id = ?                              │   ││
│  │  │  • DELETE FROM users WHERE id = ?                                 │   ││
│  │  └─────────────────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL INTERFACES                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                      Future Device Integration                              ││
│  │                                                                             ││
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ ││
│  │  │ Serial Port     │    │ USB Connection  │    │ Network Communication  │ ││
│  │  │ Communication   │    │                 │    │                         │ ││
│  │  │                 │    │ • Device Driver │    │ • TCP/IP                │ ││
│  │  │ • RS232/RS485   │    │ • USB Protocol  │    │ • HTTP/HTTPS            │ ││
│  │  │ • Baud Rate     │    │ • Plug & Play   │    │ • WebSocket             │ ││
│  │  │ • Data Parsing  │    │                 │    │ • REST API              │ ││
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘

## Data Flow

1. User Interaction → React Components → State Updates
2. CRUD Operations → Context Bridge API → IPC Handlers → SQLite Database
3. Device Commands → Luminometer API → Device Simulator → Response Data
4. Real-time Updates → IPC Response → React State → UI Updates

## Security Features

• Context Isolation: Enabled for secure renderer process
• Node Integration: Disabled in renderer for security
• Preload Script: Controlled API exposure via Context Bridge
• IPC Communication: Secure inter-process communication

## Technology Stack

• Frontend: React 18, Material-UI 5, Emotion
• Backend: Electron 27, Node.js
• Database: SQLite3
• Build Tools: React Scripts, Electron Builder
• Development: Concurrently, Wait-on
```