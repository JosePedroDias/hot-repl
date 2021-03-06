'use strict';

var net  = require('net'),
    repl = require('repl'),
    vm   = require('vm');


var hotRepl = function(ST, FN, tcpPort, debug) {
    // check arguments
    if (typeof ST !== 'object') {
        throw 'first argument ST must be an object!';
    }

    if (typeof FN !== 'object') {
        throw 'secound argument FN must be an object!';
    }

    if (tcpPort === undefined) {
        tcpPort = 5566;
    }
    else if (typeof tcpPort === 'number' && tcpPort % 1 === 0) {
    }
    else {
        throw 'third argument tcpPort is an optional natural number. Defaults to 5566 if ommitted.';
    }


    var sandbox = {
        ST: ST,
        FN: FN
    };

    // expose global stuff in our context
    for (var k in global) {
        sandbox[k] = global[k];
    }

    var context = vm.createContext(sandbox);

    net.createServer(function(socket) {
        if (debug) { console.log('CLIENT CONNECTED'); }
        repl.start({
            prompt:    '> ',
            input:     socket,
            output:    socket,
            useGlobal: false,
            terminal:  false,
            eval: function(code, _context_, fn, cb) {
                try {
                    var res= vm.runInContext(code, context, 'dynamic.vm');
                    cb(null, res);
                } catch (ex) {
                    cb(null, 'ERROR:\n'+ex);
                }
            }
        }).on('exit', function() {
            if (debug) { console.log('CLIENT DISCONNECTED'); }
            socket.end();
        });
    }).listen(tcpPort);

    if (debug) { console.log('RUNNING REPL ON PORT ' + tcpPort + '...'); }
};

module.exports = hotRepl;
