//var hot = require('./hot-repl');
var hot = require('hot-repl');


var ST = { // state, data that change
    a: 1,
    b: 2
};


var FN = { // functions, accessible ones. should rely solely on one another and ST members
    add: function(a, b) { return a + b; },
    atEverySecond: function() {
        console.log( FN.add(ST.a, ST.b) );
    }
};


/*ST.timer = */setInterval(FN.atEverySecond, 1000);


hot(ST, FN, 5566, true);
