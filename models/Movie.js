module.exports = {
    "studio": "string",
    "releaseDate": "string",
    "imdbId": "string",
    "runtime": "number",
    "description": "string",
    "language": "string",
    "title": {
        type: "string",
        indexed: true
    },
    "version": "number",
    "trailer": {
        type: "string",
        uri: {
            scheme: ['http', 'https']
        }
    },
    "imageUrl": {
        type: "string",
        uri: {
            scheme: ['http', 'https']
        }
    },
    "genre": "string",
    "tagline": "string",
    "lastModified": "string",
    "id": "string",
    "homepage": {
        type: "string",
        uri: {
            scheme: ['http', 'https']
        }
    }
};