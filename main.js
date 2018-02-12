/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

var utils         = require(__dirname + '/lib/utils'); // Get common adapter utils
var stateObjects = require(__dirname + '/lib/objects');
var nest         = null; //communication handler


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
    if (statisticTimeout) clearTimeout(statisticTimeout);
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
    // evtl. auch noch ein paar schedules löschen
});


var adapter       = utils.adapter({
    name: 'nest',
    unload: function (cb) {
        if (nest) {
            nest.close();
            nest = null;
        }
        if (typeof cb === 'function') cb();
    }
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
    adapter.log.info('statistics setting up object = ' + type + '  ' + id);
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

    // states for the temporary values
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

    // und nochmal
    if(type === 'thermostats'){}
    // imperial
    // metric
    if(type === 'cameras'){}
    // laststate

}

function main() { 
    // objects with statistics
    var obj = adapter.config.devices;
    adapter.log.debug('obj config ' + JSON.stringify(obj));
    if (!adapter.config.devices) {
        adapter.log.warn('No config defined');
        return;
    }

    for (var anz in obj){
        var logobject = obj[anz].logobject;
        var logname = obj[anz].logname;

        adapter.log.debug('werte ' + logobject +' named ' + logname);


            defineObject( "avg" , logobject, logname); //type, id, name
            adapter.subscribeForeignStates(logobject);
            adapter.setObject(adapter.namespace + '.save.avg', {
                type: 'channel',
                common: {
                    name: 'Mittelwerte',
                    role: 'sensor'
                },
                native: {
                }
            });

    }

}
