const Pub = require("./pub.js")
const util = require('util')

// passed in as an environment variable.

var configPath = "./solace.json"

if (process.env.heat_sensor_config_path) {
    configPath = process.env.heat_sensor_config_path
}

var config = require(configPath)

// Setup Solace

var solace = require('solclientjs')
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);
var pub = new Pub(solace, config);
pub.connect()
doit()

async function doit() {

    await sleep(1000)
    var topic = "temp/123";

    for (var i = 0; i < 10; i++) {
        var message = "Hi - message " + i;
        pub.publish(message, topic)
        await sleep(1000)
    }

    pub.disconnect()
}


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

process.on('exit', function () {
    console.log('Shutting down...')
    pub.disconnect()
})

process.on('SIGTERM', () => {
    console.log('Caught a SIGTERM. Shutting down...')
    process.exit()
})

process.on('SIGINT', () => {
    console.log('Caught a SIGINT. Shutting down...')
    process.exit()
})


