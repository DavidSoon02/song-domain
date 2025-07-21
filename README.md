# Song Domain Microservices

A collection of microservices for managing songs using Node.js, Express, and MongoDB. Each service handles a specific aspect of song management with JWT authentication.

## Architecture

This project consists of three independent microservices:

- **Add Service** (Port 3001): Handles song creation
- **Delete Service** (Port 3002): Handles song deletion
- **List Service** (Port 3003): Handles song retrieval

## Prerequisites

- Node.js 18+
- MongoDB running locally or connection string
- Valid JWT token from authentication service

## Quick Start

### 1. Install All Services
```bash
# Install dependencies for all services
cd add-service && npm install && cd ..
cd delete-service && npm install && cd ..
cd list-service && npm install && cd ..
```

### 2. Configure Environment Variables
Create `.env` files in each service directory:

**add-service/.env:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/songs
JWT_SECRET=distributed-programming-edison
JWT_EXPIRES_IN=24h
```

**delete-service/.env:**
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/songs
JWT_SECRET=distributed-programming-edison
JWT_EXPIRES_IN=24h
```

**list-service/.env:**
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/songs
JWT_SECRET=distributed-programming-edison
JWT_EXPIRES_IN=24h
```

### 3. Start All Services
```bash
# Terminal 1 - Add Service
cd add-service && npm start

# Terminal 2 - Delete Service  
cd delete-service && npm start

# Terminal 3 - List Service
cd list-service && npm start
```

## API Overview

| Service | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Add | POST | `/api/songs` | Add a new song |
| Delete | DELETE | `/api/songs/:id` | Delete a song by ID |
| List | GET | `/api/songs` | Get all songs |
| List | GET | `/api/songs/:id` | Get song by ID |

## Complete Workflow Example

### 1. Add a Song
```bash
curl -X POST http://localhost:3001/api/songs \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "duration": 355,
    "cover": "https://example.com/bohemian-rhapsody-cover.jpg",
    "preview": "https://example.com/bohemian-rhapsody-preview.mp3"
  }'
```

### 2. List All Songs
```bash
curl -X GET http://localhost:3003/api/songs \
  -H "Authorization: Bearer your_jwt_token_here"
```

### 3. Get Specific Song
```bash
curl -X GET http://localhost:3003/api/songs/SONG_ID_HERE \
  -H "Authorization: Bearer your_jwt_token_here"
```

### 4. Delete a Song
```bash
curl -X DELETE http://localhost:3002/api/songs/SONG_ID_HERE \
  -H "Authorization: Bearer your_jwt_token_here"
```

## JavaScript Client Example

```javascript
class SongClient {
  constructor(baseUrls, token) {
    this.addServiceUrl = baseUrls.add || 'http://localhost:3001';
    this.deleteServiceUrl = baseUrls.delete || 'http://localhost:3002';
    this.listServiceUrl = baseUrls.list || 'http://localhost:3003';
    this.token = token;
  }

  getHeaders(includeContentType = false) {
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  async addSong(songData) {
    const response = await fetch(`${this.addServiceUrl}/api/songs`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(songData)
    });
    return response.json();
  }

  async getAllSongs() {
    const response = await fetch(`${this.listServiceUrl}/api/songs`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getSongById(id) {
    const response = await fetch(`${this.listServiceUrl}/api/songs/${id}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async deleteSong(id) {
    const response = await fetch(`${this.deleteServiceUrl}/api/songs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return response.json();
  }
}

// Usage
const songClient = new SongClient({
  add: 'http://localhost:3001',
  delete: 'http://localhost:3002',
  list: 'http://localhost:3003'
}, 'your_jwt_token_here');

// Example workflow
const manageSongs = async () => {
  try {
    // Add a song
    const newSong = await songClient.addSong({
      title: "Hotel California",
      artist: "Eagles",
      duration: 391,
      cover: "https://example.com/hotel-california-cover.jpg",
      preview: "https://example.com/hotel-california-preview.mp3"
    });
    console.log('Added:', newSong);

    // List all songs
    const allSongs = await songClient.getAllSongs();
    console.log('All songs:', allSongs);

    // Get specific song
    const songId = newSong.song._id;
    const specificSong = await songClient.getSongById(songId);
    console.log('Specific song:', specificSong);

    // Delete the song
    const deletedSong = await songClient.deleteSong(songId);
    console.log('Deleted:', deletedSong);

  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Docker Deployment

### Build All Images
```bash
docker build -t song-add-service ./add-service
docker build -t song-delete-service ./delete-service
docker build -t song-list-service ./list-service
```

### Run All Containers
```bash
# Run MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Run services
docker run -d --name add-service -p 3001:3001 --env-file add-service/.env song-add-service
docker run -d --name delete-service -p 3002:3002 --env-file delete-service/.env song-delete-service
docker run -d --name list-service -p 3003:3003 --env-file list-service/.env song-list-service
```

## Authentication

All services require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token should be issued by your authentication service using the same `JWT_SECRET`.

## Data Model

### Song Schema
```javascript
{
  title: String (required),
  artist: String (required),
  duration: Number (required, in seconds),
  cover: String (optional, URL to cover image),
  preview: String (optional, URL to preview audio),
  createdAt: Date (auto-generated)
}
```

## Error Handling

Common HTTP status codes:
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (missing required fields)
- **401**: Unauthorized (missing token)
- **403**: Forbidden (invalid token)
- **404**: Not found
- **500**: Internal server error

## Development

### Run in Development Mode
```bash
# Each service supports nodemon for development
cd add-service && npm run dev
cd delete-service && npm run dev
cd list-service && npm run dev
```

### Project Structure
```
song-domain/
├── add-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── delete-service/
│   └── (same structure)
├── list-service/
│   └── (same structure)
└── README.md
```

## Contributing

1. Each service is independent
2. Follow clean code principles
3. Maintain consistent error handling
4. Update README when adding features
5. Test endpoints with valid JWT tokens

## Notes

- All services share the same MongoDB database
- JWT secret must be consistent across all services
- Services can be deployed independently
- No service dependencies - each can run standalone
- MongoDB connection is required for all operations
