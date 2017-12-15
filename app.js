let argv = require('yargs').argv;
global.window = undefined; // patch server render
// console.debug = console.log;
// console.log = () => {};

require("./dist/web/start.teacher")['default']();
require("./dist/web/start.user")['default']();

