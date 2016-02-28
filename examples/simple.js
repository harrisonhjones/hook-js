var hook = new require('../hook');

hook.setDebug(true);
// hook.setApiEndpoint('http://ahook.cloudapp.net:3000/api/');

hook.login({token: process.env.HOOKACCESSTOKEN}, function(err) {
    if(err)
    {
        console.log("Login Error: ", err);
    }
    else
    {
        console.log("Login Success");
        console.log("\tEmail: ", hook.getEmail());
        console.log("\tUsername: ", hook.getUsername());
        console.log("\tFirst Name: ", hook.getFirstName());
        console.log("\tLast Name: ", hook.getLastName());
        console.log("\tPhone #: ", hook.getPhone());


        hook.getDevices(function(err, devices) {
            if(err)
            {
                console.log("\tGet Devices Error: ", err);
            }
            else
            {
                console.log("\tGet Devices Success");
                console.log(devices);

                var deviceID = devices[0].device_id;
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

        
    }
});

