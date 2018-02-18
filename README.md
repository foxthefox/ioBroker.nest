![Logo](admin/nest_logo.jpg)
# ioBroker.nest

[![NPM version](http://img.shields.io/npm/v/iobroker.nest.svg)](https://www.npmjs.com/package/iobroker.nest)
[![Downloads](https://img.shields.io/npm/dm/iobroker.nest.svg)](https://www.npmjs.com/package/iobroker.nest)
[![Build Status](https://travis-ci.org/foxthefox/ioBroker.nest.svg?branch=master)](https://travis-ci.org/foxthefox/ioBroker.nest)

[![NPM](https://nodei.co/npm/iobroker.nest.png?downloads=true)](https://nodei.co/npm/iobroker.nest/)

adapter for NEST devices like NEST-thermostat, NEST-protect, NEST-camera

## Installation:
Installation requires nodejs v4 at minimum

from npm
```javascript
npm install iobroker.nest
```
actual version from github (this might not every time work, when development is in progress)
```javascript
npm install https://github.com/foxthefox/ioBroker.nest/tarball/master --production
```

## Settings
* set your access_token and save the adapter (not save and close)
* Press the search button for discovery.  


## available Objects
The following objects are currently implemented:
* thermostat
* protect
* camera

## ToDo
* creation of access_token from client_id/client_secret/pin
* commands for thermostat

## Changelog
#### 0.0.1
* initial release only reading status of all devices
