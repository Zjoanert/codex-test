# React Dashboard

This repository contains a simple React + TypeScript project that renders a dashboard with real-time statistics. The dashboard connects to a small WebSocket server which continuously broadcasts random data.

The app now also shows a map with real-time train positions in the Netherlands. Train locations are fetched directly from the [OVapi GTFS realtime feed](https://gtfs.ovapi.nl/nl/).

## Getting started

1. Install dependencies (requires Node.js installed locally):

```bash
npm install
```

2. Start the WebSocket server:

```bash
npm run server
```

3. In another terminal, start the development server:

```bash
npm run dev
```

Navigate to `http://localhost:5173` (default Vite port) to see the dashboard updating in real time.

The WebSocket server runs on `ws://localhost:3001` and sends a new random value every second.
