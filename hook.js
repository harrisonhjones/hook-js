// Constructor
function Hook() {
    Hook.token = null;
    Hook.apiEndpoint = 'https://api.gethook.io/v1/';
    Hook.debug = false;
    Hook.timeout = 1000;
    Hook.username = '';
    Hook.email = '';
    Hook.firstname = '';
    Hook.lastname = '';
    Hook.phone = '';
}

Hook.prototype.setDebug = function(arg) {
    // Check if the argument is a boolean. If so, set the state of debugging to the argument. If not, return false.
    if(typeof arg === 'boolean') {
        Hook.debug = arg;
        if (Hook.debug) console.log("[hook-js] debugging", (arg ? 'enabled' : 'disabled'));
        return true;
    }
    else
    {
        if (Hook.debug) console.log("[hook-js] setDebug argument is of type", typeof arg, "instead of `boolean`. Value = ", arg);
        return false;
    }
}

Hook.prototype.setApiEndpoint = function(arg) {
    // Check if the argument is a string. If so, set the value of the api endpoint. If not, return false.
    if(typeof arg === 'string') {
        Hook.apiEndpoint = arg;
        if (Hook.debug) console.log("[hook-js] apiEndpoint set to", arg);
        return true;
    }
    else
    {
        if (Hook.debug) console.log("[hook-js] setApiEndpoint argument is of type", typeof arg, "instead of `string`. Value = ", arg);
        return false;
    }
}

Hook.prototype.setTimeout = function(arg) {
    if(typeof arg === 'number') {
        Hook.timeout = arg;
        if (Hook.debug) console.log("[hook-js] timeout set to", arg);
        return true;
    }
    else
    {
        if (Hook.debug) console.log("[hook-js] setTimeout argument is of type", typeof arg, "instead of `number`. Value = ", arg);
        return false;
    }
}

Hook.prototype.setToken = function(arg)
{
    if(typeof arg === 'string') {
        Hook.token = arg;
        if (Hook.debug) console.log("[hook-js] token set to", arg);
        return true;
    }
    else
    {
        if (Hook.debug) console.log("[hook-js] setToken argument is of type", typeof arg, "instead of `string`. Value = ", arg);
        return false;
    }
}

Hook.prototype.getUsername = function()
{
    return Hook.username;
}

Hook.prototype.getFirstName = function()
{
    return Hook.firstname;
}

Hook.prototype.getLastName = function()
{
    return Hook.lastname;
}

Hook.prototype.getEmail = function()
{
    return Hook.email;
}

Hook.prototype.getPhone = function()
{
    return Hook.phone;
}

Hook.prototype.login = function(args, callback) {
    if(typeof args === 'object') {
        if('token' in args) {
            if (Hook.debug) console.log("Logging in with token '", args.token, "'");
            var needle = require('needle');
            needle.get(Hook.apiEndpoint + 'user?token=' + args.token, {timeout: Hook.timeout}, function(err, resp) {
                if(err)
                {
                    if (Hook.debug) console.log("[hook-js] login failure. Error =", err);
                    if (typeof callback === 'function') callback(err);
                }
                else
                {
                    var response = JSON.parse(resp.body);
                    if(parseInt(response.meta.status) == 200)
                    {
                        Hook.token = args.token;
                        Hook.username = response.data.username;
                        Hook.email = response.data.email;
                        Hook.firstname = response.data.firstname;
                        Hook.lastname = response.data.lastname;
                        Hook.phone = response.data.phone;

                        if (typeof callback === 'function') callback(false);
                    }
                    else
                    {
                        errorMessage = response.data.message;
                        if (Hook.debug) console.log("[hook-js] login failure. Error =", resp.body);
                        if (typeof callback === 'function') callback(errorMessage);
                    }
                }
            });
        } else if(('username' in args) && ('password' in args)) {
            var needle = require('needle');
            needle.post(Hook.apiEndpoint + 'user/login', {username: args.username, password: args.password}, {timeout: Hook.timeout}, function(err, resp) {
                if(err)
                {
                    if (Hook.debug) console.log("[hook-js] login failure. Error =", err);
                    if (typeof callback === 'function') callback(err);
                }
                else
                {
                    var response = JSON.parse(resp.body);
                    if(parseInt(response.meta.status) == 200)
                    {
                        Hook.token = response.data.token;
                        if (typeof callback === 'function') callback(false);
                    }
                    else
                    {
                        errorMessage = response.data.message;
                        if (Hook.debug) console.log("[hook-js] login failure. Error =", errorMessage);
                        if (typeof callback === 'function') callback(errorMessage);
                    }
                }
            });            
        } else {
            if (typeof callback === 'function') callback("Must login with accessToken or username and password");
        }
    } else  {
        if (typeof callback === 'function') callback("Must supply object argument to login");
    } 
}

Hook.prototype.getDevices = function(callback) {
    if (Hook.debug) console.log("Grabbing devices for user with token '", Hook.token, "'");

    if(Hook.token) {
        var needle = require('needle');

        needle.get(Hook.apiEndpoint + 'device?token=' + Hook.token, {timeout: Hook.timeout},function(err, resp) {

            if(err)
            {
                if (Hook.debug) console.log("[hook-js] get device failure. Error =", err);
                if (typeof callback === 'function') callback(err, null);
            }
            else
            {
                var response = JSON.parse(resp.body);
                if(parseInt(response.meta.status) == 200)
                {
                    if (typeof callback === 'function') callback(false, response.data[0]);
                }
                else
                {
                    errorMessage = response.data.message;
                    if (Hook.debug) console.log("[hook-js] get device failure. Error =", errorMessage);
                    if (typeof callback === 'function') callback(errorMessage, null);
                }
            }
        });
    } else {
        if (typeof callback === 'function') callback("No access token found. You must login first", null);
    } 
}

Hook.prototype.getGroups = function(callback) {
    if (Hook.debug) console.log('Hook devices not yet supported!');
    if (typeof callback === 'function') callback(false, []);
}

Hook.prototype.callDeviceAction = function(deviceID, actionName, callback) {
    if (Hook.debug) console.log("Calling action ", actionName, " on device ", deviceID);

    if(Hook.token) {
        ///device/trigger/<deviceid>/<actionName>?token=xxxx

        if (Hook.debug) console.log(Hook.apiEndpoint + 'device/trigger/' + deviceID + '/' + actionName + '/?token=' + Hook.token);

        var needle = require('needle');

        needle.get(Hook.apiEndpoint + 'device/trigger/' + deviceID + '/' + actionName + '/?token=' + Hook.token, {timeout: Hook.timeout}, function(err, resp) {

            if(err)
            {
                if (Hook.debug) console.log("[hook-js] call device action failure. Error =", err);
                if (typeof callback === 'function') callback(err, null);
            }
            else
            {
                var response = JSON.parse(resp.body);                
                callback(false, null);

                /*
                Hook's API doesn't follow the convention of the API endpoint at this point so the return value isn't very useful

                if(parseInt(response.meta.status) == 200)
                {
                    if (typeof callback === 'function') callback(false, response.data);
                }
                else
                {
                    errorMessage = response.data.message;
                    if (Hook.debug) console.log("[hook-js] get device failure. Error =", errorMessage);
                    if (typeof callback === 'function') callback(errorMessage, null);
                }*/
            }

        });

    } else {
        if (typeof callback === 'function') callback("No access token found. You must login first", null);
    } 
}

module.exports = new Hook();