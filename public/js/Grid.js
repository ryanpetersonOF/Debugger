class Grid {
    constructor() {
        this.grid;
        this.api;
        this.addGrid();
        this.numRows = 0;
        this.filterModel = [];

        return this;
    }

    add(message) {
        ++this.numRows;
        let data = [{
            id: this.numRows.toString(),
            time: message.timestamp,
            application: message.application,
            window: message.window,
            level: message.type,
            value: message.value
        }];

        this.api.api.updateRowData({ add: data });
        this.updateFilter();

        this.autoSizeColumns();
    }

    filter(filter) {
        Debugger.getInstance.getGrid.api.api.getFilterInstance('id').fire(filter)
    }

    updateFilter() {
        let list = [];

        this.filterModel = [];
        Debugger.getInstance.getApplications.forEach((app) => {
            let o = { app: app.getName };
            app.getChildren.forEach((window) => {
                let o2 = Object.assign({}, o);
                o2.window = window.getName;
                o2.filters = window.getFilters;

                this.filterModel.push(o2);
            });
        });

        this.api.api.forEachNode((rowNode) => {
            this.filterModel.forEach((app) => {
                if (app.app == rowNode.data.application) {
                    if (app.window == rowNode.data.window) {
                        let t = rowNode.data.level;
                        if (app.filters[t]) {
                            list.push(rowNode.data.id);
                        }
                    }
                }
            });
        });

        this.filter(list);
    }

    addGrid() {
        let that = this;
        //creates idFilter for id filtering.  Required for toggle log types
        function idFilter() {
        }

        idFilter.prototype.init = function (params) {
            this.valueGetter = params.valueGetter;
            this.filterText = null;
            this.p = params;
            //this.setupGui(params);
        };

        idFilter.prototype.fire = function(v){
            this.filterText = v;
            this.p.filterChangedCallback();
        }

        //no filter gui needed!
        idFilter.prototype.getGui = function () {
            return "<div></div>";
        };

        idFilter.prototype.doesFilterPass = function (params) {
            // make sure each word passes separately, ie search for firstname, lastname
            var passed = false;
            var valueGetter = this.valueGetter;
            var value = valueGetter(params);

            this.filterText.forEach(function (filterWord) {
                
                if (value == filterWord) {
                    passed = true;
                }
            });

            return passed;
        };


        idFilter.prototype.isFilterActive = function () {
            return this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
        };

        idFilter.prototype.getModel = function () {
            var model = { value: this.filterText.value };
            return model;
        };

        idFilter.prototype.setModel = function (model) {
            this.eFilterText.value = model.value;
        };

        let eGridDiv = document.querySelector('#_DebuggerGrid');

        let columnDefs = [
            { headerName: "#", field: "id", minWidth: 60, filter: idFilter},
            { headerName: "Time", field: "time", minWidth: 60 },
            { headerName: "Level", field: "level", minWidth: 69 },
            { headerName: "Application", field: "application", minWidth: 60 },
            { headerName: "Window", field: "window", minWidth: 60 },
            { headerName: "Value", field: "value", minWidth: 50 },
        ];

        let gridOptions = {
            enableColResize: true,
            columnDefs: columnDefs,
            onGridReady: that.onGridReady.bind(that),
            enableSorting: true,
            enableFilter: true,
            enableRangeSelection: true,
            rowSelection: 'multiple',
            rowHeight: 25,
            headerHeight: 50,
            rowClassRules: {
                '_debuggerErrorType-log': (params) => {return params.data.level == "LOG"},
                '_debuggerErrorType-warn': (params) => {return params.data.level == "WARN"},
                '_debuggerErrorType-info': (params) => {return params.data.level == "INFO"},
                '_debuggerErrorType-error': (params) => {return params.data.level == "ERROR"}
                
            }
        };

        this.grid = new agGrid.Grid(eGridDiv, gridOptions);
        this.api = gridOptions;
    }

    onGridReady(){
        this.autoSizeColumns();
    }

    autoSizeColumns(){
        let allColumnIds = [];
        this.api.columnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.api.columnApi.autoSizeColumns(allColumnIds);
    }

}