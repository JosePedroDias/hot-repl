# Intro

Hot-swap aims at offering the developer a way in the app while its running, be exposing a REPL via TCP.

For it to work:

* your program must have its state unified in a state object named ST.

* all relevant functions in use must be defined in another object, named FN.

* functions defined in FN must only refer/change other FN functions and ST members.

If you respect these rules, fire hot-repl by passing it ST, FN and a port number.

Now when you run your app it will keep the TCP port opened.

If you connect to it via telnet, you can hotswap any of their members.  
That means you can turn on debug, inspect the app state, patch faulty functions, etc.



# Tutorial

The `example-server-app.js` defines ST as `{a:1, b:2}` and defines FN as the functions `add` and `atEverySecond`.

Then it sets the app to call FN.atEverySecond every 1000 ms.

add is a proper sum of arguments 1 and 2.

atEverySecond calls a with state vars a and b.

So by now you should be guessing that by calling the app you get 3 printed every second.

So now you want to change stuff, right?

Fire telnet:

    telnet 127.0.0.1 5566

then call ST

    > ST
    < {a:1, b:2}

ST is OK. Let's change a...

    > ST.a = 4
    < 4

Now the console should read 6 (4+2)

So let's now change the add function...

    > FN.add = function() { return 42; }
    < [Function]

Now the console reads 42 because its calling add which ignores its arguments and returns 42.

So how would we get rid of that repeatable task? You just assign the interval timer to a variable in ST. Then you could `clearInterval(ST.timer)`

To print stuff in the server just:

console.log('hi')

And to kill it:

process.exit(0);
