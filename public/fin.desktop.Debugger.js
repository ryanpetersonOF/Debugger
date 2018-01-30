
fin.desktop.main(() => {
    console.log("Preload: fin.desktop.Debugger.js Loading");

    var _debuggerMyUUID = fin.desktop.Application.getCurrent().uuid;
   
    fin.desktop.InterApplicationBus.subscribe("Debugger-Main", "Debugger-App-Pulse", ()=>{
        fin.desktop.InterApplicationBus.send("Debugger-Main", "Debugger-Init", {});
    });

    function _timestamp(){
        let now = new Date();
        return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    }

    // define a new console
    (function () {
        var _log = console.log;
        var _error = console.error;
        var _warning = console.warn;
        var _info = console.info;

        console.error = function (text) {
            _error.apply(console, arguments);

            fin.desktop.InterApplicationBus.send("Debugger-Main", "Debugger-Application-log-" + _debuggerMyUUID, { type: "ERROR", value: text, timestamp: _timestamp() });
        };

        console.log = function (text) {
            // Do something with the log message
            _log.apply(console, arguments);
            fin.desktop.InterApplicationBus.send("Debugger-Main", "Debugger-Application-log-" + _debuggerMyUUID, { type: "LOG", value: text, timestamp: _timestamp() });

        };

        console.warn = function (text) {
            // do something with the warn message
            _warning.apply(console, arguments);
            fin.desktop.InterApplicationBus.send("Debugger-Main", "Debugger-Application-log-" + _debuggerMyUUID, { type: "WARN", value: text, timestamp: _timestamp() });

        };

        console.info = function (text) {
            _info.apply(console, arguments);
            fin.desktop.InterApplicationBus.send("Debugger-Main", "Debugger-Application-log-" + _debuggerMyUUID, { type: "INFO", value: text, timestamp: _timestamp() });
        }

    })();


    console.log("Preload: fin.desktop.Debugger.js Loaded!");
});
