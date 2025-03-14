# Cloudflared-Tunnel

# Reverse Proxy & Cloudflare Tunnel Setup 🚀

## Overview 🌐

This guide walks you through setting up a reverse proxy using Node.js and establishing a Cloudflare Tunnel to expose your local server.

## Prerequisites ✅

- A Debian/Ubuntu-based system with sudo privileges.
- A stable internet connection 🌍.
- Basic command line knowledge 💻.

## Steps 🔧

### 1. Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```
🔥 *This step ensures you have Node.js installed.*

### 2. Set Up Your Project
```bash
mkdir my-proxy
cd my-proxy
npm init -y
npm install node-fetch
```
📦 *This creates your project folder and initializes a new npm project.*

### 3. Create the Reverse Proxy Script
Open a text editor and create `proxy.js`, then paste your proxy code into it:
```bash
nano proxy.js
```
📝 *Paste your proxy code from the repository, then save (Ctrl+O, Enter) and exit (Ctrl+X).*

### 4. Install Cloudflared
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
cloudflared --version
```
☁️ *This installs Cloudflared for tunnel creation.*

### 5. Run the Reverse Proxy and Start the Tunnel

#### a) Start Your Reverse Proxy
```bash
node proxy.js
```
✅ *Expected output: "Reverse proxy server running on http://localhost:8080"*

#### b) Start the Cloudflare Tunnel (in a new terminal)
```bash
cloudflared tunnel --url http://localhost:8080
```
✅ *Expected output: "Your tunnel is running! Visit https://random.trycloudflare.com"*

## Important Notes ⚠️

- Ensure all installations complete successfully.
- Keep the reverse proxy running when starting the Cloudflare Tunnel.
- Adjust commands if using a different Linux distribution.

Enjoy your setup and happy coding! 😃✨
