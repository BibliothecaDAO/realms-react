// Load environment variables
require('dotenv').config({
  path: './.env.test.local',
});

// StarkNet.js relies on TextEncoder
// polyfill TextEncoder in testEnvironment = jsdom
// if (typeof TextEncoder === 'undefined') {
//     global.TextEncoder = require('util').TextEncoder;
// }
// if (typeof TextDecoder === 'undefined') {
//     global.TextDecoder = require('util').TextDecoder;
// }
