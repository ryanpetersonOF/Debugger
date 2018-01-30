class Window {
    constructor(app, name, isMain = false) {
        this.window = fin.desktop.Window.wrap(app.uuid, name);
        this.app = app;
        this.name = name;
        this.DOM = {
            button: {},
            CSS: {},
            filters: {}
        };
        this.filters = {
            LOG: true,
            INFO: true,
            WARN: true,
            ERROR: true
        }
        this.loggable = false;
        this.logging = true;
        this.isMain = isMain;
        this.addToDOM();

        return this;
    }

    offline(){
        this.DOM.button.wrap.hide();
    }

    online(){
        this.DOM.button.wrap.show();
    }

    // If the pulse() (preload) is present then we will receive console logs, so we display the DOM list
    setLoggable(logging) {
        this.loggable = logging;

        if (logging) {
            //this.DOM.list.show();
        }
    }

    //Adds DOM elements
    addToDOM() {
        /*
        DOM INDEX
        * wrap: class="_DebuggerAppChildWrap": div wrapper containing all elements for this application
        * list:  class="_DebuggerAppChildList": a UL to which logs (li) are appended to
        * button.*: class="_DebuggerAppChildButton": Button elements for various actions
        * header: class="_DebuggerAppChildHeader": Header for the child window (name);

        */
        let that = this;

        let txt = "Window: ";
        if (this.isMain) {
            txt = "Main Window: ";
        }

        this.DOM.CSS.wrap = "_DebuggerAppChildWrap";
        this.DOM.CSS.list = "_DebuggerAppChildList";
        this.DOM.CSS.button = "_DebuggerAppChildButton";
        this.DOM.CSS.button_wrap = "_DebuggerAppChildButtonWrap";
        this.DOM.CSS.header = "_DebuggerAppChildHeader";

        this.DOM.wrap = $(`<div></div>`).addClass(this.DOM.CSS.wrap);
        this.DOM.list = $(`<ul></ul>`).addClass(this.DOM.CSS.list).hide();
        this.DOM.header = $(`<div>${txt} ${this.name}</div>`).addClass(this.DOM.CSS.header);
        this.DOM.button.wrap = $(`<div></div>`).addClass(this.DOM.CSS.button_wrap);

        function generateDOMCheckbox(key){
            let r = Math.random() * 100;

            return $(`<input type="checkbox"checked id="${r}"/><label class="test" for="${r}">${key}</label>`)
            .change(function() {
                console.log($(this).prop('checked'));
                if ($(this).prop('checked')) {
                    that.filters[key] = true;
                } else {
                    that.filters[key] = false;
                }

                Debugger.getInstance.getGrid.updateFilter();
            });
        }

        this.DOM.button.hide = $(`<button>Hide</button>`)
            .addClass(this.DOM.CSS.button)
            .click(() => {
                this.window.hide();
            });

        this.DOM.button.show = $(`<button>Show</button>`)
            .addClass(this.DOM.CSS.button)
            .click(() => {
                this.window.show();
            });

        this.DOM.button.close = $(`<button>Close</button>`)
            .addClass(this.DOM.CSS.button)
            .click(() => {
                this.window.close();
            });

        
        this.DOM.filters.log = generateDOMCheckbox("LOG");
        this.DOM.filters.info = generateDOMCheckbox("INFO");
        this.DOM.filters.warn = generateDOMCheckbox("WARN");
        this.DOM.filters.error = generateDOMCheckbox("ERROR");

        $(this.DOM.wrap).append(this.DOM.header);

        $(this.DOM.button.wrap).append(this.DOM.button.hide).append(this.DOM.button.show).append(this.DOM.button.close);
        $(this.DOM.wrap).append(this.DOM.button.wrap);

        $(this.DOM.wrap).append(this.DOM.filters.log).append(this.DOM.filters.info).append(this.DOM.filters.warn).append(this.DOM.filters.error);

        $(this.DOM.wrap).append(this.DOM.list);

        //Append it all to the owner Applications child DOM area
        $(this.app.getDOM.children).append(this.DOM.wrap);
    }

    // Writes log messages
    write(message) {
        if (this.logging) {

            //Debugger.getInstance.write(message);
            this.DOM.list.append($(`<li>[${message.timestamp}] [${message.type}]: ${message.value}</li>`).addClass(`_debuggerErrorType-${message.type}`));
        }
    }

    // Sends IAB to real child window to check if preload is active.
    // If it is then the preload will send back IAB to Debugger class.
    pulse() {
        fin.desktop.InterApplicationBus.send(this.app.uuid, this.name, "Debugger-App-Pulse", {});
    }

    get getFilters(){
        return this.filters;
    }

    get getName() {
        return this.name;
    }

    get getDOM() {
        return this.DOM;
    }

    get getLogging() {
        return this.logging;
    }

    get getWindow() {
        return this.window;
    }

}