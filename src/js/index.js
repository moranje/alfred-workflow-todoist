#!/usr/bin/env node
// Author: M. Oranje
// Licence: MIT

var calls = require('./calls');

var call = process.argv[2];
var args = process.argv.slice(3);

/**
 * This returns the call to the Todoist API
 */
calls[call].apply(this, args);
