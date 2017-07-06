const neode = require("neode")
    .fromEnv()
    .with({
        Movie: require("./models/Movie"),
        Person: require("./models/Person"),
        Actor: require("./models/Actor"),
        Director: require("./models/Director")
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
    .then(res => {
        const noel = res[0];
        const scarlett = res[1];
        const adam = res[2];

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
    return neode.merge("Director", {
        name: "Noel Clarke",
        directed: [
            adulthood
        ]
    })
    .then(() => {
        return adulthood;
    });
})
.then(adulthood => {
    console.log('Created ', adulthood.id(), adulthood.properties());
})
.catch(e => {
    console.log("Error :(", e, e.details);
})
.then(() => {
    neode.close();

    console.log('Shutdown');
});
/**/
