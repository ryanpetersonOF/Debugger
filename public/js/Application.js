class Application {
    constructor(uuid) {

        this.uuid = uuid;
        this.app = fin.desktop.Application.wrap(this.uuid);
        this.name = this.app.name || this.app.window.name;
        this.DOM = {
            button: {},
            CSS: {}
        };
        this.children = [];
        this.addToDOM();
        this.subscribeToTopic();

        // Adds main window as child, designating as main window
        this.addChild(this.name, true);

        // Tracks when child windows are created
        this.app.addEventListener('window-created', (event) => {
            if(this.getChild(event.name)){
                this.removeChild(event.name);
                this.addChild(event.name);
            } else {
                this.addChild(event.name);
            }
        });

        //Tracks when window is loaded to fire pulse()
        this.app.addEventListener('window-end-load', (event) => {
            // Timeout needed as the preload is not accepting items yet.  
            setTimeout(() => {
                this.getChild(event.name).pulse();
            }, 2000);
        });

        // Tracks when a child window has closed
        this.app.addEventListener('window-closed', (event) => {
            this.getChild(event.name).offline();
            //this.removeChild(event.name);
        });

        return this;
    }

    subscribeToTopic() {
        fin.desktop.InterApplicationBus.subscribe("*", "Debugger-Application-log-" + this.uuid, (message, uuid, name) => {
            let child = this.getChild(name);
            child.setLoggable(true);

            if (typeof message.value == 'object') {
                message.value = JSON.stringify(message.value);
            }

            child.write(message);

            let gridMessageConstruct = {
                application: this.name,
                window: child.getName
            }

            let gridMessage = Object.assign(message, gridMessageConstruct);
            Debugger.getInstance.getGrid.add(gridMessage);
        });
    }

    // Constructs DOM Elements for the Application.  Child DOM elements are created in their class.
    addToDOM() {
        /*
            DOM INDEX
            * wrap: class="_DebuggerAppWrap": div wrapper containing all elements for this application
            * app_header: class="_DebuggerAppHeader": div container app Header (app UUID);
            * children: class="_DebuggerAppChildren": div wrapper containing all elements of the child windows
            * children_header: class="_DebuggerAppChildrenHeader": div containing child area Header ("Windows");
            * button.*: class="_DebuggerAppButton": Button elements for various actions

        */

        this.DOM.CSS.wrap = "_DebuggerAppWrap";
        this.DOM.CSS.appHeader = "_DebuggerAppHeader";
        this.DOM.CSS.children = "_DebuggerAppChildren";
        this.DOM.CSS.childrenHeader = "_DebuggerAppChildrenHeader";
        this.DOM.CSS.button = "_DebuggerAppButton";

        this.DOM.wrap = $(`<div></div>`).addClass(this.DOM.CSS.wrap);

        this.DOM.app_header = $(`<div>${this.uuid}</div>`).addClass(this.DOM.CSS.appHeader);

        this.DOM.children = $(`<div></div>`).addClass(this.DOM.CSS.children);
        this.DOM.children_header = $(`<div>Windows</div>`).addClass(this.DOM.CSS.childrenHeader);

        $(this.DOM.children).append(this.DOM.children_header);

        this.DOM.button.devTools = $(`<button>Dev Tools</button>`)
            .addClass(this.DOM.CSS.button)
            .click(() => {
                fin.desktop.System.showDeveloperTools(this.uuid, this.name, () => { }, (e) => { console.log(e) });
            });

        this.DOM.button.restart = $(`<button>Restart</button>`)
            .addClass(this.DOM.CSS.button)
            .click(() => {
                this.app.restart();
            });

        $(this.DOM.wrap).append(this.DOM.app_header);
        $(this.DOM.wrap).append(this.DOM.button.devTools);
        $(this.DOM.wrap).append(this.DOM.button.restart);
        $(this.DOM.wrap).append(this.DOM.children);

        $("#_DebuggerApps").append(this.DOM.wrap);
    }

    // Adds a new Window to be tracked to the application. AKA "child"
    addChild(name, isMain = false) {
        if (this.getChild(name)) {
            return;
        }

        this.children.push(new Window(this, name, isMain));
    }

    //Removes child DOM and removes from known children
    removeChild(name) {
        this.removeSelf.bind(this.getChild(name))();
        this.children.splice(this.children.findIndex((child) => { return name == child.window.name }), 1);
    }

    // Finds and returns a child (window) based on name, because names are unique
    getChild(name) {
        return this.children.find((child) => { return name == child.getName });
    }

    get getChildren(){
        return this.children;
    }

    // Returns App Manifest, unless new Application is used
    // http://cdn.openfin.co/jsdocs/stable/fin.desktop.Application.html#getManifest
    retrieveManifest() {
        return new Promise((resolve, reject) => {
            this.app.getManifest((manifest) => {
                this.manifest = manifest;
                console.log("got Manifest!");
                resolve(manifest);
            }, () => {
                reject("App created from new Application - No Manifest Available");
            });
        });
    }



    // Removes self DOM elements
    removeSelf() {
        this.DOM.wrap.remove();

        /*
        this.getChildren.forEach((child) => {
            child.offline();
        });*/
    }

    get getName(){
        return this.name;
    }
    
    get getUUID() {
        return this.uuid;
    }

    get getManifest() {
        return this.manifest;
    }

    get getDOM() {
        return this.DOM;
    }
}