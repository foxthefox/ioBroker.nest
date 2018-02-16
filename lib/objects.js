module.exports = {

    target_temperature_c: {
        common: {
            type: 'number',
            role: 'level.temperature',
            name: 'target_temperature',
            unit: '°C',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    target_temperature_f: {
        common: {
            type: 'number',
            role: 'level.temperature',
            name: 'target_temperature',
            unit: '°F',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    target_temperature_high_c: {
        common: {
            type: 'number',
            role: 'level.temperature',
            name: 'target_temperature_high',
            unit: '°C',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    target_temperature_high_f: {
        common: {
            type: 'number',
            role: 'level.temperature',
            name: 'target_temperature_high',
            unit: '°F',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    target_temperature_low_c: {
        common: {
            type: 'number',
            role: 'level.temperature',
            name: 'target_temperature_low',
            unit: '°C',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    target_temperature_low_f: {
        common: {
            type: 'number',
            role: 'level.temperature',
            name: 'target_temperature_low',
            unit: '°F',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    eco_temperature_high_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'eco_temperature_high',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    eco_temperature_high_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'eco_temperature_high',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    eco_temperature_low_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'eco_temperature_low',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    eco_temperature_low_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'eco_temperature_low',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    away_temperature_high_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'away_temperature_high',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    away_temperature_high_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'away_temperature_high',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    away_temperature_low_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'away_temperature_low',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    away_temperature_low_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'away_temperature_low',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    ambient_temperature_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'away_temperature',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    ambient_temperature_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'ambient_temperature',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    locked_temp_max_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'locked_temperature_max',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    locked_temp_max_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'locked_temperature_max',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    locked_temp_min_f: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'locked_temperature_min',
            unit: '°F',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    locked_temp_min_c: {
        common: {
            type: 'number',
            role: 'value.temperature',
            name: 'locked_temperature_min',
            unit: '°C',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    humidity: {
        common: {
            type: 'number',
            role: 'value.humidity',
            name: 'humidity',
            unit: '%',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    fan_timer_duration: {
        common: {
            type: 'number',
            role: 'level',
            name: 'fan_timer_duration',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },


    fan_timer_active: {
        common: {
            type: 'boolean',
            role: 'switch',
            name: 'fan_timer_active',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_streaming: {
        common: {
            type: 'boolean',
            role: 'switch',
            name: 'is_streaming',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_online: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_online',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    has_sound: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'has_sound',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    has_motion: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'has_motion',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    has_person: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'has_person',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_audio_input_enabled: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_audio_input_enabled',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_video_history_enabled: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_video_history_enabled',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_public_share_enabled: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_public_share_enabled',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_manual_test_active: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_manual_test_active',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    can_cool: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'can_cool',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    can_heat: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'can_heat',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_using_emergency_heat: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_using_emergency_heat',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    has_leaf: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'has_leaf',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    is_locked: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'is_locked',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    has_fan: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'has_fan',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    sunlight_correction_enabled: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'sunlight_correction_enabled',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    sunlight_correction_active: {
        common: {
            type: 'boolean',
            role: 'indicator',
            name: 'sunlight_correction_active',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    activity_zone_ids: {
        common: {
            type: 'string',
            role: 'json',
            name: 'activity_zone_ids',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    activity_zones: {
        common: {
            type: 'string',
            role: 'json',
            name: 'activity_zones',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    software_version: {
        common: {
            type: 'string',
            role: 'text',
            name: 'software_version',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    structure_id: {
        common: {
            type: 'string',
            role: 'text',
            name: 'structure_id',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    where_id: {
        common: {
            type: 'string',
            role: 'text',
            name: 'where_id',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    where_name: {
        common: {
            type: 'string',
            role: 'text',
            name: 'where_name',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    name: {
        common: {
            type: 'string',
            role: 'text',
            name: 'name',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    name_long: {
        common: {
            type: 'string',
            role: 'text',
            name: 'name_long',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    web_url: {
        common: {
            type: 'string',
            role: 'text.url',
            name: 'web_url',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    app_url: {
        common: {
            type: 'string',
            role: 'text.url',
            name: 'app_url',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    image_url: {
        common: {
            type: 'string',
            role: 'text.url',
            name: 'image_url',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    animated_image_url: {
        common: {
            type: 'string',
            role: 'text.url',
            name: 'animated_image_url',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    public_share_url: {
        common: {
            type: 'string',
            role: 'text.url',
            name: 'public_share_url',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    snapshot_url: {
        common: {
            type: 'string',
            role: 'text.url',
            name: 'snapshot_url',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    start_time: {
        common: {
            type: 'string',
            role: 'text',
            name: 'start_time',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    end_time: {
        common: {
            type: 'string',
            role: 'text',
            name: 'end_time',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    urls_expire_time: {
        common: {
            type: 'string',
            role: 'text',
            name: 'urls_expire_time',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    device_id: {
        common: {
            type: 'string',
            role: 'text',
            name: 'device_id',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },  
    
    
    locale: {
        common: {
            type: 'string',
            role: 'text',
            name: 'locale',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    }, 
    
    hvac_state: {
        common: {
            type: 'string',
            role: 'text',
            name: 'hvac_state',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    
    hvac_mode: {
        common: {
            type: 'string',
            role: 'level',
            name: 'hvac_mode',
            write: true,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    
    label: {
        common: {
            type: 'string',
            role: 'text',
            name: 'label',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },
    
    time_to_target: {
        common: {
            type: 'string',
            role: 'text',
            name: 'time_to_target',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    time_to_target_training: {
        common: {
            type: 'string',
            role: 'text',
            name: 'time_to_target_training',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    fan_timer_timeout: {
        common: {
            type: 'string',
            role: 'text',
            name: 'fan_timer_timeout',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    last_connection: {
        common: {
            type: 'string',
            role: 'text',
            name: 'last_connection',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    previous_hvac_mode: {
        common: {
            type: 'string',
            role: 'text',
            name: 'previous_hvac_mode',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    fan_timer_duration: {
        common: {
            type: 'string',
            role: 'text',
            name: 'fan_timer_duration',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    temperature_scale: {
        common: {
            type: 'string',
            role: 'text',
            name: 'temperature_scale',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    last_manual_test_time: {
        common: {
            type: 'string',
            role: 'text',
            name: 'last_manual_test_time',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    ui_color_state: {
        common: {
            type: 'string',
            role: 'text',
            name: 'ui_color_state',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    battery_health: {
        common: {
            type: 'string',
            role: 'text',
            name: 'battery_health',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    co_alarm_state: {
        common: {
            type: 'string',
            role: 'text',
            name: 'co_alarm_state',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    },

    smoke_alarm_state: {
        common: {
            type: 'string',
            role: 'text',
            name: 'smoke_alarm_state',
            write: false,
            read: false
        },
        native: {
        },
        type: 'state'
    }

};
