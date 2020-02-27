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
        var a = rand(30.0, 33.0);
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

    await sleep(1000);
    var topic = "temperature/data";
    var temps = [];
    var goingUp = [];

    for (var sensor = 0; sensor < 4; sensor++) {
        temps[sensor] = rand(29.5, 31.5);
        goingUp[sensor] = true;
    }

    for (var i = 0; i < 120; i++) {
        for (var sensor = 0; sensor < 4; sensor++) {
            let temp = temps[sensor];
            var msg = {};
            msg.sensorId = sensor;
            msg.temperature = temp;
            var message = JSON.stringify(msg);
            pub.publish(message, topic);
            var delta;
            if (goingUp[sensor]) {
                delta = rand(0.0, 0.3);
            } else {
                delta = rand(-0.3, 0.0);
            }
            temp += delta;;
            temps[sensor] = temp;

            if (temp > 35.0) {
                goingUp[sensor] = false;
            }

            if (temp < 15.0) {
                goingUp[sensor] = true;
            }
        }
        await sleep(1000);
    }

    pub.disconnect();
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


