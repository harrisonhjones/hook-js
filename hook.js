var accessToken = null;
var apiEndpoint = 'http://ahook.cloudapp.net:3000/api/';
var debug = false;

function Hook() {
    accessToken = null;
}

Hook.prototype.setDebug = function(arg) {
    if(typeof arg === 'boolean') {
        debug = arg;
        if (debug) console.log("[hook-js] debugging", (arg ? 'enabled' : 'disabled'));
    }
}

Hook.prototype.setApiEndpoint = function(arg) {
    if(typeof arg === 'string') {
        apiEndpoint = arg;
        if (debug) console.log("[hook-js] apiEndpoint set to", arg);
    }
}

Hook.prototype.login = function(args, callback) {
    if(typeof args === 'object') {
        if('accessToken' in args) {
            if (debug) console.log("Logging in with accessToken '", args.accessToken, "'");
            var request = require('request');
            request(apiEndpoint + 'HookUsers/Me?access_token=' + args.accessToken, function(error, response, body) {
                if (!error && response.statusCode == 200){
                    accessToken = args.accessToken;
                    if (typeof callback === 'function') callback(error, JSON.parse(body).HookUser[0]);
                } else {
                    if (typeof callback === 'function') callback(error, response);
                }
            });
        } else if(('username' in args) && ('password' in args)) {
            if (typeof callback === 'function') callback("Logging in with username '" + args.username + "' & password '" + args.password + "'", null);
        } else {
            if (typeof callback === 'function') callback("Must login with accessToken or username and password", null);
        }
    } else  {
        if (typeof callback === 'function') callback("Must supply object argument to login", null);
    } 
}

Hook.prototype.listDevices = function(callback) {
    if (debug) console.log("Grabbing devices for user with accessToken '", accessToken, "'");

    if(accessToken) {
        var request = require('request');
        request(apiEndpoint + 'HookUsers/MyDevices?access_token=' + accessToken, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                if (typeof callback === 'function') callback(error, JSON.parse(body).Devices);
            } else {
                if (typeof callback === 'function') callback(error, response);
            }
        });
    } else {
        if (typeof callback === 'function') callback("No access token found. You must login first", null);
    } 
}

Hook.prototype.callDeviceAction = function(deviceID, actionName, callback) {
    if (debug) console.log("Calling action ", actionName, " on device ", deviceID);

    if(accessToken) {
        var request = require('request');
        request(apiEndpoint + 'Devices/' + deviceID.toString() + '/' + actionName + '?access_token=' + accessToken, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                if (typeof callback === 'function') callback(error, JSON.parse(body));
            } else {
                if (typeof callback === 'function') callback(error, response);
            }
        });
    } else {
        if (typeof callback === 'function') callback("No access token found. You must login first", null);
    } 
}

module.exports = new Hook;