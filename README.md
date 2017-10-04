# Neode Example

This repository contains an example project using the [Neode](http://github.com/adam-cowley/neode) package for NodeJS.

## Models

The basic models are defined in the `./models` directory.  The models are all based on the Recommendations example in the [Neo4j Sandbox](https://neo4j.com/sandbox-v2).

## General Workflow

A general workflow is mapped out in `index.js`.  After creating a neode instance with the environment variables, the example goes through the flow of merging a Movie node based on the title, then creating and relating a set of Actors and a Director.

## Watch or Not?

The rest of the repository outlines how to build a simple app using Neode.  Using the same models defined above, **Watch or Not** will give you 10 movie choices within a category and based on an upvote or downvote.  Based on the responses provided, the app will provide a recommendation based on the ratings of similar users.

Requests into the sever are handled by a simple `express` application, with templates served using the `jade` template engine.

The code is documented throughout.  Head to server.js to get started.

### Running the server
Firstly, copy the `.env.example` file to `.env` and update with the credentials for your Neo4j instance.

```
npm install
node server.js
```
