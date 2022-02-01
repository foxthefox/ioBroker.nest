![Logo](admin/nest_logo.gif)
# ioBroker.nest

![Number of Installations](http://iobroker.live/badges/nest-installed.svg) ![Number of Installations](http://iobroker.live/badges/nest-stable.svg) [![NPM version](http://img.shields.io/npm/v/iobroker.nest.svg)](https://www.npmjs.com/package/iobroker.nest)

**Tests:** ![Test and Release](https://github.com/foxthefox/ioBroker.s7webapi/workflows/Test%20and%20Release/badge.svg)

adapter for NEST devices like NEST-thermostat, NEST-protect, NEST-camera

## Installation:
Installation requires nodejs v4 at minimum
ioBroker admin v3 is needed

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
## 1.0.0 BREAKING CHANGE
* the adapter does not use the old nest portal anymore
* the new google nest portal is used
* change to classbased adapter
* githubactions instead travis


#### 0.0.1
* initial release only reading status of all devices

## License

The MIT License (MIT)

Copyright (c) 2017 -2022 foxthefox <foxthefox@wysiwis.net>
