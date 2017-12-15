let argv = require('yargs').argv;
global.window = undefined; // patch server render
// console.debug = console.log;
// console.log = () => {};

let start = require("./dist/web/start.teacher")['default'];
// let start = require("./dist/web/start.user")['default'];
start();

