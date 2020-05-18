const Glitch = require('../main');

const readline = require('readline');

const me = new Glitch.Me();

const input = (text, rl, d) => new Promise((res, rej) => rl.question(text, ans => d ? res(ans.length > 0 ? ans : d) : res(ans)));

me.on("ready", async () => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`Logged in with ${me.name} (@${me.login})!`);
    console.log("Creating new project\n--------------------")
    const proj = await me.remix("hello-express", {
        domain: await input("domain name: ", rl),
        description: await input("description: ", rl),
        private: await input("private (false): ", rl, "false") == "false" ? false : true
    })
    await input("Press enter to delete the project.", rl);
    await proj.delete();
    console.log("Project deleted!");
})

me.signin("your-token-here");