// Define a Neode Instance
const neode = require("neode")

    // Using configuration from .env file
    .fromEnv()

    // Including the models in the models/ directory
    .with({
        Movie: require("./models/Movie"),
        Person: require("./models/Person"),
        Actor: require("./models/Actor"),
        Director: require("./models/Director")
    });


// Merge a movie on the title field and add additional properties
// Neode will also work out what to merge on based on the schema definition using `neode.merge`
neode.model("Movie").mergeOn({
    title: "Adulthood",
}, {
    description: "Not Straight Outta Compton, but straight out of jail and back on the mean streets of London.",
    tagline: "Are you dizzy blud?"
})
.then(adulthood => {
    // Get the 'Actor' definition
    const actor = neode.model("Actor");

    // Create some 'Actor' nodes
    return Promise.all([
        actor.mergeOn({name: "Noel Clarke"}),
        actor.mergeOn({name: "Scarlett Alice Johnson"}),
        actor.mergeOn({name: "Adam Deacon"})
    ])
    .then(([noel, scarlett, adam]) => {
        // Relate the actors to the movie
        return Promise.all([
            noel.relateTo(adulthood, "acts_in", {name: "Sam"}),
            scarlett.relateTo(adulthood, "acts_in", {name: "Lexi"}),
            adam.relateTo(adulthood, "acts_in", {name: "Jay"}),
        ])
    })
    .then(() => {
        return adulthood;
    });
})
.then(adulthood => {
    // Merge a 'Director' node based on the name
    return neode.merge("Director", {
        name: "Noel Clarke",
        // Neode will create relationships when either a Node instance,
        // ID property or Object containing match parameters is passed
        directed: [
            adulthood
        ]
    })
    .then(() => {
        return adulthood;
    });
})
.then(adulthood => {
    // Output some results
    console.log('Created '#, adulthood.id(), adulthood.properties());
})
.catch(e => {
    console.log("Error :(", e, e.details);
})
.then(() => {
    // Close all connections to the graph
    neode.close();

    console.log('Shutdown');
});
