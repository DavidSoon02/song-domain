# List Service

Microservice for retrieving songs from the database.

## Prerequisites

- Node.js 18+
- MongoDB running locally or connection string
- Valid JWT token from authentication service

## Local Installation

1. Navigate to the service directory:
```bash
cd list-service
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with:
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/songs
JWT_SECRET=distributed-programming-edison
JWT_EXPIRES_IN=24h
```

4. Start the service:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Docker Installation

1. Build the Docker image:
```bash
docker build -t list-service .
```

2. Run the container:
```bash
docker run -p 3003:3003 --env-file .env list-service
```

## API Endpoints

### Get All Songs
- **Method:** GET
- **URL:** `/api/songs`
- **Headers:** 
  - `Authorization: Bearer <jwt_token>`

**Success Response (200):**
```json
{
  "message": "Songs retrieved successfully",
  "songs": [
    {
      "_id": "64f8b5c9e123456789abcdef",
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "duration": 355,
      "cover": "https://example.com/bohemian-rhapsody-cover.jpg",
      "preview": "https://example.com/bohemian-rhapsody-preview.mp3",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "64f8b5c9e123456789abcd00",
      "title": "Hotel California",
      "artist": "Eagles",
      "duration": 391,
      "cover": "https://example.com/hotel-california-cover.jpg",
      "preview": "https://example.com/hotel-california-preview.mp3",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "__v": 0
    }
  ],
  "count": 2
}
```

### Get Song by ID
- **Method:** GET
- **URL:** `/api/songs/:id`
- **Headers:** 
  - `Authorization: Bearer <jwt_token>`

**URL Parameters:**
- `id` (string): MongoDB ObjectId of the song

**Success Response (200):**
```json
{
  "message": "Song retrieved successfully",
  "song": {
    "_id": "64f8b5c9e123456789abcdef",
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "duration": 355,
    "cover": "https://example.com/bohemian-rhapsody-cover.jpg",
    "preview": "https://example.com/bohemian-rhapsody-preview.mp3",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**
- **401:** Access token required
- **403:** Invalid token
- **404:** Song not found (for specific ID)
- **500:** Server error

## Usage Examples

### Get All Songs

#### Using curl:
```bash
curl -X GET http://localhost:3003/api/songs \
  -H "Authorization: Bearer your_jwt_token_here"
```

#### Using JavaScript fetch:
```javascript
const getAllSongs = async () => {
  const response = await fetch('http://localhost:3003/api/songs', {
    headers: {
      'Authorization': 'Bearer your_jwt_token_here'
    }
  });
  
  const data = await response.json();
  console.log(`Found ${data.count} songs:`, data.songs);
  return data.songs;
};
```

### Get Song by ID

#### Using curl:
```bash
curl -X GET http://localhost:3003/api/songs/64f8b5c9e123456789abcdef \
  -H "Authorization: Bearer your_jwt_token_here"
```

#### Using JavaScript fetch:
```javascript
const getSongById = async (songId) => {
  const response = await fetch(`http://localhost:3003/api/songs/${songId}`, {
    headers: {
      'Authorization': 'Bearer your_jwt_token_here'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Song found:', data.song);
    return data.song;
  } else {
    console.error('Song not found');
    return null;
  }
};
```

## Advanced Usage Examples

### Search Songs by Artist:
```javascript
const getSongsByArtist = async (artistName) => {
  const allSongs = await getAllSongs();
  return allSongs.filter(song => 
    song.artist.toLowerCase().includes(artistName.toLowerCase())
  );
};

// Usage
getSongsByArtist('Queen').then(songs => {
  console.log('Queen songs:', songs);
});
```

### Search Songs by Genre:
```javascript
const getSongsByDuration = async (minDuration, maxDuration) => {
  const allSongs = await getAllSongs();
  return allSongs.filter(song => 
    song.duration >= minDuration && song.duration <= maxDuration
  );
};

// Usage
getSongsByDuration(180, 300).then(songs => {
  console.log('Songs between 3-5 minutes:', songs);
});
```

### Get Songs with Cover Images:
```javascript
const getSongsWithCovers = async () => {
  const allSongs = await getAllSongs();
  return allSongs.filter(song => song.cover && song.cover.trim() !== '');
};

// Usage
getSongsWithCovers().then(songs => {
  console.log('Songs with covers:', songs);
});
```

### Display Songs Table:
```javascript
const displaySongsTable = async () => {
  const songs = await getAllSongs();
  
  console.table(songs.map(song => ({
    Title: song.title,
    Artist: song.artist,
    Duration: song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : 'N/A',
    Cover: song.cover ? 'Yes' : 'No',
    Preview: song.preview ? 'Yes' : 'No'
  })));
};
```

## Integration with Other Services

### Complete CRUD Operations:
```javascript
const songManager = {
  // Add song (uses add-service)
  async add(songData) {
    const response = await fetch('http://localhost:3001/api/songs', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer your_jwt_token_here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(songData)
    });
    return response.json();
  },

  // List songs (uses this service)
  async list() {
    return await getAllSongs();
  },

  // Get specific song (uses this service)
  async get(id) {
    return await getSongById(id);
  },

  // Delete song (uses delete-service)
  async delete(id) {
    const response = await fetch(`http://localhost:3002/api/songs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer your_jwt_token_here'
      }
    });
    return response.json();
  }
};

// Usage example
const manageSongs = async () => {
  // Add a song
  const newSong = await songManager.add({
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    duration: 482,
    cover: "https://example.com/stairway-to-heaven-cover.jpg",
    preview: "https://example.com/stairway-to-heaven-preview.mp3"
  });

  // List all songs
  const allSongs = await songManager.list();
  
  // Get specific song
  const song = await songManager.get(newSong.song._id);
  
  // Delete the song
  await songManager.delete(newSong.song._id);
};
```

## Notes

- Service runs on port 3003 by default
- All endpoints require JWT authentication
- Songs are returned sorted by creation date (newest first)
- MongoDB connection required for operation
- Returns empty array if no songs found
- Includes song count in response for convenience
