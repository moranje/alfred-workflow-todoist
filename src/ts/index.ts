#!/usr/bin/env node

import calls = require('./calls');

let call = process.argv[2];
let args = process.argv.slice(3);

/**
 * This returns the call to the Todoist API
 */
calls[call].apply(this, args);
