const Glitch = require('../main');

const me = new Glitch.Me();

me.on("ready", () => {
    me.remix("hello-express").catch(console.error);
})

me.signin("bike-coriander-elderberry").catch(console.log)