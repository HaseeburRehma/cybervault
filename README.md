# CyberVault

This project contains a React frontend and an Express backend.
A `docker-compose.yml` file is provided to run the application with MongoDB.

## Requirements
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Quick Start

1. Copy environment variables:
   ```bash
   cp server/.env.example server/.env
   ```
   Adjust the values as needed.
2. Build and start the services:
   ```bash
   docker-compose up --build
   ```
3. Visit `http://localhost:3000` to access the client.

The server will be available on port `8000` and MongoDB will be accessible on
port `27017` inside the Docker network.

## Development

During development you can still run the server and client separately:

```bash
cd server && npm install && npm start
```

```bash
cd client && npm install && npm start
```

## Testing

The repository currently does not include automated tests. Test scripts can be
added under the respective `package.json` files.
