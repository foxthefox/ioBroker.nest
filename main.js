'use strict';

/*
 * Created with @iobroker/create-adapter v2.0.2
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

var stateObjects = require(__dirname + '/lib/objects');
var request = require('request'); // event driven communication
const EventSource = require('eventsource'); // streamed communication

var types = [];
var typeobjects = {};
var nestTimeout; //falls es mal ein polling gibt

var nameObjects = {
	thermostats: {
		basic: [
			'device_id',
			'software_version',
			'structure_id',
			'where_id',
			'where_name',
			'name',
			'name_long',
			'is_online'
		],
		state: [
			'can_cool',
			'can_heat',
			'locale',
			'is_using_emergency_heat',
			'has_fan',
			'fan_timer_active',
			'has_leaf',
			'is_locked',
			'sunlight_correction_enabled',
			'sunlight_correction_active',
			'last_connection',
			'fan_timer_timeout',
			'temperature_scale',
			'time_to_target_training',
			'hvac_state',
			'label',
			'time_to_target',
			'hvac_mode',
			'previous_hvac_mode',
			'fan_timer_duration'
		],
		metric: [
			'target_temperature_c',
			'target_temperature_high_c',
			'target_temperature_low_c',
			'eco_temperature_high_c',
			'eco_temperature_low_c',
			'away_temperature_high_c',
			'away_temperature_low_c',
			'ambient_temperature_c',
			'locked_temp_min_c',
			'locked_temp_max_c',
			'humidity'
		],
		imperial: [
			'target_temperature_f',
			'target_temperature_high_f',
			'target_temperature_low_f',
			'eco_temperature_high_f',
			'eco_temperature_low_f',
			'away_temperature_high_f',
			'away_temperature_low_f',
			'ambient_temperature_f',
			'locked_temp_min_f',
			'locked_temp_max_f',
			'humidity'
		]
	},
	smoke_co_alarms: {
		basic: [
			'device_id',
			'software_version',
			'structure_id',
			'where_id',
			'where_name',
			'name',
			'name_long',
			'is_online'
		],
		state: [
			'is_manual_test_active',
			'locale',
			'last_connection',
			'battery_health',
			'co_alarm_state',
			'smoke_alarm_state',
			'last_manual_test_time',
			'ui_color_state'
		]
	},
	cameras: {
		basic: [
			'device_id',
			'software_version',
			'structure_id',
			'where_id',
			'where_name',
			'name',
			'name_long',
			'is_online'
		],
		state: [
			'is_streaming',
			'is_audio_input_enabled',
			'is_video_history_enabled',
			'is_public_share_enabled',
			'web_url',
			'app_url',
			'public_share_url',
			'snapshot_url',
			'activity_zones'
		],
		last_state: [
			'has_sound',
			'has_motion',
			'has_person',
			'start_time',
			'end_time',
			'urls_expire_time',
			'web_url',
			'app_url',
			'image_url',
			'animated_image_url',
			'activity_zone_ids'
		]
	}
};

const settings = {
	Username: '',
	Password: ''
};

class Nest extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 's7webapi'
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
		this.systemConfig = {};
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
		// objects with nest
		var obj = this.config.devices;
		this.log.debug('obj config ' + JSON.stringify(obj));
		if (!this.config.devices) {
			this.log.warn('No config defined');
			return;
		}

		typeobjects['thermostats'] = [];
		typeobjects['smoke_co_alarms'] = [];
		typeobjects['cameras'] = [];

		for (var anz in obj) {
			var nestobject = obj[anz].id;
			var nestname = obj[anz].name;
			var nesttype = obj[anz].type;

			this.log.debug('werte ' + nestobject + ' named ' + nestname);

			//thermostats anlegen
			if (nesttype === 'thermostats') {
				typeobjects['thermostats'].push(nestobject);
				this.defineObject(nesttype, nestobject, nestname); //type, id, name
				/*
				this.setObject(this.namespace + '.thermostat', {
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
			if (nesttype === 'smoke_co_alarms') {
				typeobjects['smoke_co_alarms'].push(nestobject);
				this.defineObject(nesttype, nestobject, nestname); //type, id, name
				/*
				this.setObject(this.namespace + '.smoke', {
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
			if (nesttype === 'cameras') {
				typeobjects['cameras'].push(nestobject);
				this.defineObject(nesttype, nestobject, nestname); //type, id, name
				/*
				this.setObject(this.namespace + '.cameras', {
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

		var token = this.config.access_token;

		//initial setup
		this.getUpdate(token);

		//streamed data updates
		this.startStreaming(token);
		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync('admin', 'iobroker');
		this.log.info('check user admin pw iobroker: ' + result);

		result = await this.checkGroupAsync('admin', 'admin');
		this.log.info('check group user admin group admin: ' + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	async onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			await this.plc.logout();
			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.messagebox" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	/*
	onMessage(obj) {
		if (typeof obj === 'object' && obj.message) {
			if (obj.command === 'send') {
				// e.g. send email or pushover or whatever
				this.log.info('send command');

				// Send response in callback if required
				if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
			}
		}

	}
	*/
	defineObject(type, id, name) {
		//Überschrift
		this.log.info('nest setting up object = ' + type + '  ' + id);
		this.setObject(this.namespace + '.' + type + '.' + id, {
			type: 'channel',
			common: {
				name: name,
				role: 'sensor'
			},
			native: {
				addr: id
			}
		});

		// states for the basic values
		var nameObjectType = nameObjects[type];
		var objects = nameObjectType['basic'];
		for (var s = 0; s < objects.length; s++) {
			if (!stateObjects[objects[s]]) {
				this.log.error('State ' + objects[s] + ' unknown');
				continue;
			}
			var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
			if (!obj) {
				this.log.error('Unknown state: ' + objects[s]);
				continue;
			}
			this.log.debug('obj anlegen  ' + JSON.stringify(obj));
			this.setObjectNotExists(this.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
		}

		// states for the state values
		var objects = nameObjectType['state'];
		for (var s = 0; s < objects.length; s++) {
			if (!stateObjects[objects[s]]) {
				this.log.error('State ' + objects[s] + ' unknown');
				continue;
			}
			var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
			if (!obj) {
				this.log.error('Unknown state: ' + objects[s]);
				continue;
			}
			this.log.debug('obj anlegen  ' + JSON.stringify(obj));
			this.setObjectNotExists(this.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
		}

		// states for the thermostat values
		if (type === 'thermostats') {
			// imperial

			// metric
			var objects = nameObjectType['metric'];
			for (var s = 0; s < objects.length; s++) {
				if (!stateObjects[objects[s]]) {
					this.log.error('State ' + objects[s] + ' unknown');
					continue;
				}
				var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
				if (!obj) {
					this.log.error('Unknown state: ' + objects[s]);
					continue;
				}
				this.log.debug('obj anlegen  ' + JSON.stringify(obj));
				this.setObjectNotExists(this.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
			}
		}

		//states for the camera values
		if (type === 'cameras') {
			// laststate
			var objects = nameObjectType['last_state'];
			for (var s = 0; s < objects.length; s++) {
				if (!stateObjects[objects[s]]) {
					this.log.error('State ' + objects[s] + ' unknown');
					continue;
				}
				var obj = JSON.parse(JSON.stringify(stateObjects[objects[s]]));
				if (!obj) {
					this.log.error('Unknown state: ' + objects[s]);
					continue;
				}
				this.log.debug('obj anlegen  ' + JSON.stringify(obj));
				this.setObjectNotExists(this.namespace + '.' + type + '.' + id + '.' + objects[s], obj);
			}
		}
	}

	updateDevices(object) {
		var list = object;
		var types = Object.keys(list.devices);
		for (var i in types) {
			this.log.debug('types ' + types[i]);
			var typeids = Object.keys(list.devices[types[i]]); //muß ohne . sein types[i], steht für .thermostats, .cameras .smoke_co_alarms
			this.log.debug('typeids ' + typeids);
			for (var j in typeids) {
				this.log.debug('id ' + typeids[j]);
				this.log.debug('name ' + list.devices[types[i]][typeids[j]].where_name); //wieder ohne ., hier stehen die kryptischen Ids
				var objectdata = Object.keys(list.devices[types[i]][typeids[j]]);
				for (var k in objectdata) {
					//if (nameObjects[types[i]].hasOwnproperty(objectdata[k])){
					this.log.debug(
						'value set ' +
							types[i] +
							'.' +
							typeids[j] +
							'.' +
							objectdata[k] +
							' wert ' +
							list.devices[types[i]][typeids[j]][objectdata[k]]
					);
					this.setState(this.namespace + '.' + types[i] + '.' + typeids[j] + '.' + objectdata[k], {
						val: list.devices[types[i]][typeids[j]][objectdata[k]],
						ack: true
					});
					//}
				}
			}
		}
	}

	getUpdate(accesstoken) {
		this.log.debug('initial data request ' + accesstoken);
		var nesturl = 'https://developer-api.nest.com';
		var nesturl2 = nesturl + '?auth=' + accesstoken;

		var options = {
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accesstoken }
		};

		request(nesturl, options, function(err, resp, body) {
			this.log.debug('status' + resp.statusCode + '  ' + resp.statusMessage);
			this.log.debug('body ' + body);
			if (resp.statusCode == 200) {
				this.log.debug(body);
				var list = JSON.parse(body);
				updateDevices(list);
			} else {
				this.log.debug('error ' + err + resp);
			}
		});
	}

	startStreaming(token) {
		const NEST_API_URL = 'https://developer-api.nest.com';

		var headers = {
			Authorization: 'Bearer ' + token
		};
		var source = new EventSource(NEST_API_URL, { headers: headers });

		source.addEventListener('put', function(event) {
			this.log.debug('\n' + event.data); // Nest data in JSON format
			this.log.debug('device' + JSON.stringify(JSON.parse(event.data).data));
			var stream = JSON.parse(event.data);
			if (stream.data) {
				updateDevices(stream.data);
			}
		});

		source.addEventListener('open', function(event) {
			this.log.debug('Connection opened!');
		});

		source.addEventListener('auth_revoked', function(event) {
			this.log.debug('Authentication token was revoked.');
			// Re-authenticate your user here.
		});

		source.addEventListener(
			'error',
			function(event) {
				if (event.readyState == EventSource.CLOSED) {
					this.log.error('Connection was closed!', event);
				} else {
					this.log.error('An unknown error occurred: ', event);
				}
			},
			false
		);
	}
}
if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Nest(options);
} else {
	// otherwise start the instance directly
	new Nest();
}
