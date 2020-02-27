# heat-sensor

This is the repo for a heat sensor IOT application.

Early days - work in progress.

1. Run ```npm install solclientjs```
1. cd src
1. edit-me.config.json to solace.json
1. Edit solace.json - put in your Solace credentials for Javascript/SMF
1. Run ```node app.js```


example messages:

Add a 'station' parameter based on the chipID, so we can determine what has dropped out.

topic: temperature/data
sprintf(message, "{\n    \"sensorId\":%d,\n    \"time\":%lu,\n    \"temperature\": %2.2f\n}\n", i, currentTime, temp);

topic: temperature/control
Improve the last will message.
