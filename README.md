# 🖥️ mSystemsX - Homelab Controller

> **🚧 This project is currently in development.**

---
## 🔄 Development Progress

- **✅ Base Login/Change Password** - *Completed*
- **✅ Account Management** - *Completed*
- **🛠️ Sound System** - *Beta Testing*
- **⏳ Virtual Machines** - *In Progress*
- **⏳ Email** - *To Do*
- **⏳ Status** - *To Do*

---

## ℹ️ About mSystemsX

mSystemsX is a web control panel developed to manage and monitor my personal homelab in a centralized way. The platform provides an intuitive interface for interacting with servers, virtual machines, sound systems, email, and more.

## 🚀 Features

- ✅ **Proxmox Management** - Control VMs and containers directly from the panel.
- ✅ **Virtual Machines** - Access and manage active virtual machines in the system.
- ✅ **Sound System** - Integration with sound systems for automation and remote control.
- ✅ **Email** - Configuration and monitoring of email notifications.
- ✅ **Status** - Monitoring panel with real-time status of homelab services.
- ✅ **Secure Authentication** - Logout, password change, and account management.

## 🛠️ Technologies Used

- 🔹 **Web Development:** Next.js by Vercel
- 🔹 **Database:** MySQL
- 🔹 **Virtualization:** Proxmox VE
- 🔹 **Security:** Next-Auth

## 📦 Installation

### Requirements

- Linux/Windows server with Docker installed
- Configured Proxmox VE
- Node.js 18

### Steps

1. Clone the repository:
   ```
   git clone https://github.com/antmmatos/MainSystemsX.git
   cd MainSystemsX
   ```
2. Install dependencies:
   ```
   npm install
   yarn
   pnpm install
   ```
3. Configure environment variables (`.env`):
   - `AUTH_SECRET` must be generated (you can use any secure method, like OpenSSL or online tools).
   - Example `.env` file:
   ```
   AUTH_SECRET=""
   PUBLIC_SPOTIFY_CLIENT_ID=
   SPOTIFY_CLIENT_SECRET=
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=""
   DB_NAME=msystemsx
   BASE_URL=http://localhost:3000
   PUBLIC_PROXMOX_HOST=proxmox.local:8006
   ```
4. Start the server:
   ```
   npm start
   yarn start
   pnpm start
   ```

## 👤 Author

**António Matos** - Project Developer  
📧 Contact: [antmmatos@msystemsx.cloud](mailto:antmmatos@msystemsx.cloud)

## 📜 License

Distributed under the GPL license. See `LICENSE` for more details.
