var hook = new require('../hook');
var config = require('config-node')({
    dir: 'config', 
    ext: 'conf.json', 
    env: 'simple' 
});

hook.setDebug(true);
// hook.setApiEndpoint('http://ahook.cloudapp.net:3000/api/');

hook.login({accessToken: config.hookAccessToken}, function(err, user) {
    if(err)
    {
        console.log("Login Error: ", err);
    }
    else
    {
        console.log("Login Success");
        console.log("\tEmail: ", user.email);
        console.log("\tUser ID: ", user.id);

        hook.listDevices(function(err, devices) {
            if(err)
            {
                console.log("\tList Devices Error: ", err);
            }
            else
            {
                console.log("\tList Devices Success");
                console.log(devices);
                for (var i = 0; i < devices.length; i++) {
                    console.log("\t\tdeviceName: ", devices[i].deviceName);
                    console.log("\t\t\tid: " + devices[i].id);
                    console.log("\t\t\thookId: " + devices[i].hookId);
                    console.log("\t\t\tActions: ");
                    for( var j = 0; j < devices[i].deviceActions.length; j++) {
                        console.log("\t\t\t\tactionName: ",devices[i].deviceActions[j].actionName);
                        console.log("\t\t\t\t\tActionInfo: ");
                        console.log("\t\t\t\t\t\tS: ", devices[i].deviceActions[j].actionInfo.S);
                        console.log("\t\t\t\t\t\tD: ", devices[i].deviceActions[j].actionInfo.D);
                        console.log("\t\t\t\t\t\tP: ", devices[i].deviceActions[j].actionInfo.P);
                        console.log("\t\t\t\t\tid: ",devices[i].deviceActions[j].id);
                        console.log("\t\t\t\t\tdeviceId: ",devices[i].deviceActions[j].deviceId);
                    }
                }
            }
        });

        var deviceID = 90;
        var actionName = "ON";

        hook.callDeviceAction(deviceID, actionName, function(err, body) {
            if(err)
            {
                console.log("Action Call Error: ", err);
            }
            else
            {
                console.log("Action Call Success", body);
            }
        });
    }
});

