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


// Example of the rand function we need:

function(var low, var high) {
    var value = 0;// need to figure this part out
    return value;
}

//for (var i = 0; i < 10; i++) {
//    play();
//}

function play() {
    var a = Math.random();
    var b = a + 19.5
    console.log( "b is " + b)
}

async function doit() {

    await sleep(1000)
    var topic = "temp/123";
    var temp = 19.5 + Math.random();

    for (var i = 0; i < 10; i++) {
        var message = "temp: " + temp;
        pub.publish(message, topic)
        await sleep(1000)
        var delta = -0.5 + Math.random();
        temp += delta;
    }

    pub.disconnect()
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


