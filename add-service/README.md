# Add Service

Microservice for adding songs to the database.

## Prerequisites

- Node.js 18+
- MongoDB running locally or connection string
- Valid JWT token from authentication service

## Local Installation

1. Navigate to the service directory:
```bash
cd add-service
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with:
```env
PORT=3001
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
docker build -t add-service .
```

2. Run the container:
```bash
docker run -p 3001:3001 --env-file .env add-service
```

## API Endpoints

### Add Song
- **Method:** POST
- **URL:** `/api/songs`
- **Headers:** 
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "duration": 355,
  "cover": "https://example.com/bohemian-rhapsody-cover.jpg",
  "preview": "https://example.com/bohemian-rhapsody-preview.mp3"
}
```

**Success Response (201):**
```json
{
  "message": "Song added successfully",
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
- **400:** Missing required fields
- **401:** Access token required
- **403:** Invalid token
- **500:** Server error

## Usage Examples

### Using curl:
```bash
curl -X POST http://localhost:3001/api/songs \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hotel California",
    "artist": "Eagles",
    "duration": 391,
    "cover": "https://example.com/hotel-california-cover.jpg",
    "preview": "https://example.com/hotel-california-preview.mp3"
  }'
```

### Using JavaScript fetch:
```javascript
const addSong = async () => {
  const response = await fetch('http://localhost:3001/api/songs', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer your_jwt_token_here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Imagine",
      artist: "John Lennon",
      duration: 183,
      cover: "https://example.com/imagine-cover.jpg",
      preview: "https://example.com/imagine-preview.mp3"
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

## Required Fields

- `title` (string): Song title
- `artist` (string): Artist name
- `duration` (number): Duration in seconds

## Optional Fields

- `cover` (string): URL to song cover image
- `preview` (string): URL to song preview audio file

## Notes

- Service runs on port 3001 by default
- All endpoints require JWT authentication
- MongoDB connection required for operation
- Timestamps are automatically added to records
