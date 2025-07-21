# Delete Service

Microservice for deleting songs from the database.

## Prerequisites

- Node.js 18+
- MongoDB running locally or connection string
- Valid JWT token from authentication service

## Local Installation

1. Navigate to the service directory:
```bash
cd delete-service
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with:
```env
PORT=3002
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
docker build -t delete-service .
```

2. Run the container:
```bash
docker run -p 3002:3002 --env-file .env delete-service
```

## API Endpoints

### Delete Song
- **Method:** DELETE
- **URL:** `/api/songs/:id`
- **Headers:** 
  - `Authorization: Bearer <jwt_token>`

**URL Parameters:**
- `id` (string): MongoDB ObjectId of the song to delete

**Success Response (200):**
```json
{
  "message": "Song deleted successfully",
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
- **404:** Song not found
- **500:** Server error

## Usage Examples

### Using curl:
```bash
curl -X DELETE http://localhost:3002/api/songs/64f8b5c9e123456789abcdef \
  -H "Authorization: Bearer your_jwt_token_here"
```

### Using JavaScript fetch:
```javascript
const deleteSong = async (songId) => {
  const response = await fetch(`http://localhost:3002/api/songs/${songId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer your_jwt_token_here'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Song deleted:', data);
  } else {
    console.error('Failed to delete song');
  }
};

// Example usage
deleteSong('64f8b5c9e123456789abcdef');
```

### Using Postman:
1. Set method to DELETE
2. URL: `http://localhost:3002/api/songs/64f8b5c9e123456789abcdef`
3. Headers:
   - Key: `Authorization`
   - Value: `Bearer your_jwt_token_here`
4. Send request

## Common Use Cases

### Delete by ID after search:
```javascript
// First, get the song ID from list service
const getSongs = async () => {
  const response = await fetch('http://localhost:3003/api/songs', {
    headers: { 'Authorization': 'Bearer your_jwt_token_here' }
  });
  const data = await response.json();
  return data.songs;
};

// Then delete specific song
const deleteSpecificSong = async (title) => {
  const songs = await getSongs();
  const songToDelete = songs.find(song => song.title === title);
  
  if (songToDelete) {
    await deleteSong(songToDelete._id);
  }
};
```

## Error Handling

### Invalid ID Format:
```bash
# This will return 500 error for invalid ObjectId
curl -X DELETE http://localhost:3002/api/songs/invalid-id \
  -H "Authorization: Bearer your_jwt_token_here"
```

### Song Not Found:
```bash
# This will return 404 if song doesn't exist
curl -X DELETE http://localhost:3002/api/songs/64f8b5c9e123456789abcd00 \
  -H "Authorization: Bearer your_jwt_token_here"
```

## Notes

- Service runs on port 3002 by default
- All endpoints require JWT authentication
- MongoDB connection required for operation
- Deleted songs cannot be recovered
- Returns the deleted song data for confirmation
- Use valid MongoDB ObjectId format for song ID
