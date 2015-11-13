# HookJS

**About:** A NodeJS module to interact with the Hook (http://gethook.io) API

**Author:** Harrison H. Jones <harrison@hhj.me>

## Installation

1. Install [NodeJS](http://nodejs.org/)
2. Open up a terminal or command prompt and run: `npm install hook-js`

## Examples

See below in **Usage** or take a look at the examples folder

## Usage

### Login
```
// Include the module
var hook = new require('hook-js');	

// Enable debugging (disabled by default)
hook.setDebug(true);

// Login
hook.login({accessToken: "HOOK_ACCESS_TOKEN_HERE"}, function(err, user) {
	if(err)
	    console.log("Login Error: ", err);
	else
	{
		console.log("Login Success");
		console.log("\tEmail: ", user.email);
		console.log("\tUser ID: ", user.id);
	}
});
```

### List Devices

```
hook.listDevices(function(err, devices) {
	if(err)
	    console.log("\tList Devices Error: ", err);
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
```

### Call an Action

```
var deviceID = DEVICE_ID_HERE;
var actionName = "ACTION_NAME_HERE";

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
```

## To Do

Take a look at the current open GitHub issues for this project to help out!