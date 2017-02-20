'use strict';

var _reactDom = require('react-dom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLoadMask = require('react-load-mask');

var _reactLoadMask2 = _interopRequireDefault(_reactLoadMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();

var assign = require('object-assign');

var Region = require('region');

var Column = require('./models/Column');

var PropTypes = require('./PropTypes');
var Wrapper = require('./Wrapper');
var Header = require('./Header');
var WrapperFactory = _react2.default.createFactory(Wrapper);
var HeaderFactory = _react2.default.createFactory(Header);
var ResizeProxy = require('./ResizeProxy');

var findIndexByName = require('./utils/findIndexByName');
var group = require('./utils/group');

var slice = require('./render/slice');
var _getTableProps = require('./render/getTableProps');
var getGroupedRows = require('./render/getGroupedRows');
var renderMenu = require('./render/renderMenu');

var preventDefault = require('./utils/preventDefault');

var isArray = Array.isArray;

var SIZING_ID = '___SIZING___';

function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}

function signum(x) {
    return x < 0 ? -1 : 1;
}

function emptyFn() {}

function getVisibleCount(props, state) {
    return getVisibleColumns(props, state).length;
}

function getVisibleColumns(props, state) {

    var visibility = state.visibility;
    var visibleColumns = props.columns.filter(function (c) {
        var name = c.name;
        var visible = c.visible;

        if (name in visibility) {
            visible = !!visibility[name];
        }

        return visible;
    });

    return visibleColumns;
}

function findColumn(columns, column) {

    var name = typeof column === 'string' ? column : column.name;
    var index = findIndexByName(columns, name);

    if (~index) {
        return columns[index];
    }
}

module.exports = _react2.default.createClass({

    displayName: 'ReactDataGrid',

    mixins: [require('./RowSelect')],

    propTypes: {
        loading: _react2.default.PropTypes.bool,

        //specify false if you don't want any column to be resizable
        resizableColumns: _react2.default.PropTypes.bool,

        //specify false if you don't want column menus to be displayed
        withColumnMenu: _react2.default.PropTypes.bool,
        cellEllipsis: _react2.default.PropTypes.bool,
        sortable: _react2.default.PropTypes.bool,
        loadMaskOverHeader: _react2.default.PropTypes.bool,
        idProperty: _react2.default.PropTypes.string.isRequired,

        //you can customize the column menu by specifying a factory
        columnMenuFactory: _react2.default.PropTypes.func,
        onDataSourceResponse: _react2.default.PropTypes.func,
        onDataSourceSuccess: _react2.default.PropTypes.func,
        onDataSourceError: _react2.default.PropTypes.func,

        /**
         * @cfg {Number/String} columnMinWidth=50
         */
        columnMinWidth: PropTypes.numeric,
        rowHeight: PropTypes.numeric,
        sortInfo: PropTypes.sortInfo,
        columns: PropTypes.column,

        data: function data(props, name) {
            var value = props[name];
            if (isArray(value)) {
                return new Error('We are deprecating the "data" array prop. Use "dataSource" instead! It can either be an array (for local data) or a remote data source (string url, promise or function)');
            }
        }
    },

    getDefaultProps: require('./getDefaultProps'),

    componentDidMount: function componentDidMount() {
        window.addEventListener('click', this.windowClickListener = this.onWindowClick);
    },

    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener('click', this.windowClickListener);
    },

    onWindowClick: function onWindowClick(event) {
        if (this.state.menu) {
            this.setState({
                menuColumn: null,
                menu: null
            });
        }
    },

    getInitialState: function getInitialState() {

        var props = this.props;
        var defaultSelected = props.defaultSelected;

        return {
            menuColumn: null,
            defaultSelected: defaultSelected,
            visibility: {}
        };
    },

    getRenderEndIndex: function getRenderEndIndex(props, state) {
        var rowCount = props.rowCountBuffer;
        var length = props.data.length;

        if (state.groupData) {
            length += state.groupData.groupsCount;
        }

        if (!rowCount) {
            var maxHeight;
            if (props.style && typeof props.style.height === 'number') {
                maxHeight = props.style.height;
            } else {
                maxHeight = window.screen.height;
            }
            rowCount = Math.floor(maxHeight / props.rowHeight);
        }

        var endIndex = rowCount;

        if (endIndex > length - 1) {
            endIndex = length;
        }

        return endIndex;
    },

    onDropColumn: function onDropColumn(index, dropIndex) {
        ;(this.props.onColumnOrderChange || emptyFn)(index, dropIndex);
    },

    toggleColumn: function toggleColumn(props, column) {

        var visible = column.visible;
        var visibility = this.state.visibility;

        if (column.name in visibility) {
            visible = visibility[column.name];
        }

        column = findColumn(this.props.columns, column);

        if (visible && getVisibleCount(props, this.state) === 1) {
            return;
        }

        var onHide = this.props.onColumnHide || emptyFn;
        var onShow = this.props.onColumnShow || emptyFn;

        visible ? onHide(column) : onShow(column);

        var onChange = this.props.onColumnVisibilityChange || emptyFn;

        onChange(column, !visible);

        if (column.visible == null && column.hidden == null) {
            var visibility = this.state.visibility;

            visibility[column.name] = !visible;

            this.cleanCache();
            this.setState({});
        }
    },

    cleanCache: function cleanCache() {
        //so grouped rows are re-rendered
        delete this.groupedRows;

        //clear row cache
        this.rowCache = {};
    },

    showMenu: function showMenu(menu, state) {

        state = state || {};
        state.menu = menu;

        if (this.state.menu) {
            this.setState({
                menu: null,
                menuColumn: null
            });
        }

        setTimeout(function () {
            //since menu is hidden on click on window,
            //show it in a timeout, after the click event has reached the window
            this.setState(state);
        }.bind(this), 0);
    },

    prepareHeader: function prepareHeader(props, state) {

        var allColumns = props.columns;
        var columns = getVisibleColumns(props, state);

        return (props.headerFactory || HeaderFactory)({
            resizing: state.resizing,
            columns: columns,
            allColumns: allColumns,
            columnVisibility: state.visibility,
            cellPadding: props.headerPadding || props.cellPadding,
            menuIconColor: props.menuIconColor,
            menuIcon: props.menuIcon,
            sortIcons: props.sortIcons,
            sortInfo: props.sortInfo,
            resizableColumns: props.resizableColumns,
            reorderColumns: props.reorderColumns,
            withColumnMenu: props.withColumnMenu,
            sortable: props.sortable,

            onDropColumn: this.onDropColumn,
            onSortChange: props.onSortChange,
            onMenuClick: props.onMenuClick,
            onColumnResizeDragStart: this.onColumnResizeDragStart,
            onColumnResizeDrag: this.onColumnResizeDrag,
            onColumnResizeDrop: this.onColumnResizeDrop,

            toggleColumn: this.toggleColumn.bind(this, props),
            showMenu: this.showMenu,
            menuColumn: state.menuColumn,
            columnMenuFactory: props.columnMenuFactory,
            style: {
                minWidth: props.totalColumnWidth
            }
        });
    },

    prepareFooter: function prepareFooter(props, state) {
        return (props.footerFactory || _react2.default.DOM.div)({
            className: 'z-footer-wrapper'
        });
    },

    prepareRenderProps: function prepareRenderProps(props) {
        var result = {};
        var list = {
            className: true,
            style: true
        };

        Object.keys(props).forEach(function (name) {
            // if (list[name] || name.indexOf('data-') == 0 || name.indexOf('on') === 0){
            if (list[name]) {
                result[name] = props[name];
            }
        });

        return result;
    },

    render: function render() {
        var props = this.prepareProps(this.props, this.state);

        this.p = props;

        this.data = props.data;
        this.dataSource = props.dataSource;

        var header = this.prepareHeader(props, this.state);
        var wrapper = this.prepareWrapper(props, this.state);
        var footer = this.prepareFooter(props, this.state);
        var resizeProxy = this.prepareResizeProxy(props, this.state);

        var renderProps = this.prepareRenderProps(props);

        var menuProps = {
            columns: props.columns,
            menu: this.state.menu
        };

        var loadMask;

        if (props.loadMaskOverHeader) {
            loadMask = _react2.default.createElement(_reactLoadMask2.default, { visible: props.loading });
        }

        var topToolbar;
        var bottomToolbar;

        var result = _react2.default.createElement(
            'div',
            renderProps,
            topToolbar,
            _react2.default.createElement(
                'div',
                { className: 'z-inner' },
                header,
                wrapper,
                footer,
                resizeProxy
            ),
            loadMask,
            renderMenu(menuProps),
            bottomToolbar
        );

        return result;
    },

    getTableProps: function getTableProps(props, state) {
        var table;
        var rows;

        if (props.groupBy) {
            rows = this.groupedRows = this.groupedRows || getGroupedRows(props, state.groupData);
            rows = slice(rows, props);
        }

        table = _getTableProps.call(this, props, rows);

        return table;
    },

    prepareWrapper: function prepareWrapper(props, state) {
        var data = props.data;

        var wrapperProps = assign({
            ref: 'wrapper',

            allColumns: props.columns,

            menu: state.menu,
            menuColumn: state.menuColumn,
            showMenu: this.showMenu,

            selected: props.selected == null ? state.defaultSelected : props.selected
        }, props);

        wrapperProps.columns = getVisibleColumns(props, state);
        wrapperProps.tableProps = this.getTableProps(wrapperProps, state);

        return (props.WrapperFactory || WrapperFactory)(wrapperProps);
    },

    handleRowClick: function handleRowClick(rowProps, event) {
        if (this.props.onRowClick) {
            this.props.onRowClick(rowProps.data, rowProps, event);
        }

        this.handleSelection(rowProps, event);
    },

    prepareProps: function prepareProps(thisProps, state) {
        var props = assign({}, thisProps);

        props.loading = this.prepareLoading(props);
        props.data = this.prepareData(props);
        props.dataSource = this.prepareDataSource(props);
        props.empty = !props.data.length;

        props.rowHeight = this.prepareRowHeight(props);

        props.resizableColumns = this.prepareResizableColumns(props);
        props.reorderColumns = this.prepareReorderColumns(props);

        this.prepareClassName(props);
        props.style = this.prepareStyle(props);

        this.prepareColumns(props, state);

        props.minRowWidth = props.totalColumnWidth;

        return props;
    },

    prepareLoading: function prepareLoading(props) {
        var showLoadMask = props.showLoadMask || !this.isMounted(); //ismounted check for initial load
        return props.loading == null ? showLoadMask && this.state.defaultLoading : props.loading;
    },

    prepareDataSourceCount: function prepareDataSourceCount(props) {
        return props.dataSourceCount == null ? this.state.defaultDataSourceCount : props.dataSourceCount;
    },

    /**
     * Returns true if in the current configuration,
     * the datagrid should load its data remotely.
     *
     * @param  {Object}  [props] Optional. If not given, this.props will be used
     * @return {Boolean}
     */
    isRemoteDataSource: function isRemoteDataSource(props) {
        props = props || this.props;

        return props.dataSource && !isArray(props.dataSource);
    },

    prepareDataSource: function prepareDataSource(props) {
        var dataSource = props.dataSource;

        if (isArray(dataSource)) {
            dataSource = null;
        }

        return dataSource;
    },

    prepareData: function prepareData(props) {

        var data = null;

        if (isArray(props.data)) {
            data = props.data;
        }

        if (isArray(props.dataSource)) {
            data = props.dataSource;
        }

        data = data == null ? this.state.defaultData : data;

        if (!isArray(data)) {
            data = [];
        }

        return data;
    },

    prepareResizableColumns: function prepareResizableColumns(props) {
        if (props.resizableColumns === false) {
            return false;
        }

        return props.resizableColumns || !!props.onColumnResize;
    },

    prepareReorderColumns: function prepareReorderColumns(props) {
        if (props.reorderColumns === false) {
            return false;
        }

        return props.reorderColumns || !!props.onColumnOrderChange;
    },

    prepareRowHeight: function prepareRowHeight() {
        return this.props.rowHeight == null ? this.state.rowHeight : this.props.rowHeight;
    },

    groupData: function groupData(props) {
        if (props.groupBy) {
            var data = this.prepareData(props);

            this.setState({
                groupData: group(data, props.groupBy)
            });

            delete this.groupedRows;
        }
    },

    reload: function reload() {
        if (this.dataSource) {
            return this.loadDataSource(this.dataSource, this.props);
        }
    },

    /**
     * Loads remote data
     *
     * @param  {String/Function/Promise} [dataSource]
     * @param  {Object} [props]
     */
    loadDataSource: function loadDataSource(dataSource, props) {
        props = props || this.props;

        if (!arguments.length) {
            dataSource = props.dataSource;
        }

        var dataSourceQuery = {};

        if (props.sortInfo) {
            dataSourceQuery.sortInfo = props.sortInfo;
        }

        if (typeof dataSource == 'function') {
            dataSource = dataSource(dataSourceQuery, props);
        }

        if (typeof dataSource == 'string') {
            var fetch = this.props.fetch || global.fetch;

            var keys = Object.keys(dataSourceQuery);
            if (props.appendDataSourceQueryParams && keys.length) {
                //dataSource was initially passed as a string
                //so we append quey params
                dataSource += '?' + keys.map(function (param) {
                    return param + '=' + JSON.stringify(dataSourceQuery[param]);
                }).join('&');
            }

            dataSource = fetch(dataSource);
        }

        if (dataSource && dataSource.then) {

            if (props.onDataSourceResponse) {
                dataSource.then(props.onDataSourceResponse, props.onDataSourceResponse);
            } else {
                this.setState({
                    defaultLoading: true
                });

                var errorFn = function (err) {
                    if (props.onDataSourceError) {
                        props.onDataSourceError(err);
                    }

                    this.setState({
                        defaultLoading: false
                    });
                }.bind(this);

                var noCatchFn = dataSource['catch'] ? null : errorFn;

                dataSource = dataSource.then(function (response) {
                    return response && typeof response.json == 'function' ? response.json() : response;
                }).then(function (json) {

                    if (props.onDataSourceSuccess) {
                        props.onDataSourceSuccess(json);
                        this.setState({
                            defaultLoading: false
                        });
                        return;
                    }

                    var info;
                    if (typeof props.getDataSourceInfo == 'function') {
                        info = props.getDataSourceInfo(json);
                    }

                    var data = info ? info.data : Array.isArray(json) ? json : json.data;

                    var count = info ? info.count : json.count != null ? json.count : null;

                    var newState = {
                        defaultData: data,
                        defaultLoading: false
                    };
                    if (props.groupBy) {
                        newState.groupData = group(data, props.groupBy);
                        delete this.groupedRows;
                    }

                    if (count != null) {
                        newState.defaultDataSourceCount = count;
                    }

                    this.setState(newState);
                }.bind(this), noCatchFn);

                if (dataSource['catch']) {
                    dataSource['catch'](errorFn);
                }
            }

            if (props.onDataSourceLoaded) {
                dataSource.then(props.onDataSourceLoaded);
            }
        }

        return dataSource;
    },

    componentWillMount: function componentWillMount() {
        this.rowCache = {};
        this.groupData(this.props);

        if (this.isRemoteDataSource(this.props)) {
            this.loadDataSource(this.props.dataSource, this.props);
        }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.rowCache = {};
        this.groupData(nextProps);

        if (this.isRemoteDataSource(nextProps)) {
            if (nextProps.reload) {
                this.loadDataSource(nextProps.dataSource, nextProps);
            }
        }
    },

    prepareStyle: function prepareStyle(props) {
        var style = {};

        assign(style, props.defaultStyle, props.style);

        return style;
    },

    prepareClassName: function prepareClassName(props) {
        props.className = props.className || '';
        props.className += ' ' + props.defaultClassName;

        if (props.cellEllipsis) {
            props.className += ' ' + props.cellEllipsisCls;
        }

        if (props.styleAlternateRows) {
            props.className += ' ' + props.styleAlternateRowsCls;
        }

        if (props.showCellBorders) {
            var cellBordersCls = props.showCellBorders === true ? props.showCellBordersCls + '-horizontal ' + props.showCellBordersCls + '-vertical' : props.showCellBordersCls + '-' + props.showCellBorders;

            props.className += ' ' + cellBordersCls;
        }

        if (props.withColumnMenu) {
            props.className += ' ' + props.withColumnMenuCls;
        }

        if (props.empty) {
            props.className += ' ' + props.emptyCls;
        }
    },

    ///////////////////////////////////////
    ///
    /// Code dealing with preparing columns
    ///
    ///////////////////////////////////////
    prepareColumns: function prepareColumns(props, state) {
        props.columns = props.columns.map(function (col, index) {
            col = Column(col, props);
            col.index = index;
            return col;
        }, this);

        this.prepareColumnSizes(props, state);

        props.columns.forEach(this.prepareColumnStyle.bind(this, props));
    },

    prepareColumnStyle: function prepareColumnStyle(props, column) {
        var style = column.sizeStyle = {};

        column.style = assign({}, column.style);
        column.textAlign = column.textAlign || column.style.textAlign;

        var minWidth = column.minWidth || props.columnMinWidth;

        style.minWidth = minWidth;

        if (column.flexible) {
            style.flex = column.flex || 1;
        } else {
            style.width = column.width;
            style.minWidth = column.width;
        }
    },

    prepareColumnSizes: function prepareColumnSizes(props, state) {

        var visibleColumns = getVisibleColumns(props, state);
        var totalWidth = 0;
        var flexCount = 0;

        visibleColumns.forEach(function (column) {
            column.minWidth = column.minWidth || props.columnMinWidth;

            if (!column.flexible) {
                totalWidth += column.width;
                return 0;
            } else if (column.minWidth) {
                totalWidth += column.minWidth;
            }

            flexCount++;
        }, this);

        props.columnFlexCount = flexCount;
        props.totalColumnWidth = totalWidth;
    },

    prepareResizeProxy: function prepareResizeProxy(props, state) {
        return _react2.default.createElement(ResizeProxy, { ref: 'resizeProxy', active: state.resizing });
    },

    onColumnResizeDragStart: function onColumnResizeDragStart(config) {

        var domNode = (0, _reactDom.findDOMNode)(this);
        var region = Region.from(domNode);

        this.resizeProxyLeft = config.resizeProxyLeft - region.left;

        this.setState({
            resizing: true,
            resizeOffset: this.resizeProxyLeft
        });
    },

    onColumnResizeDrag: function onColumnResizeDrag(config) {
        this.refs.resizeProxy.setState({
            offset: this.resizeProxyLeft + config.resizeProxyDiff
        });
    },

    onColumnResizeDrop: function onColumnResizeDrop(config, resizeInfo) {
        var props = this.props;
        var columns = props.columns;

        var onColumnResize = props.onColumnResize || emptyFn;
        var first = resizeInfo[0];

        var firstCol = findColumn(columns, first.name);
        var firstSize = first.size;

        var second = resizeInfo[1];
        var secondCol = second ? findColumn(columns, second.name) : undefined;
        var secondSize = second ? second.size : undefined;

        //if defaultWidth specified, update it
        if (firstCol.width == null && firstCol.defaultWidth) {
            firstCol.defaultWidth = firstSize;
        }

        if (secondCol && secondCol.width == null && secondCol.defaultWidth) {
            secondCol.defaultWidth = secondSize;
        }

        this.setState(config);

        onColumnResize(firstCol, firstSize, secondCol, secondSize);
    }
});