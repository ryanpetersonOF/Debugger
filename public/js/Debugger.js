class Debugger {

    constructor() {
        // Singleton Pattern
        if (self._debuggerInstance) {
            return self._debuggerInstance;
        }

        this.appList = [];

        this.grid = new Grid();

        this.subscribeToTopic();

        this.discoverRunningApplications();

        fin.desktop.System.addEventListener('application-created', (event) => {
            if(!this.getApplication(event.uuid)){
                this.appList.push(new Application(event.uuid));
            } else {
                this.removeApplication(this.getApplication(event.uuid));
                this.appList.push(new Application(event.uuid));
            }
        });

        fin.desktop.System.addEventListener('application-closed', (event) => {
            //this.removeApplication(this.getApplication(event.uuid));
        });

        //Dirty Singleton Pattern for lack of better alternative
        self._debuggerInstance = this;

        return this;
    }

    // Discovers any Applications and their windows which launched prior to the Debugger instance
    discoverRunningApplications() {
        return new Promise((resolve, reject) => {
            fin.desktop.System.getAllApplications((applicationInfoList) => {
                applicationInfoList.forEach((app) => {
                    if (app.isRunning) {

                        let _debuggerApp;
                        
                        if(this.getApplication(app.uuid)){
                            _debuggerApp = this.getApplication(app.uuid);
                        } else {
                            _debuggerApp = new Application(app.uuid);
                            this.appList.push(_debuggerApp);
                        }

                        fin.desktop.Application.wrap(app.uuid).getChildWindows(function (children) {
                            children.forEach(function (childWindow) {
                                if(_debuggerApp.getChild(childWindow.name)){
                                    return;
                                }

                                _debuggerApp.addChild(childWindow.name);
                            });
                        });
                    }
                });
                resolve(applicationInfoList);
            });
        });
    }

    // Subscribes to IAB Topics
    subscribeToTopic() {

        //Return Message from the Preload Script, started from Window.pulse();
        fin.desktop.InterApplicationBus.subscribe("*", "Debugger-Init", (message, uuid, name) => {
            try{
                this.getApplication(uuid).getChild(name).setLoggable(true);
            } catch(e){
                
            }
        });

    }

    getApplication(uuid) {
        return this.appList.find((app) => { return app.app.uuid == uuid });
    }

    get getApplications() {
        return this.appList;
    }

    get getGrid() {
        return this.grid;
    }

    // Removes Application DOM and removes from known Children
    removeApplication(app) {
        app.removeSelf();

        var i = this.appList.indexOf(app)
        if (i != -1) {
            this.appList.splice(i, 1);
        }
    }

    // Singleton pattern to get instance
    static get getInstance() {
        if (self._debuggerInstance) {
            return self._debuggerInstance
        } else {
            return new Debugger();
        }
    }
}