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
var pub;

init();
doit()
//test();

function test() {
    for (var i = 0; i < 9; i++) {
        var a = rand(19.5, 21.5);
        console.log("a: " + a);
    }
}


// Example of the rand function we need:

function rand(low, high) {
    var range = high - low;
    var value = Math.random() * range + low;
    return value;
}

async function doit() {

    await sleep(1000)
    var topic = "temp/123";
    var temp = rand(19.5, 21.5)

    for (var i = 0; i < 10; i++) {
        var message = "temp: " + temp;
        pub.publish(message, topic)
        await sleep(1000)
        var delta = rand(-0.5, 0.5)
        temp += delta;
    }

    pub.disconnect()
}

function init() {
    var factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);
    solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);
    pub = new Pub(solace, config);
    pub.connect()
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

//process.on('exit', function () {
//    console.log('Shutting down...')
//    pub.disconnect()
//})

process.on('SIGTERM', () => {
    console.log('Caught a SIGTERM. Shutting down...')
    process.exit()
})

process.on('SIGINT', () => {
    console.log('Caught a SIGINT. Shutting down...')
    process.exit()
})


