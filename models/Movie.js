module.exports = {
    labels: ["Movie"],

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
    "id": {
        type: "string",
        primary: true
    },
    "homepage": {
        type: "string",
        uri: {
            scheme: ['http', 'https']
        }
    }
};