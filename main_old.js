/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

// you have to require the utils module and call adapter function
var utils = require('@iobroker/adapter-core'); // Get common adapter utils
var stateObjects = require(__dirname + '/lib/objects');
var request = require('request'); // event driven communication
const EventSource = require('eventsource'); // streamed communication


// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluding extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.nest.0
var adapter = utils.Adapter('nest');

var types = [];
var typeobjects = {};
var nestTimeout; //falls es mal ein polling gibt


var nameObjects = {
    thermostats :{
        basic: ["device_id", "software_version", "structure_id", "where_id", "where_name", "name", "name_long", "is_online"],
        state: ["can_cool", "can_heat", "locale", "is_using_emergency_heat", "has_fan", "fan_timer_active", "has_leaf", "is_locked", "sunlight_correction_enabled", "sunlight_correction_active", "last_connection", "fan_timer_timeout", "temperature_scale", "time_to_target_training", "hvac_state", "label","time_to_target", "hvac_mode", "previous_hvac_mode", "fan_timer_duration"  ],
        metric: ["target_temperature_c", "target_temperature_high_c", "target_temperature_low_c", "eco_temperature_high_c", "eco_temperature_low_c", "away_temperature_high_c", "away_temperature_low_c", "ambient_temperature_c", "locked_temp_min_c", "locked_temp_max_c", "humidity" ],
        imperial: ["target_temperature_f","target_temperature_high_f","target_temperature_low_f","eco_temperature_high_f","eco_temperature_low_f", "away_temperature_high_f", "away_temperature_low_f", "ambient_temperature_f", "locked_temp_min_f" , "locked_temp_max_f", "humidity" ]
    },
    smoke_co_alarms :{
        basic: ["device_id", "software_version", "structure_id", "where_id", "where_name", "name", "name_long", "is_online"],
        state: ["is_manual_test_active", "locale", "last_connection", "battery_health", "co_alarm_state", "smoke_alarm_state", "last_manual_test_time", "ui_color_state" ]
    },
    cameras :{
        basic: ["device_id", "software_version", "structure_id", "where_id", "where_name", "name", "name_long", "is_online" ],
        state: ["is_streaming", "is_audio_input_enabled", "is_video_history_enabled", "is_public_share_enabled" , "web_url","app_url", "public_share_url","snapshot_url", "activity_zones" ],
        last_state: ["has_sound", "has_motion", "has_person", "start_time", "end_time", "urls_expire_time", "web_url", "app_url" , "image_url" , "animated_image_url", "activity_zone_ids" ]
    }

};


// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    if (nestTimeout) clearTimeout(nestTimeout);
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
    // evtl. auch noch ein paar schedules löschen
});

adapter.on('message', function (obj) {
    var wait = false;
    if (obj) {
        switch (obj.command) {
            case 'browse':
                adapter.log.info('Discover devices...');
                discoverDevices({
                    type: 'all'
                }).then(function (results) {
                    adapter.log.info('Discover devices: ' + JSON.stringify(results));
                    if (obj.callback) adapter.sendTo(obj.from, obj.command, results, obj.callback);
                });
                wait = true;
                break;

            default:
                adapter.log.warn('Unknown command: ' + obj.command);
                break;
        }
    }

    if (!wait && obj.callback) {
        adapter.sendTo(obj.from, obj.command, obj.message, obj.callback);
    }

    return true;
});

// is called when databases are connected and adapter received configuration.
// start here!
adapter.on('ready', function () {
    main();
});

function defineObject(type, id, name){
    //Überschrift
    adapter.log.info('nest setting up object = ' + type + '  ' + id);
    adapter.setObject(adapter.namespace + '.' + type + '.' + id, {
        type: 'channel',
        common: {
            name: name,
            role: 'sensor'
        },
        native: {
            "addr": id
        }
    });


    // states for the basic values
    var nameObjectType = nameObjects[type];
    var objects= nameObjectType["basic"];
    for (var s = 0; s < objects.length; s++) {
        if (!stateObjects[objects[s]]) {
            adapter.log.error('State ' + objects[s] + ' unknown');
            continue;
        }
        var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
        if (!obj) {
            adapter.log.error('Unknown state: ' + objects[s]);
            continue;
        }
        adapter.log.debug('obj anlegen  '+ JSON.stringify(obj));
        adapter.setObject(adapter.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
    }

    // states for the state values
    var objects= nameObjectType["state"];
    for (var s = 0; s < objects.length; s++) {
        if (!stateObjects[objects[s]]) {
            adapter.log.error('State ' + objects[s] + ' unknown');
            continue;
        }
        var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
        if (!obj) {
            adapter.log.error('Unknown state: ' + objects[s]);
            continue;
        }
        adapter.log.debug('obj anlegen  '+ JSON.stringify(obj));
        adapter.setObject(adapter.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
    }

    // states for the thermostat values
    if(type === 'thermostats'){
        // imperial

        // metric
        var objects= nameObjectType["metric"];
        for (var s = 0; s < objects.length; s++) {
            if (!stateObjects[objects[s]]) {
                adapter.log.error('State ' + objects[s] + ' unknown');
                continue;
            }
            var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
            if (!obj) {
                adapter.log.error('Unknown state: ' + objects[s]);
                continue;
            }
            adapter.log.debug('obj anlegen  '+ JSON.stringify(obj));
            adapter.setObject(adapter.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
        }
    }


    //states for the camera values
    if(type === 'cameras'){
        // laststate
        var objects= nameObjectType["last_state"];
        for (var s = 0; s < objects.length; s++) {
            if (!stateObjects[objects[s]]) {
                adapter.log.error('State ' + objects[s] + ' unknown');
                continue;
            }
            var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
            if (!obj) {
                adapter.log.error('Unknown state: ' + objects[s]);
                continue;
            }
            adapter.log.debug('obj anlegen  '+ JSON.stringify(obj));
            adapter.setObject(adapter.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
        }
    }
}

function updateDevices(object){
    var list = object;
    var types = Object.keys(list.devices);
    for (var i in types){
        adapter.log.debug('types ' + types[i]);
        var typeids = Object.keys(list.devices[types[i]]); //muß ohne . sein types[i], steht für .thermostats, .cameras .smoke_co_alarms
        adapter.log.debug("typeids " + typeids);
        for (var j in typeids){
            adapter.log.debug('id ' + typeids[j]);
            adapter.log.debug('name '+ list.devices[types[i]][typeids[j]].where_name); //wieder ohne ., hier stehen die kryptischen Ids
            var objectdata = Object.keys(list.devices[types[i]][typeids[j]]);
            for (var k in objectdata){
                //if (nameObjects[types[i]].hasOwnproperty(objectdata[k])){
                    adapter.log.debug('value set ' + types[i] + '.' + typeids[j] + '.' + objectdata[k] + ' wert ' + list.devices[types[i]][typeids[j]][objectdata[k]] );
                    adapter.setState(adapter.namespace + '.' + types[i] + '.' + typeids[j] + '.' + objectdata[k], {val: list.devices[types[i]][typeids[j]][objectdata[k]], ack: true});
                //}
            }

        }
    }
}


function getUpdate(accesstoken){
    adapter.log.debug('initial data request ' + accesstoken);
    var nesturl = 'https://developer-api.nest.com';
    var nesturl2 = nesturl + '?auth=' + accesstoken;

    var options = {
        headers: { 'Content-Type': 'application/json' ,'Authorization': 'Bearer ' + accesstoken }
    }

    request(nesturl, options, function(err, resp, body) {
        adapter.log.debug('status' +resp.statusCode + '  ' +resp.statusMessage);
        adapter.log.debug('body ' + body);
        if (resp.statusCode == 200) {
            adapter.log.debug(body);
            var list = JSON.parse(body);
            updateDevices(list);
        }
        else {
            adapter.log.debug('error ' +err + resp );
        }
    });
}


function startStreaming(token) {
    const NEST_API_URL = 'https://developer-api.nest.com';
    
    var headers = {
        "Authorization": 'Bearer ' + token
    }
    var source = new EventSource(NEST_API_URL, {"headers": headers});

    source.addEventListener('put', function(event) {
        adapter.log.debug('\n' + event.data); // Nest data in JSON format
        adapter.log.debug('device'+JSON.stringify(JSON.parse(event.data).data));
        var stream = JSON.parse(event.data)
        if(stream.data){
            updateDevices(stream.data);
        }
        
    });

    source.addEventListener('open', function(event) {
        adapter.log.debug('Connection opened!');
    });

    source.addEventListener('auth_revoked', function(event) {
        adapter.log.debug('Authentication token was revoked.');
        // Re-authenticate your user here.
    });

    source.addEventListener('error', function(event) {
        if (event.readyState == EventSource.CLOSED) {
            adapter.log.error('Connection was closed!', event);
        } else {
            adapter.log.error('An unknown error occurred: ', event);
        }
    }, false);
}

function main() { 
    // objects with nest
    var obj = adapter.config.devices;
    adapter.log.debug('obj config ' + JSON.stringify(obj));
    if (!adapter.config.devices) {
        adapter.log.warn('No config defined');
        return;
    }

    typeobjects["thermostats"]=[];
    typeobjects["smoke_co_alarms"]=[];
    typeobjects["cameras"]=[];

    

    for (var anz in obj){
        var nestobject = obj[anz].id;
        var nestname = obj[anz].name;
        var nesttype = obj[anz].type;

        adapter.log.debug('werte ' + nestobject +' named ' + nestname);

        //thermostats anlegen
        if( nesttype  === 'thermostats' ){
            typeobjects["thermostats"].push(nestobject);
            defineObject( nesttype , nestobject, nestname); //type, id, name
            /*
            adapter.setObject(adapter.namespace + '.thermostat', {
                type: 'channel',
                common: {
                    name: 'theromostat',
                    role: 'sensor'
                },
                native: {
                }
            });
            */
        }

        // smoke alarm anlegen
        if(nesttype === 'smoke_co_alarms' ){
            typeobjects["smoke_co_alarms"].push(nestobject);
            defineObject( nesttype , nestobject, nestname); //type, id, name
            /*
            adapter.setObject(adapter.namespace + '.smoke', {
                type: 'channel',
                common: {
                    name: 'smoke alarm',
                    role: 'sensor'
                },
                native: {
                }
            });
            */
        }   

        //camera anlegen     
        if( nesttype === 'cameras' ){
            typeobjects["cameras"].push(nestobject);
            defineObject( nesttype , nestobject, nestname); //type, id, name
            /*
            adapter.setObject(adapter.namespace + '.cameras', {
                type: 'channel',
                common: {
                    name: 'camera',
                    role: 'sensor'
                },
                native: {
                }
            });
            */
        }
    }
    
    var token = adapter.config.access_token;

    //initial setup
    getUpdate(token);

    //streamed data updates
    startStreaming(token);

    adapter.log.debug('typeobjects ' + JSON.stringify(typeobjects));

}
