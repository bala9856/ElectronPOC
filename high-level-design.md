# High-Level Design Architecture

## Luminometer AQ - System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM CONTEXT                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────────────────────────────┐    ┌─────────────┐ │
│  │             │    │                                     │    │             │ │
│  │    USER     │◄──►│        LUMINOMETER AQ               │◄──►│ LUMINOMETER │ │
│  │             │    │      DESKTOP APPLICATION            │    │   DEVICE    │ │
│  │ • Operator  │    │                                     │    │             │ │
│  │ • Admin     │    │  ┌─────────────────────────────────┐ │    │ • Hardware  │ │
│  │ • Analyst   │    │  │         USER INTERFACE         │ │    │ • Sensors   │ │
│  └─────────────┘    │  │                                 │ │    │ • Firmware  │ │
│                     │  │ • User Management               │ │    └─────────────┘ │
│                     │  │ • Device Control                │ │                    │
│                     │  │ • Data Visualization            │ │                    │
│                     │  └─────────────────────────────────┘ │                    │
│                     │                                     │                    │
│                     │  ┌─────────────────────────────────┐ │                    │
│                     │  │       BUSINESS LOGIC            │ │                    │
│                     │  │                                 │ │                    │
│                     │  │ • CRUD Operations               │ │                    │
│                     │  │ • Device Communication         │ │                    │
│                     │  │ • Data Processing               │ │                    │
│                     │  └─────────────────────────────────┘ │                    │
│                     │                                     │                    │
│                     │  ┌─────────────────────────────────┐ │                    │
│                     │  │        DATA STORAGE             │ │                    │
│                     │  │                                 │ │                    │
│                     │  │ • User Database                 │ │                    │
│                     │  │ • Device Readings               │ │                    │
│                     │  │ • Configuration                 │ │                    │
│                     │  └─────────────────────────────────┘ │                    │
│                     └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## System Components

### 1. **Frontend Layer**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────────┐ │
│  │ User Interface  │         │    Device Interface         │ │
│  │                 │         │                             │ │
│  │ • User CRUD     │         │ • Connection Status         │ │
│  │ • Data Tables   │         │ • Real-time Data            │ │
│  │ • Forms         │         │ • Command Interface         │ │
│  │ • Navigation    │         │ • Data Visualization        │ │
│  └─────────────────┘         └─────────────────────────────┘ │
│                                                             │
│  Technology: React + Material-UI                           │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Application Layer**

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────────┐ │
│  │ User Management │         │   Device Management         │ │
│  │ Service         │         │   Service                   │ │
│  │                 │         │                             │ │
│  │ • Create User   │         │ • Connect Device            │ │
│  │ • Update User   │         │ • Send Commands             │ │
│  │ • Delete User   │         │ • Read Data                 │ │
│  │ • List Users    │         │ • Process Responses         │ │
│  └─────────────────┘         └─────────────────────────────┘ │
│                                                             │
│  Technology: Electron Main Process + IPC                   │
└─────────────────────────────────────────────────────────────┘
```

### 3. **Data Layer**

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA TIER                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────────┐ │
│  │ Local Database  │         │    Device Data              │ │
│  │                 │         │                             │ │
│  │ • Users Table   │         │ • Luminescence Values       │ │
│  │ • Settings      │         │ • Temperature Readings      │ │
│  │ • Audit Logs    │         │ • Timestamps                │ │
│  │ • Backups       │         │ • Device Status             │ │
│  └─────────────────┘         └─────────────────────────────┘ │
│                                                             │
│  Technology: SQLite Database                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │    │             │
│    USER     │───►│     UI      │───►│  BUSINESS   │───►│    DATA     │
│             │    │  LAYER      │    │   LOGIC     │    │   LAYER     │
│ • Actions   │    │             │    │             │    │             │
│ • Input     │    │ • Forms     │    │ • Services  │    │ • SQLite    │
│ • Commands  │    │ • Tables    │    │ • IPC       │    │ • Files     │
│             │◄───│ • Dialogs   │◄───│ • Handlers  │◄───│ • Cache     │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                             │
                                             ▼
                                   ┌─────────────┐
                                   │             │
                                   │  DEVICE     │
                                   │ INTERFACE   │
                                   │             │
                                   │ • Commands  │
                                   │ • Responses │
                                   │ • Status    │
                                   │             │
                                   └─────────────┘
```

## Module Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                    MODULE STRUCTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  App.js                                                     │
│  ├── UserManagement                                         │
│  │   ├── UserTable                                          │
│  │   ├── UserForm                                           │
│  │   └── UserActions                                        │
│  │                                                          │
│  └── LuminometerScreen                                      │
│      ├── DeviceStatus                                       │
│      ├── DataDisplay                                        │
│      └── CommandInterface                                   │
│                                                             │
│  Main Process                                               │
│  ├── WindowManager                                          │
│  ├── DatabaseService                                        │
│  ├── DeviceService                                          │
│  └── IPCHandlers                                            │
│                                                             │
│  Preload Script                                             │
│  └── ContextBridge                                          │
│      ├── UserAPI                                            │
│      └── DeviceAPI                                          │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY BOUNDARIES                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                RENDERER PROCESS                         │ │
│  │                                                         │ │
│  │  • Context Isolation: ENABLED                          │ │
│  │  • Node Integration: DISABLED                          │ │
│  │  • Remote Module: DISABLED                             │ │
│  │  • Sandbox: ENABLED                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                               │
│                              │ Secure IPC                    │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 PRELOAD SCRIPT                          │ │
│  │                                                         │ │
│  │  • Context Bridge API                                  │ │
│  │  • Controlled Exposure                                 │ │
│  │  • Input Validation                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                               │
│                              │ IPC Channel                   │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  MAIN PROCESS                           │ │
│  │                                                         │ │
│  │  • Full Node.js Access                                 │ │
│  │  • File System Access                                  │ │
│  │  • Database Operations                                 │ │
│  │  • Device Communication                                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT MODEL                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                DESKTOP APPLICATION                      │ │
│  │                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │ │
│  │  │   Windows   │  │    macOS    │  │      Linux      │ │ │
│  │  │             │  │             │  │                 │ │ │
│  │  │ • .exe      │  │ • .dmg      │  │ • .AppImage     │ │ │
│  │  │ • .msi      │  │ • .app      │  │ • .deb          │ │ │
│  │  │ • Portable  │  │             │  │ • .rpm          │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Distribution: Electron Builder                            │
│  Auto-Updates: Electron Updater                            │
│  Code Signing: Platform Certificates                       │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### **1. Separation of Concerns**

- UI logic separated from business logic
- Database operations isolated in service layer
- Device communication abstracted

### **2. Security First**

- Context isolation for renderer process
- Controlled API exposure via preload script
- Input validation at all boundaries

### **3. Modularity**

- Component-based UI architecture
- Service-oriented backend design
- Plugin-ready device interface

### **4. Scalability**

- Async operations for device communication
- Efficient data handling with SQLite
- Memory-conscious React components

### **5. Maintainability**

- Clear module boundaries
- Consistent error handling
- Comprehensive logging
