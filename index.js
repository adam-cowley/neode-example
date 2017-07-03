// const neode = require("neode")
const neode = require("../neode/build")
    .fromEnv()
    .with({
        Movie: require("./models/Movie"),
        Person: require("./models/Person"),
        Actor: require("./models/Actor"),
        Director: require("./models/Director"),
    });

neode.model("Movie").mergeOn({
    title: "Adulthood",
}, {
    description: "Not Straight Outta Compton, but straight out of jail and back on the mean streets of London.",
    tagline: "Are you dizzy blud?"
})
.then(adulthood => {
    const actor = neode.model("Actor");

    return Promise.all([
        actor.mergeOn({name: "Noel Clarke"}),
        actor.mergeOn({name: "Scarlett Alice Johnson"}),
        actor.mergeOn({name: "Adam Deacon"})
    ])
    .then(([noel, scarlett, adam]) => {
        return Promise.all([
            noel.relateTo(adulthood, "acts_in", {name: "Sam"}),
            scarlett.relateTo(adulthood, "acts_in", {name: "Lexi"}),
            adam.relateTo(adulthood, "acts_in", {name: "Jay"}),
        ])
    })
    .then(() => {
        return adulthood
    });
})
.then(adulthood => {
    console.log('Created ', adulthood)
})
.catch(e => {
    console.log("Error :(", e);
});

