(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ReactDOM"), require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["ReactDOM", "React"], factory);
	else if(typeof exports === 'object')
		exports["DataGrid"] = factory(require("ReactDOM"), require("React"));
	else
		root["DataGrid"] = factory(root["ReactDOM"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _reactDom = __webpack_require__(1);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactLoadMask = __webpack_require__(3);

	var _reactLoadMask2 = _interopRequireDefault(_reactLoadMask);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(6).polyfill();

	var assign = __webpack_require__(5);

	var Region = __webpack_require__(8);

	var PaginationToolbar = _react2.default.createFactory(__webpack_require__(18));
	var Column = __webpack_require__(35);

	var PropTypes = __webpack_require__(79);
	var Wrapper = __webpack_require__(80);
	var Header = __webpack_require__(91);
	var WrapperFactory = _react2.default.createFactory(Wrapper);
	var HeaderFactory = _react2.default.createFactory(Header);
	var ResizeProxy = __webpack_require__(130);

	var findIndexByName = __webpack_require__(126);
	var group = __webpack_require__(131);

	var slice = __webpack_require__(132);
	var _getTableProps = __webpack_require__(133);
	var getGroupedRows = __webpack_require__(138);
	var renderMenu = __webpack_require__(134);

	var preventDefault = __webpack_require__(139);

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

	    mixins: [__webpack_require__(140), __webpack_require__(142)],

	    propTypes: {
	        loading: _react2.default.PropTypes.bool,
	        virtualRendering: _react2.default.PropTypes.bool,

	        //specify false if you don't want any column to be resizable
	        resizableColumns: _react2.default.PropTypes.bool,
	        filterable: _react2.default.PropTypes.bool,

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
	        scrollBy: PropTypes.numeric,
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

	    getDefaultProps: __webpack_require__(143),

	    componentDidMount: function componentDidMount() {
	        window.addEventListener('click', this.windowClickListener = this.onWindowClick);
	        // this.checkRowHeight(this.props)
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        this.scroller = null;
	        window.removeEventListener('click', this.windowClickListener);
	    },

	    // checkRowHeight: function(props) {
	    //     if (this.isVirtualRendering(props)){

	    //         //if virtual rendering and no rowHeight specifed, we use
	    //         var row = this.findRowById(SIZING_ID)
	    //         var config = {}

	    //         if (row){
	    //             this.setState({
	    //                 rowHeight: config.rowHeight = row.offsetHeight
	    //             })
	    //         }

	    //         //this ensures rows are kept in view
	    //         this.updateStartIndex(props, undefined, config)
	    //     }
	    // },

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
	            startIndex: 0,
	            scrollLeft: 0,
	            scrollTop: 0,
	            menuColumn: null,
	            defaultSelected: defaultSelected,
	            visibility: {},
	            defaultPageSize: props.defaultPageSize,
	            defaultPage: props.defaultPage
	        };
	    },

	    updateStartIndex: function updateStartIndex() {
	        this.handleScrollTop();
	    },

	    handleScrollLeft: function handleScrollLeft(scrollLeft) {

	        this.setState({
	            scrollLeft: scrollLeft,
	            menuColumn: null
	        });
	    },

	    handleScrollTop: function handleScrollTop(scrollTop) {
	        var props = this.p;
	        var state = this.state;

	        scrollTop = scrollTop === undefined ? this.state.scrollTop : scrollTop;

	        state.menuColumn = null;

	        this.scrollTop = scrollTop;

	        if (props.virtualRendering) {

	            var prevIndex = this.state.startIndex || 0;
	            var renderStartIndex = Math.ceil(scrollTop / props.rowHeight);

	            state.startIndex = renderStartIndex;

	            // var data = this.prepareData(props)

	            // if (renderStartIndex >= data.length){
	            //     renderStartIndex = 0
	            // }

	            // state.renderStartIndex = renderStartIndex

	            // var endIndex = this.getRenderEndIndex(props, state)

	            // if (endIndex > data.length){
	            //     renderStartIndex -= data.length - endIndex
	            //     renderStartIndex = Math.max(0, renderStartIndex)

	            //     state.renderStartIndex = renderStartIndex
	            // }

	            // // console.log('scroll!');
	            // var sign = signum(renderStartIndex - prevIndex)

	            // state.topOffset = -sign * Math.ceil(scrollTop - state.renderStartIndex * this.props.rowHeight)

	            // console.log(scrollTop, sign);
	        } else {
	            state.scrollTop = scrollTop;
	        }

	        this.setState(state);
	    },

	    getRenderEndIndex: function getRenderEndIndex(props, state) {
	        var startIndex = state.startIndex;
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

	        var endIndex = startIndex + rowCount;

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
	            scrollLeft: state.scrollLeft,
	            resizing: state.resizing,
	            columns: columns,
	            allColumns: allColumns,
	            columnVisibility: state.visibility,
	            cellPadding: props.headerPadding || props.cellPadding,
	            filterIconColor: props.filterIconColor,
	            menuIconColor: props.menuIconColor,
	            menuIcon: props.menuIcon,
	            sortIcons: props.sortIcons,
	            filterIcon: props.filterIcon,
	            scrollbarSize: props.scrollbarSize,
	            sortInfo: props.sortInfo,
	            resizableColumns: props.resizableColumns,
	            reorderColumns: props.reorderColumns,
	            filterable: props.filterable,
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
	            filterMenuFactory: this.filterMenuFactory,
	            menuColumn: state.menuColumn,
	            columnMenuFactory: props.columnMenuFactory

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

	        var paginationToolbar;

	        if (props.pagination) {
	            var page = props.page;
	            var minPage = props.minPage;
	            var maxPage = props.maxPage;

	            var paginationToolbarFactory = props.paginationFactory || PaginationToolbar;
	            var paginationProps = assign({
	                dataSourceCount: props.dataSourceCount,
	                page: page,
	                pageSize: props.pageSize,
	                minPage: minPage,
	                maxPage: maxPage,
	                reload: this.reload,
	                onPageChange: this.gotoPage,
	                onPageSizeChange: this.setPageSize,
	                border: props.style.border
	            }, props.paginationToolbarProps);

	            paginationToolbar = paginationToolbarFactory(paginationProps);

	            if (paginationToolbar === undefined) {
	                paginationToolbar = PaginationToolbar(paginationProps);
	            }
	        }

	        var topToolbar;
	        var bottomToolbar;

	        if (paginationToolbar) {
	            if (paginationToolbar.props.position == 'top') {
	                topToolbar = paginationToolbar;
	            } else {
	                bottomToolbar = paginationToolbar;
	            }
	        }

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

	    handleVerticalScrollOverflow: function handleVerticalScrollOverflow(sign, scrollTop) {

	        var props = this.p;
	        var page = props.page;

	        if (this.isValidPage(page + sign, props)) {
	            this.gotoPage(page + sign);
	        }
	    },

	    fixHorizontalScrollbar: function fixHorizontalScrollbar() {
	        var scroller = this.scroller;

	        if (scroller) {
	            scroller.fixHorizontalScrollbar();
	        }
	    },

	    onWrapperMount: function onWrapperMount(wrapper, scroller) {
	        this.scroller = scroller;
	    },

	    prepareWrapper: function prepareWrapper(props, state) {
	        var virtualRendering = props.virtualRendering;

	        var data = props.data;
	        var scrollTop = state.scrollTop;
	        var startIndex = state.startIndex;
	        var endIndex = virtualRendering ? this.getRenderEndIndex(props, state) : 0;

	        var renderCount = virtualRendering ? endIndex + 1 - startIndex : data.length;

	        var totalLength = state.groupData ? data.length + state.groupData.groupsCount : data.length;

	        if (props.virtualRendering) {
	            scrollTop = startIndex * props.rowHeight;
	        }

	        // var topLoader
	        // var bottomLoader
	        // var loadersSize = 0

	        // if (props.virtualPagination){

	        //     if (props.page < props.maxPage){
	        //         loadersSize += 2 * props.rowHeight
	        //         bottomLoader = <div style={{height: 2 * props.rowHeight, position: 'relative', width: props.columnFlexCount? 'calc(100% - ' + props.scrollbarSize + ')': props.minRowWidth - props.scrollbarSize}}>
	        //             <LoadMask visible={true} style={{background: 'rgba(128, 128, 128, 0.17)'}}/>
	        //         </div>
	        //     }

	        //     if (props.page > props.minPage){
	        //         loadersSize += 2 * props.rowHeight
	        //         topLoader = <div style={{height: 2 * props.rowHeight, position: 'relative', width: props.columnFlexCount? 'calc(100% - ' + props.scrollbarSize + ')': props.minRowWidth - props.scrollbarSize}}>
	        //             <LoadMask visible={true} style={{background: 'rgba(128, 128, 128, 0.17)'}}/>
	        //         </div>
	        //     }
	        // }

	        var wrapperProps = assign({
	            ref: 'wrapper',
	            onMount: this.onWrapperMount,
	            scrollLeft: state.scrollLeft,
	            scrollTop: scrollTop,
	            topOffset: state.topOffset,
	            startIndex: startIndex,
	            totalLength: totalLength,
	            renderCount: renderCount,
	            endIndex: endIndex,

	            allColumns: props.columns,

	            onScrollLeft: this.handleScrollLeft,
	            onScrollTop: this.handleScrollTop,
	            // onScrollOverflow: props.virtualPagination? this.handleVerticalScrollOverflow: null,

	            menu: state.menu,
	            menuColumn: state.menuColumn,
	            showMenu: this.showMenu,

	            // cellFactory     : props.cellFactory,
	            // rowStyle        : props.rowStyle,
	            // rowClassName    : props.rowClassName,
	            // rowContextMenu  : props.rowContextMenu,

	            // topLoader: topLoader,
	            // bottomLoader: bottomLoader,
	            // loadersSize: loadersSize,

	            // onRowClick: this.handleRowClick,
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
	        props.virtualRendering = this.isVirtualRendering(props);

	        props.filterable = this.prepareFilterable(props);
	        props.resizableColumns = this.prepareResizableColumns(props);
	        props.reorderColumns = this.prepareReorderColumns(props);

	        this.prepareClassName(props);
	        props.style = this.prepareStyle(props);

	        this.preparePaging(props, state);
	        this.prepareColumns(props, state);

	        props.minRowWidth = props.totalColumnWidth + props.scrollbarSize;

	        return props;
	    },

	    prepareLoading: function prepareLoading(props) {
	        var showLoadMask = props.showLoadMask || !this.isMounted(); //ismounted check for initial load
	        return props.loading == null ? showLoadMask && this.state.defaultLoading : props.loading;
	    },

	    preparePaging: function preparePaging(props, state) {
	        props.pagination = this.preparePagination(props);

	        if (props.pagination) {
	            props.pageSize = this.preparePageSize(props);
	            props.dataSourceCount = this.prepareDataSourceCount(props);

	            props.minPage = 1;
	            props.maxPage = Math.ceil((props.dataSourceCount || 1) / props.pageSize);
	            props.page = clamp(this.preparePage(props), props.minPage, props.maxPage);
	        }
	    },

	    preparePagination: function preparePagination(props) {
	        return props.pagination === false ? false : !!props.pageSize || !!props.paginationFactory || this.isRemoteDataSource(props);
	    },

	    prepareDataSourceCount: function prepareDataSourceCount(props) {
	        return props.dataSourceCount == null ? this.state.defaultDataSourceCount : props.dataSourceCount;
	    },

	    preparePageSize: function preparePageSize(props) {
	        return props.pageSize == null ? this.state.defaultPageSize : props.pageSize;
	    },

	    preparePage: function preparePage(props) {
	        return props.page == null ? this.state.defaultPage : props.page;
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

	    prepareFilterable: function prepareFilterable(props) {
	        if (props.filterable === false) {
	            return false;
	        }

	        return props.filterable || !!props.onFilter;
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

	    isVirtualRendering: function isVirtualRendering(props) {
	        props = props || this.props;

	        return props.virtualRendering || props.rowHeight != null;
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

	    isValidPage: function isValidPage(page, props) {
	        return page >= 1 && page <= this.getMaxPage(props);
	    },

	    getMaxPage: function getMaxPage(props) {
	        props = props || this.props;

	        var count = this.prepareDataSourceCount(props) || 1;
	        var pageSize = this.preparePageSize(props);

	        return Math.ceil(count / pageSize);
	    },

	    reload: function reload() {
	        if (this.dataSource) {
	            return this.loadDataSource(this.dataSource, this.props);
	        }
	    },

	    clampPage: function clampPage(page) {
	        return clamp(page, 1, this.getMaxPage(this.props));
	    },

	    setPageSize: function setPageSize(pageSize) {

	        var stateful;
	        var newPage = this.preparePage(this.props);
	        var newState = {};

	        if (typeof this.props.onPageSizeChange == 'function') {
	            this.props.onPageSizeChange(pageSize, this.p);
	        }

	        if (this.props.pageSize == null) {
	            stateful = true;
	            this.state.defaultPageSize = pageSize;
	            newState.defaultPageSize = pageSize;
	        }

	        if (!this.isValidPage(newPage, this.props)) {

	            newPage = this.clampPage(newPage);

	            if (typeof this.props.onPageChange == 'function') {
	                this.props.onPageChange(newPage);
	            }

	            if (this.props.page == null) {
	                stateful = true;
	                this.state.defaultPage = newPage;
	                newState.defaultPage = newPage;
	            }
	        }

	        if (stateful) {
	            this.reload();
	            this.setState(newState);
	        }
	    },

	    gotoPage: function gotoPage(page) {
	        if (typeof this.props.onPageChange == 'function') {
	            this.props.onPageChange(page);
	        } else {
	            this.state.defaultPage = page;
	            var result = this.reload();
	            this.setState({
	                defaultPage: page
	            });

	            return result;
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

	        var pagination = this.preparePagination(props);
	        var pageSize;
	        var page;

	        if (pagination) {
	            pageSize = this.preparePageSize(props);
	            page = this.preparePage(props);

	            assign(dataSourceQuery, {
	                pageSize: pageSize,
	                page: page,
	                skip: (page - 1) * pageSize
	            });
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
	            var otherPage = this.props.page != nextProps.page;
	            var otherPageSize = this.props.pageSize != nextProps.pageSize;

	            if (nextProps.reload || otherPage || otherPageSize) {
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

	        var horizScrollbar = this.refs.wrapper.refs.horizScrollbar;

	        if (horizScrollbar && this.state.scrollLeft) {

	            setTimeout(function () {
	                //FF needs this, since it does not trigger scroll event when scrollbar dissapears
	                //so we might end up with grid content not visible (to the left)

	                var domNode = (0, _reactDom.findDOMNode)(horizScrollbar);
	                if (domNode && !domNode.scrollLeft) {
	                    this.handleScrollLeft(0);
	                }
	            }.bind(this), 1);
	        }

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _Loader = __webpack_require__(4);

	var _Loader2 = _interopRequireDefault(_Loader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DEFAULT_CLASS_NAME = 'react-load-mask';

	var notEmpty = function notEmpty(s) {
	  return !!s;
	};

	var LoadMask = function (_React$Component) {
	  _inherits(LoadMask, _React$Component);

	  function LoadMask() {
	    _classCallCheck(this, LoadMask);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(LoadMask).apply(this, arguments));
	  }

	  _createClass(LoadMask, [{
	    key: 'render',
	    value: function render() {
	      var props = this.props;

	      var visibleClassName = props.visible ? DEFAULT_CLASS_NAME + '--visible' : '';
	      var className = [props.className, DEFAULT_CLASS_NAME, visibleClassName, props.theme && DEFAULT_CLASS_NAME + '--theme-' + props.theme].filter(notEmpty).join(' ');

	      return _react2.default.createElement(
	        'div',
	        _extends({}, props, { className: className }),
	        _react2.default.createElement(_Loader2.default, { size: props.size, theme: props.theme })
	      );
	    }
	  }]);

	  return LoadMask;
	}(_react2.default.Component);

	exports.default = LoadMask;


	LoadMask.defaultProps = {
	  visible: false,
	  theme: 'default'
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _objectAssign = __webpack_require__(5);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DEFAULT_CLASS_NAME = 'react-load-mask__loader';
	var LOADBAR_CLASSNAME = DEFAULT_CLASS_NAME + '-loadbar';

	var notEmpty = function notEmpty(s) {
	  return !!s;
	};

	var Loader = function (_React$Component) {
	  _inherits(Loader, _React$Component);

	  function Loader() {
	    _classCallCheck(this, Loader);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Loader).apply(this, arguments));
	  }

	  _createClass(Loader, [{
	    key: 'render',
	    value: function render() {
	      var props = this.props;

	      var style = (0, _objectAssign2.default)({}, props.style, {
	        width: props.size,
	        height: props.size
	      });

	      var className = [props.className, DEFAULT_CLASS_NAME, props.theme && DEFAULT_CLASS_NAME + '--theme-' + props.theme].filter(notEmpty).join(' ');

	      return _react2.default.createElement(
	        'div',
	        _extends({}, props, { style: style, className: className }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--1' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--2' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--3' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--4' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--5' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--6' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--7' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--8' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--9' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--10' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--11' }),
	        _react2.default.createElement('div', { className: LOADBAR_CLASSNAME + ' ' + LOADBAR_CLASSNAME + '--12' })
	      );
	    }
	  }]);

	  return Loader;
	}(_react2.default.Component);

	exports.default = Loader;


	Loader.defaultProps = {
	  size: 40
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   3.3.1
	 */

	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.ES6Promise = factory());
	}(this, (function () { 'use strict';

	function objectOrFunction(x) {
	  return typeof x === 'function' || typeof x === 'object' && x !== null;
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}

	var _isArray = undefined;
	if (!Array.isArray) {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	} else {
	  _isArray = Array.isArray;
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = undefined;
	var customSchedulerFn = undefined;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  return function () {
	    vertxNext(flush);
	  };
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var r = require;
	    var vertx = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vertx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = undefined;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var _arguments = arguments;

	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;

	  if (_state) {
	    (function () {
	      var callback = _arguments[_state - 1];
	      asap(function () {
	        return invokeCallback(_state, child, callback, parent._result);
	      });
	    })();
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  _resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(16);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var GET_THEN_ERROR = new ErrorObject();

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    GET_THEN_ERROR.error = error;
	    return GET_THEN_ERROR;
	  }
	}

	function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        _resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      _reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      _reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    _reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return _resolve(promise, value);
	    }, function (reason) {
	      return _reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$) {
	  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$ === GET_THEN_ERROR) {
	      _reject(promise, GET_THEN_ERROR.error);
	    } else if (then$$ === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$)) {
	      handleForeignThenable(promise, maybeThenable, then$$);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function _resolve(promise, value) {
	  if (promise === value) {
	    _reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function _reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;

	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = undefined,
	      callback = undefined,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function ErrorObject() {
	  this.error = null;
	}

	var TRY_CATCH_ERROR = new ErrorObject();

	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = undefined,
	      error = undefined,
	      succeeded = undefined,
	      failed = undefined;

	  if (hasCallback) {
	    value = tryCatch(callback, detail);

	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value = null;
	    } else {
	      succeeded = true;
	    }

	    if (promise === value) {
	      _reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }

	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      _resolve(promise, value);
	    }, function rejectPromise(reason) {
	      _reject(promise, reason);
	    });
	  } catch (e) {
	    _reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function Enumerator(Constructor, input) {
	  this._instanceConstructor = Constructor;
	  this.promise = new Constructor(noop);

	  if (!this.promise[PROMISE_ID]) {
	    makePromise(this.promise);
	  }

	  if (isArray(input)) {
	    this._input = input;
	    this.length = input.length;
	    this._remaining = input.length;

	    this._result = new Array(this.length);

	    if (this.length === 0) {
	      fulfill(this.promise, this._result);
	    } else {
	      this.length = this.length || 0;
	      this._enumerate();
	      if (this._remaining === 0) {
	        fulfill(this.promise, this._result);
	      }
	    }
	  } else {
	    _reject(this.promise, validationError());
	  }
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	};

	Enumerator.prototype._enumerate = function () {
	  var length = this.length;
	  var _input = this._input;

	  for (var i = 0; this._state === PENDING && i < length; i++) {
	    this._eachEntry(_input[i], i);
	  }
	};

	Enumerator.prototype._eachEntry = function (entry, i) {
	  var c = this._instanceConstructor;
	  var resolve$$ = c.resolve;

	  if (resolve$$ === resolve) {
	    var _then = getThen(entry);

	    if (_then === then && entry._state !== PENDING) {
	      this._settledAt(entry._state, i, entry._result);
	    } else if (typeof _then !== 'function') {
	      this._remaining--;
	      this._result[i] = entry;
	    } else if (c === Promise) {
	      var promise = new c(noop);
	      handleMaybeThenable(promise, entry, _then);
	      this._willSettleAt(promise, i);
	    } else {
	      this._willSettleAt(new c(function (resolve$$) {
	        return resolve$$(entry);
	      }), i);
	    }
	  } else {
	    this._willSettleAt(resolve$$(entry), i);
	  }
	};

	Enumerator.prototype._settledAt = function (state, i, value) {
	  var promise = this.promise;

	  if (promise._state === PENDING) {
	    this._remaining--;

	    if (state === REJECTED) {
	      _reject(promise, value);
	    } else {
	      this._result[i] = value;
	    }
	  }

	  if (this._remaining === 0) {
	    fulfill(promise, this._result);
	  }
	};

	Enumerator.prototype._willSettleAt = function (promise, i) {
	  var enumerator = this;

	  subscribe(promise, undefined, function (value) {
	    return enumerator._settledAt(FULFILLED, i, value);
	  }, function (reason) {
	    return enumerator._settledAt(REJECTED, i, reason);
	  });
	};

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  _reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {function} resolver
	  Useful for tooling.
	  @constructor
	*/
	function Promise(resolver) {
	  this[PROMISE_ID] = nextId();
	  this._result = this._state = undefined;
	  this._subscribers = [];

	  if (noop !== resolver) {
	    typeof resolver !== 'function' && needsResolver();
	    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	  }
	}

	Promise.all = all;
	Promise.race = race;
	Promise.resolve = resolve;
	Promise.reject = reject;
	Promise._setScheduler = setScheduler;
	Promise._setAsap = setAsap;
	Promise._asap = asap;

	Promise.prototype = {
	  constructor: Promise,

	  /**
	    The primary way of interacting with a promise is through its `then` method,
	    which registers callbacks to receive either a promise's eventual value or the
	    reason why the promise cannot be fulfilled.
	  
	    ```js
	    findUser().then(function(user){
	      // user is available
	    }, function(reason){
	      // user is unavailable, and you are given the reason why
	    });
	    ```
	  
	    Chaining
	    --------
	  
	    The return value of `then` is itself a promise.  This second, 'downstream'
	    promise is resolved with the return value of the first promise's fulfillment
	    or rejection handler, or rejected if the handler throws an exception.
	  
	    ```js
	    findUser().then(function (user) {
	      return user.name;
	    }, function (reason) {
	      return 'default name';
	    }).then(function (userName) {
	      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	      // will be `'default name'`
	    });
	  
	    findUser().then(function (user) {
	      throw new Error('Found user, but still unhappy');
	    }, function (reason) {
	      throw new Error('`findUser` rejected and we're unhappy');
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	    });
	    ```
	    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	  
	    ```js
	    findUser().then(function (user) {
	      throw new PedagogicalException('Upstream error');
	    }).then(function (value) {
	      // never reached
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // The `PedgagocialException` is propagated all the way down to here
	    });
	    ```
	  
	    Assimilation
	    ------------
	  
	    Sometimes the value you want to propagate to a downstream promise can only be
	    retrieved asynchronously. This can be achieved by returning a promise in the
	    fulfillment or rejection handler. The downstream promise will then be pending
	    until the returned promise is settled. This is called *assimilation*.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // The user's comments are now available
	    });
	    ```
	  
	    If the assimliated promise rejects, then the downstream promise will also reject.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // If `findCommentsByAuthor` fulfills, we'll have the value here
	    }, function (reason) {
	      // If `findCommentsByAuthor` rejects, we'll have the reason here
	    });
	    ```
	  
	    Simple Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let result;
	  
	    try {
	      result = findResult();
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	    findResult(function(result, err){
	      if (err) {
	        // failure
	      } else {
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findResult().then(function(result){
	      // success
	    }, function(reason){
	      // failure
	    });
	    ```
	  
	    Advanced Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let author, books;
	  
	    try {
	      author = findAuthor();
	      books  = findBooksByAuthor(author);
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	  
	    function foundBooks(books) {
	  
	    }
	  
	    function failure(reason) {
	  
	    }
	  
	    findAuthor(function(author, err){
	      if (err) {
	        failure(err);
	        // failure
	      } else {
	        try {
	          findBoooksByAuthor(author, function(books, err) {
	            if (err) {
	              failure(err);
	            } else {
	              try {
	                foundBooks(books);
	              } catch(reason) {
	                failure(reason);
	              }
	            }
	          });
	        } catch(error) {
	          failure(err);
	        }
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findAuthor().
	      then(findBooksByAuthor).
	      then(function(books){
	        // found books
	    }).catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method then
	    @param {Function} onFulfilled
	    @param {Function} onRejected
	    Useful for tooling.
	    @return {Promise}
	  */
	  then: then,

	  /**
	    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	    as the catch block of a try/catch statement.
	  
	    ```js
	    function findAuthor(){
	      throw new Error('couldn't find that author');
	    }
	  
	    // synchronous
	    try {
	      findAuthor();
	    } catch(reason) {
	      // something went wrong
	    }
	  
	    // async with promises
	    findAuthor().catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method catch
	    @param {Function} onRejection
	    Useful for tooling.
	    @return {Promise}
	  */
	  'catch': function _catch(onRejection) {
	    return this.then(null, onRejection);
	  }
	};

	function polyfill() {
	    var local = undefined;

	    if (typeof global !== 'undefined') {
	        local = global;
	    } else if (typeof self !== 'undefined') {
	        local = self;
	    } else {
	        try {
	            local = Function('return this')();
	        } catch (e) {
	            throw new Error('polyfill failed because global object is unavailable in this environment');
	        }
	    }

	    var P = local.Promise;

	    if (P) {
	        var promiseToString = null;
	        try {
	            promiseToString = Object.prototype.toString.call(P.resolve());
	        } catch (e) {
	            // silently ignored
	        }

	        if (promiseToString === '[object Promise]' && !P.cast) {
	            return;
	        }
	    }

	    local.Promise = Promise;
	}

	polyfill();
	// Strange compat..
	Promise.polyfill = polyfill;
	Promise.Promise = Promise;

	return Promise;

	})));
	//# sourceMappingURL=es6-promise.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9)

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn    = __webpack_require__(10)
	var newify    = __webpack_require__(11)

	var assign      = __webpack_require__(13);
	var EventEmitter = __webpack_require__(14).EventEmitter

	var inherits = __webpack_require__(15)
	var VALIDATE = __webpack_require__(16)

	var objectToString = Object.prototype.toString

	var isObject = function(value){
	    return objectToString.apply(value) === '[object Object]'
	}

	function copyList(source, target, list){
	    if (source){
	        list.forEach(function(key){
	            if (hasOwn(source, key)){
	                target[key] = source[key]
	            }
	        })
	    }

	    return target
	}

	/**
	 * @class Region
	 *
	 * The Region is an abstraction that allows the developer to refer to rectangles on the screen,
	 * and move them around, make diffs and unions, detect intersections, compute areas, etc.
	 *
	 * ## Creating a region
	 *      var region = require('region')({
	 *          top  : 10,
	 *          left : 10,
	 *          bottom: 100,
	 *          right : 100
	 *      })
	 *      //this region is a square, 90x90, starting from (10,10) to (100,100)
	 *
	 *      var second = require('region')({ top: 10, left: 100, right: 200, bottom: 60})
	 *      var union  = region.getUnion(second)
	 *
	 *      //the "union" region is a union between "region" and "second"
	 */

	var POINT_POSITIONS = {
	        cy: 'YCenter',
	        cx: 'XCenter',
	        t : 'Top',
	        tc: 'TopCenter',
	        tl: 'TopLeft',
	        tr: 'TopRight',
	        b : 'Bottom',
	        bc: 'BottomCenter',
	        bl: 'BottomLeft',
	        br: 'BottomRight',
	        l : 'Left',
	        lc: 'LeftCenter',
	        r : 'Right',
	        rc: 'RightCenter',
	        c : 'Center'
	    }

	/**
	 * @constructor
	 *
	 * Construct a new Region.
	 *
	 * Example:
	 *
	 *      var r = new Region({ top: 10, left: 20, bottom: 100, right: 200 })
	 *
	 *      //or, the same, but with numbers (can be used with new or without)
	 *
	 *      r = Region(10, 200, 100, 20)
	 *
	 *      //or, with width and height
	 *
	 *      r = Region({ top: 10, left: 20, width: 180, height: 90})
	 *
	 * @param {Number|Object} top The top pixel position, or an object with top, left, bottom, right properties. If an object is passed,
	 * instead of having bottom and right, it can have width and height.
	 *
	 * @param {Number} right The right pixel position
	 * @param {Number} bottom The bottom pixel position
	 * @param {Number} left The left pixel position
	 *
	 * @return {Region} this
	 */
	var REGION = function(top, right, bottom, left){

	    if (!(this instanceof REGION)){
	        return newify(REGION, arguments)
	    }

	    EventEmitter.call(this)

	    if (isObject(top)){
	        copyList(top, this, ['top','right','bottom','left'])

	        if (top.bottom == null && top.height != null){
	            this.bottom = this.top + top.height
	        }
	        if (top.right == null && top.width != null){
	            this.right = this.left + top.width
	        }

	        if (top.emitChangeEvents){
	            this.emitChangeEvents = top.emitChangeEvents
	        }
	    } else {
	        this.top    = top
	        this.right  = right
	        this.bottom = bottom
	        this.left   = left
	    }

	    this[0] = this.left
	    this[1] = this.top

	    VALIDATE(this)
	}

	inherits(REGION, EventEmitter)

	assign(REGION.prototype, {

	    /**
	     * @cfg {Boolean} emitChangeEvents If this is set to true, the region
	     * will emit 'changesize' and 'changeposition' whenever the size or the position changs
	     */
	    emitChangeEvents: false,

	    /**
	     * Returns this region, or a clone of this region
	     * @param  {Boolean} [clone] If true, this method will return a clone of this region
	     * @return {Region}       This region, or a clone of this
	     */
	    getRegion: function(clone){
	        return clone?
	                    this.clone():
	                    this
	    },

	    /**
	     * Sets the properties of this region to those of the given region
	     * @param {Region/Object} reg The region or object to use for setting properties of this region
	     * @return {Region} this
	     */
	    setRegion: function(reg){

	        if (reg instanceof REGION){
	            this.set(reg.get())
	        } else {
	            this.set(reg)
	        }

	        return this
	    },

	    /**
	     * Returns true if this region is valid, false otherwise
	     *
	     * @param  {Region} region The region to check
	     * @return {Boolean}        True, if the region is valid, false otherwise.
	     * A region is valid if
	     *  * left <= right  &&
	     *  * top  <= bottom
	     */
	    validate: function(){
	        return REGION.validate(this)
	    },

	    _before: function(){
	        if (this.emitChangeEvents){
	            return copyList(this, {}, ['left','top','bottom','right'])
	        }
	    },

	    _after: function(before){
	        if (this.emitChangeEvents){

	            if(this.top != before.top || this.left != before.left) {
	                this.emitPositionChange()
	            }

	            if(this.right != before.right || this.bottom != before.bottom) {
	                this.emitSizeChange()
	            }
	        }
	    },

	    notifyPositionChange: function(){
	        this.emit('changeposition', this)
	    },

	    emitPositionChange: function(){
	        this.notifyPositionChange()
	    },

	    notifySizeChange: function(){
	        this.emit('changesize', this)
	    },

	    emitSizeChange: function(){
	        this.notifySizeChange()
	    },

	    /**
	     * Add the given amounts to each specified side. Example
	     *
	     *      region.add({
	     *          top: 50,    //add 50 px to the top side
	     *          bottom: -100    //substract 100 px from the bottom side
	     *      })
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    add: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            this[direction] += directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * The same as {@link #add}, but substracts the given values
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    substract: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if (hasOwn(directions, direction) ) {
	            this[direction] -= directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the size of the region.
	     * @return {Object} An object with {width, height}, corresponding to the width and height of the region
	     */
	    getSize: function(){
	        return {
	            width  : this.width,
	            height : this.height
	        }
	    },

	    /**
	     * Move the region to the given position and keeps the region width and height.
	     *
	     * @param {Object} position An object with {top, left} properties. The values in {top,left} are used to move the region by the given amounts.
	     * @param {Number} [position.left]
	     * @param {Number} [position.top]
	     *
	     * @return {Region} this
	     */
	    setPosition: function(position){
	        var width  = this.width
	        var height = this.height

	        if (position.left != undefined){
	            position.right  = position.left + width
	        }

	        if (position.top != undefined){
	            position.bottom = position.top  + height
	        }

	        return this.set(position)
	    },

	    /**
	     * Sets both the height and the width of this region to the given size.
	     *
	     * @param {Number} size The new size for the region
	     * @return {Region} this
	     */
	    setSize: function(size){
	        if (size.height != undefined && size.width != undefined){
	            return this.set({
	                right  : this.left + size.width,
	                bottom : this.top  + size.height
	            })
	        }

	        if (size.width != undefined){
	            this.setWidth(size.width)
	        }

	        if (size.height != undefined){
	            this.setHeight(size.height)
	        }

	        return this
	    },



	    /**
	     * @chainable
	     *
	     * Sets the width of this region
	     * @param {Number} width The new width for this region
	     * @return {Region} this
	     */
	    setWidth: function(width){
	        return this.set({
	            right: this.left + width
	        })
	    },

	    /**
	     * @chainable
	     *
	     * Sets the height of this region
	     * @param {Number} height The new height for this region
	     * @return {Region} this
	     */
	    setHeight: function(height){
	        return this.set({
	            bottom: this.top + height
	        })
	    },

	    /**
	     * Sets the given properties on this region
	     *
	     * @param {Object} directions an object containing top, left, and EITHER bottom, right OR width, height
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @param {Number} [directions.width]
	     * @param {Number} [directions.height]
	     *
	     *
	     * @return {Region} this
	     */
	    set: function(directions){
	        var before = this._before()

	        copyList(directions, this, ['left','top','bottom','right'])

	        if (directions.bottom == null && directions.height != null){
	            this.bottom = this.top + directions.height
	        }
	        if (directions.right == null && directions.width != null){
	            this.right = this.left + directions.width
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the given property from this region. If no property is given, return an object
	     * with {left, top, right, bottom}
	     *
	     * @param {String} [dir] the property to retrieve from this region
	     * @return {Number/Object}
	     */
	    get: function(dir){
	        return dir? this[dir]:
	                    copyList(this, {}, ['left','right','top','bottom'])
	    },

	    /**
	     * Shifts this region to either top, or left or both.
	     * Shift is similar to {@link #add} by the fact that it adds the given dimensions to top/left sides, but also adds the given dimensions
	     * to bottom and right
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    shift: function(directions){

	        var before = this._before()

	        if (directions.top){
	            this.top    += directions.top
	            this.bottom += directions.top
	        }

	        if (directions.left){
	            this.left  += directions.left
	            this.right += directions.left
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Same as {@link #shift}, but substracts the given values
	     * @chainable
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    unshift: function(directions){

	        if (directions.top){
	            directions.top *= -1
	        }

	        if (directions.left){
	            directions.left *= -1
	        }

	        return this.shift(directions)
	    },

	    /**
	     * Compare this region and the given region. Return true if they have all the same size and position
	     * @param  {Region} region The region to compare with
	     * @return {Boolean}       True if this and region have same size and position
	     */
	    equals: function(region){
	        return this.equalsPosition(region) && this.equalsSize(region)
	    },

	    /**
	     * Returns true if this region has the same bottom,right properties as the given region
	     * @param  {Region/Object} size The region to compare against
	     * @return {Boolean}       true if this region is the same size as the given size
	     */
	    equalsSize: function(size){
	        var isInstance = size instanceof REGION

	        var s = {
	            width: size.width == null && isInstance?
	                    size.getWidth():
	                    size.width,

	            height: size.height == null && isInstance?
	                    size.getHeight():
	                    size.height
	        }
	        return this.getWidth() == s.width && this.getHeight() == s.height
	    },

	    /**
	     * Returns true if this region has the same top,left properties as the given region
	     * @param  {Region} region The region to compare against
	     * @return {Boolean}       true if this.top == region.top and this.left == region.left
	     */
	    equalsPosition: function(region){
	        return this.top == region.top && this.left == region.left
	    },

	    /**
	     * Adds the given ammount to the left side of this region
	     * @param {Number} left The ammount to add
	     * @return {Region} this
	     */
	    addLeft: function(left){
	        var before = this._before()

	        this.left = this[0] = this.left + left

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the top side of this region
	     * @param {Number} top The ammount to add
	     * @return {Region} this
	     */
	    addTop: function(top){
	        var before = this._before()

	        this.top = this[1] = this.top + top

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the bottom side of this region
	     * @param {Number} bottom The ammount to add
	     * @return {Region} this
	     */
	    addBottom: function(bottom){
	        var before = this._before()

	        this.bottom += bottom

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the right side of this region
	     * @param {Number} right The ammount to add
	     * @return {Region} this
	     */
	    addRight: function(right){
	        var before = this._before()

	        this.right += right

	        this._after(before)

	        return this
	    },

	    /**
	     * Minimize the top side.
	     * @return {Region} this
	     */
	    minTop: function(){
	        return this.expand({top: 1})
	    },
	    /**
	     * Minimize the bottom side.
	     * @return {Region} this
	     */
	    maxBottom: function(){
	        return this.expand({bottom: 1})
	    },
	    /**
	     * Minimize the left side.
	     * @return {Region} this
	     */
	    minLeft: function(){
	        return this.expand({left: 1})
	    },
	    /**
	     * Maximize the right side.
	     * @return {Region} this
	     */
	    maxRight: function(){
	        return this.expand({right: 1})
	    },

	    /**
	     * Expands this region to the dimensions of the given region, or the document region, if no region is expanded.
	     * But only expand the given sides (any of the four can be expanded).
	     *
	     * @param {Object} directions
	     * @param {Boolean} [directions.top]
	     * @param {Boolean} [directions.bottom]
	     * @param {Boolean} [directions.left]
	     * @param {Boolean} [directions.right]
	     *
	     * @param {Region} [region] the region to expand to, defaults to the document region
	     * @return {Region} this region
	     */
	    expand: function(directions, region){
	        var docRegion = region || REGION.getDocRegion()
	        var list      = []
	        var direction
	        var before = this._before()

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            list.push(direction)
	        }

	        copyList(docRegion, this, list)

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Returns a clone of this region
	     * @return {Region} A new region, with the same position and dimension as this region
	     */
	    clone: function(){
	        return new REGION({
	                    top    : this.top,
	                    left   : this.left,
	                    right  : this.right,
	                    bottom : this.bottom
	                })
	    },

	    /**
	     * Returns true if this region contains the given point
	     * @param {Number/Object} x the x coordinate of the point
	     * @param {Number} [y] the y coordinate of the point
	     *
	     * @return {Boolean} true if this region constains the given point, false otherwise
	     */
	    containsPoint: function(x, y){
	        if (arguments.length == 1){
	            y = x.y
	            x = x.x
	        }

	        return this.left <= x  &&
	               x <= this.right &&
	               this.top <= y   &&
	               y <= this.bottom
	    },

	    /**
	     *
	     * @param region
	     *
	     * @return {Boolean} true if this region contains the given region, false otherwise
	     */
	    containsRegion: function(region){
	        return this.containsPoint(region.left, region.top)    &&
	               this.containsPoint(region.right, region.bottom)
	    },

	    /**
	     * Returns an object with the difference for {top, bottom} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {top,bottom}
	     */
	    diffHeight: function(region){
	        return this.diff(region, {top: true, bottom: true})
	    },

	    /**
	     * Returns an object with the difference for {left, right} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {left,right}
	     */
	    diffWidth: function(region){
	        return this.diff(region, {left: true, right: true})
	    },

	    /**
	     * Returns an object with the difference in sizes for the given directions, between this and region
	     *
	     * @param  {Region} region     The region to use for diff
	     * @param  {Object} directions An object with the directions to diff. Can have any of the following keys:
	     *  * left
	     *  * right
	     *  * top
	     *  * bottom
	     *
	     * @return {Object} and object with the same keys as the directions object, but the values being the
	     * differences between this region and the given region
	     */
	    diff: function(region, directions){
	        var result = {}
	        var dirName

	        for (dirName in directions) if ( hasOwn(directions, dirName) ) {
	            result[dirName] = this[dirName] - region[dirName]
	        }

	        return result
	    },

	    /**
	     * Returns the position, in {left,top} properties, of this region
	     *
	     * @return {Object} {left,top}
	     */
	    getPosition: function(){
	        return {
	            left: this.left,
	            top : this.top
	        }
	    },

	    /**
	     * Returns the point at the given position from this region.
	     *
	     * @param {String} position Any of:
	     *
	     *  * 'cx' - See {@link #getPointXCenter}
	     *  * 'cy' - See {@link #getPointYCenter}
	     *  * 'b'  - See {@link #getPointBottom}
	     *  * 'bc' - See {@link #getPointBottomCenter}
	     *  * 'l'  - See {@link #getPointLeft}F
	     *  * 'lc' - See {@link #getPointLeftCenter}
	     *  * 't'  - See {@link #getPointTop}
	     *  * 'tc' - See {@link #getPointTopCenter}
	     *  * 'r'  - See {@link #getPointRight}
	     *  * 'rc' - See {@link #getPointRightCenter}
	     *  * 'c'  - See {@link #getPointCenter}
	     *  * 'tl' - See {@link #getPointTopLeft}
	     *  * 'bl' - See {@link #getPointBottomLeft}
	     *  * 'br' - See {@link #getPointBottomRight}
	     *  * 'tr' - See {@link #getPointTopRight}
	     *
	     * @param {Boolean} asLeftTop
	     *
	     * @return {Object} either an object with {x,y} or {left,top} if asLeftTop is true
	     */
	    getPoint: function(position, asLeftTop){

	        //<debug>
	        if (!POINT_POSITIONS[position]) {
	            console.warn('The position ', position, ' could not be found! Available options are tl, bl, tr, br, l, r, t, b.');
	        }
	        //</debug>

	        var method = 'getPoint' + POINT_POSITIONS[position],
	            result = this[method]()

	        if (asLeftTop){
	            return {
	                left : result.x,
	                top  : result.y
	            }
	        }

	        return result
	    },

	    /**
	     * Returns a point with x = null and y being the middle of the left region segment
	     * @return {Object} {x,y}
	     */
	    getPointYCenter: function(){
	        return { x: null, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x being the middle of the top region segment
	     * @return {Object} {x,y}
	     */
	    getPointXCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: null }
	    },

	    /**
	     * Returns a point with x = null and y the region top position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointTop: function(){
	        return { x: null, y: this.top }
	    },

	    /**
	     * Returns a point that is the middle point of the region top segment
	     * @return {Object} {x,y}
	     */
	    getPointTopCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top }
	    },

	    /**
	     * Returns a point that is the top-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopLeft: function(){
	        return { x: this.left, y: this.top}
	    },

	    /**
	     * Returns a point that is the top-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopRight: function(){
	        return { x: this.right, y: this.top}
	    },

	    /**
	     * Returns a point with x = null and y the region bottom position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointBottom: function(){
	        return { x: null, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the middle point of the region bottom segment
	     * @return {Object} {x,y}
	     */
	    getPointBottomCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the bottom-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomLeft: function(){
	        return { x: this.left, y: this.bottom}
	    },

	    /**
	     * Returns a point that is the bottom-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomRight: function(){
	        return { x: this.right, y: this.bottom}
	    },

	    /**
	     * Returns a point with y = null and x the region left position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointLeft: function(){
	        return { x: this.left, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region left segment
	     * @return {Object} {x,y}
	     */
	    getPointLeftCenter: function(){
	        return { x: this.left, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x the region right position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointRight: function(){
	        return { x: this.right, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region right segment
	     * @return {Object} {x,y}
	     */
	    getPointRightCenter: function(){
	        return { x: this.right, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point that is the center of the region
	     * @return {Object} {x,y}
	     */
	    getPointCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * @return {Number} returns the height of the region
	     */
	    getHeight: function(){
	        return this.bottom - this.top
	    },

	    /**
	     * @return {Number} returns the width of the region
	     */
	    getWidth: function(){
	        return this.right - this.left
	    },

	    /**
	     * @return {Number} returns the top property of the region
	     */
	    getTop: function(){
	        return this.top
	    },

	    /**
	     * @return {Number} returns the left property of the region
	     */
	    getLeft: function(){
	        return this.left
	    },

	    /**
	     * @return {Number} returns the bottom property of the region
	     */
	    getBottom: function(){
	        return this.bottom
	    },

	    /**
	     * @return {Number} returns the right property of the region
	     */
	    getRight: function(){
	        return this.right
	    },

	    /**
	     * Returns the area of the region
	     * @return {Number} the computed area
	     */
	    getArea: function(){
	        return this.getWidth() * this.getHeight()
	    },

	    constrainTo: function(contrain){
	        var intersect = this.getIntersection(contrain)
	        var shift

	        if (!intersect || !intersect.equals(this)){

	            var contrainWidth  = contrain.getWidth(),
	                contrainHeight = contrain.getHeight()

	            if (this.getWidth() > contrainWidth){
	                this.left = contrain.left
	                this.setWidth(contrainWidth)
	            }

	            if (this.getHeight() > contrainHeight){
	                this.top = contrain.top
	                this.setHeight(contrainHeight)
	            }

	            shift = {}

	            if (this.right > contrain.right){
	                shift.left = contrain.right - this.right
	            }

	            if (this.bottom > contrain.bottom){
	                shift.top = contrain.bottom - this.bottom
	            }

	            if (this.left < contrain.left){
	                shift.left = contrain.left - this.left
	            }

	            if (this.top < contrain.top){
	                shift.top = contrain.top - this.top
	            }

	            this.shift(shift)

	            return true
	        }

	        return false
	    },

	    __IS_REGION: true

	    /**
	     * @property {Number} top
	     */

	    /**
	     * @property {Number} right
	     */

	    /**
	     * @property {Number} bottom
	     */

	    /**
	     * @property {Number} left
	     */

	    /**
	     * @property {Number} [0] the top property
	     */

	    /**
	     * @property {Number} [1] the left property
	     */

	    /**
	     * @method getIntersection
	     * Returns a region that is the intersection of this region and the given region
	     * @param  {Region} region The region to intersect with
	     * @return {Region}        The intersection region
	     */

	    /**
	     * @method getUnion
	     * Returns a region that is the union of this region with the given region
	     * @param  {Region} region  The region to make union with
	     * @return {Region}        The union region. The smallest region that contains both this and the given region.
	     */

	})

	Object.defineProperties(REGION.prototype, {
	    width: {
	        get: function(){
	            return this.getWidth()
	        },
	        set: function(width){
	            return this.setWidth(width)
	        }
	    },
	    height: {
	        get: function(){
	            return this.getHeight()
	        },
	        set: function(height){
	            return this.setHeight(height)
	        }
	    }
	})

	__webpack_require__(17)(REGION)

	module.exports = REGION

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict'

	var hasOwn = Object.prototype.hasOwnProperty

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}


	module.exports = curry(function(object, property){
	    return hasOwn.call(object, property)
	})

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(12)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	            value       : ctor,
	            enumerable  : false,
	            writable    : true,
	            configurable: true
	        }
	    })
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @static
	 * Returns true if the given region is valid, false otherwise.
	 * @param  {Region} region The region to check
	 * @return {Boolean}        True, if the region is valid, false otherwise.
	 * A region is valid if
	 *  * left <= right  &&
	 *  * top  <= bottom
	 */
	module.exports = function validate(region){

	    var isValid = true

	    if (region.right < region.left){
	        isValid = false
	        region.right = region.left
	    }

	    if (region.bottom < region.top){
	        isValid = false
	        region.bottom = region.top
	    }

	    return isValid
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn   = __webpack_require__(10)
	var VALIDATE = __webpack_require__(16)

	module.exports = function(REGION){

	    var MAX = Math.max
	    var MIN = Math.min

	    var statics = {
	        init: function(){
	            var exportAsNonStatic = {
	                getIntersection      : true,
	                getIntersectionArea  : true,
	                getIntersectionHeight: true,
	                getIntersectionWidth : true,
	                getUnion             : true
	            }
	            var thisProto = REGION.prototype
	            var newName

	            var exportHasOwn = hasOwn(exportAsNonStatic)
	            var methodName

	            for (methodName in exportAsNonStatic) if (exportHasOwn(methodName)) {
	                newName = exportAsNonStatic[methodName]
	                if (typeof newName != 'string'){
	                    newName = methodName
	                }

	                ;(function(proto, methodName, protoMethodName){

	                    proto[methodName] = function(region){
	                        //<debug>
	                        if (!REGION[protoMethodName]){
	                            console.warn('cannot find method ', protoMethodName,' on ', REGION)
	                        }
	                        //</debug>
	                        return REGION[protoMethodName](this, region)
	                    }

	                })(thisProto, newName, methodName);
	            }
	        },

	        validate: VALIDATE,

	        /**
	         * Returns the region corresponding to the documentElement
	         * @return {Region} The region corresponding to the documentElement. This region is the maximum region visible on the screen.
	         */
	        getDocRegion: function(){
	            return REGION.fromDOM(document.documentElement)
	        },

	        from: function(reg){
	            if (reg.__IS_REGION){
	                return reg
	            }

	            if (typeof document != 'undefined'){
	                if (typeof HTMLElement != 'undefined' && reg instanceof HTMLElement){
	                    return REGION.fromDOM(reg)
	                }

	                if (reg.type && typeof reg.pageX !== 'undefined' && typeof reg.pageY !== 'undefined'){
	                    return REGION.fromEvent(reg)
	                }
	            }

	            return REGION(reg)
	        },

	        fromEvent: function(event){
	            return REGION.fromPoint({
	                x: event.pageX,
	                y: event.pageY
	            })
	        },

	        fromDOM: function(dom){
	            var rect = dom.getBoundingClientRect()
	            // var docElem = document.documentElement
	            // var win     = window

	            // var top  = rect.top + win.pageYOffset - docElem.clientTop
	            // var left = rect.left + win.pageXOffset - docElem.clientLeft

	            return new REGION({
	                top   : rect.top,
	                left  : rect.left,
	                bottom: rect.bottom,
	                right : rect.right
	            })
	        },

	        /**
	         * @static
	         * Returns a region that is the intersection of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region/Boolean}        The intersection region or false if no intersection found
	         */
	        getIntersection: function(first, second){

	            var area = this.getIntersectionArea(first, second)

	            if (area){
	                return new REGION(area)
	            }

	            return false
	        },

	        getIntersectionWidth: function(first, second){
	            var minRight  = MIN(first.right, second.right)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (maxLeft < minRight){
	                return minRight  - maxLeft
	            }

	            return 0
	        },

	        getIntersectionHeight: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minBottom = MIN(first.bottom,second.bottom)

	            if (maxTop  < minBottom){
	                return minBottom - maxTop
	            }

	            return 0
	        },

	        getIntersectionArea: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minRight  = MIN(first.right, second.right)
	            var minBottom = MIN(first.bottom,second.bottom)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (
	                    maxTop  < minBottom &&
	                    maxLeft < minRight
	                ){
	                return {
	                    top    : maxTop,
	                    right  : minRight,
	                    bottom : minBottom,
	                    left   : maxLeft,

	                    width  : minRight  - maxLeft,
	                    height : minBottom - maxTop
	                }
	            }

	            return false
	        },

	        /**
	         * @static
	         * Returns a region that is the union of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region}        The union region. The smallest region that contains both given regions.
	         */
	        getUnion: function(first, second){
	            var top    = MIN(first.top,   second.top)
	            var right  = MAX(first.right, second.right)
	            var bottom = MAX(first.bottom,second.bottom)
	            var left   = MIN(first.left,  second.left)

	            return new REGION(top, right, bottom, left)
	        },

	        /**
	         * @static
	         * Returns a region. If the reg argument is a region, returns it, otherwise return a new region built from the reg object.
	         *
	         * @param  {Region} reg A region or an object with either top, left, bottom, right or
	         * with top, left, width, height
	         * @return {Region} A region
	         */
	        getRegion: function(reg){
	            return REGION.from(reg)
	        },

	        /**
	         * Creates a region that corresponds to a point.
	         *
	         * @param  {Object} xy The point
	         * @param  {Number} xy.x
	         * @param  {Number} xy.y
	         *
	         * @return {Region}    The new region, with top==xy.y, bottom = xy.y and left==xy.x, right==xy.x
	         */
	        fromPoint: function(xy){
	            return new REGION({
	                        top    : xy.y,
	                        bottom : xy.y,
	                        left   : xy.x,
	                        right  : xy.x
	                    })
	        }
	    }

	    Object.keys(statics).forEach(function(key){
	        REGION[key] = statics[key]
	    })

	    REGION.init()
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _reactDom = __webpack_require__(1);

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(1);
	var assign = __webpack_require__(5);
	var Toolbar = __webpack_require__(19);
	var Region = Toolbar.Region;
	var normalize = __webpack_require__(20);

	var WHITESPACE = '\xA0';
	function sortAsc(a, b) {
		return a - b;
	}

	function emptyFn() {}

	function gotoPrev(props) {
		return React.createElement(
			'svg',
			_extends({ version: '1.1', viewBox: '0 0 2 3' }, props),
			React.createElement('polygon', { points: '2,0 2,3 0,1.5 ' })
		);
	}

	function gotoNext(props) {
		return React.createElement(
			'svg',
			_extends({ version: '1.1', viewBox: '0 0 2 3' }, props),
			React.createElement('polygon', { points: '0,0 2,1.5 0,3' })
		);
	}

	function gotoFirst(props) {
		return React.createElement(
			'svg',
			_extends({ version: '1.1', viewBox: '0 0 3 3' }, props),
			React.createElement('polygon', { points: '3,0 3,3 1,1.5' }),
			React.createElement('rect', { height: '3', width: '0.95', y: '0', x: '0' })
		);
	}

	function gotoLast(props) {
		return React.createElement(
			'svg',
			_extends({ version: '1.1', viewBox: '0 0 3 3' }, props),
			React.createElement('polygon', { points: '0,0 0,3 2,1.5' }),
			React.createElement('rect', { height: '3', width: '0.95', y: '0', x: '2' })
		);
	}

	function refresh(props) {
		return React.createElement(
			'svg',
			_extends({ version: '1.1', x: '0px', y: '0px', viewBox: '0 0 487.23 487.23' }, props),
			React.createElement(
				'g',
				null,
				React.createElement('path', { d: 'M55.323,203.641c15.664,0,29.813-9.405,35.872-23.854c25.017-59.604,83.842-101.61,152.42-101.61 c37.797,0,72.449,12.955,100.23,34.442l-21.775,3.371c-7.438,1.153-13.224,7.054-14.232,14.512 c-1.01,7.454,3.008,14.686,9.867,17.768l119.746,53.872c5.249,2.357,11.33,1.904,16.168-1.205 c4.83-3.114,7.764-8.458,7.796-14.208l0.621-131.943c0.042-7.506-4.851-14.144-12.024-16.332 c-7.185-2.188-14.947,0.589-19.104,6.837l-16.505,24.805C370.398,26.778,310.1,0,243.615,0C142.806,0,56.133,61.562,19.167,149.06 c-5.134,12.128-3.84,26.015,3.429,36.987C29.865,197.023,42.152,203.641,55.323,203.641z' }),
				React.createElement('path', { d: 'M464.635,301.184c-7.27-10.977-19.558-17.594-32.728-17.594c-15.664,0-29.813,9.405-35.872,23.854 c-25.018,59.604-83.843,101.61-152.42,101.61c-37.798,0-72.45-12.955-100.232-34.442l21.776-3.369 c7.437-1.153,13.223-7.055,14.233-14.514c1.009-7.453-3.008-14.686-9.867-17.768L49.779,285.089 c-5.25-2.356-11.33-1.905-16.169,1.205c-4.829,3.114-7.764,8.458-7.795,14.207l-0.622,131.943 c-0.042,7.506,4.85,14.144,12.024,16.332c7.185,2.188,14.948-0.59,19.104-6.839l16.505-24.805 c44.004,43.32,104.303,70.098,170.788,70.098c100.811,0,187.481-61.561,224.446-149.059 C473.197,326.043,471.903,312.157,464.635,301.184z' })
			)
		);
	}

	function separator(props) {

		if (props.showSeparators === false) {
			return;
		}

		var margin = 5;
		var width = 2;
		var color = props.iconProps.style.fill;

		var result;

		var sepProps = {
			width: 2,
			margin: 5,
			color: color
		};

		if (props.separatorFactory) {
			result = props.separatorFactory(sepProps);
		}

		if (result !== undefined) {
			return result;
		}

		var style = normalize({
			marginLeft: sepProps.margin,
			marginRight: sepProps.margin,
			width: sepProps.width,
			background: sepProps.color,
			display: 'inline-block',
			alignSelf: 'stretch'
		});

		return React.createElement('span', { style: style });
	}

	var ICON_MAP = {
		gotoFirst: gotoFirst,
		gotoLast: gotoLast,
		gotoPrev: gotoPrev,
		gotoNext: gotoNext,
		refresh: refresh
	};

	var defaultStyles = {
		// gotoPrev: { marginRight: 10},
		// gotoNext: { marginLeft: 10}
	};

	module.exports = React.createClass({

		displayName: 'PaginationToolbar',

		getDefaultProps: function getDefaultProps() {
			return {
				iconSize: 20,
				showRefreshIcon: true,
				showPageSize: true,
				defaultStyle: {
					color: 'inherit'
				},

				pageSizes: [10, 20, 50, 100, 200, 500, 1000],

				theme: '',

				defaultIconProps: {
					version: '1.2',
					style: {
						cursor: 'pointer',
						marginLeft: 3,
						marginRight: 3,
						fill: '#8E8E8E',
						verticalAlign: 'middle'
					},
					disabledStyle: {
						cursor: 'auto',
						fill: '#DFDCDC'
					},
					overStyle: {
						fill: 'gray'
					}
				}
			};
		},

		getInitialState: function getInitialState() {
			return {
				mouseOver: {}
			};
		},

		prepareProps: function prepareProps(thisProps) {
			var props = assign({}, thisProps);

			props.className = this.prepareClassName(props);
			props.iconProps = this.prepareIconProps(props);
			props.style = this.prepareStyle(props);
			props.pageSizes = this.preparePageSizes(props);
			delete props.defaultStyle;

			return props;
		},

		prepareClassName: function prepareClassName(props) {
			var className = props.className || '';

			className += ' react-datagrid-pagination-toolbar';

			return className;
		},

		preparePageSizes: function preparePageSizes(props) {
			var sizes = [].concat(props.pageSizes);

			if (sizes.indexOf(props.pageSize) == -1) {
				sizes.push(props.pageSize);
			}

			return sizes.sort(sortAsc);
		},

		prepareIconProps: function prepareIconProps(props) {
			var iconProps = assign({}, props.defaultIconProps);
			var defaultIconStyle = iconProps.style;
			var defaultIconOverStyle = iconProps.overStyle;
			var defaultIconDisabledStyle = iconProps.disabledStyle;

			assign(iconProps, props.iconProps);

			var iconSizeStyle = {};

			if (props.iconSize != null) {
				iconSizeStyle = { width: props.iconSize, height: props.iconSize };
			}

			if (props.iconHeight != null) {
				iconSizeStyle.height = props.iconHeight;
			}
			if (props.iconWidth != null) {
				iconSizeStyle.width = props.iconWidth;
			}

			iconProps.style = assign({}, defaultIconStyle, iconSizeStyle, iconProps.style);
			iconProps.overStyle = assign({}, defaultIconOverStyle, iconProps.overStyle);
			iconProps.disabledStyle = assign({}, defaultIconDisabledStyle, iconProps.disabledStyle);

			return iconProps;
		},

		prepareStyle: function prepareStyle(props) {
			var borderStyle = {};
			var borderName = 'borderTop';

			if (props.position == 'top') {
				borderName = 'borderBottom';
			}

			if (props.border) {
				borderStyle[borderName] = props.border;
			}

			return assign({}, props.defaultStyle, borderStyle, props.style);
		},

		handleInputChange: function handleInputChange(event) {
			var value = event.target.value * 1;

			if (!isNaN(value) && value >= this.props.minPage && value <= this.props.maxPage && value != this.props.page) {
				this.gotoPage(value);
			}
		},

		handleInputBlur: function handleInputBlur() {
			this.setState({
				inputFocused: false
			});
		},

		handleInputFocus: function handleInputFocus() {

			var page = this.props.page;
			this.setState({
				inputFocused: true
			}, function () {

				var domNode = (0, _reactDom.findDOMNode)(this.refs.input);
				domNode.value = page;
			}.bind(this));
		},

		onPageSizeChange: function onPageSizeChange(event) {
			this.props.onPageSizeChange(event.target.value * 1);
		},

		renderInput: function renderInput(props) {
			var otherProps = {};

			if (this.state.inputFocused) {
				otherProps.defaultValue = props.page;
			} else {
				otherProps.value = props.page;
			}

			var inputProps = assign({
				ref: 'input',
				onBlur: this.handleInputBlur,
				onFocus: this.handleInputFocus,
				style: normalize({
					marginLeft: 5,
					marginRight: 5,
					padding: 2,
					maxWidth: 60,
					textAlign: 'right',
					flex: 1,
					minWidth: 40
				}),
				page: props.page,
				onChange: this.handleInputChange
			}, otherProps);

			var defaultFactory = React.DOM.input;
			var factory = props.pageInputFactory || defaultFactory;

			var result = factory(inputProps);

			if (result === undefined) {
				result = defaultFactory(inputProps);
			}

			return result;
		},

		renderSelect: function renderSelect(props) {

			var options = props.pageSizes.map(function (value) {
				return React.createElement(
					'option',
					{ value: value },
					value
				);
			});

			var selectProps = {
				onChange: this.onPageSizeChange,
				value: props.pageSize,
				style: { marginLeft: 5, marginRight: 5, padding: 2, textAlign: 'right' },
				children: options
			};

			var defaultFactory = React.DOM.select;
			var factory = props.pageSizeSelectFactory || defaultFactory;

			var result = factory(selectProps);

			if (result === undefined) {
				result = defaultFactory(selectProps);
			}

			return result;
		},

		renderDisplaying: function renderDisplaying(props) {
			var start = (props.pageSize * (props.page - 1) || 0) + 1;
			var end = Math.min(props.pageSize * props.page, props.dataSourceCount) || 1;
			var refreshIcon = props.showRefreshIcon ? this.icon('refresh', props) : null;
			var sep = refreshIcon ? this.separator : null;

			var factory = props.displayingFactory;

			if (factory) {
				return factory({
					start: start,
					end: end,
					dataSourceCount: props.dataSourceCount,
					page: props.page,
					pageSize: props.pageSize,
					minPage: props.minPage,
					maxPage: props.maxPage,
					reload: this.reload,
					gotoPage: this.gotoPage,
					refreshIcon: refreshIcon
				});
			}

			var textStyle = { display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' };

			return React.createElement(
				'div',
				{ style: normalize({ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }) },
				React.createElement(
					'span',
					{ style: textStyle },
					'Displaying ',
					start,
					' - ',
					end,
					' of ',
					props.dataSourceCount || 1,
					'.'
				),
				sep,
				refreshIcon
			);
		},

		renderPageSize: function renderPageSize(props) {
			if (props.showPageSize) {
				return React.createElement(
					'div',
					null,
					'Page size ',
					this.renderSelect(props)
				);
			}
		},

		render: function render() {

			var props = this.prepareProps(this.props);

			this.separator = separator(props);

			var showPageSize = props.showPageSize;
			var pageSize = showPageSize ? this.renderPageSize(props) : null;

			var start = props.pageSize * (props.page - 1) + 1;
			var end = Math.min(props.pageSize * props.page, props.dataSourceCount);

			var displaying = this.renderDisplaying(props);
			var minWidth = 430;

			if (!showPageSize) {
				minWidth -= 100;
			}

			var sep = this.separator;

			return React.createElement(
				Toolbar,
				props,
				React.createElement(
					Region,
					{ flex: '1 1 auto', style: normalize({ display: 'flex', alignItems: 'center', minWidth: minWidth }) },
					this.icon('gotoFirst', props),
					this.icon('gotoPrev', props),
					sep,
					'Page ',
					this.renderInput(props),
					' of',
					WHITESPACE,
					props.maxPage,
					'.',
					sep,
					this.icon('gotoNext', props),
					this.icon('gotoLast', props),
					showPageSize ? sep : null,
					pageSize
				),
				React.createElement(
					Region,
					{ flex: '1 1 auto' },
					displaying
				)
			);
		},

		icon: function icon(iconName, props) {
			var icon = props[iconName + 'Icon'];

			if (!icon || typeof icon != 'function') {
				var MAP = {
					refresh: props.page,
					gotoFirst: props.minPage,
					gotoLast: props.maxPage,
					gotoPrev: Math.max(props.page - 1, props.minPage),
					gotoNext: Math.min(props.page + 1, props.maxPage)
				};

				var targetPage = MAP[iconName];
				var disabled = targetPage === props.page && iconName != 'refresh';
				var mouseOver = this.state.mouseOver[iconName];

				var iconProps = assign({
					mouseOver: mouseOver,
					name: iconName,
					disabled: disabled
				}, props.iconProps);

				var iconStyle = iconProps.style = assign({}, iconProps.style, defaultStyles[iconName], props.iconStyle, props[iconName + 'IconStyle']);

				if (mouseOver) {
					iconProps.style = assign({}, iconStyle, iconProps.overStyle, props.overIconStyle);
				}
				if (disabled) {
					iconProps.style = assign({}, iconStyle, iconProps.disabledStyle, props.disabledIconStyle);
				} else {
					iconProps.onClick = iconName == 'refresh' ? this.reload : this.gotoPage.bind(this, targetPage);
				}

				iconProps.onMouseEnter = this.onIconMouseEnter.bind(this, props, iconProps);
				iconProps.onMouseLeave = this.onIconMouseLeave.bind(this, props, iconProps);

				var defaultFactory = ICON_MAP[iconName];
				var factory = props[iconName + 'IconFactory'] || defaultFactory;
				icon = factory(iconProps);

				if (icon === undefined) {
					icon = defaultFactory(iconProps);
				}
			}

			return icon;
		},

		onIconMouseEnter: function onIconMouseEnter(props, iconProps) {
			var mouseOver = this.state.mouseOver;

			mouseOver[iconProps.name] = true;

			this.setState({});
		},

		onIconMouseLeave: function onIconMouseLeave(props, iconProps) {
			var mouseOver = this.state.mouseOver;

			mouseOver[iconProps.name] = false;

			this.setState({});
		},

		reload: function reload() {
			;(this.props.reload || emptyFn)();
		},

		gotoPage: function gotoPage(page) {
			this.props.onPageChange(page);
		}
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React     = __webpack_require__(2)
	var normalize = __webpack_require__(20)
	var assign    = __webpack_require__(32)
	var clone = React.cloneElement || __webpack_require__(33)
	var emptyFn = function(){}

	var DISPLAY_NAME = 'ReactToolbar'

	function isRegion(child){
		return child && child.props && child.props.isToolbarRegion
	}

	function toAlign(index, regions){
		if (index == 0){
			return 'left'
		}

		if (index == regions.length - 1){
			return 'right'
		}

		return 'center'
	}

	var THEMES = {
		default: {
			style: {
				//theme styles
				color  : 'rgb(120, 120, 120)',
				border : '1px solid rgb(218, 218, 218)'
			}
		}
	}

	var Toolbar = React.createClass({

		displayName: DISPLAY_NAME,

		getDefaultProps: function() {
			return {
				'data-display-name': DISPLAY_NAME,
				isReactToolbar: true,

				padding: 2,
				theme: 'default',

				defaultStyle  : {
					display  : 'inline-flex',
					boxSizing: 'border-box',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',

					padding: 2
				},

				defaultHorizontalStyle: {
					width       : '100%',
					flexFlow    : 'row',
					alignItems  : 'center', //so items are centered vertically
					alignContent: 'stretch'
				},

				defaultVerticalStyle: {
					height      : '100%',
					flexFlow    : 'column',
					alignItems  : 'stretch',
					alignContent: 'center'
				}
			}
		},

		getInitialState: function(){
			return {}
		},

		render: function(){

			var state = this.state
			var props = this.prepareProps(this.props, state)

			// this.prepareContent(props)

			return React.createElement("div", React.__spread({},  props))
		},

		prepareContent: function(props){

			// var style = {
			// 	display : 'inline-flex',
			// 	position: 'relative',
			// 	overflow: 'hidden',
			// 	flex    : '1 0 0',
			// 	padding : props.style.padding
			// }

			// props.style.padding = 0
		},

		prepareProps: function(thisProps, state) {
			var props = assign({}, thisProps)

			props.vertical = props.orientation == 'vertical'
			props.style    = this.prepareStyle(props, state)
			props.children = this.prepareChildren(props, state)

			return props
		},

		prepareStyle: function(props, state) {

			var defaultOrientationStyle = props.defaultHorizontalStyle
			var orientationStyle = props.horizontalStyle

			if (props.vertical){
				defaultOrientationStyle = props.defaultVerticalStyle
				orientationStyle = props.verticalStyle
			}

			var themes     = Toolbar.themes || {}
			var theme      = themes[props.theme]
			var themeStyle = theme? theme.style: null

			var style = assign({}, props.defaultStyle, defaultOrientationStyle, themeStyle, props.style, orientationStyle)

			return normalize(style)
		},

		prepareChildren: function(props) {

			var regionCount = 0

			var children = []
			var regions  = []

			React.Children.forEach(props.children, function(child){
				if (isRegion(child)){
					regions.push(child)
					regionCount++
				}
			}, this)


			var regionIndex = -1
			React.Children.forEach(props.children, function(child){
				if (isRegion(child)){
					regionIndex++
					child = this.prepareRegion(child, regionIndex, regions)
				}

				children.push(child)
			}, this)

			if (!regionCount){
				return this.prepareRegion(
					React.createElement(Toolbar.Region, null, 
						children
					)
				)
			}

			return children
		},

		prepareRegion: function(region, index, regions) {
			index   = index   || 0
			regions = regions || []

			var props = this.props
			var regionStyle = assign({}, props.defaultRegionStyle, props.regionStyle)

			if (props.padding){
				regionStyle.padding = props.padding
			}

			var style = assign({}, regionStyle, region.props.style)
			var align = region.props.align || toAlign(index, regions)


			return clone(region, {
				style: style,
				align: align
			})
		}
	})

	Toolbar.Region = __webpack_require__(34)
	Toolbar.themes = THEMES

	module.exports = Toolbar

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn      = __webpack_require__(21)
	var getPrefixed = __webpack_require__(22)

	var map      = __webpack_require__(28)
	var plugable = __webpack_require__(29)

	function plugins(key, value){

		var result = {
			key  : key,
			value: value
		}

		;(RESULT.plugins || []).forEach(function(fn){

			var tmp = map(function(res){
				return fn(key, value, res)
			}, result)

			if (tmp){
				result = tmp
			}
		})

		return result
	}

	function normalize(key, value){

		var result = plugins(key, value)

		return map(function(result){
			return {
				key  : getPrefixed(result.key, result.value),
				value: result.value
			}
		}, result)

		return result
	}

	var RESULT = function(style){

		var k
		var item
		var result = {}

		for (k in style) if (hasOwn(style, k)){
			item = normalize(k, style[k])

			if (!item){
				continue
			}

			map(function(item){
				result[item.key] = item.value
			}, item)
		}

		return result
	}

	module.exports = plugable(RESULT)

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(obj, prop){
		return Object.prototype.hasOwnProperty.call(obj, prop)
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getStylePrefixed = __webpack_require__(23)
	var properties       = __webpack_require__(27)

	module.exports = function(key, value){

		if (!properties[key]){
			return key
		}

		return getStylePrefixed(key, value)
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(24)
	var getPrefix    = __webpack_require__(25)
	var el           = __webpack_require__(26)

	var MEMORY = {}
	var STYLE
	var ELEMENT

	var PREFIX

	module.exports = function(key, value){

	    ELEMENT = ELEMENT || el()
	    STYLE   = STYLE   || ELEMENT.style

	    var k = key// + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix
	    var prefixed

	    if (!(key in STYLE)){//we have to prefix

	        // if (PREFIX){
	        //     prefix = PREFIX
	        // } else {
	            prefix = getPrefix('appearance')

	        //     if (prefix){
	        //         prefix = PREFIX = prefix.toLowerCase()
	        //     }
	        // }

	        if (prefix){
	            prefixed = prefix + toUpperFirst(key)

	            if (prefixed in STYLE){
	                key = prefixed
	            }
	        }
	    }

	    MEMORY[k] = key

	    return key
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(str){
		return str?
				str.charAt(0).toUpperCase() + str.slice(1):
				''
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(24)
	var prefixes     = ["ms", "Moz", "Webkit", "O"]

	var el = __webpack_require__(26)

	var ELEMENT
	var PREFIX

	module.exports = function(key){

		if (PREFIX !== undefined){
			return PREFIX
		}

		ELEMENT = ELEMENT || el()

		var i = 0
		var len = prefixes.length
		var tmp
		var prefix

		for (; i < len; i++){
			prefix = prefixes[i]
			tmp = prefix + toUpperFirst(key)

			if (typeof ELEMENT.style[tmp] != 'undefined'){
				return PREFIX = prefix
			}
		}

		return PREFIX
	}

/***/ },
/* 26 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var el

	module.exports = function(){

		if(!el && !!global.document){
		  	el = global.document.createElement('div')
		}

		if (!el){
			el = {style: {}}
		}

		return el
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  'alignItems': 1,
	  'justifyContent': 1,
	  'flex': 1,
	  'flexFlow': 1,
	  'flexGrow': 1,
	  'flexShrink': 1,
	  'flexBasis': 1,
	  'flexDirection': 1,
	  'flexWrap': 1,
	  'alignContent': 1,
	  'alignSelf': 1,

	  'userSelect': 1,
	  'transform': 1,
	  'transition': 1,
	  'transformOrigin': 1,
	  'transformStyle': 1,
	  'transitionProperty': 1,
	  'transitionDuration': 1,
	  'transitionTimingFunction': 1,
	  'transitionDelay': 1,
	  'borderImage': 1,
	  'borderImageSlice': 1,
	  'boxShadow': 1,
	  'backgroundClip': 1,
	  'backfaceVisibility': 1,
	  'perspective': 1,
	  'perspectiveOrigin': 1,
	  'animation': 1,
	  'animationDuration': 1,
	  'animationName': 1,
	  'animationDelay': 1,
	  'animationDirection': 1,
	  'animationIterationCount': 1,
	  'animationTimingFunction': 1,
	  'animationPlayState': 1,
	  'animationFillMode': 1,
	  'appearance': 1
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(fn, item){

		if (!item){
			return
		}

		if (Array.isArray(item)){
			return item.map(fn).filter(function(x){
				return !!x
			})
		} else {
			return fn(item)
		}
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getCssPrefixedValue = __webpack_require__(30)

	module.exports = function(target){
		target.plugins = target.plugins || [
			(function(){
				var values = {
					'flex':1,
					'inline-flex':1
				}

				return function(key, value){
					if (key === 'display' && value in values){
						return {
							key  : key,
							value: getCssPrefixedValue(key, value, true)
						}
					}
				}
			})()
		]

		target.plugin = function(fn){
			target.plugins = target.plugins || []

			target.plugins.push(fn)
		}

		return target
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getPrefix     = __webpack_require__(25)
	var forcePrefixed = __webpack_require__(31)
	var el            = __webpack_require__(26)

	var MEMORY = {}
	var STYLE
	var ELEMENT

	module.exports = function(key, value, force){

	    ELEMENT = ELEMENT || el()
	    STYLE   = STYLE   ||  ELEMENT.style

	    var k = key + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix
	    var prefixed
	    var prefixedValue

	    if (force || !(key in STYLE)){

	        prefix = getPrefix('appearance')

	        if (prefix){
	            prefixed = forcePrefixed(key, value)

	            prefixedValue = '-' + prefix.toLowerCase() + '-' + value

	            if (prefixed in STYLE){
	                ELEMENT.style[prefixed] = ''
	                ELEMENT.style[prefixed] = prefixedValue

	                if (ELEMENT.style[prefixed] !== ''){
	                    value = prefixedValue
	                }
	            }
	        }
	    }

	    MEMORY[k] = value

	    return value
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(24)
	var getPrefix    = __webpack_require__(25)
	var properties   = __webpack_require__(27)

	/**
	 * Returns the given key prefixed, if the property is found in the prefixProps map.
	 *
	 * Does not test if the property supports the given value unprefixed.
	 * If you need this, use './getPrefixed' instead
	 */
	module.exports = function(key, value){

		if (!properties[key]){
			return key
		}

		var prefix = getPrefix(key)

		return prefix?
					prefix + toUpperFirst(key):
					key
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var React    = __webpack_require__(2)
	  , hasOwn   = Object.prototype.hasOwnProperty
	  , version  = React.version.split('.').map(parseFloat)
	  , RESERVED = {
	      className:  resolve(joinClasses),
	      children:   function(){},
	      key:        function(){},
	      ref:        function(){},
	      style:      resolve(extend)
	    };

	module.exports = function cloneWithProps(child, props) {
	  var newProps = mergeProps(props, child.props);

	  if (!hasOwn.call(newProps, 'children') && hasOwn.call(child.props, 'children'))
	    newProps.children = child.props.children;

	  // < 0.11
	  if (version[0] === 0 && version[1] < 11)
	    return child.constructor.ConvenienceConstructor(newProps);
	  
	  // 0.11
	  if (version[0] === 0 && version[1] === 11)
	    return child.constructor(newProps);

	  // 0.12
	  else if (version[0] === 0 && version[1] === 12){
	    MockLegacyFactory.isReactLegacyFactory = true
	    MockLegacyFactory.type = child.type
	    return React.createElement(MockLegacyFactory, newProps);
	  }

	  // 0.13+
	  return React.createElement(child.type, newProps);

	  function MockLegacyFactory(){}
	}

	function mergeProps(currentProps, childProps) {
	  var newProps = extend(currentProps), key

	  for (key in childProps) {
	    if (hasOwn.call(RESERVED, key) )
	      RESERVED[key](newProps, childProps[key], key)

	    else if ( !hasOwn.call(newProps, key) )
	      newProps[key] = childProps[key];
	  }
	  return newProps
	}

	function resolve(fn){
	  return function(src, value, key){
	    if( !hasOwn.call(src, key)) src[key] = value
	    else src[key] = fn(src[key], value)
	  }
	}

	function joinClasses(a, b){
	  if ( !a ) return b || ''
	  return a + (b ? ' ' + b : '')
	}

	function extend() {
	  var target = {};
	  for (var i = 0; i < arguments.length; i++) 
	    for (var key in arguments[i]) if (hasOwn.call(arguments[i], key)) 
	      target[key] = arguments[i][key]   
	  return target
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React     = __webpack_require__(2)
	var normalize = __webpack_require__(20)
	var assign    = __webpack_require__(32)

	var cloneWithProps = React.cloneElement || __webpack_require__(33)
	var DISPLAY_NAME   = 'ReactToolbarRegion'

	var JUSTIFY_MAP = {
		start: 'flex-start',
		left: 'flex-start',

		end: 'flex-end',
		right: 'flex-end'
	}

	var TEXT_ALIGN = {
		start: 'left',
		left : 'left',

		right: 'right',
		end  :'right'
	}

	module.exports = React.createClass({

		displayName: DISPLAY_NAME,

		getDefaultProps: function(){
			return {
				'data-display-name': DISPLAY_NAME,

				isToolbarRegion: true,

				flex: 1,
				flexShrink: null,
				flexBasis : null,

				defaultStyle: {
					boxSizing   : 'border-box',

					// alignSelf   : 'center',
					alignItems  : 'center',
					flexShrink  : 1,
					flexBasis   : 0,

					position    : 'relative',
					display     : 'inline-block',

					overflow    : 'hidden',
					whiteSpace  : 'nowrap',
					textOverflow: 'ellipsis',
				},

				defaultHorizontalStyle: {
					// display : 'inline-flex',
					flexFlow: 'row'
				},

				defaultVerticalStyle: {
					// display : 'flex',
					flexFlow: 'column'
				}
			}
		},

		render: function(){
			var props = this.prepareProps(this.props)

			return React.createElement("div", React.__spread({},  props))
		},


		prepareProps: function(thisProps) {
			var props = assign({}, thisProps)

			props.vertical = props.orientation == 'vertical'
			props.style    = this.prepareStyle(props)

			return props
		},

		prepareStyle: function(props) {
			var alignStyle = {
				justifyContent: JUSTIFY_MAP[props.align] || 'center',
				textAlign     : TEXT_ALIGN[props.align] || 'center'
			}

			var defaultOrientationStyle = props.defaultHorizontalStyle
			var orientationStyle = props.horizontalStyle

			if (props.vertical){
				defaultOrientationStyle = props.defaultVerticalStyle
				orientationStyle = props.verticalStyle
			}

			var style = assign({},
							props.defaultStyle,
							defaultOrientationStyle,
							props.style,
							orientationStyle,
							alignStyle
						)

			if (props.flex !== false && props.flex != null){
				var flex
				var flexShrink = 0
				var flexBasis  = 0

				if (typeof props.flex == 'number'){
					flex = props.flex + ' ' + (props.flexShrink || style.flexShrink || flexShrink) + ' ' + (props.flexBasis || style.flexBasis || flexBasis)
				} else {
					flex = props.flex
				}

				style.flex = flex
			}

			return normalize(style)
		}
	})

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var humanize = __webpack_require__(36).humanize;
	var assign = __webpack_require__(5);

	function getVisibleInfo(col) {
	    var visible = true;
	    var defaultVisible;

	    if (col.hidden != null) {
	        visible = !col.hidden;
	    } else if (col.visible != null) {
	        visible = !!col.visible;
	    } else {
	        //no visible or hidden specified
	        //so we look for defaultVisible/defaultHidden

	        if (col.defaultHidden != null) {
	            defaultVisible = !col.defaultHidden;
	        } else if (col.defaultVisible != null) {
	            defaultVisible = !!col.defaultVisible;
	        }

	        visible = defaultVisible;
	    }

	    return {
	        visible: visible,
	        defaultVisible: defaultVisible
	    };
	}

	var Column = function Column(col, props) {

	    col = assign({}, Column.defaults, col);

	    //title
	    if (!col.title) {
	        col.title = humanize(col.name);
	    }

	    //sortable
	    if (props && !props.sortable) {
	        col.sortable = false;
	    }
	    col.sortable = !!col.sortable;

	    //resizable
	    if (props && props.resizableColumns === false) {
	        col.resizable = false;
	    }
	    col.resizable = !!col.resizable;

	    //filterable
	    if (props && props.filterable === false) {
	        col.filterable = false;
	    }
	    col.filterable = !!col.filterable;

	    var visibleInfo = getVisibleInfo(col);
	    var visible = visibleInfo.visible;

	    if (visibleInfo.defaultVisible != null) {
	        col.defaultHidden = !visibleInfo.defaultVisible;
	        col.defaultVisible = visibleInfo.defaultVisible;
	    }

	    //hidden
	    col.hidden = !visible;
	    //visible
	    col.visible = visible;

	    if (col.width == null && col.defaultWidth) {
	        col.width = col.defaultWidth;
	    }

	    //flexible
	    col.flexible = !col.width;

	    return col;
	};

	Column.displayName = 'Column';

	Column.defaults = {
	    sortable: true,
	    filterable: true,
	    resizable: true,
	    defaultVisible: true,
	    type: 'string'
	};

	module.exports = Column;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    toLowerFirst     : __webpack_require__(37),
	    toUpperFirst     : __webpack_require__(38),
	    separate         : __webpack_require__(39),
	    stripWhitespace  : __webpack_require__(40),
	    compactWhitespace: __webpack_require__(41),
	    camelize         : __webpack_require__(42),
	    humanize         : __webpack_require__(44),
	    hyphenate        : __webpack_require__(45),
	    endsWith         : __webpack_require__(46),

	    is: __webpack_require__(47)
	}

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = function(str){
	    return str.length?
	            str.charAt(0).toLowerCase() + str.substring(1):
	            str
	}

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(value){
	    return value.length?
	                value.charAt(0).toUpperCase() + value.substring(1):
	                value
	}

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict'

	var doubleColonRe      = /::/g
	var upperToLowerRe     = /([A-Z]+)([A-Z][a-z])/g
	var lowerToUpperRe     = /([a-z\d])([A-Z])/g
	var underscoreToDashRe = /_/g

	module.exports = function(name, separator){

	   return name?
	           name.replace(doubleColonRe, '/')
	                .replace(upperToLowerRe, '$1_$2')
	                .replace(lowerToUpperRe, '$1_$2')
	                .replace(underscoreToDashRe, separator || '-')
	            :
	            ''
	}

/***/ },
/* 40 */
/***/ function(module, exports) {

	var RE = /\s/g

	module.exports = function(str){
	    if (!str){
	        return ''
	    }

	    return str.replace(RE, '')
	}

/***/ },
/* 41 */
/***/ function(module, exports) {

	var RE = /\s+/g

	module.exports = function(str){
	    if (!str){
	        return ''
	    }

	    return str.trim().replace(RE, ' ')
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var toCamelFn = function(str, letter){
	       return letter ? letter.toUpperCase(): ''
	   }

	var hyphenRe = __webpack_require__(43)

	module.exports = function(str){
	   return str?
	          str.replace(hyphenRe, toCamelFn):
	          ''
	}

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = /[-\s]+(.)?/g

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var separate     = __webpack_require__(39)
	var camelize     = __webpack_require__(42)
	var toUpperFirst = __webpack_require__(38)
	var hyphenRe     = __webpack_require__(43)

	function toLowerAndSpace(str, letter){
	    return letter? ' ' + letter.toLowerCase(): ' '
	}

	module.exports = function(name, config){

	    var str = config && config.capitalize?
	                    separate(camelize(name), ' '):
	                    separate(name, ' ').replace(hyphenRe, toLowerAndSpace)

	    return toUpperFirst(str.trim())
	}


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var separate = __webpack_require__(39)

	module.exports = function(name){
	   return separate(name).toLowerCase()
	}

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(str, endsWith){

	    str += ''

	    if (!str){
	        return typeof endsWith == 'string'?
	                    !endsWith:
	                    false
	    }

	    endsWith += ''

	    if (str.length < endsWith.length){
	        return false
	    }

	    return str.lastIndexOf(endsWith) == str.length - endsWith.length
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    alphanum: __webpack_require__(48),
	    match   : __webpack_require__(49),
	    guid   : __webpack_require__(63),
	    // email   : require('./email'),
	    numeric   : __webpack_require__(64)
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = __webpack_require__(49)(/^[a-zA-Z0-9]+$/)

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var F = __webpack_require__(50)

	module.exports = F.curry(function(re, value){
	    return !!re.test(value)
	})

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	    var setImmediate = function(fn){
	        setTimeout(fn, 0)
	    }
	    var clearImmediate = clearTimeout
	    /**
	     * Utility methods for working with functions.
	     * These methods augment the Function prototype.
	     *
	     * Using {@link #before}
	     *
	     *      function log(m){
	     *          console.log(m)
	     *      }
	     *
	     *      var doLog = function (m){
	     *          console.log('LOG ')
	     *      }.before(log)
	     *
	     *      doLog('test')
	     *      //will log
	     *      //"LOG "
	     *      //and then
	     *      //"test"
	     *
	     *
	     *
	     * Using {@link #bindArgs}:
	     *
	     *      //returns the sum of all arguments
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1 = add.bindArgs(1)
	     *
	     *      add1(2, 3) == 6
	     *
	     * Using {@link #lockArgs}:
	     *
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1_2   = add.lockArgs(1,2)
	     *      var add1_2_3 = add.lockArgs(1,2,3)
	     *
	     *      add1_2(3,4)  == 3 //args are locked to only be 1 and 2
	     *      add1_2_3(6)  == 6 //args are locked to only be 1, 2 and 3
	     *
	     *
	     *
	     * Using {@link #compose}:
	     *
	     *      function multiply(a,b){
	     *          return a* b
	     *      }
	     *
	     *      var multiply2 = multiply.curry()(2)
	     *
	     *      Function.compose(multiply2( add(5,6) )) == multiply2( add(5,6) )
	     *
	     *
	     * @class Function
	     */

	    var SLICE = Array.prototype.slice

	    var curry = __webpack_require__(51),

	        findFn = function(fn, target, onFound){
	            // if (typeof target.find == 'function'){
	            //     return target.find(fn)
	            // }

	            onFound = typeof onFound == 'function'?
	                        onFound:
	                        function(found, key, target){
	                            return found
	                        }

	            if (Array.isArray(target)){
	                var i   = 0
	                var len = target.length
	                var it

	                for(; i < len; i++){
	                    it = target[i]
	                    if (fn(it, i, target)){
	                        return onFound(it, i, target)
	                    }
	                }

	                return
	            }

	            if (typeof target == 'object'){
	                var keys = Object.keys(target)
	                var i = 0
	                var len = keys.length
	                var k
	                var it

	                for( ; i < len; i++){
	                    k  = keys[i]
	                    it = target[k]

	                    if (fn(it, k, target)){
	                        return onFound(it, k, target)
	                    }
	                }
	            }
	        },

	        find = curry(findFn, 2),

	        findIndex = curry(function(fn, target){
	            return findFn(fn, target, function(it, i){
	                return i
	            })
	        }),

	        bindFunctionsOf = function(obj) {
	            Object.keys(obj).forEach(function(k){
	                if (typeof obj[k] == 'function'){
	                    obj[k] = obj[k].bind(obj)
	                }
	            })

	            return obj
	        },

	        /*
	         * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	         *
	         * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	         *
	         * @return the result of the first function in the enumeration
	         */
	        compose = __webpack_require__(52),

	        chain = __webpack_require__(53),

	        once = __webpack_require__(54),

	        bindArgsArray = __webpack_require__(55),

	        bindArgs = __webpack_require__(56),

	        lockArgsArray = __webpack_require__(57),

	        lockArgs = __webpack_require__(58),

	        skipArgs = function(fn, count){
	            return function(){
	                var args = SLICE.call(arguments, count || 0)

	                return fn.apply(this, args)
	            }
	        },

	        intercept = function(interceptedFn, interceptingFn, withStopArg){

	            return function(){
	                var args    = [].from(arguments),
	                    stopArg = { stop: false }

	                if (withStopArg){
	                    args.push(stopArg)
	                }

	                var result = interceptingFn.apply(this, args)

	                if (withStopArg){
	                    if (stopArg.stop === true){
	                        return result
	                    }

	                } else {
	                    if (result === false){
	                        return result
	                    }
	                }

	                //the interception was not stopped
	                return interceptedFn.apply(this, arguments)
	            }

	        },

	        delay = function(fn, delay, scope){

	            var delayIsNumber = delay * 1 == delay

	            if (arguments.length == 2 && !delayIsNumber){
	                scope = delay
	                delay = 0
	            } else {
	                if (!delayIsNumber){
	                    delay = 0
	                }
	            }

	            return function(){
	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                if (delay || !setImmediate){
	                    setTimeout(function(){
	                        fn.apply(self, args)
	                    }, delay)

	                } else {
	                    setImmediate(function(){
	                        fn.apply(self, args)
	                    })
	                }
	            }
	        },

	        defer = function(fn, scope){
	            return delay(fn, 0, scope)
	        },

	        buffer = function(fn, delay, scope){

	            var timeoutId = -1

	            return function(){

	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                var withTimeout = delay || !setImmediate,
	                    clearFn = withTimeout?
	                                clearTimeout:
	                                clearImmediate,
	                    setFn   = withTimeout?
	                                setTimeout:
	                                setImmediate

	                if (timeoutId !== -1){
	                    clearFn(timeoutId)
	                }

	                timeoutId = setFn(function(){
	                    fn.apply(self, args)
	                    self = null
	                }, delay)

	            }

	        },

	        throttle = function(fn, delay, scope) {
	            var timeoutId = -1,
	                self,
	                args

	            return function () {

	                self = scope || this
	                args = arguments

	                if (timeoutId !== -1) {
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function () {
	                        fn.apply(self, args)

	                        self = null
	                        timeoutId = -1
	                    }, delay)
	                }

	            }

	        },

	        spread = function(fn, delay, scope){

	            var timeoutId       = -1
	            var callCount       = 0
	            var executeCount    = 0
	            var nextArgs        = {}
	            var increaseCounter = true
	            var resultingFnUnbound
	            var resultingFn

	            resultingFn = resultingFnUnbound = function(){

	                var args = arguments,
	                    self = scope || this

	                if (increaseCounter){
	                    nextArgs[callCount++] = {args: args, scope: self}
	                }

	                if (timeoutId !== -1){
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function(){
	                        fn.apply(self, args)

	                        timeoutId = -1
	                        executeCount++

	                        if (callCount !== executeCount){
	                            resultingFn = bindArgsArray(resultingFnUnbound, nextArgs[executeCount].args).bind(nextArgs[executeCount].scope)
	                            delete nextArgs[executeCount]

	                            increaseCounter = false
	                            resultingFn.apply(self)
	                            increaseCounter = true
	                        } else {
	                            nextArgs = {}
	                        }
	                    }, delay)
	                }

	            }

	            return resultingFn
	        },

	        /*
	         * @param {Array} args the array for which to create a cache key
	         * @param {Number} [cacheParamNumber] the number of args to use for the cache key. Use this to limit the args that area actually used for the cache key
	         */
	        getCacheKey = function(args, cacheParamNumber){
	            if (cacheParamNumber == null){
	                cacheParamNumber = -1
	            }

	            var i        = 0,
	                len      = Math.min(args.length, cacheParamNumber),
	                cacheKey = [],
	                it

	            for ( ; i < len; i++){
	                it = args[i]

	                if (root.check.isPlainObject(it) || Array.isArray(it)){
	                    cacheKey.push(JSON.stringify(it))
	                } else {
	                    cacheKey.push(String(it))
	                }
	            }

	            return cacheKey.join(', ')
	        },

	        /*
	         * @param {Function} fn - the function to cache results for
	         * @param {Number} skipCacheParamNumber - the index of the boolean parameter that makes this function skip the caching and
	         * actually return computed results.
	         * @param {Function|String} cacheBucketMethod - a function or the name of a method on this object which makes caching distributed across multiple buckets.
	         * If given, cached results will be searched into the cache corresponding to this bucket. If no result found, return computed result.
	         *
	         * For example this param is very useful when a function from a prototype is cached,
	         * but we want to return the same cached results only for one object that inherits that proto, not for all objects. Thus, for example for Wes.Element,
	         * we use the 'getId' cacheBucketMethod to indicate cached results for one object only.
	         * @param {Function} [cacheKeyBuilder] A function to be used to compose the cache key
	         *
	         * @return {Function} a new function, which returns results from cache, if they are available, otherwise uses the given fn to compute the results.
	         * This returned function has a 'clearCache' function attached, which clears the caching. If a parameter ( a bucket id) is  provided,
	         * only clears the cache in the specified cache bucket.
	         */
	        cache = function(fn, config){
	            config = config || {}

	            var bucketCache = {},
	                cache       = {},
	                skipCacheParamNumber = config.skipCacheIndex,
	                cacheBucketMethod    = config.cacheBucket,
	                cacheKeyBuilder      = config.cacheKey,
	                cacheArgsLength      = skipCacheParamNumber == null?
	                                            fn.length:
	                                            skipCacheParamNumber,
	                cachingFn

	            cachingFn = function(){
	                var result,
	                    skipCache = skipCacheParamNumber != null?
	                                                arguments[skipCacheParamNumber] === true:
	                                                false,
	                    args = skipCache?
	                                    SLICE.call(arguments, 0, cacheArgsLength):
	                                    SLICE.call(arguments),

	                    cacheBucketId = cacheBucketMethod != null?
	                                        typeof cacheBucketMethod == 'function'?
	                                            cacheBucketMethod():
	                                            typeof this[cacheBucketMethod] == 'function'?
	                                                this[cacheBucketMethod]():
	                                                null
	                                        :
	                                        null,


	                    cacheObject = cacheBucketId?
	                                        bucketCache[cacheBucketId]:
	                                        cache,

	                    cacheKey = (cacheKeyBuilder || getCacheKey)(args, cacheArgsLength)

	                if (cacheBucketId && !cacheObject){
	                    cacheObject = bucketCache[cacheBucketId] = {}
	                }

	                if (skipCache || cacheObject[cacheKey] == null){
	                    cacheObject[cacheKey] = result = fn.apply(this, args)
	                } else {
	                    result = cacheObject[cacheKey]
	                }

	                return result
	            }

	            /*
	             * @param {String|Object|Number} [bucketId] the bucket for which to clear the cache. If none given, clears all the cache for this function.
	             */
	            cachingFn.clearCache = function(bucketId){
	                if (bucketId){
	                    delete bucketCache[String(bucketId)]
	                } else {
	                    cache = {}
	                    bucketCache = {}
	                }
	            }

	            /*
	             *
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getCache = function(cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.getBucketCache(null, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket from which to retrieve the cached value
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getBucketCache = function(bucketId, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId);

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {}
	                }

	                return cacheObject[cacheKey]
	            }

	            /*
	             *
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setCache = function(value, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.setBucketCache(null, value, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket for which to set the cache value
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setBucketCache = function(bucketId, value, cacheArgs, cacheParamNumber, cacheKeyBuilder){

	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId)

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {};
	                }

	                return cacheObject[cacheKey] = value
	            }

	            return cachingFn
	        }

	module.exports = {

	    map: __webpack_require__(59),

	    dot: __webpack_require__(60),

	    maxArgs: __webpack_require__(61),

	    /**
	     * @method compose
	     *
	     * Example:
	     *
	     *      zippy.Function.compose(c, b, a)
	     *
	     * See {@link Function#compose}
	     */
	    compose: compose,

	    /**
	     * See {@link Function#self}
	     */
	    self: function(fn){
	        return fn
	    },

	    /**
	     * See {@link Function#buffer}
	     */
	    buffer: buffer,

	    /**
	     * See {@link Function#delay}
	     */
	    delay: delay,

	    /**
	     * See {@link Function#defer}
	     * @param {Function} fn
	     * @param {Object} scope
	     */
	    defer:defer,

	    /**
	     * See {@link Function#skipArgs}
	     * @param {Function} fn
	     * @param {Number} [count=0] how many args to skip when calling the resulting function
	     * @return {Function} The function that will call the original fn without the first count args.
	     */
	    skipArgs: skipArgs,

	    /**
	     * See {@link Function#intercept}
	     */
	    intercept: function(fn, interceptedFn, withStopArgs){
	        return intercept(interceptedFn, fn, withStopArgs)
	    },

	    /**
	     * See {@link Function#throttle}
	     */
	    throttle: throttle,

	    /**
	     * See {@link Function#spread}
	     */
	    spread: spread,

	    /**
	     * See {@link Function#chain}
	     */
	    chain: function(fn, where, mainFn){
	        return chain(where, mainFn, fn)
	    },

	    /**
	     * See {@link Function#before}
	     */
	    before: function(fn, otherFn){
	        return chain('before', otherFn, fn)
	    },

	    /**
	     * See {@link Function#after}
	     */
	    after: function(fn, otherFn){
	        return chain('after', otherFn, fn)
	    },

	    /**
	     * See {@link Function#curry}
	     */
	    curry: curry,

	    /**
	     * See {@link Function#once}
	     */
	    once: once,

	    /**
	     * See {@link Function#bindArgs}
	     */
	    bindArgs: bindArgs,

	    /**
	     * See {@link Function#bindArgsArray}
	     */
	    bindArgsArray: bindArgsArray,

	    /**
	     * See {@link Function#lockArgs}
	     */
	    lockArgs: lockArgs,

	    /**
	     * See {@link Function#lockArgsArray}
	     */
	    lockArgsArray: lockArgsArray,

	    bindFunctionsOf: bindFunctionsOf,

	    find: find,

	    findIndex: findIndex,

	    newify: __webpack_require__(62)
	}

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict'

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict'

	function composeTwo(f, g) {
	    return function () {
	        return f(g.apply(this, arguments))
	    }
	}

	/*
	 * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	 *
	 * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	 *
	 * @return the result of the first function in the enumeration
	 */
	module.exports = function(){

	    var args = arguments
	    var len  = args.length
	    var i    = 0
	    var f    = args[0]

	    while (++i < len) {
	        f = composeTwo(f, args[i])
	    }

	    return f
	}

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict'

	function chain(where, fn, secondFn){

	    return function(){
	        if (where === 'before'){
	            secondFn.apply(this, arguments)
	        }

	        var result = fn.apply(this, arguments)

	        if (where !== 'before'){
	            secondFn.apply(this, arguments)
	        }

	        return result
	    }
	}

	module.exports = chain

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use once'

	function once(fn, scope){

	    var called
	    var result

	    return function(){
	        if (called){
	            return result
	        }

	        called = true

	        return result = fn.apply(scope || this, arguments)
	    }
	}

	module.exports = once

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){
	    return function(){
	        var thisArgs = SLICE.call(args || [])

	        if (arguments.length){
	            thisArgs.push.apply(thisArgs, arguments)
	        }

	        return fn.apply(this, thisArgs)
	    }
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var bindArgsArray = __webpack_require__(55)

	module.exports = function(fn){
	    return bindArgsArray(fn, SLICE.call(arguments,1))
	}

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){

	    return function(){
	        if (!Array.isArray(args)){
	            args = SLICE.call(args || [])
	        }

	        return fn.apply(this, args)
	    }
	}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var lockArgsArray = __webpack_require__(57)

	module.exports = function(fn){
	    return lockArgsArray(fn, SLICE.call(arguments, 1))
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(51)

	module.exports = curry(function(fn, value){
	    return value != undefined && typeof value.map?
	            value.map(fn):
	            fn(value)
	})

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(51)

	module.exports = curry(function(prop, value){
	    return value != undefined? value[prop]: undefined
	})

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var curry = __webpack_require__(51)

	module.exports = function(fn, count){
	    return function(){
	        return fn.apply(this, SLICE.call(arguments, 0, count))
	    }
	}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var newify = __webpack_require__(11)
	var curry  = __webpack_require__(51)

	module.exports = curry(newify)

/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict'

	var regex = /^[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}$/i
	var regex2 = /^\{[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}\}$/i

	module.exports = function(value){
	    return regex.test(value) || regex2.test(value)
	}



/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = __webpack_require__(65).numeric

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(66)

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	    'numeric'  : __webpack_require__(67),
	    'number'   : __webpack_require__(68),
	    'int'      : __webpack_require__(69),
	    'float'    : __webpack_require__(70),
	    'string'   : __webpack_require__(71),
	    'function' : __webpack_require__(72),
	    'object'   : __webpack_require__(73),
	    'arguments': __webpack_require__(74),
	    'boolean'  : __webpack_require__(75),
	    'date'     : __webpack_require__(76),
	    'regexp'   : __webpack_require__(77),
	    'array'    : __webpack_require__(78)
	}

/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(value){
	    return !isNaN( parseFloat( value ) ) && isFinite( value )
	}

/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(value){
	    return typeof value === 'number' && isFinite(value)
	}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(68)

	module.exports = function(value){
	    return number(value) && (value === parseInt(value, 10))
	}

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(68)

	module.exports = function(value){
	    return number(value) && (value === parseFloat(value, 10)) && !(value === parseInt(value, 10))
	}

/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'string'
	}

/***/ },
/* 72 */
/***/ function(module, exports) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Function]'
	}

/***/ },
/* 73 */
/***/ function(module, exports) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Object]'
	}

/***/ },
/* 74 */
/***/ function(module, exports) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Arguments]' || !!value.callee
	}

/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'boolean'
	}

/***/ },
/* 76 */
/***/ function(module, exports) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Date]'
	}

/***/ },
/* 77 */
/***/ function(module, exports) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object RegExp]'
	}

/***/ },
/* 78 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function(value){
	    return Array.isArray(value)
	}

/***/ },
/* 79 */
/***/ function(module, exports) {

	'use strict';

	function val(fn) {

	    return function (props, propName) {

	        return fn(props[propName], propName, props);
	    };
	}

	module.exports = {
	    numeric: val(function (value, propName) {

	        if (value == null) {
	            return;
	        }
	        if (value * 1 != value) {
	            return new Error('Invalid numeric value for ' + propName);
	        }
	    }),

	    sortInfo: val(function (value) {
	        if (typeof value == 'string' || typeof value == 'number') {
	            return new Error('Invalid sortInfo specified');
	        }
	    }),

	    column: val(function (value, props, propName) {

	        if (!value) {
	            return new Error('No columns specified. Please specify at least one column!');
	        }

	        if (!Array.isArray(value)) {
	            value = props[propName] = [value];
	        }

	        var err;

	        value.some(function (col, index) {
	            if (!col.name) {
	                err = new Error('All grid columns must have a name! Column at index ' + index + ' has no name!');
	                return true;
	            }
	        });

	        return err;
	    })
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var assign = __webpack_require__(5);
	var Scroller = __webpack_require__(81);

	function emptyFn() {}

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.Wrapper',

	    propTypes: {
	        scrollLeft: React.PropTypes.number,
	        scrollTop: React.PropTypes.number,
	        scrollbarSize: React.PropTypes.number,
	        rowHeight: React.PropTypes.any,
	        renderCount: React.PropTypes.number
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            scrollLeft: 0,
	            scrollTop: 0
	        };
	    },

	    onMount: function onMount(scroller) {
	        ;(this.props.onMount || emptyFn)(this, scroller);
	    },

	    render: function render() {

	        var props = this.prepareProps(this.props);
	        var rowsCount = props.renderCount;

	        var groupsCount = 0;
	        if (props.groupData) {
	            groupsCount = props.groupData.groupsCount;
	        }

	        rowsCount += groupsCount;

	        // var loadersSize = props.loadersSize
	        var verticalScrollerSize = (props.totalLength + groupsCount) * props.rowHeight; // + loadersSize

	        var content = props.empty ? React.createElement(
	            'div',
	            { className: 'z-empty-text', style: props.emptyTextStyle },
	            props.emptyText
	        ) : React.createElement('div', _extends({}, props.tableProps, { ref: 'table' }));

	        return React.createElement(
	            Scroller,
	            {
	                onMount: this.onMount,
	                preventDefaultHorizontal: true,

	                loadMask: !props.loadMaskOverHeader,
	                loading: props.loading,

	                scrollbarSize: props.scrollbarSize,

	                minVerticalScrollStep: props.rowHeight,
	                scrollTop: props.scrollTop,
	                scrollLeft: props.scrollLeft,

	                scrollHeight: verticalScrollerSize,
	                scrollWidth: props.minRowWidth,

	                onVerticalScroll: this.onVerticalScroll,
	                onHorizontalScroll: this.onHorizontalScroll
	            },
	            content
	        );
	    },

	    onVerticalScrollOverflow: function onVerticalScrollOverflow() {},

	    onHorizontalScrollOverflow: function onHorizontalScrollOverflow() {},

	    onHorizontalScroll: function onHorizontalScroll(scrollLeft) {
	        this.props.onScrollLeft(scrollLeft);
	    },

	    onVerticalScroll: function onVerticalScroll(pos) {
	        this.props.onScrollTop(pos);
	    },

	    prepareProps: function prepareProps(thisProps) {
	        var props = {};

	        assign(props, thisProps);

	        return props;
	    }
	});

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _reactClass = __webpack_require__(82);

	var _reactClass2 = _interopRequireDefault(_reactClass);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(1);

	var LoadMask = __webpack_require__(3);
	var assign = __webpack_require__(5);
	var DragHelper = __webpack_require__(83);
	var normalize = __webpack_require__(20);
	var hasTouch = __webpack_require__(89);

	var preventDefault = function preventDefault(event) {
	  return event && event.preventDefault();
	};
	var signum = function signum(x) {
	  return x < 0 ? -1 : 1;
	};
	var emptyFn = function emptyFn() {};
	var ABS = Math.abs;

	var LoadMaskFactory = _react2['default'].createFactory(LoadMask);

	var horizontalScrollbarStyle = {};

	var IS_MAC = global && global.navigator && global.navigator.appVersion && global.navigator.appVersion.indexOf("Mac") != -1;
	var IS_FIREFOX = global && global.navigator && global.navigator.userAgent && !! ~global.navigator.userAgent.toLowerCase().indexOf('firefox');

	if (IS_MAC) {
	  horizontalScrollbarStyle.position = 'absolute';
	  horizontalScrollbarStyle.height = 20;
	}

	var PT = _react2['default'].PropTypes;
	var DISPLAY_NAME = 'Scroller';

	var ON_OVERFLOW_NAMES = {
	  vertical: 'onVerticalScrollOverflow',
	  horizontal: 'onHorizontalScrollOverflow'
	};

	var ON_SCROLL_NAMES = {
	  vertical: 'onVerticalScroll',
	  horizontal: 'onHorizontalScroll'
	};

	/**
	 * Called on scroll by mouse wheel
	 */
	var syncScrollbar = function syncScrollbar(orientation) {

	  return function (scrollPos, event) {

	    var domNode = orientation == 'horizontal' ? this.getHorizontalScrollbarNode() : this.getVerticalScrollbarNode();
	    var scrollPosName = orientation == 'horizontal' ? 'scrollLeft' : 'scrollTop';
	    var overflowCallback;

	    domNode[scrollPosName] = scrollPos;

	    var newScrollPos = domNode[scrollPosName];

	    if (newScrollPos != scrollPos) {
	      // overflowCallback = this.props[ON_OVERFLOW_NAMES[orientation]]
	      // overflowCallback && overflowCallback(signum(scrollPos), newScrollPos)
	    } else {
	        preventDefault(event);
	      }
	  };
	};

	var syncHorizontalScrollbar = syncScrollbar('horizontal');
	var syncVerticalScrollbar = syncScrollbar('vertical');

	var scrollAt = function scrollAt(orientation) {
	  var syncFn = orientation == 'horizontal' ? syncHorizontalScrollbar : syncVerticalScrollbar;

	  return function (scrollPos, event) {
	    // this.mouseWheelScroll = true

	    syncFn.call(this, Math.round(scrollPos), event);

	    // raf(function(){
	    //     this.mouseWheelScroll = false
	    // }.bind(this))
	  };
	};

	var onScroll = function onScroll(orientation) {

	  var clientHeightNames = {
	    vertical: 'clientHeight',
	    horizontal: 'clientWidth'
	  };

	  var scrollHeightNames = {
	    vertical: 'scrollHeight',
	    horizontal: 'scrollWidth'
	  };

	  return function (event) {

	    var scrollPosName = orientation == 'horizontal' ? 'scrollLeft' : 'scrollTop';
	    var target = event.target;
	    var scrollPos = target[scrollPosName];

	    var onScroll = this.props[ON_SCROLL_NAMES[orientation]];
	    var onOverflow = this.props[ON_OVERFLOW_NAMES[orientation]];

	    // if (!this.mouseWheelScroll && onOverflow){
	    if (onOverflow) {
	      if (scrollPos == 0) {
	        onOverflow(-1, scrollPos);
	      } else if (scrollPos + target[clientHeightNames[orientation]] >= target[scrollHeightNames[orientation]]) {
	        onOverflow(1, scrollPos);
	      }
	    }

	    ;(onScroll || emptyFn)(scrollPos);
	  };
	};

	/**
	 * The scroller can have a load mask (loadMask prop is true by default),
	 * you just need to specify loading=true to see it in action
	 *
	 * <Scroller loading={true} />
	 *
	 * If you don't want a load mask, specify
	 *
	 * <Scroller loadMask={false} />
	 *
	 * Or if you want to customize the loadMask factory, specify
	 *
	 * function mask(props) { return aMaskFactory(props) }
	 * <Scroller loading={true} loadMask={mask}
	 *
	 */

	var Scroller = (function (_Component) {
	  _inherits(Scroller, _Component);

	  function Scroller() {
	    _classCallCheck(this, Scroller);

	    _get(Object.getPrototypeOf(Scroller.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(Scroller, [{
	    key: 'render',
	    value: function render() {
	      var props = this.p = this.prepareProps(this.props);

	      var loadMask = this.renderLoadMask(props);
	      var horizontalScrollbar = this.renderHorizontalScrollbar(props);
	      var verticalScrollbar = this.renderVerticalScrollbar(props);

	      var events = {};

	      if (!hasTouch) {
	        events.onWheel = this.handleWheel;
	      } else {
	        events.onTouchStart = this.handleTouchStart;
	      }

	      //extra div needed for SAFARI V SCROLL
	      //maxWidth needed for FF - see
	      //http://stackoverflow.com/questions/27424831/firefox-flexbox-overflow
	      //http://stackoverflow.com/questions/27472595/firefox-34-ignoring-max-width-for-flexbox
	      var content = _react2['default'].createElement('div', { className: 'z-content-wrapper-fix', style: { maxWidth: 'calc(100% - ' + props.scrollbarSize + 'px)' },
	        children: props.children });

	      var renderProps = this.prepareRenderProps(props);

	      return _react2['default'].createElement(
	        'div',
	        renderProps,
	        loadMask,
	        _react2['default'].createElement(
	          'div',
	          _extends({ className: 'z-content-wrapper' }, events),
	          content,
	          verticalScrollbar
	        ),
	        horizontalScrollbar
	      );
	    }
	  }, {
	    key: 'prepareRenderProps',
	    value: function prepareRenderProps(props) {
	      var renderProps = assign({}, props);

	      delete renderProps.height;
	      delete renderProps.width;

	      return renderProps;
	    }
	  }, {
	    key: 'handleTouchStart',
	    value: function handleTouchStart(event) {

	      var props = this.props;
	      var scroll = {
	        top: props.scrollTop,
	        left: props.scrollLeft
	      };

	      var newScrollPos;
	      var side;

	      DragHelper(event, {
	        scope: this,
	        onDrag: function onDrag(event, config) {
	          if (config.diff.top == 0 && config.diff.left == 0) {
	            return;
	          }

	          if (!side) {
	            side = ABS(config.diff.top) > ABS(config.diff.left) ? 'top' : 'left';
	          }

	          var diff = config.diff[side];

	          newScrollPos = scroll[side] - diff;

	          if (side == 'top') {
	            this.verticalScrollAt(newScrollPos, event);
	          } else {
	            this.horizontalScrollAt(newScrollPos, event);
	          }
	        }
	      });

	      event.stopPropagation();
	      preventDefault(event);
	    }
	  }, {
	    key: 'handleWheel',
	    value: function handleWheel(event) {

	      var props = this.props;
	      // var normalizedEvent = normalizeWheel(event)

	      var virtual = props.virtualRendering;
	      var horizontal = IS_MAC ? ABS(event.deltaX) > ABS(event.deltaY) : event.shiftKey;
	      var scrollStep = props.scrollStep;
	      var minScrollStep = props.minScrollStep;

	      var scrollTop = props.scrollTop;
	      var scrollLeft = props.scrollLeft;

	      // var delta = normalizedEvent.pixelY
	      var delta = event.deltaY;

	      if (horizontal) {
	        // delta = delta || normalizedEvent.pixelX
	        delta = delta || event.deltaX;
	        minScrollStep = props.minHorizontalScrollStep || minScrollStep;
	      } else {
	        if (delta !== 0) {
	          minScrollStep = props.minVerticalScrollStep || minScrollStep;
	        }
	      }

	      if (typeof props.interceptWheelScroll == 'function') {
	        delta = props.interceptWheelScroll(delta, normalizedEvent, event);
	      } else if (minScrollStep) {
	        if (ABS(delta) < minScrollStep && delta !== 0) {
	          delta = signum(delta) * minScrollStep;
	        }
	      }

	      if (horizontal) {
	        this.horizontalScrollAt(scrollLeft + delta, event);
	        props.preventDefaultHorizontal && preventDefault(event);
	      } else {
	        if (delta !== 0) {
	          this.verticalScrollAt(scrollTop + delta, event);
	          props.preventDefaultVertical && preventDefault(event);
	        }
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps() {
	      setTimeout(this.fixHorizontalScrollbar, 0);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.fixHorizontalScrollbar();(this.props.onMount || emptyFn)(this);

	      setTimeout((function () {
	        this.fixHorizontalScrollbar();
	      }).bind(this), 0);
	    }
	  }, {
	    key: 'fixHorizontalScrollbar',
	    value: function fixHorizontalScrollbar() {

	      var thisNode = (0, _reactDom.findDOMNode)(this);

	      if (!thisNode) {
	        return;
	      }

	      this.horizontalScrollerNode = this.horizontalScrollerNode || thisNode.querySelector('.z-horizontal-scroller');

	      var dom = this.horizontalScrollerNode;

	      if (dom) {
	        var height = dom.style.height;

	        dom.style.height = height == '0.2px' ? '0.1px' : '0.2px';
	      }
	    }
	  }, {
	    key: 'getVerticalScrollbarNode',
	    value: function getVerticalScrollbarNode() {
	      return this.verticalScrollbarNode = this.verticalScrollbarNode || (0, _reactDom.findDOMNode)(this).querySelector('.ref-verticalScrollbar');
	    }
	  }, {
	    key: 'getHorizontalScrollbarNode',
	    value: function getHorizontalScrollbarNode() {
	      return this.horizontalScrollbarNode = this.horizontalScrollbarNode || (0, _reactDom.findDOMNode)(this).querySelector('.ref-horizontalScrollbar');
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      delete this.horizontalScrollerNode;
	      delete this.horizontalScrollbarNode;
	      delete this.verticalScrollbarNode;
	    }

	    ////////////////////////////////////////////////
	    //
	    // RENDER METHODS
	    //
	    ////////////////////////////////////////////////
	  }, {
	    key: 'renderVerticalScrollbar',
	    value: function renderVerticalScrollbar(props) {
	      var height = props.scrollHeight;
	      var verticalScrollbarStyle = {
	        width: props.scrollbarSize
	      };

	      var onScroll = this.onVerticalScroll;

	      return _react2['default'].createElement(
	        'div',
	        { className: 'z-vertical-scrollbar', style: verticalScrollbarStyle },
	        _react2['default'].createElement(
	          'div',
	          {
	            className: 'ref-verticalScrollbar',
	            onScroll: onScroll,
	            style: { overflow: 'auto', width: '100%', height: '100%' }
	          },
	          _react2['default'].createElement('div', { className: 'z-vertical-scroller', style: { height: height } })
	        )
	      );
	    }
	  }, {
	    key: 'renderHorizontalScrollbar',
	    value: function renderHorizontalScrollbar(props) {
	      var scrollbar;
	      var onScroll = this.onHorizontalScroll;
	      var style = horizontalScrollbarStyle;
	      var minWidth = props.scrollWidth;

	      var scroller = _react2['default'].createElement('div', { xref: 'horizontalScroller', className: 'z-horizontal-scroller', style: { width: minWidth } });

	      if (IS_MAC) {
	        //needed for mac safari
	        scrollbar = _react2['default'].createElement(
	          'div',
	          {
	            style: style,
	            className: 'z-horizontal-scrollbar mac-fix'
	          },
	          _react2['default'].createElement(
	            'div',
	            {
	              onScroll: onScroll,
	              className: 'ref-horizontalScrollbar z-horizontal-scrollbar-fix'
	            },
	            scroller
	          )
	        );
	      } else {
	        scrollbar = _react2['default'].createElement(
	          'div',
	          {
	            style: style,
	            className: 'ref-horizontalScrollbar z-horizontal-scrollbar',
	            onScroll: onScroll
	          },
	          scroller
	        );
	      }

	      return scrollbar;
	    }
	  }, {
	    key: 'renderLoadMask',
	    value: function renderLoadMask(props) {
	      if (props.loadMask) {
	        var loadMaskProps = assign({ visible: props.loading }, props.loadMaskProps);

	        var defaultFactory = LoadMaskFactory;
	        var factory = typeof props.loadMask == 'function' ? props.loadMask : defaultFactory;

	        var mask = factory(loadMaskProps);

	        if (mask === undefined) {
	          //allow the specified factory to just modify props
	          //and then leave the rendering to the defaultFactory
	          mask = defaultFactory(loadMaskProps);
	        }

	        return mask;
	      }
	    }

	    ////////////////////////////////////////////////
	    //
	    // PREPARE PROPS METHODS
	    //
	    ////////////////////////////////////////////////
	  }, {
	    key: 'prepareProps',
	    value: function prepareProps(thisProps) {
	      var props = assign({}, thisProps);

	      props.className = this.prepareClassName(props);
	      props.style = this.prepareStyle(props);

	      return props;
	    }
	  }, {
	    key: 'prepareStyle',
	    value: function prepareStyle(props) {
	      var style = assign({}, props.style);

	      if (props.height != null) {
	        style.height = props.height;
	      }

	      if (props.width != null) {
	        style.width = props.width;
	      }

	      if (props.normalizeStyles) {
	        style = normalize(style);
	      }

	      return style;
	    }
	  }, {
	    key: 'prepareClassName',
	    value: function prepareClassName(props) {
	      var className = props.className || '';

	      if (Scroller.className) {
	        className += ' ' + Scroller.className;
	      }

	      return className;
	    }
	  }]);

	  return Scroller;
	})(_reactClass2['default']);

	Scroller.className = 'z-scroller';
	Scroller.displayName = DISPLAY_NAME;

	assign(Scroller.prototype, {
	  onVerticalScroll: onScroll('vertical'),
	  onHorizontalScroll: onScroll('horizontal'),

	  verticalScrollAt: scrollAt('vertical'),
	  horizontalScrollAt: scrollAt('horizontal'),

	  syncHorizontalScrollbar: syncHorizontalScrollbar,
	  syncVerticalScrollbar: syncVerticalScrollbar
	});

	Scroller.propTypes = {
	  loadMask: PT.oneOfType([PT.bool, PT.func]),

	  loading: PT.bool,
	  normalizeStyles: PT.bool,

	  scrollTop: PT.number,
	  scrollLeft: PT.number,

	  scrollWidth: PT.number.isRequired,
	  scrollHeight: PT.number.isRequired,

	  height: PT.number,
	  width: PT.number,

	  minScrollStep: PT.number,
	  minHorizontalScrollStep: PT.number,
	  minVerticalScrollStep: PT.number,

	  virtualRendering: PT.oneOf([true]),

	  preventDefaultVertical: PT.bool,
	  preventDefaultHorizontal: PT.bool
	}, Scroller.defaultProps = {
	  'data-display-name': DISPLAY_NAME,
	  loadMask: true,

	  virtualRendering: true, //FOR NOW, only true is supported
	  scrollbarSize: 20,

	  scrollTop: 0,
	  scrollLeft: 0,

	  minScrollStep: 10,

	  minHorizontalScrollStep: IS_FIREFOX ? 40 : 1,

	  //since FF goes back in browser history on scroll too soon
	  //chrome and others also do this, but the normal preventDefault in syncScrollbar fn prevents this
	  preventDefaultHorizontal: IS_FIREFOX
	};

	exports['default'] = Scroller;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(2);
	var assign = __webpack_require__(5);

	function autoBind(object) {
	  var proto = object.constructor.prototype;

	  var names = Object.getOwnPropertyNames(proto).filter(function (key) {
	    return key != 'constructor' && key != 'render' && typeof proto[key] == 'function';
	  });

	  names.push('setState');
	  names.forEach(function (key) {
	    object[key] = object[key].bind(object);
	  });

	  return object;
	}

	var ReactClass = (function (_React$Component) {
	  _inherits(ReactClass, _React$Component);

	  function ReactClass(props) {
	    _classCallCheck(this, ReactClass);

	    _get(Object.getPrototypeOf(ReactClass.prototype), 'constructor', this).call(this, props);
	    autoBind(this);
	  }

	  _createClass(ReactClass, [{
	    key: 'prepareProps',
	    value: function prepareProps(thisProps) {

	      var props = assign({}, thisProps);

	      props.style = this.prepareStyle(props);
	      props.className = this.prepareClassName(props);

	      return props;
	    }
	  }, {
	    key: 'prepareClassName',
	    value: function prepareClassName(props) {
	      var className = props.className || '';

	      var defaultProps = this.constructor.defaultProps;

	      if (defaultProps && defaultProps.defaultClassName != null) {
	        className += ' ' + defaultProps.defaultClassName;
	      }

	      return className;
	    }
	  }, {
	    key: 'prepareStyle',
	    value: function prepareStyle(props) {
	      var defaultStyle;

	      if (this.constructor.defaultProps) {
	        defaultStyle = this.constructor.defaultProps.defaultStyle;
	      }

	      return assign({}, defaultStyle, props.style);
	    }
	  }]);

	  return ReactClass;
	})(React.Component);

	module.exports = ReactClass;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var assign   = __webpack_require__(5)
	var Region   = __webpack_require__(84)
	var hasTouch = __webpack_require__(89)
	var once     = __webpack_require__(90)

	var mobileTest = global.navigator ?
	    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(global.navigator.userAgent) :
	    false

	var isMobile = hasTouch && mobileTest;

	var Helper = function(config){
	    this.config = config
	}

	var EVENTS = {
	    move: isMobile? 'touchmove': 'mousemove',
	    up  : isMobile? 'touchend' : 'mouseup'
	}

	function emptyFn(){}

	function getPageCoords(event){
	    var firstTouch

	    var pageX = event.pageX
	    var pageY = event.pageY

	    if (isMobile && event.touches && (firstTouch = event.touches[0])){
	        pageX = firstTouch.pageX
	        pageY = firstTouch.pageY
	    }

	    return {
	        pageX: pageX,
	        pageY: pageY
	    }
	}

	assign(Helper.prototype, {

	    /**
	     * Should be called on a mousedown event
	     *
	     * @param  {Event} event
	     * @return {[type]}       [description]
	     */
	    initDrag: function(event) {

	        this.onDragInit(event)

	        var events = this.config.events || EVENTS

	        var onDragStart = once(this.onDragStart, this)
	        var target = isMobile?
	                        event.target:
	                        global

	        var mouseMoveListener = (function(event){
	            onDragStart(event)
	            this.onDrag(event)
	        }).bind(this)

	        var mouseUpListener = (function(event){

	            this.onDrop(event)

	            target.removeEventListener(events.move, mouseMoveListener)
	            target.removeEventListener(events.up, mouseUpListener)
	        }).bind(this)

	        target.addEventListener(events.move, mouseMoveListener, false)
	        target.addEventListener(events.up, mouseUpListener)
	    },

	    onDragInit: function(event){

	        var config = {
	            diff: {
	                left: 0,
	                top : 0
	            }
	        }
	        this.state = {
	            config: config
	        }

	        if (this.config.region){
	            this.state.initialRegion = Region.from(this.config.region)
	            this.state.dragRegion =
	                config.dragRegion =
	                    this.state.initialRegion.clone()
	        }
	        if (this.config.constrainTo){
	            this.state.constrainTo = Region.from(this.config.constrainTo)
	        }

	        this.callConfig('onDragInit', event)
	    },

	    /**
	     * Called when the first mousemove event occurs after drag is initialized
	     * @param  {Event} event
	     */
	    onDragStart: function(event){
	        this.state.initPageCoords = getPageCoords(event)

	        this.state.didDrag = this.state.config.didDrag = true
	        this.callConfig('onDragStart', event)
	    },

	    /**
	     * Called on all mousemove events after drag is initialized.
	     *
	     * @param  {Event} event
	     */
	    onDrag: function(event){

	        var config = this.state.config

	        var initPageCoords = this.state.initPageCoords
	        var eventCoords = getPageCoords(event)

	        var diff = config.diff = {
	            left: eventCoords.pageX - initPageCoords.pageX,
	            top : eventCoords.pageY - initPageCoords.pageY
	        }

	        if (this.state.initialRegion){
	            var dragRegion = config.dragRegion

	            //set the dragRegion to initial coords
	            dragRegion.set(this.state.initialRegion)

	            //shift it to the new position
	            dragRegion.shift(diff)

	            if (this.state.constrainTo){
	                //and finally constrain it if it's the case
	                var boolConstrained = dragRegion.constrainTo(this.state.constrainTo)

	                diff.left = dragRegion.left - this.state.initialRegion.left
	                diff.top  = dragRegion.top  - this.state.initialRegion.top

	                // console.log(diff);
	            }

	            config.dragRegion = dragRegion
	        }

	        this.callConfig('onDrag', event)
	    },

	    /**
	     * Called on the mouseup event on window
	     *
	     * @param  {Event} event
	     */
	    onDrop: function(event){
	        this.callConfig('onDrop', event)

	        this.state = null
	    },

	    callConfig: function(fnName, event){
	        var config = this.state.config
	        var args   = [event, config]

	        var fn = this.config[fnName]

	        if (fn){
	            fn.apply(this, args)
	        }
	    }

	})

	module.exports = function(event, config){

	    if (config.scope){
	        var skippedKeys = {
	            scope      : 1,
	            region     : 1,
	            constrainTo: 1
	        }

	        Object.keys(config).forEach(function(key){
	            var value = config[key]

	            if (key in skippedKeys){
	                return
	            }

	            if (typeof value == 'function'){
	                config[key] = value.bind(config.scope)
	            }
	        })
	    }
	    var helper = new Helper(config)

	    helper.initDrag(event)

	    return helper
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(8)

	__webpack_require__(85)
	__webpack_require__(86)

	var COMPUTE_ALIGN_REGION = __webpack_require__(87)

	/**
	 * region-align module exposes methods for aligning {@link Element} and {@link Region} instances
	 *
	 * The #alignTo method aligns this to the target element/region using the specified positions. See #alignTo for a graphical example.
	 *
	 *
	 *      var div = Element.select('div.first')
	 *
	 *      div.alignTo(Element.select('body') , 'br-br')
	 *
	 *      //aligns the div to be in the bottom-right corner of the body
	 *
	 * Other useful methods
	 *
	 *  * {@link #alignRegions} - aligns a given source region to a target region
	 *  * {@link #COMPUTE_ALIGN_REGION} - given a source region and a target region, and alignment positions, returns a clone of the source region, but aligned to satisfy the given alignments
	 */


	/**
	 * Aligns sourceRegion to targetRegion. It modifies the sourceRegion in order to perform the correct alignment.
	 * See #COMPUTE_ALIGN_REGION for details and examples.
	 *
	 * This method calls #COMPUTE_ALIGN_REGION passing to it all its arguments. The #COMPUTE_ALIGN_REGION method returns a region that is properly aligned.
	 * If this returned region position/size differs from sourceRegion, then the sourceRegion is modified to be an exact copy of the aligned region.
	 *
	 * @inheritdoc #COMPUTE_ALIGN_REGION
	 * @return {String} the position used for alignment
	 */
	Region.alignRegions = function(sourceRegion, targetRegion, positions, config){

	    var result        = COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config)
	    var alignedRegion = result.region

	    if ( !alignedRegion.equals(sourceRegion) ) {
	        sourceRegion.setRegion(alignedRegion)
	    }

	    return result.position

	}

	    /**
	     *
	     * The #alignTo method aligns this to the given target region, using the specified alignment position(s).
	     * You can also specify a constrain for the alignment.
	     *
	     * Example
	     *
	     *      BIG
	     *      ________________________
	     *      |  _______              |
	     *      | |       |             |
	     *      | |   A   |             |
	     *      | |       |      _____  |
	     *      | |_______|     |     | |
	     *      |               |  B  | |
	     *      |               |     | |
	     *      |_______________|_____|_|
	     *
	     * Assume the *BIG* outside rectangle is our constrain region, and you want to align the *A* rectangle
	     * to the *B* rectangle. Ideally, you'll want their tops to be aligned, and *A* to be placed at the right side of *B*
	     *
	     *
	     *      //so we would align them using
	     *
	     *      A.alignTo(B, 'tl-tr', { constrain: BIG })
	     *
	     * But this would result in
	     *
	     *       BIG
	     *      ________________________
	     *      |                       |
	     *      |                       |
	     *      |                       |
	     *      |                _____ _|_____
	     *      |               |     | .     |
	     *      |               |  B  | . A   |
	     *      |               |     | .     |
	     *      |_______________|_____|_._____|
	     *
	     *
	     * Which is not what we want. So we specify an array of options to try
	     *
	     *      A.alignTo(B, ['tl-tr', 'tr-tl'], { constrain: BIG })
	     *
	     * So by this we mean: try to align A(top,left) with B(top,right) and stick to the BIG constrain. If this is not possible,
	     * try the next option: align A(top,right) with B(top,left)
	     *
	     * So this is what we end up with
	     *
	     *      BIG
	     *      ________________________
	     *      |                       |
	     *      |                       |
	     *      |                       |
	     *      |        _______ _____  |
	     *      |       |       |     | |
	     *      |       |   A   |  B  | |
	     *      |       |       |     | |
	     *      |_______|_______|_____|_|
	     *
	     *
	     * Which is a lot better!
	     *
	     * @param {Element/Region} target The target to which to align this alignable.
	     *
	     * @param {String[]/String} positions The positions for the alignment.
	     *
	     * Example:
	     *
	     *      'br-tl'
	     *      ['br-tl','br-tr','cx-tc']
	     *
	     * This method will try to align using the first position. But if there is a constrain region, that position might not satisfy the constrain.
	     * If this is the case, the next positions will be tried. If one of them satifies the constrain, it will be used for aligning and it will be returned from this method.
	     *
	     * If no position matches the contrain, the one with the largest intersection of the source region with the constrain will be used, and this alignable will be resized to fit the constrain region.
	     *
	     * @param {Object} config A config object with other configuration for this method
	     *
	     * @param {Array[]/Object[]/Object} config.offset The offset to use for aligning. If more that one offset is specified, then offset at a given index is used with the position at the same index.
	     *
	     * An offset can have the following form:
	     *
	     *      [left_offset, top_offset]
	     *      {left: left_offset, top: top_offset}
	     *      {x: left_offset, y: top_offset}
	     *
	     * You can pass one offset or an array of offsets. In case you pass just one offset,
	     * it cannot have the array form, so you cannot call
	     *
	     *      this.alignTo(target, positions, [10, 20])
	     *
	     * If you do, it will not be considered. Instead, please use
	     *
	     *      this.alignTo(target, positions, {x: 10, y: 20})
	     *
	     * Or
	     *
	     *      this.alignTo(target, positions, [[10, 20]] )
	     *
	     * @param {Boolean/Element/Region} config.constrain If boolean, target will be constrained to the document region, otherwise,
	     * getRegion will be called on this argument to determine the region we need to constrain to.
	     *
	     * @param {Boolean/Object} config.sync Either boolean or an object with {width, height}. If it is boolean,
	     * both width and height will be synced. If directions are specified, will only sync the direction which is specified as true
	     *
	     * @return {String}
	     *
	     */
	Region.prototype.alignTo = function(target, positions, config){

	    config = config || {}

	    var sourceRegion = this
	    var targetRegion = Region.from(target)

	    var result = COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config)
	    var resultRegion = result.region

	    if (!resultRegion.equalsSize(sourceRegion)){
	        this.setSize(resultRegion.getSize())
	    }
	    if (!resultRegion.equalsPosition(sourceRegion)){
	        this.setPosition(resultRegion.getPosition(), { absolute: !!config.absolute })
	    }

	    return result.position
	}

	module.exports = Region

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var Region = __webpack_require__(8)

	/**
	 * @static
	 * Aligns the source region to the target region, so as to correspond to the given alignment.
	 *
	 * NOTE that this method makes changes on the sourceRegion in order for it to be aligned as specified.
	 *
	 * @param {Region} sourceRegion
	 * @param {Region} targetRegion
	 *
	 * @param {String} align A string with 2 valid align positions, eg: 'tr-bl'.
	 * For valid positions, see {@link Region#getPoint}
	 *
	 * Having 2 regions, we need to be able to align them as we wish:
	 *
	 * for example, if we have
	 *
	 *       source    target
	 *       ________________
	 *       ____
	 *      |    |     ________
	 *      |____|    |        |
	 *                |        |
	 *                |________|
	 *
	 * and we align 't-t', we get:
	 *
	 *       source    target
	 *       _________________
	 *
	 *       ____      ________
	 *      |    |    |        |
	 *      |____|    |        |
	 *                |________|
	 *
	 *  In this case, the source was moved down to be aligned to the top of the target
	 *
	 *
	 * and if we align 'tc-tc' we get
	 *
	 *       source     target
	 *       __________________
	 *
	 *                 ________
	 *                | |    | |
	 *                | |____| |
	 *                |________|
	 *
	 *  Since the source was moved to have the top-center point to be the same with target top-center
	 *
	 *
	 *
	 * @return {RegionClass} The Region class
	 */
	Region.align = function(sourceRegion, targetRegion, align){

	    targetRegion = Region.from(targetRegion)

	    align = (align || 'c-c').split('-')

	    //<debug>
	    if (align.length != 2){
	        console.warn('Incorrect region alignment! The align parameter need to be in the form \'br-c\', that is, a - separated string!', align)
	    }
	    //</debug>

	    return Region.alignToPoint(sourceRegion, targetRegion.getPoint(align[1]), align[0])
	}

	/**
	 * Modifies the given region to be aligned to the point, as specified by anchor
	 *
	 * @param {Region} region The region to align to the point
	 * @param {Object} point The point to be used as a reference
	 * @param {Number} point.x
	 * @param {Number} point.y
	 * @param {String} anchor The position where to anchor the region to the point. See {@link #getPoint} for available options/
	 *
	 * @return {Region} the given region
	 */
	Region.alignToPoint = function(region, point, anchor){

	    region = Region.from(region)

	    var sourcePoint = region.getPoint(anchor)
	    var count       = 0
	    var shiftObj    = {}

	    if (
	            sourcePoint.x != null &&
	            point.x != null
	        ){

	            count++
	            shiftObj.left = point.x - sourcePoint.x
	    }

	    if (
	            sourcePoint.y != null &&
	            point.y != null
	        ){
	            count++
	            shiftObj.top = point.y - sourcePoint.y
	    }

	    if (count){

	        region.shift(shiftObj)

	    }

	    return region
	}

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(8)

	/**
	 *
	 * Aligns this region to the given region
	 * @param {Region} region
	 * @param {String} alignPositions For available positions, see {@link #getPoint}
	 *
	 *     eg: 'tr-bl'
	 *
	 * @return this
	 */
	Region.prototype.alignToRegion = function(region, alignPositions){
	    Region.align(this, region, alignPositions)

	    return this
	}

	/**
	 * Aligns this region to the given point, in the anchor position
	 * @param {Object} point eg: {x: 20, y: 600}
	 * @param {Number} point.x
	 * @param {Number} point.y
	 *
	 * @param {String} anchor For available positions, see {@link #getPoint}
	 *
	 *     eg: 'bl'
	 *
	 * @return this
	 */
	 Region.prototype.alignToPoint = function(point, anchor){
	    Region.alignToPoint(this, point, anchor)

	    return this
	}

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var ALIGN_TO_NORMALIZED = __webpack_require__(88)

	var Region = __webpack_require__(8)

	/**
	 * @localdoc Given source and target regions, and the given alignments required, returns a region that is the resulting allignment.
	 * Does not modify the sourceRegion.
	 *
	 * Example
	 *
	 *      var sourceRegion = zippy.getInstance({
	 *          alias  : 'z.region',
	 *          top    : 10,
	 *          left   : 10,
	 *          bottom : 40,
	 *          right  : 100
	 *      })
	 *
	 *      var targetRegion = zippy.getInstance({
	 *          alias  : 'z.region',
	 *          top    : 10,
	 *          left   : 10,
	 *          bottom : 40,
	 *          right  : 100
	 *      })
	 *      //has top-left at (10,10)
	 *      //and bottom-right at (40, 100)
	 *
	 *      var alignRegion = alignable.COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, 'tl-br')
	 *
	 *      //alignRegion will be a clone of sourceRegion, but will have the
	 *      //top-left corner aligned with bottom-right of targetRegion
	 *
	 *      alignRegion.get() // => { top: 40, left: 100, bottom: 70, right: 190 }
	 *
	 * @param  {Region} sourceRegion The source region to align to targetRegion
	 * @param  {Region} targetRegion The target region to which to align the sourceRegion
	 * @param  {String/String[]} positions    A string ( delimited by "-" characters ) or an array of strings with the position to try, in the order of their priority.
	 * See Region#getPoint for a list of available positions. They can be combined in any way.
	 * @param  {Object} config      A config object with other configuration for the alignment
	 * @param  {Object/Object[]} config.offset      Optional offsets. Either an object or an array with a different offset for each position
	 * @param  {Element/Region/Boolean} config.constrain  The constrain to region or element. If the boolean true, Region.getDocRegion() will be used
	 * @param  {Object/Boolean} config.sync   A boolean object that indicates whether to sync sourceRegion and targetRegion sizes (width/height or both). Can be
	 *
	 *  * true - in order to sync both width and height
	 *  * { width: true }  - to only sync width
	 *  * { height: true } - to only sync height
	 *  * { size: true }   - to sync both width and height
	 *
	 * @return {Object} an object with the following keys:
	 *
	 *  * position - the position where the alignment was made. One of the given positions
	 *  * region   - the region where the alignment is in place
	 *  * positionChanged - boolean value indicating if the position of the returned region is different from the position of sourceRegion
	 *  * widthChanged    - boolean value indicating if the width of the returned region is different from the width of sourceRegion
	 *  * heightChanged   - boolean value indicating if the height of the returned region is different from the height of sourceRegion
	 */
	function COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config){
	    sourceRegion = Region.from(sourceRegion)

	    var sourceClone = sourceRegion.clone()
	    var position    = ALIGN_TO_NORMALIZED(sourceClone, targetRegion, positions, config)

	    return {
	        position        : position,
	        region          : sourceClone,
	        widthChanged    : sourceClone.getWidth() != sourceRegion.getWidth(),
	        heightChanged   : sourceClone.getHeight() != sourceRegion.getHeight(),
	        positionChanged : sourceClone.equalsPosition(sourceRegion)
	    }
	}


	module.exports = COMPUTE_ALIGN_REGION

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var Region = __webpack_require__(8)

	/**
	 *
	 * This method is trying to align the sourceRegion to the targetRegion, given the alignment positions
	 * and the offsets. It only modifies the sourceRegion
	 *
	 * This is all well and easy, but if there is a constrainTo region, the algorithm has to take it into account.
	 * In this case, it works as follows.
	 *
	 *  * start with the first alignment position. Aligns the region, adds the offset and then check for the constraint.
	 *  * if the constraint condition is ok, return the position.
	 *  * otherwise, remember the intersection area, if the regions are intersecting.
	 *  * then go to the next specified align position, and so on, computing the maximum intersection area.
	 *
	 * If no alignment fits the constrainRegion, the sourceRegion will be resized to match it,
	 * using the position with the maximum intersection area.
	 *
	 * Since we have computed the index of the position with the max intersection area, take that position,
	 * and align the sourceRegion accordingly. Then resize the sourceRegion to the intersection, and reposition
	 * it again, since resizing it might have destroyed the alignment.
	 *
	 * Return the position.
	 *
	 * @param {Region} sourceRegion
	 * @param {Region} targetRegion
	 * @param {String[]} positions
	 * @param {Object} config
	 * @param {Array} config.offset
	 * @param {Region} config.constrain
	 * @param {Boolean/Object} config.sync
	 *
	 * @return {String/Undefined} the chosen position for the alignment, or undefined if no position found
	 */
	function ALIGN_TO_NORMALIZED(sourceRegion, targetRegion, positions, config){

	    targetRegion = Region.from(targetRegion)

	    config = config  || {}

	    var constrainTo = config.constrain,
	        syncOption  = config.sync,
	        offsets     = config.offset || [],
	        syncWidth   = false,
	        syncHeight  = false,
	        sourceClone = sourceRegion.clone()

	    /*
	     * Prepare the method arguments: positions, offsets, constrain and sync options
	     */
	    if (!Array.isArray(positions)){
	        positions = positions? [positions]: []
	    }

	    if (!Array.isArray(offsets)){
	        offsets = offsets? [offsets]: []
	    }

	    if (constrainTo){
	        constrainTo = constrainTo === true?
	                                Region.getDocRegion():
	                                constrainTo.getRegion()
	    }

	    if (syncOption){

	        if (syncOption.size){
	            syncWidth  = true
	            syncHeight = true
	        } else {
	            syncWidth  = syncOption === true?
	                            true:
	                            syncOption.width || false

	            syncHeight = syncOption === true?
	                            true:
	                            syncOption.height || false
	        }
	    }

	    if (syncWidth){
	        sourceClone.setWidth(targetRegion.getWidth())
	    }
	    if (syncHeight){
	        sourceClone.setHeight(targetRegion.getHeight())

	    }

	    var offset,
	        i = 0,
	        len = positions.length,
	        pos,
	        intersection,
	        itArea,
	        maxArea = -1,
	        maxAreaIndex = -1

	    for (; i < len; i++){
	        pos     = positions[i]
	        offset  = offsets[i]

	        sourceClone.alignToRegion(targetRegion, pos)

	        if (offset){
	            if (!Array.isArray(offset)){
	                offset = offsets[i] = [offset.x || offset.left, offset.y || offset.top]
	            }

	            sourceClone.shift({
	                left: offset[0],
	                top : offset[1]
	            })
	        }

	        //the source region is already aligned in the correct position

	        if (constrainTo){
	            //if we have a constrain region, test for the constrain
	            intersection = sourceClone.getIntersection(constrainTo)

	            if ( intersection && intersection.equals(sourceClone) ) {
	                //constrain respected, so return (the aligned position)

	                sourceRegion.set(sourceClone)
	                return pos
	            } else {

	                //the constrain was not respected, so continue trying
	                if (intersection && ((itArea = intersection.getArea()) > maxArea)){
	                    maxArea      = itArea
	                    maxAreaIndex = i
	                }
	            }

	        } else {
	            sourceRegion.set(sourceClone)
	            return pos
	        }
	    }

	    //no alignment respected the constraints
	    if (~maxAreaIndex){
	        pos     = positions[maxAreaIndex]
	        offset  = offsets[maxAreaIndex]

	        sourceClone.alignToRegion(targetRegion, pos)

	        if (offset){
	            sourceClone.shift({
	                left: offset[0],
	                top : offset[1]
	            })
	        }

	        //we are sure an intersection exists, because of the way the maxAreaIndex was computed
	        intersection = sourceClone.getIntersection(constrainTo)

	        sourceClone.setRegion(intersection)
	        sourceClone.alignToRegion(targetRegion, pos)

	        if (offset){
	            sourceClone.shift({
	                left: offset[0],
	                top : offset[1]
	            })
	        }

	        sourceRegion.set(sourceClone)

	        return pos
	    }

	}

	module.exports = ALIGN_TO_NORMALIZED

/***/ },
/* 89 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = 'ontouchstart' in global || (global.DocumentTouch && document instanceof DocumentTouch)
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 90 */
/***/ function(module, exports) {

	'use once'

	module.exports = function once(fn, scope){

	    var called
	    var result

	    return function(){
	        if (called){
	            return result
	        }

	        called = true

	        return result = fn.apply(scope || this, arguments)
	    }
	}

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var Region = __webpack_require__(8);
	var ReactMenu = React.createFactory(__webpack_require__(92));
	var assign = __webpack_require__(5);
	var clone = __webpack_require__(119);
	var asArray = __webpack_require__(124);
	var findIndexBy = __webpack_require__(125);
	var findIndexByName = __webpack_require__(126);
	var Cell = __webpack_require__(127);
	var setupColumnDrag = __webpack_require__(128);
	var setupColumnResize = __webpack_require__(129);

	var normalize = __webpack_require__(20);

	function emptyFn() {}

	function getColumnSortInfo(column, sortInfo) {

	    sortInfo = asArray(sortInfo);

	    var index = findIndexBy(sortInfo, function (info) {
	        return info.name === column.name;
	    });

	    return sortInfo[index];
	}

	function removeColumnSort(column, sortInfo) {
	    sortInfo = asArray(sortInfo);

	    var index = findIndexBy(sortInfo, function (info) {
	        return info.name === column.name;
	    });

	    if (~index) {
	        sortInfo.splice(index, 1);
	    }

	    return sortInfo;
	}

	function getDropState() {
	    return {
	        dragLeft: null,
	        dragColumn: null,
	        dragColumnIndex: null,
	        dragging: false,
	        dropIndex: null,

	        shiftIndexes: null,
	        shiftSize: null
	    };
	}

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.Header',

	    propTypes: {
	        columns: React.PropTypes.array
	    },

	    onDrop: function onDrop(event) {
	        var state = this.state;
	        var props = this.props;

	        if (state.dragging) {
	            event.stopPropagation();
	        }

	        var dragIndex = state.dragColumnIndex;
	        var dropIndex = state.dropIndex;

	        if (dropIndex != null) {

	            //since we need the indexes in the array of all columns
	            //not only in the array of the visible columns
	            //we need to search them and make this transform
	            var dragColumn = props.columns[dragIndex];
	            var dropColumn = props.columns[dropIndex];

	            dragIndex = findIndexByName(props.allColumns, dragColumn.name);
	            dropIndex = findIndexByName(props.allColumns, dropColumn.name);

	            this.props.onDropColumn(dragIndex, dropIndex);
	        }

	        this.setState(getDropState());
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            defaultClassName: 'z-header-wrapper',
	            draggingClassName: 'z-dragging',
	            cellClassName: 'z-column-header',
	            defaultStyle: {},
	            sortInfo: null,
	            scrollLeft: 0,
	            scrollTop: 0
	        };
	    },

	    getInitialState: function getInitialState() {

	        return {
	            mouseOver: true,
	            dragging: false,

	            shiftSize: null,
	            dragColumn: null,
	            shiftIndexes: null
	        };
	    },

	    render: function render() {
	        var props = this.prepareProps(this.props);
	        var state = this.state;

	        var cellMap = {};
	        var cells = props.columns.map(function (col, index) {
	            var cell = this.renderCell(props, state, col, index);
	            cellMap[col.name] = cell;

	            return cell;
	        }, this);

	        if (props.columnGroups && props.columnGroups.length) {

	            cells = props.columnGroups.map(function (colGroup) {
	                var cellProps = {};
	                var columns = [];

	                var cells = colGroup.columns.map(function (colName) {
	                    var col = props.columnMap[colName];
	                    columns.push(col);
	                    return cellMap[colName];
	                });

	                return React.createElement(
	                    Cell,
	                    cellProps,
	                    cells
	                );
	            }, this);
	        }

	        var style = normalize(props.style);
	        var headerStyle = normalize({
	            paddingRight: props.scrollbarSize,
	            transform: 'translate3d(' + -props.scrollLeft + 'px, ' + -props.scrollTop + 'px, 0px)'
	        });

	        return React.createElement(
	            'div',
	            { style: style, className: props.className },
	            React.createElement(
	                'div',
	                { className: 'z-header', style: headerStyle },
	                cells
	            )
	        );
	    },

	    renderCell: function renderCell(props, state, column, index) {

	        var resizing = props.resizing;
	        var text = column.title;
	        var className = props.cellClassName || '';
	        var style = {
	            left: 0
	        };

	        var menu = this.renderColumnMenu(props, state, column, index);

	        if (state.dragColumn && state.shiftIndexes && state.shiftIndexes[index]) {
	            style.left = state.shiftSize;
	        }

	        if (state.dragColumn === column) {
	            className += ' z-drag z-over';
	            style.zIndex = 1;
	            style.left = state.dragLeft || 0;
	        }

	        var filterIcon = props.filterIcon || React.createElement(
	            'svg',
	            { version: '1.1', style: { transform: 'translate3d(0,0,0)', height: '100%', width: '100%', padding: '0px 2px' }, viewBox: '0 0 3 4' },
	            React.createElement('polygon', { points: '0,0 1,2 1,4 2,4 2,2 3,0 ', style: { fill: props.filterIconColor, strokeWidth: 0, fillRule: 'nonZero' } })
	        );

	        var filter = column.filterable ? React.createElement(
	            'div',
	            { className: 'z-show-filter', onMouseUp: this.handleFilterMouseUp.bind(this, column) },
	            filterIcon
	        ) : null;

	        var resizer = column.resizable ? React.createElement('span', { className: 'z-column-resize', onMouseDown: this.handleResizeMouseDown.bind(this, column) }) : null;

	        if (column.sortable) {
	            text = React.createElement(
	                'span',
	                null,
	                text,
	                React.createElement('span', { className: 'z-icon-sort-info' })
	            );

	            var sortInfo = getColumnSortInfo(column, props.sortInfo);

	            if (sortInfo && sortInfo.dir) {
	                className += sortInfo.dir === -1 || sortInfo.dir === 'desc' ? ' z-desc' : ' z-asc';
	            }

	            className += ' z-sortable';
	        }

	        if (filter) {
	            className += ' z-filterable';
	        }

	        if (state.mouseOver === column.name && !resizing) {
	            className += ' z-over';
	        }

	        if (props.menuColumn === column.name) {
	            className += ' z-active';
	        }

	        className += ' z-unselectable';

	        var events = {};

	        events.onMouseDown = this.handleMouseDown.bind(this, column);
	        events.onMouseUp = this.handleMouseUp.bind(this, column);

	        return React.createElement(
	            Cell,
	            _extends({
	                key: column.name,
	                contentPadding: props.cellPadding,
	                columns: props.columns || [],
	                index: index,
	                column: props.columns[index],
	                className: className,
	                style: style,
	                text: text,
	                header: true,
	                onMouseOut: this.handleMouseOut.bind(this, column),
	                onMouseOver: this.handleMouseOver.bind(this, column)
	            }, events),
	            filter,
	            menu,
	            resizer
	        );
	    },

	    toggleSort: function toggleSort(column) {
	        var sortInfo = asArray(clone(this.props.sortInfo));
	        var columnSortInfo = getColumnSortInfo(column, sortInfo);

	        if (!columnSortInfo) {
	            columnSortInfo = {
	                name: column.name,
	                type: column.type,
	                fn: column.sortFn
	            };

	            sortInfo.push(columnSortInfo);
	        }

	        if (typeof column.toggleSort === 'function') {
	            column.toggleSort(columnSortInfo, sortInfo);
	        } else {

	            var dir = columnSortInfo.dir;
	            var dirSign = dir === 'asc' ? 1 : dir === 'desc' ? -1 : dir;
	            var newDir = dirSign === 1 ? -1 : dirSign === -1 ? 0 : 1;

	            columnSortInfo.dir = newDir;

	            if (!newDir) {
	                sortInfo = removeColumnSort(column, sortInfo);
	            }
	        }

	        ;(this.props.onSortChange || emptyFn)(sortInfo);
	    },

	    renderColumnMenu: function renderColumnMenu(props, state, column, index) {
	        if (!props.withColumnMenu) {
	            return;
	        }

	        var menuIcon = props.menuIcon || React.createElement(
	            'svg',
	            { version: '1.1', style: { transform: 'translate3d(0,0,0)', height: '100%', width: '100%', padding: '0px 2px' }, viewBox: '0 0 3 4' },
	            React.createElement('polygon', { points: '0,0 1.5,3 3,0 ', style: { fill: props.menuIconColor, strokeWidth: 0, fillRule: 'nonZero' } })
	        );

	        var sortIcons = props.sortIcons ? props.sortIcons.map(function (sortIcon) {
	            return React.createElement(
	                'span',
	                null,
	                sortIcon
	            );
	        }) : '';

	        return React.createElement(
	            'div',
	            { className: 'z-show-menu', onMouseUp: this.handleShowMenuMouseUp.bind(this, props, column, index) },
	            menuIcon,
	            sortIcons
	        );
	    },

	    handleShowMenuMouseUp: function handleShowMenuMouseUp(props, column, index, event) {
	        event.nativeEvent.stopSort = true;

	        this.showCustomMenu(column, event);
	    },

	    showCustomMenu: function showCustomMenu(column, event) {
	        ;(this.props.onMenuClick || emptyFn)(column, event);
	    },

	    showMenu: function showMenu(column, event) {

	        var menuItem = function (column) {
	            var visibility = this.props.columnVisibility;

	            var visible = column.visible;

	            if (column.name in visibility) {
	                visible = visibility[column.name];
	            }

	            return {
	                cls: visible ? 'z-selected' : '',
	                selected: visible ? React.createElement(
	                    'span',
	                    { style: { fontSize: '0.95em' } },
	                    '\u2713'
	                ) : '',
	                label: column.title,
	                fn: this.toggleColumn.bind(this, column)
	            };
	        }.bind(this);

	        function menu(eventTarget, props) {

	            var columns = props.gridColumns;

	            props.columns = ['selected', 'label'];
	            props.items = columns.map(menuItem);
	            props.alignTo = eventTarget;
	            props.alignPositions = ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];
	            props.style = {
	                position: 'absolute'
	            };

	            var factory = this.props.columnMenuFactory || ReactMenu;

	            var result = factory(props);

	            return result === undefined ? ReactMenu(props) : result;
	        }

	        this.props.showMenu(menu.bind(this, event.currentTarget), {
	            menuColumn: column.name
	        });
	    },

	    showFilterMenu: function showFilterMenu(column, event) {

	        function menu(eventTarget, props) {

	            var defaultFactory = this.props.filterMenuFactory;
	            var factory = column.filterMenuFactory || defaultFactory;

	            props.columns = ['component'];
	            props.column = column;
	            props.alignTo = eventTarget;
	            props.alignPositions = ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];
	            props.style = {
	                position: 'absolute'
	            };

	            var result = factory(props);

	            return result === undefined ? defaultFactory(props) : result;
	        }

	        this.props.showMenu(menu.bind(this, event.currentTarget), {
	            menuColumn: column.name
	        });
	    },

	    toggleColumn: function toggleColumn(column) {
	        this.props.toggleColumn(column);
	    },

	    hideMenu: function hideMenu() {
	        this.props.showColumnMenu(null, null);
	    },

	    handleResizeMouseDown: function handleResizeMouseDown(column, event) {
	        setupColumnResize(this, this.props, column, event);

	        //in order to prevent setupColumnDrag in handleMouseDown
	        // event.stopPropagation()

	        //we are doing setupColumnDrag protection using the resizing flag on native event
	        if (event.nativeEvent) {
	            event.nativeEvent.resizing = true;
	        }
	    },

	    handleFilterMouseUp: function handleFilterMouseUp(column, event) {
	        event.nativeEvent.stopSort = true;

	        this.showFilterMenu(column, event);
	        // event.stopPropagation()
	    },

	    handleMouseUp: function handleMouseUp(column, event) {
	        if (this.state.dragging) {
	            return;
	        }

	        if (this.state.resizing) {
	            return;
	        }

	        if (event && event.nativeEvent && event.nativeEvent.stopSort) {
	            return;
	        }

	        if (column.sortable) {
	            this.toggleSort(column);
	        }
	    },

	    handleMouseOut: function handleMouseOut(column) {
	        this.setState({
	            mouseOver: false
	        });
	    },

	    handleMouseOver: function handleMouseOver(column) {
	        this.setState({
	            mouseOver: column.name
	        });
	    },

	    handleMouseDown: function handleMouseDown(column, event) {
	        if (event && event.nativeEvent && event.nativeEvent.resizing) {
	            return;
	        }

	        if (!this.props.reorderColumns) {
	            return;
	        }

	        setupColumnDrag(this, this.props, column, event);
	    },

	    onResizeDragStart: function onResizeDragStart(config) {
	        this.setState({
	            resizing: true
	        });
	        this.props.onColumnResizeDragStart(config);
	    },

	    onResizeDrag: function onResizeDrag(config) {
	        this.props.onColumnResizeDrag(config);
	    },

	    onResizeDrop: function onResizeDrop(config, resizeInfo, event) {
	        this.setState({
	            resizing: false
	        });

	        this.props.onColumnResizeDrop(config, resizeInfo);
	    },

	    prepareProps: function prepareProps(thisProps) {
	        var props = {};

	        assign(props, thisProps);

	        this.prepareClassName(props);
	        this.prepareStyle(props);

	        var columnMap = {};(props.columns || []).forEach(function (col) {
	            columnMap[col.name] = col;
	        });

	        props.columnMap = columnMap;

	        return props;
	    },

	    prepareClassName: function prepareClassName(props) {
	        props.className = props.className || '';
	        props.className += ' ' + props.defaultClassName;

	        if (this.state.dragging) {
	            props.className += ' ' + props.draggingClassName;
	        }
	    },

	    prepareStyle: function prepareStyle(props) {
	        var style = props.style = {};

	        assign(style, props.defaultStyle);
	    }
	});

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var MenuClass=__webpack_require__(93),MenuItem=__webpack_require__(109),MenuItemCell=__webpack_require__(105),MenuSeparator=__webpack_require__(112);MenuClass.Item=MenuItem,MenuClass.Item.Cell=MenuItemCell,MenuClass.ItemCell=MenuItemCell,MenuClass.Separator=MenuSeparator,module.exports=MenuClass;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _reactDom=__webpack_require__(1);function emptyFn(){}var React=__webpack_require__(2),assign=__webpack_require__(5),Region=__webpack_require__(84),inTriangle=__webpack_require__(94),hasTouch=__webpack_require__(89),normalize=__webpack_require__(20),getMenuOffset=__webpack_require__(95),getConstrainRegion=__webpack_require__(99),getItemStyleProps=__webpack_require__(100),renderSubMenu=__webpack_require__(101),renderChildren=__webpack_require__(104),prepareItem=__webpack_require__(106),propTypes=__webpack_require__(113),ScrollContainer=__webpack_require__(114);var MenuItem=__webpack_require__(109),MenuClass=React.createClass({displayName:'Menu',propTypes:propTypes,getDefaultProps:function getDefaultProps(){return{isMenu:!0,constrainTo:!0,enableScroll:!0,interactionStyles:!0,applyDefaultTheme:!0,defaultStyle:{display:'inline-block',boxSizing:'border-box',position:'relative',background:'white',//theme props
	border:'1px solid rgb(46, 153, 235)'},defaultSubMenuStyle:{position:'absolute'},subMenuStyle:null,scrollerProps:{},columns:['label'],items:null,visible:!0,defaultItemStyle:{},itemStyle:{},defaultItemOverStyle:{},itemOverStyle:{},defaultItemDisabledStyle:{},itemDisabledStyle:{},defaultItemExpandedStyle:{},itemExpandedStyle:{},defaultCellStyle:{},cellStyle:{},stopClickPropagation:!0}},getInitialState:function getInitialState(){return{mouseOver:!1}},componentWillUnmount:function componentWillUnmount(){this.didMount=!1},componentDidMount:function componentDidMount(){(this.props.onMount||emptyFn)(this),this.didMount=!0,(this.props.constrainTo||this.props.alignTo)&&!this.props.subMenu&&setTimeout(function(){if(this.isMounted()){var i,a=this.props,b=Region.from((0,_reactDom.findDOMNode)(this.refs.scrollContainer)),c=(0,_reactDom.findDOMNode)(this),d=Region.from(c),e=d.height,f=b.height+e,g=Region({left:d.left,right:d.right,top:d.top,bottom:d.top+f}),h=a.constrainTo?getConstrainRegion(a.constrainTo):null;//get clientHeight of this dom node, so as to account for padding
	//build the actual region of the menu
	if(a.alignTo){var j=Region.from(c.parentNode),k=Region.from(a.alignTo);g.alignTo(k,a.alignPositions,{offset:a.alignOffset,constrain:h});var l=g.top-j.top,m=g.left-j.left;i={style:{left:m,top:l}}}h&&(i=i||{},g.bottom>h.bottom&&(i.maxHeight=h.bottom-g.top-e)),i&&this.setState(i)}}.bind(this),0)},prepareProps:function prepareProps(a,b){var c={};return assign(c,this.props),c.style=this.prepareStyle(c,b),c.className=this.prepareClassName(c),c.itemStyleProps=getItemStyleProps(c,b),c.children=this.prepareChildren(c,b),c.scrollerProps=this.prepareScrollerProps(c),c},prepareScrollerProps:function prepareScrollerProps(a){return assign({},a.scrollerProps)},prepareChildren:function prepareChildren(a,b){var c=a.children;return a.items&&a.items.length&&(c=a.items.map(this.prepareItem.bind(this,a,b))),c},prepareItem:prepareItem,prepareClassName:function prepareClassName(a){var b=a.className||'';return b+=' z-menu',b},prepareStyle:function prepareStyle(a,b){var c=a.subMenu?a.defaultSubMenuStyle:null,d=assign({},a.defaultStyle,c,a.style,a.subMenuStyle);if(a.visible&&(!a.items||a.items.length)||(d.display='none'),a.absolute&&(d.position='absolute'),a.at){var e=Array.isArray(a.at),f={left:e?a.at[0]:void 0===a.at.left?a.at.x||a.at.pageX:a.at.left,top:e?a.at[1]:void 0===a.at.top?a.at.y||a.at.pageY:a.at.top};assign(d,f)}return b.style&&assign(d,b.style),!this.didMount&&(a.constrainTo||a.alignTo)&&!a.subMenu&&(d.visibility='hidden',d.maxHeight=0,d.overflow='hidden'),normalize(d)},/////////////// RENDERING LOGIC
	renderSubMenu:renderSubMenu,render:function render(){var a=this.state,b=this.prepareProps(this.props,a),c=this.renderSubMenu(b,a),d=this.renderChildren(b,a);return React.createElement('div',b,c,React.createElement(ScrollContainer,{onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave,scrollerProps:b.scrollerProps,ref:'scrollContainer',enableScroll:b.enableScroll,maxHeight:a.maxHeight||b.maxHeight},React.createElement('table',{ref:'table',style:{borderSpacing:0}},React.createElement('tbody',null,d))))},renderChildren:renderChildren,////////////////////////// BEHAVIOUR LOGIC
	handleMouseEnter:function handleMouseEnter(){this.setState({mouseInside:!0}),this.onActivate()},handleMouseLeave:function handleMouseLeave(){this.setState({mouseInside:!1}),this.state.menu||this.state.nextItem||this.onInactivate()},onActivate:function onActivate(){this.state.activated||(this.setState({activated:!0}),(this.props.onActivate||emptyFn)())},onInactivate:function onInactivate(){this.state.activated&&(this.setState({activated:!1})// console.log('inactivate')
	,(this.props.onInactivate||emptyFn)())},//we also need mouseOverSubMenu: Boolean
	//since when from a submenu we move back to a parent menu, we may move
	//to a different menu item than the one that triggered the submenu
	//so we should display another submenu
	handleSubMenuMouseEnter:function handleSubMenuMouseEnter(){this.setState({mouseOverSubMenu:!0})},handleSubMenuMouseLeave:function handleSubMenuMouseLeave(){this.setState({mouseOverSubMenu:!1})},isSubMenuActive:function isSubMenuActive(){return this.state.subMenuActive},onSubMenuActivate:function onSubMenuActivate(){this.setState({subMenuActive:!0})},onSubMenuInactivate:function onSubMenuInactivate(){var a=+new Date,b=this.state.nextItem,c=this.state.nextTimestamp||0;this.setState({subMenuActive:!1,timestamp:a},function(){setTimeout(function(){return a!=this.state.timestamp||b&&100>a-c?void this.setItem(this.state.nextItem,this.state.nextOffset):void(!this.isSubMenuActive()&&this.setItem())}.bind(this),10)})},removeMouseMoveListener:function removeMouseMoveListener(){this.onWindowMouseMove&&(window.removeEventListener('mousemove',this.onWindowMouseMove),this.onWindowMouseMove=null)},onMenuItemMouseOut:function onMenuItemMouseOut(a,b){this.state.menu&&this.setupCheck(b)},/**
	     * Called when mouseout happens on the item for which there is a submenu displayed
	     */onMenuItemMouseOver:function onMenuItemMouseOver(a,b){if(this.didMount){var c=a.menu;+new Date,c&&(this.state.menu?this.setNextItem(a,b):this.setItem(a,b))}},setupCheck:function setupCheck(a){// + tolerance
	// - tolerance
	if(this.didMount){var b=5,c=(0,_reactDom.findDOMNode)(this),d=c.querySelector('.z-menu');if(d){var e=Region.from(d),f=e.left,g=e.top,h=e.left,i=e.bottom;'left'==this.subMenuPosition&&(f=e.right,h=e.right);var j=a.x+('left'==this.subMenuPosition?b:-b),k=a.y,l=[[f,g],[h,i],[j,k]];this.removeMouseMoveListener(),this.onWindowMouseMove=function(m){var n=[m.pageX,m.pageY];inTriangle(n,l)||(this.removeMouseMoveListener(),!this.state.mouseOverSubMenu&&this.setItem(this.state.nextItem,this.state.nextOffset))}.bind(this),window.addEventListener('mousemove',this.onWindowMouseMove)}}},setNextItem:function setNextItem(a,b){var c=+new Date;this.setState({timestamp:c,nextItem:a,nextOffset:b,nextTimestamp:+new Date})},setItem:function setItem(a,b){var c=a?a.menu:null;// if (!menu){
	//     return
	// }
	this.removeMouseMoveListener();this.didMount&&(!c&&!this.state.mouseInside&&this.onInactivate(),this.setState({itemProps:a,menu:c,menuOffset:b,timestamp:+new Date,nextItem:null,nextOffset:null,nextTimestamp:null}))},onMenuItemExpanderClick:function onMenuItemExpanderClick(a){a.nativeEvent.expanderClick=!0},onMenuItemClick:function onMenuItemClick(a,b,c){var d=a.isPropagationStopped();if(this.props.stopClickPropagation&&a.stopPropagation(),hasTouch&&b&&a&&a.nativeEvent&&a.nativeEvent.expanderClick){var e={x:a.pageX,y:a.pageY},f=getMenuOffset(a.currentTarget);return void this.onMenuItemMouseOver(b,f,e)}d||(b&&(this.props.onClick||emptyFn)(a,b,c),this.onChildClick(a,b))},onChildClick:function onChildClick(a,b){(this.props.onChildClick||emptyFn)(a,b),this.props.parentMenu&&this.props.parentMenu.onChildClick(a,b)}});MenuClass.themes=__webpack_require__(118),module.exports=MenuClass;

/***/ },
/* 94 */
/***/ function(module, exports) {

	//http://www.blackpawn.com/texts/pointinpoly/
	module.exports = function pointInTriangle(point, triangle) {
	    //compute vectors & dot products
	    var cx = point[0], cy = point[1],
	        t0 = triangle[0], t1 = triangle[1], t2 = triangle[2],
	        v0x = t2[0]-t0[0], v0y = t2[1]-t0[1],
	        v1x = t1[0]-t0[0], v1y = t1[1]-t0[1],
	        v2x = cx-t0[0], v2y = cy-t0[1],
	        dot00 = v0x*v0x + v0y*v0y,
	        dot01 = v0x*v1x + v0y*v1y,
	        dot02 = v0x*v2x + v0y*v2y,
	        dot11 = v1x*v1x + v1y*v1y,
	        dot12 = v1x*v2x + v1y*v2y

	    // Compute barycentric coordinates
	    var b = (dot00 * dot11 - dot01 * dot01),
	        inv = b === 0 ? 0 : (1 / b),
	        u = (dot11*dot02 - dot01*dot12) * inv,
	        v = (dot00*dot12 - dot01*dot02) * inv
	    return u>=0 && v>=0 && (u+v < 1)
	}

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var Region=__webpack_require__(84),selectParent=__webpack_require__(96);module.exports=function(a){var b=Region.from(selectParent('.z-menu',a)),c=Region.from(a);return{// pageX : thisRegion.left,
	// pageY : thisRegion.top,
	left:c.left-b.left,top:c.top-b.top,width:c.width,height:c.height}};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var curry   = __webpack_require__(97)
	var matches

	module.exports = curry(function(selector, node){

		matches = matches || __webpack_require__(98)

	    while (node = node.parentElement){
	        if (matches.call(node, selector)){
	            return node
	        }
	    }
	})

/***/ },
/* 97 */
/***/ function(module, exports) {

	'use strict';

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 98 */
/***/ function(module, exports) {

	'use strict';

	var proto = Element.prototype

	var nativeMatches = proto.matches ||
	  proto.mozMatchesSelector ||
	  proto.msMatchesSelector ||
	  proto.oMatchesSelector ||
	  proto.webkitMatchesSelector

	module.exports = nativeMatches


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _reactDom=__webpack_require__(1),Region=__webpack_require__(84),selectParent=__webpack_require__(96);module.exports=function(a){var b;if(!0===a&&(b=Region.getDocRegion()),!b&&'string'==typeof a){var c=selectParent(a,(0,_reactDom.findDOMNode)(this));b=Region.from(c)}return b||'function'!=typeof a||(b=Region.from(a())),b};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var assign=__webpack_require__(5);module.exports=function(a){var b=assign({},a.defaultItemStyle,a.itemStyle),c=assign({},a.defaultItemOverStyle,a.itemOverStyle),d=assign({},a.defaultItemActiveStyle,a.itemActiveStyle),e=assign({},a.defaultItemDisabledStyle,a.itemDisabledStyle),f=assign({},a.defaultItemExpandedStyle,a.itemExpandedStyle),g=assign({},a.defaultCellStyle,a.cellStyle);return{itemStyle:b,itemOverStyle:c,itemActiveStyle:d,itemDisabledStyle:e,itemExpandedStyle:f,cellStyle:g}};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var Region=__webpack_require__(84),assign=__webpack_require__(5),React=__webpack_require__(2),cloneElement=React.cloneElement,getPositionStyle=__webpack_require__(102);module.exports=function(a,b){var c=b.menu;if(c&&this.didMount){var d=getPositionStyle.call(this,a,b);return c=cloneElement(c,assign({ref:'subMenu',subMenu:!0,parentMenu:this,maxHeight:b.subMenuMaxHeight,onActivate:this.onSubMenuActivate,onInactivate:this.onSubMenuInactivate,scrollerProps:a.scrollerProps,constrainTo:a.constrainTo,expander:a.expander,theme:a.theme,themes:a.themes||this.constructor.themes},a.itemStyleProps)),React.createElement('div',{ref:'subMenuWrap',style:d,onMouseEnter:this.handleSubMenuMouseEnter,onMouseLeave:this.handleSubMenuMouseLeave},c)}};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _reactDom=__webpack_require__(1),Region=__webpack_require__(84),assign=__webpack_require__(5),align=__webpack_require__(103);module.exports=function(b,c){if(!c.menu||!this.didMount)return void(this.prevMenuIndex=-1);var d=c.menuOffset,e=d.left+d.width,f=d.top,g=c.itemProps.index,h=this.prevMenuIndex==g;this.aligning&&!h&&(this.aligning=!1),this.prevMenuIndex=g;var i={position:'absolute',visibility:'hidden',overflow:'hidden',pointerEvents:'none',left:e,top:f,zIndex:1};return this.aligning||h||setTimeout(function(){if(this.didMount){var j=Region.from((0,_reactDom.findDOMNode)(this)),k=Region.from({left:j.left,top:j.top+d.top,width:d.width,height:d.height}),l=this.refs.subMenu&&this.refs.subMenu.isMounted();if(l){var q,m=Region.from(this.refs.subMenu.refs.scrollContainer.getCurrentSizeDOM()),n=m.height,o=align(b,m,/* alignTo */k,b.constrainTo),p=m.height;p<n&&(q=p-b.subMenuConstrainMargin),q&&-1==o/* upwards*/&&(m.top=m.bottom-q);var r=m.left-j.left,s=m.top-j.top;5>Math.abs(r-e)&&(r=e),5>Math.abs(s-f)&&(s=f),this.subMenuPosition=0>r?'left':'right',this.alignOffset={left:r,top:s},this.aligning=!0,this.setState({subMenuMaxHeight:q})}}}.bind(this),0),(h||this.aligning&&this.alignOffset)&&(assign(i,this.alignOffset),i.visibility='visible',delete i.pointerEvents,delete i.overflow),this.aligning=!1,i};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var Region=__webpack_require__(84),getConstrainRegion=__webpack_require__(99);module.exports=function(a,b,c,d){var e=getConstrainRegion.call(this,d);if(e)if('function'==typeof a.alignSubMenu)a.alignSubMenu(b,c,e);else{var f=b.alignTo(c,['tl-tr','bl-br','tr-tl','br-bl'],{constrain:e});return'tl-tr'==f||'tr-tl'==f?//align downwards
	1://align upwards
	-1}};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2),MenuItemCell=__webpack_require__(105),cloneElement=React.cloneElement,assign=__webpack_require__(5);function emptyFn(){}module.exports=function(a,b){var d=b.itemProps?b.itemProps.index:-1,e=a.children,f=1,g=[];React.Children.map(e,function(l){var m=l.props;if(g.push(l),m&&m.isMenuItem){var n=React.Children.count(m.children);f=Math.max(f,n)}});var h=a.itemStyleProps,j=-1,k=g.map(function(l,m){var n=l.props,o={};n&&n.isMenuItem&&(j++,o.onMenuItemMouseOver=this.onMenuItemMouseOver,o.onMenuItemMouseOut=this.onMenuItemMouseOut);var p=React.Children.map(n.children,function(t){return t}),q=React.Children.count(p);for(q<f&&(p=p?[p]:[]);q<f;)q++,p.push(React.createElement(MenuItemCell,null));var r=n.onClick||emptyFn,s=cloneElement(l,assign({interactionStyles:a.interactionStyles,itemIndex:j,itemCount:g.length,key:m,index:m,expanded:d==m,children:p,expander:a.expander,applyDefaultTheme:a.applyDefaultTheme,theme:a.theme,themes:a.themes||this.constructor.themes,onExpanderClick:this.onMenuItemExpanderClick,onClick:function(t,u,v){r.apply(null,arguments),this.onMenuItemClick(t,u,v)}.bind(this)},o,{style:h.itemStyle,overStyle:h.itemOverStyle,activeStyle:h.itemActiveStyle,disabledStyle:h.itemDisabledStyle,expandedStyle:h.itemExpandedStyle,cellStyle:h.cellStyle}));return s},this);return k};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2),assign=__webpack_require__(5),MenuItemCell=React.createClass({displayName:'ReactMenuItemCell',getDefaultProps:function getDefaultProps(){return{defaultStyle:{padding:5,whiteSpace:'nowrap'}}},render:function render(){var a=this.prepareProps(this.props),b=a.children;return a.expander&&(b=!0===a.expander?'\u203A':a.expander),React.createElement('td',a,b)},prepareProps:function prepareProps(a){var b={};return assign(b,a),b.style=this.prepareStyle(b),b},prepareStyle:function prepareStyle(a){var b={};// if (props.itemIndex != props.itemCount - 1){
	//     style.paddingBottom = 0
	// }
	return assign(b,a.defaultStyle,a.style),b}});module.exports=MenuItemCell;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2),assign=__webpack_require__(5),renderCells=__webpack_require__(107),MenuItem=__webpack_require__(109),MenuItemFactory=React.createFactory(MenuItem),MenuSeparator=__webpack_require__(112);module.exports=function(a,b,c,d){var e=b.itemProps?b.itemProps.index:-1;if('-'===c)return React.createElement(MenuSeparator,{key:d});var f=[a.itemClassName,c.cls,c.className].filter(function(i){return!!i}).join(' '),g=assign({className:f,key:d,data:c,columns:a.columns,expanded:d===e,disabled:c.disabled,onClick:c.onClick||c.fn},a.itemStyleProps);if(g.children=renderCells(g),c.items){var h=__webpack_require__(93);g.children.push(React.createElement(Menu,{items:c.items}))}return(a.itemFactory||MenuItemFactory)(g)};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var renderCell=__webpack_require__(108);module.exports=function(a){return a.columns.map(renderCell.bind(null,a))};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2),assign=__webpack_require__(5),MenuItemCell=__webpack_require__(105);module.exports=function(a,b){var c=assign({},a.defaultCellStyle,a.cellStyle);return React.createElement(MenuItemCell,{style:c},a.data[b])};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _reactDom=__webpack_require__(1),React=__webpack_require__(2),assign=__webpack_require__(5),normalize=__webpack_require__(20),EVENT_NAMES=__webpack_require__(110),getMenuOffset=__webpack_require__(95),prepareChildren=__webpack_require__(111),Menu=__webpack_require__(93),MenuItemCell=__webpack_require__(105),emptyFn=function emptyFn(){};function toUpperFirst(a){return a?a.charAt(0).toUpperCase()+a.substring(1):''}var MenuItem=React.createClass({displayName:'ReactMenuItem',getInitialState:function getInitialState(){return{}},getDefaultProps:function getDefaultProps(){return{isMenuItem:!0,interactionStyles:!0,defaultStyle:{cursor:'pointer',userSelect:'none',boxSizing:'border-box'},expander:'\u203A'}},render:function render(){var a=this.prepareProps(this.props,this.state);return React.createElement('tr',a)},componentDidMount:function componentDidMount(){this.didMount=!0},prepareProps:function prepareProps(a,b){var c={};return assign(c,a),c.theme=this.prepareTheme(c),c.mouseOver=!!b.mouseOver,c.active=!!b.active,c.disabled=!!c.disabled,c.style=this.prepareStyle(c),c.className=this.prepareClassName(c),c.children=this.prepareChildren(c),c.onClick=this.handleClick.bind(this,c),c.onMouseEnter=this.handleMouseEnter.bind(this,c),c.onMouseLeave=this.handleMouseLeave.bind(this,c),c.onMouseDown=this.handleMouseDown,c.onMouseMove=this.handleMouseMove,c},prepareTheme:function prepareTheme(a){var b=a.themes=a.themes||this.constructor.theme||THEME,c=a.theme;return'string'==typeof c&&(c=b[c]),c||b.default},handleClick:function handleClick(a,b){if(a.disabled)return void b.stopPropagation();(this.props.onClick||this.props.fn||emptyFn)(b,a,a.index)},handleMouseMove:function handleMouseMove(){},handleMouseDown:function handleMouseDown(){var a=function(){this.setState({active:!1}),window.removeEventListener('mouseup',a)}.bind(this);window.addEventListener('mouseup',a),this.setState({active:!0})},showMenu:function showMenu(a,b){b.showMenu(a,offset)},handleMouseEnter:function handleMouseEnter(a,b){if(!a.disabled){var c={x:b.pageX,y:b.pageY};if(this.setState({mouseOver:!0}),a.onMenuItemMouseOver){var d;a.menu&&(d=getMenuOffset((0,_reactDom.findDOMNode)(this))),a.onMenuItemMouseOver(a,d,c)}}},handleMouseLeave:function handleMouseLeave(a,b){if(!a.disabled){var c={x:b.pageX,y:b.pageY};this.didMount&&this.setState({active:!1,mouseOver:!1}),a.onMenuItemMouseOut&&a.onMenuItemMouseOut(a,c)}},prepareChildren:prepareChildren,prepareClassName:function prepareClassName(a){var b=a.className||'';return b+=' menu-row',a.disabled?b+=' disabled '+(a.disabledClassName||''):(a.mouseOver&&(b+=' over '+(a.overClassName||'')),a.active&&(b+=' active '+(a.activeClassName||'')),a.expanded&&(b+=' expanded '+(a.expandedClassName||''))),b},prepareDefaultStyle:function prepareDefaultStyle(a){var b=assign({},a.defaultStyle);return a.disabled&&assign(b,a.defaultDisabledStyle),b},prepareComputedStyleNames:function prepareComputedStyleNames(a){var b=['style'];if(a.disabled)return b.push('disabledStyle'),b;a.expanded&&b.push('expandedStyle');//names is something like ['style','expandedStyle']
	//
	//now we add over and active styles
	var c;a.mouseOver&&(c=b.map(function(e){return'over'+toUpperFirst(e)}));var d;return a.active&&(d=b.map(function(e){return'active'+toUpperFirst(e)})),c&&b.push.apply(b,c),d&&b.push.apply(b,d),b},prepareStyle:function prepareStyle(a){var b=assign({},this.prepareDefaultStyle(a)),c=this.prepareComputedStyleNames(a),d=a.theme,e=a.themes;return d&&(a.applyDefaultTheme&&d!=e.default&&e.default&&c.forEach(function(f){assign(b,e.default[f])}),c.forEach(function(f){assign(b,d[f])})),(a.onThemeStyleReady||emptyFn)(b,a),c.forEach(function(f){assign(b,a[f])}),(a.onStyleReady||emptyFn)(b,a),normalize(b);// assign(style, props.defaultStyle, props.style)
	// if (props.disabled){
	//     assign(style, props.defaultDisabledStyle, props.disabledStyle)
	// } else {
	//     if (props.interactionStyles){
	//         if (props.expanded){
	//             assign(style, props.defaultExpandedStyle, props.expandedStyle)
	//         }
	//         if (props.mouseOver){
	//             assign(style, props.defaultOverStyle, props.overStyle)
	//         }
	//         if (props.active){
	//             assign(style, props.defaultActiveStyle, props.activeStyle)
	//         }
	//     }
	// }
	// return normalize(style)
	}});module.exports=MenuItem;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(89)?
		{
			onMouseDown: 'onTouchStart',
			onMouseUp  : 'onTouchEnd',
			onMouseMove: 'onTouchMove'
		}:
		{
			onMouseDown: 'onMouseDown',
			onMouseUp  : 'onMouseUp',
			onMouseMove: 'onMouseMove'
		}

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},React=__webpack_require__(2),Menu=__webpack_require__(93),MenuItemCell=__webpack_require__(105),renderCell=__webpack_require__(108);var _react=__webpack_require__(2);module.exports=function(a){var c,b=[];if(React.Children.forEach(a.children,function(f){if(f){if(f.props&&f.props.isMenu)return void(c=(0,_react.cloneElement)(f,{ref:'subMenu',subMenu:!0}));'string'!=typeof f&&(f=(0,_react.cloneElement)(f,{style:a.cellStyle,itemIndex:a.itemIndex,itemCount:a.itemCount})),b.push(f)}}),c){a.menu=c;var d=a.expander||!0,e={};d&&(e.onClick=a.onExpanderClick),b.push(React.createElement(MenuItemCell,_extends({expander:d},e)))}return b};

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2),assign=__webpack_require__(5),emptyFn=function emptyFn(){},MenuSeparator=React.createClass({displayName:'ReactMenuSeparator',getDefaultProps:function getDefaultProps(){return{size:1}},render:function render(){var a=this.prepareProps(this.props);return React.createElement('tr',a,React.createElement('td',{colSpan:10,style:{padding:0}}))},prepareProps:function prepareProps(a){var b={};return assign(b,a),b.style=this.prepareStyle(b),b.className=this.prepareClassName(b),b},prepareClassName:function prepareClassName(a){var b=a.className||'';return b+=' menu-separator',b},prepareStyle:function prepareStyle(a){var b={};return assign(b,MenuSeparator.defaultStyle,MenuSeparator.style,{height:MenuSeparator.size||a.size},a.style),b}});MenuSeparator.defaultStyle={cursor:'auto',background:'gray'},MenuSeparator.style={},module.exports=MenuSeparator;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2);module.exports={items:React.PropTypes.array,columns:React.PropTypes.array,onMount:React.PropTypes.func,defaultRowActiveStyle:React.PropTypes.object,defaultRowOverStyle:React.PropTypes.object,defaultRowStyle:React.PropTypes.object,rowActiveStyle:React.PropTypes.object,rowOverStyle:React.PropTypes.object,rowStyle:React.PropTypes.object,cellStyle:React.PropTypes.object};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _reactDom=__webpack_require__(1),React=__webpack_require__(2),assign=__webpack_require__(5),buffer=__webpack_require__(115),Scroller=__webpack_require__(116);function stop(a){a.preventDefault(),a.stopPropagation()}module.exports=React.createClass({displayName:'ReactMenuScrollContainer',getInitialState:function getInitialState(){return{adjustScroll:!0,scrollPos:0}},getDefaultProps:function getDefaultProps(){return{scrollStep:5,scrollSpeed:50}},componentWillUnmount:function componentWillUnmount(){this.props.enableScroll&&window.removeEventListener('resize',this.onResizeListener)},componentDidMount:function componentDidMount(){this.props.enableScroll&&setTimeout(function(){this.isMounted()&&(this.adjustScroll(),window.addEventListener('resize',this.onResizeListener=buffer(this.onWindowResize,this.props.onWindowResizeBuffer,this)))}.bind(this),0)},componentDidUpdate:function componentDidUpdate(){this.props.enableScroll&&this.adjustScroll()},onWindowResize:function onWindowResize(){this.adjustScroll(),this.doScroll(0)},render:function render(){var a=this.props,b=a.children;if(!a.enableScroll)return b;var c={position:'relative'};this.state.scrollPos&&(c.top=-this.state.scrollPos);var d={position:'relative',overflow:'hidden'};return a.maxHeight&&(d.maxHeight=a.maxHeight),React.createElement('div',{onMouseEnter:a.onMouseEnter,onMouseLeave:a.onMouseLeave,className:'z-menu-scroll-container',style:d},React.createElement('div',{ref:'tableWrap',style:c},b),this.renderScroller(a,-1),this.renderScroller(a,1))},renderScroller:function renderScroller(a,b){var c=-1==b?this.handleScrollTop:this.handleScrollBottom,d=-1==b?this.handleScrollTopMax:this.handleScrollBottomMax,e=-1==b?this.state.hasTopScroll:this.state.hasBottomScroll,f=assign({},a.scrollerProps,{visible:e,side:-1==b?'top':'bottom',onMouseDown:c,onDoubleClick:d});return React.createElement(Scroller,f)},adjustScroll:function adjustScroll(){if(this.props.enableScroll){if(!this.state.adjustScroll)return void(this.state.adjustScroll=!0);var a=this.getAvailableHeight(),b=this.getCurrentTableHeight(),c={adjustScroll:!1,hasTopScroll:!1,hasBottomScroll:!1};b>a?(c.maxScrollPos=b-a,c.hasTopScroll=0!==this.state.scrollPos,c.hasBottomScroll=this.state.scrollPos!=c.maxScrollPos):(c.maxScrollPos=0,c.scrollPos=0),this.setState(c)}},getAvailableHeight:function getAvailableHeight(){return this.getAvailableSizeDOM().clientHeight},getAvailableSizeDOM:function getAvailableSizeDOM(){return(0,_reactDom.findDOMNode)(this)},getCurrentTableHeight:function getCurrentTableHeight(){return this.getCurrentSizeDOM().clientHeight},getCurrentSizeDOM:function getCurrentSizeDOM(){return(0,_reactDom.findDOMNode)(this.refs.tableWrap)},handleScrollTop:function handleScrollTop(a){a.preventDefault(),this.handleScroll(-1)},handleScrollBottom:function handleScrollBottom(a){a.preventDefault(),this.handleScroll(1)},handleScrollTopMax:function handleScrollTopMax(a){stop(a),this.handleScrollMax(-1)},handleScrollBottomMax:function handleScrollBottomMax(a){stop(a),this.handleScrollMax(1)},handleScrollMax:function handleScrollMax(a){var b=-1==a?0:this.state.maxScrollPos;this.setScrollPosition(b)},handleScroll:function handleScroll(a/*1 to bottom, -1 to up*/){var b=function(){this.stopScroll(),window.removeEventListener('mouseup',b)}.bind(this);window.addEventListener('mouseup',b),this.scrollInterval=setInterval(this.doScroll.bind(this,a),this.props.scrollSpeed)},doScroll:function doScroll(a){this.setState({scrollDirection:a});var b=this.state.scrollPos+a*this.props.scrollStep;this.setScrollPosition(b)},setScrollPosition:function setScrollPosition(a){a>this.state.maxScrollPos&&(a=this.state.maxScrollPos),0>a&&(a=0),this.setState({scrollPos:a,scrolling:!0})},stopScroll:function stopScroll(){clearInterval(this.scrollInterval),this.setState({scrolling:!1})}});

/***/ },
/* 115 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var setImmediate   = global.setImmediate
	var clearImmediate = global.clearImmediate

	module.exports = function(fn, delay, scope){

	    var timeoutId = -1

	    return function(){

	        var self = scope || this
	        var args = arguments

	        if (delay < 0){
	            fn.apply(self, args)
	            return
	        }

	        var withTimeout = delay || !setImmediate
	        var clearFn = withTimeout?
	                        clearTimeout:
	                        clearImmediate
	        var setFn   = withTimeout?
	                        setTimeout:
	                        setImmediate

	        if (timeoutId !== -1){
	            clearFn(timeoutId)
	        }

	        timeoutId = setFn(function(){
	            fn.apply(self, args)
	            self = null
	        }, delay)
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var React=__webpack_require__(2),assign=__webpack_require__(5),getArrowStyle=__webpack_require__(117);function emptyFn(){}var SCROLLER_STYLE={left:0,right:0,position:'absolute',cursor:'pointer',zIndex:1};function generateArrowStyle(a,b,c){var d=assign({},c),e={color:d.color||a.arrowColor},f=4,g=d.width||a.arrowWidth||a.arrowSize||a.style.height-f,h=d.height||a.arrowHeight||a.arrowSize||a.style.height-f;return e.width=g,e.height=h,assign(d,getArrowStyle('top'==a.side?'up':'down',e)),d.display='inline-block',d.position='absolute',d.left='50%',d.marginLeft=-g,d.top='50%',d.marginTop=-h/2,b.active&&(d.marginTop+='top'==a.side?-1:1),d}var Scroller=React.createClass({displayName:'Scroller',display:'ReactMenuScroller',getInitialState:function getInitialState(){return{}},getDefaultProps:function getDefaultProps(){return{height:10,defaultStyle:{background:'white'},defaultOverStyle:{},overStyle:{},defaultTopStyle:{borderBottom:'1px solid gray'},topStyle:{},defaultBottomStyle:{borderTop:'1px solid gray'},bottomStyle:{},arrowColor:'gray',arrowStyle:{},defaultArrowStyle:{},defaultArrowOverStyle:{color:'rgb(74, 74, 74)'},arrowOverStyle:{}}},handleMouseEnter:function handleMouseEnter(){this.setState({mouseOver:!0})},handleMouseLeave:function handleMouseLeave(){this.setState({mouseOver:!1})},handleMouseDown:function handleMouseDown(a){this.setState({active:!0}),(this.props.onMouseDown||emptyFn)(a)},handleMouseUp:function handleMouseUp(a){this.setState({active:!1}),(this.props.onMouseUp||emptyFn)(a)},render:function render(){var a=assign({},this.props,{onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp}),b=this.state,c=a.side;a.className=this.prepareClassName(a,b),a.style=this.prepareStyle(a,b);var d=this.prepareArrowStyle(a,b);return a.factory?a.factory(a,c):React.createElement('div',a,React.createElement('div',{style:d}))},prepareStyle:function prepareStyle(a,b){var c,d;b.mouseOver&&(d=a.overStyle,c=a.defaultOverStyle);var e='top'==a.side?a.defaultTopStyle:a.defaultBottomStyle,f='top'==a.side?a.topStyle:a.bottomStyle,g=assign({},SCROLLER_STYLE,a.defaultStyle,e,c,a.style,f,d);return g.height=g.height||a.height,g[a.side]=0,a.visible||(g.display='none'),g},prepareClassName:function prepareClassName(a){//className
	var b=a.className||'';return b+=' z-menu-scroller '+a.side,a.active&&a.visible&&(b+=' active'),b},prepareArrowStyle:function prepareArrowStyle(a,b){var c,d;b.mouseOver&&(c=a.defaultArrowOverStyle,d=a.arrowOverStyle);var e=assign({},a.defaultArrowStyle,c,a.arrowStyle,d);return generateArrowStyle(a,b,e)},handleClick:function handleClick(a){a.stopPropagation}});module.exports=Scroller;

/***/ },
/* 117 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function arrowStyle(side, config){

	    var arrowSize   = config.size   || 8
	    var arrowWidth  = config.width  || arrowSize
	    var arrowHeight = config.height || arrowSize
	    var arrowColor  = config.color  || 'black'
	    var includePosition = config.includePosition

	    var style

	    if (side == 'up' || side == 'down'){

	        style = {
	            borderLeft : arrowWidth + 'px solid transparent',
	            borderRight: arrowWidth + 'px solid transparent'
	        }

	        if (includePosition){
	            style.marginTop = -Math.round(arrowHeight/2) + 'px'
	            style.position  = 'relative'
	            style.top       = '50%'
	        }

	        style[side === 'up'? 'borderBottom': 'borderTop'] = arrowHeight + 'px solid ' + arrowColor
	    }

	    if (side == 'left' || side == 'right'){

	        style = {
	            borderTop : arrowHeight + 'px solid transparent',
	            borderBottom: arrowHeight + 'px solid transparent'
	        }

	        if (includePosition){
	            style.marginLeft = -Math.round(arrowWidth/2) + 'px'
	            style.position   = 'relative'
	            style.left       = '50%'
	        }

	        style[side === 'left'? 'borderRight': 'borderLeft'] = arrowWidth + 'px solid ' + arrowColor
	    }

	    return style
	}

/***/ },
/* 118 */
/***/ function(module, exports) {

	'use strict';module.exports={default:{// overStyle: {
	//     background: 'rgb(202, 223, 255)'
	// },
	overStyle:{background:'linear-gradient(to bottom, rgb(125, 191, 242) 0%, rgb(110, 184, 241) 50%, rgb(117, 188, 242) 100%)',color:'white'},activeStyle:{// background: 'rgb(118, 181, 231)',
	//-6 lightness from overStyle
	background:' linear-gradient(to bottom, rgb(106,182,240) 0%,rgb(91,175,239) 50%,rgb(96,178,240) 100%)',color:'white'},expandedStyle:{// background: 'rgb(215, 231, 255)',
	background:'linear-gradient(to bottom, rgb(162,210,246) 0%,rgb(151,204,245) 50%,rgb(154,206,246) 100%)',color:'white'},disabledStyle:{color:'gray',cursor:'default'}}};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var clone = (function() {
	'use strict';

	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	*/
	function clone(parent, circular, depth, prototype) {
	  var filter;
	  if (typeof circular === 'object') {
	    depth = circular.depth;
	    prototype = circular.prototype;
	    filter = circular.filter;
	    circular = circular.circular
	  }
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];

	  var useBuffer = typeof Buffer != 'undefined';

	  if (typeof circular == 'undefined')
	    circular = true;

	  if (typeof depth == 'undefined')
	    depth = Infinity;

	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;

	    if (depth == 0)
	      return parent;

	    var child;
	    var proto;
	    if (typeof parent != 'object') {
	      return parent;
	    }

	    if (clone.__isArray(parent)) {
	      child = [];
	    } else if (clone.__isRegExp(parent)) {
	      child = new RegExp(parent.source, __getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (clone.__isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      child = new Buffer(parent.length);
	      parent.copy(child);
	      return child;
	    } else {
	      if (typeof prototype == 'undefined') {
	        proto = Object.getPrototypeOf(parent);
	        child = Object.create(proto);
	      }
	      else {
	        child = Object.create(prototype);
	        proto = prototype;
	      }
	    }

	    if (circular) {
	      var index = allParents.indexOf(parent);

	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }

	    for (var i in parent) {
	      var attrs;
	      if (proto) {
	        attrs = Object.getOwnPropertyDescriptor(proto, i);
	      }

	      if (attrs && attrs.set == null) {
	        continue;
	      }
	      child[i] = _clone(parent[i], depth - 1);
	    }

	    return child;
	  }

	  return _clone(parent, depth);
	}

	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function clonePrototype(parent) {
	  if (parent === null)
	    return null;

	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};

	// private utility functions

	function __objToStr(o) {
	  return Object.prototype.toString.call(o);
	};
	clone.__objToStr = __objToStr;

	function __isDate(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Date]';
	};
	clone.__isDate = __isDate;

	function __isArray(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Array]';
	};
	clone.__isArray = __isArray;

	function __isRegExp(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
	};
	clone.__isRegExp = __isRegExp;

	function __getRegExpFlags(re) {
	  var flags = '';
	  if (re.global) flags += 'g';
	  if (re.ignoreCase) flags += 'i';
	  if (re.multiline) flags += 'm';
	  return flags;
	};
	clone.__getRegExpFlags = __getRegExpFlags;

	return clone;
	})();

	if (typeof module === 'object' && module.exports) {
	  module.exports = clone;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(120).Buffer))

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(121)
	var ieee754 = __webpack_require__(122)
	var isArray = __webpack_require__(123)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 121 */
/***/ function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 122 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 123 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 124 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function asArray(x) {
	    if (!x) {
	        x = [];
	    }

	    if (!Array.isArray(x)) {
	        x = [x];
	    }

	    return x;
	};

/***/ },
/* 125 */
/***/ function(module, exports) {

	'use strict';

	function findIndexBy(arr, fn) {

	    var i = 0;
	    var len = arr.length;

	    for (; i < len; i++) {
	        if (fn(arr[i]) === true) {
	            return i;
	        }
	    }

	    return -1;
	}

	module.exports = findIndexBy;

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var findIndexBy = __webpack_require__(125);

	function findIndexByName(arr, name) {
	    return findIndexBy(arr, function (info) {
	        return info.name === name;
	    });
	}

	module.exports = findIndexByName;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var assign = __webpack_require__(5);
	var normalize = __webpack_require__(20);

	var TEXT_ALIGN_2_JUSTIFY = {
	    right: 'flex-end',
	    center: 'center'
	};

	function copyProps(target, source, list) {

	    list.forEach(function (name) {
	        if (name in source) {
	            target[name] = source[name];
	        }
	    });
	}

	var PropTypes = React.PropTypes;

	var Cell = React.createClass({

	    displayName: 'ReactDataGrid.Cell',

	    propTypes: {
	        className: PropTypes.string,
	        firstClassName: PropTypes.string,
	        lastClassName: PropTypes.string,

	        contentPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

	        column: PropTypes.object,
	        columns: PropTypes.array,
	        index: PropTypes.number,

	        style: PropTypes.object,
	        text: PropTypes.any,
	        rowIndex: PropTypes.number
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            text: '',

	            firstClassName: 'z-first',
	            lastClassName: 'z-last',

	            defaultStyle: {}
	        };
	    },

	    prepareClassName: function prepareClassName(props) {
	        var index = props.index;
	        var columns = props.columns;
	        var column = props.column;

	        var textAlign = column && column.textAlign;

	        var className = props.className || '';

	        className += ' ' + Cell.className;

	        if (columns) {
	            if (!index && props.firstClassName) {
	                className += ' ' + props.firstClassName;
	            }

	            if (index == columns.length - 1 && props.lastClassName) {
	                className += ' ' + props.lastClassName;
	            }
	        }

	        if (textAlign) {
	            className += ' z-align-' + textAlign;
	        }

	        return className;
	    },

	    prepareStyle: function prepareStyle(props) {
	        var column = props.column;
	        var sizeStyle = column && column.sizeStyle;

	        var alignStyle;
	        var textAlign = column && column.textAlign || (props.style || {}).textAlign;

	        if (textAlign) {
	            alignStyle = { justifyContent: TEXT_ALIGN_2_JUSTIFY[textAlign] };
	        }

	        var style = assign({}, props.defaultStyle, sizeStyle, alignStyle, props.style);

	        return normalize(style);
	    },

	    prepareProps: function prepareProps(thisProps) {

	        var props = assign({}, thisProps);

	        if (!props.column && props.columns) {
	            props.column = props.columns[props.index];
	        }

	        props.className = this.prepareClassName(props);
	        props.style = this.prepareStyle(props);

	        return props;
	    },

	    render: function render() {
	        var props = this.p = this.prepareProps(this.props);

	        var column = props.column;
	        var textAlign = column && column.textAlign;
	        var text = props.renderText ? props.renderText(props.text, column, props.rowIndex) : props.text;

	        var contentProps = {
	            className: 'z-content',
	            style: {
	                padding: props.contentPadding
	            }
	        };

	        var content = props.renderCell ? props.renderCell(contentProps, text, props) : React.DOM.div(contentProps, text);

	        var renderProps = assign({}, props);

	        delete renderProps.data;

	        return React.createElement(
	            'div',
	            renderProps,
	            content,
	            props.children
	        );
	    }
	});

	Cell.className = 'z-cell';

	module.exports = Cell;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(8);
	var DragHelper = __webpack_require__(83);
	var findDOMNode = __webpack_require__(1).findDOMNode;

	function range(start, end) {
	    var res = [];

	    for (; start <= end; start++) {
	        res.push(start);
	    }

	    return res;
	}

	function buildIndexes(direction, index, dragIndex) {
	    var indexes = direction < 0 ? range(index, dragIndex) : range(dragIndex, index);

	    var result = {};

	    indexes.forEach(function (value) {
	        result[value] = true;
	    });

	    return result;
	}

	module.exports = function (header, props, column, event) {

	    event.preventDefault();

	    var headerNode = findDOMNode(header);
	    var headerRegion = Region.from(headerNode);
	    var dragColumn = column;
	    var dragColumnIndex;
	    var columnData;
	    var shiftRegion;

	    DragHelper(event, {

	        constrainTo: headerRegion.expand({ top: true, bottom: true }),

	        onDragStart: function onDragStart(event, config) {

	            var columnHeaders = headerNode.querySelectorAll('.' + props.cellClassName);

	            columnData = props.columns.map(function (column, i) {
	                var region = Region.from(columnHeaders[i]);

	                if (column === dragColumn) {
	                    dragColumnIndex = i;
	                    shiftRegion = region.clone();
	                }

	                return {
	                    column: column,
	                    index: i,
	                    region: region
	                };
	            });

	            header.setState({
	                dragColumn: column,
	                dragging: true
	            });

	            config.columnData = columnData;
	        },
	        onDrag: function onDrag(event, config) {
	            var diff = config.diff.left;
	            var directionSign = diff < 0 ? -1 : 1;
	            var state = {
	                dragColumnIndex: dragColumnIndex,
	                dragColumn: dragColumn,
	                dragLeft: diff,
	                dropIndex: null,
	                shiftIndexes: null,
	                shiftSize: null
	            };

	            var shift;
	            var shiftSize;
	            var newLeft = shiftRegion.left + diff;
	            var newRight = newLeft + shiftRegion.width;
	            var shiftZone = { left: newLeft, right: newRight };

	            config.columnData.forEach(function (columnData, index, arr) {

	                var itColumn = columnData.column;
	                var itRegion = columnData.region;

	                if (shift || itColumn === dragColumn) {
	                    return;
	                }

	                var itLeft = itRegion.left;
	                var itRight = itRegion.right;
	                var itZone = directionSign == -1 ? { left: itLeft, right: itLeft + itRegion.width } : { left: itRight - itRegion.width, right: itRight };

	                if (shiftRegion.width < itRegion.width) {
	                    //shift region is smaller than itRegion
	                    shift = Region.getIntersectionWidth(itZone, shiftZone) >= Math.min(itRegion.width, shiftRegion.width) / 2;
	                } else {
	                    //shift region is bigger than itRegion
	                    shift = Region.getIntersectionWidth(itRegion, shiftZone) >= itRegion.width / 2;
	                }

	                if (shift) {
	                    shiftSize = -directionSign * shiftRegion.width;
	                    state.dropIndex = index;
	                    state.shiftIndexes = buildIndexes(directionSign, index, dragColumnIndex);
	                    state.shiftSize = shiftSize;
	                }
	            });

	            header.setState(state);
	        },

	        onDrop: function onDrop(event) {
	            header.onDrop(event);
	        }
	    });
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(8);
	var DragHelper = __webpack_require__(83);
	var findDOMNode = __webpack_require__(1).findDOMNode;

	var findIndexByName = __webpack_require__(126);

	module.exports = function (header, props, column, event) {

	    event.preventDefault();

	    var columns = props.columns;
	    var index = findIndexByName(columns, column.name);
	    var proxyLeft = Region.from(event.target).right;

	    var headerNode = findDOMNode(header);

	    var constrainTo = Region.from(headerNode);

	    DragHelper(event, {
	        constrainTo: constrainTo,

	        onDragStart: function onDragStart(event, config) {

	            header.onResizeDragStart({
	                resizing: true,
	                resizeColumn: column,
	                resizeProxyLeft: proxyLeft
	            });
	        },

	        onDrag: function onDrag(event, config) {
	            var diff = config.diff.left;

	            header.onResizeDrag({
	                resizeProxyDiff: diff
	            });
	        },

	        onDrop: function onDrop(event, config) {

	            var diff = config.diff.left;
	            var columnHeaders = headerNode.querySelectorAll('.' + props.cellClassName);
	            var nextColumn = diff > 0 ? null : columns[index + 1];

	            var columnSize = Region.from(columnHeaders[index]).width;
	            var nextColumnSize;
	            var firstSize = columnSize + diff;
	            var secondSize = 0;

	            // if (firstSize < column.minWidth){
	            //     firstSize = column.minWidth
	            //     diff = firstSize - columnSize
	            // }

	            if (nextColumn) {
	                nextColumnSize = nextColumn ? Region.from(columnHeaders[index + 1]).width : 0;

	                secondSize = nextColumnSize - diff;
	            }

	            // if (nextColumn && secondSize < nextColumn.minWidth){
	            //     secondSize = nextColumn.minWidth
	            //     diff = nextColumnSize - secondSize
	            //     firstSize = columnSize + diff
	            // }

	            var resizeInfo = [{
	                name: column.name,
	                size: firstSize,
	                diff: diff
	            }];

	            if (nextColumn) {
	                resizeInfo.push({
	                    name: nextColumn.name,
	                    size: secondSize,
	                    diff: -diff
	                });
	            }

	            header.onResizeDrop({
	                resizing: false,
	                resizeColumn: null,
	                resizeProxyLeft: null
	            }, resizeInfo, event);
	        }
	    });
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var assign = __webpack_require__(5);

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.ResizeProxy',

	    propTypes: {
	        active: React.PropTypes.bool
	    },

	    getInitialState: function getInitialState() {
	        return {
	            offset: 0
	        };
	    },

	    render: function render() {

	        var props = assign({}, this.props);
	        var state = this.state;

	        var style = {};
	        var active = props.active;

	        if (active) {
	            style.display = 'block';
	            style.left = state.offset;
	        }

	        return React.createElement('div', { className: 'z-resize-proxy', style: style });
	    }
	});

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasown = __webpack_require__(10);

	function copyIf(source, target) {
	    var hasOwn = hasown(target);

	    Object.keys(source).forEach(function (key) {
	        if (!hasOwn(key)) {
	            target[key] = source[key];
	        }
	    });
	}

	function groupByFields(data, fields, path, names, fieldIndex) {
	    data = data || [];
	    fieldIndex = fieldIndex || 0;

	    var field = fields[fieldIndex];

	    if (!field) {
	        return data;
	    }

	    var group = groupArrayByField(data, field);
	    var fieldName = typeof field == 'string' ? field : field.name;

	    if (!fieldIndex) {
	        group.namePath = [];
	        group.valuePath = [];
	        group.depth = 0;
	        delete group.name;
	    }

	    var groupsCount = group.length;

	    if (group.keys && group.keys.length) {

	        group.leaf = false;
	        group.keys.forEach(function (key) {

	            var groupPath = (path || []).concat(key);
	            var fieldNames = (names || []).concat(fieldName);
	            var data = groupByFields(group.data[key], fields, groupPath, fieldNames, fieldIndex + 1);

	            if (Array.isArray(data)) {
	                data = {
	                    data: data,
	                    leaf: true
	                };
	            }

	            data.name = fieldName;
	            data.value = key;
	            data.valuePath = groupPath;
	            data.namePath = fieldNames;
	            data.depth = fieldIndex + 1;

	            if (typeof field != 'string') {

	                copyIf(field, data);
	            }

	            group.data[key] = data;

	            if (!data.leaf) {
	                groupsCount += data.groupsCount;
	            }
	        });
	    }

	    if (!group.leaf) {
	        group.groupsCount = groupsCount;
	    }

	    return group;
	}

	function groupArrayByField(data, field) {

	    var groupKeys = {};
	    var groupKeysArray = [];

	    var fieldName = typeof field == 'string' ? field : field.name;(data || []).forEach(function (item) {
	        var itemKey = item[fieldName];

	        if (groupKeys[itemKey]) {
	            groupKeys[itemKey].push(item);
	        } else {
	            groupKeys[itemKey] = [item];
	            groupKeysArray.push(itemKey);
	        }
	    });

	    var result = {
	        keys: groupKeysArray,
	        data: groupKeys,
	        childName: fieldName,
	        length: groupKeysArray.length,
	        leaf: true
	    };

	    return result;
	}

	module.exports = groupByFields;

/***/ },
/* 132 */
/***/ function(module, exports) {

	'use strict';

	function slice(data, props) {

	    if (!props.virtualRendering) {
	        return data;
	    }

	    return data.slice(props.startIndex, props.startIndex + props.renderCount);
	}

	module.exports = slice;

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var renderMenu = __webpack_require__(134);
	var renderRow = __webpack_require__(135);
	var tableStyle = __webpack_require__(137);
	var slice = __webpack_require__(132);
	var LoadMask = __webpack_require__(3);

	function getData(props) {

	    if (!props.virtualRendering) {
	        return props.data;
	    }

	    return slice(props.data, props);
	}

	module.exports = function (props, rows) {

	    rows = rows || getData(props).map(function (data, index) {
	        return renderRow.call(this, props, data, index + props.startIndex);
	    }, this);

	    // if (props.topLoader && props.scrollTop < (2 * props.rowHeight)){
	    // rows.unshift(props.topLoader)
	    // }

	    return {
	        className: 'z-table',
	        style: tableStyle(props),
	        children: rows
	    };
	};

/***/ },
/* 134 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function renderMenu(props) {
	    if (!props.menu) {
	        return;
	    }

	    return props.menu({
	        className: 'z-header-menu-column',
	        gridColumns: props.columns
	    });
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var assign = __webpack_require__(5);
	var React = __webpack_require__(2);

	var Row = __webpack_require__(136);
	var RowFactory = React.createFactory(Row);

	var renderCell = Row.prototype.renderCell;

	/**
	 * Render a datagrid row
	 *
	 * @param  {Object}   props The props from which to build row props
	 * @param  {Object}   data The data object that backs this row
	 * @param  {Number}   index The index in the grid of the row to be rendered
	 * @param  {Function} [fn] A function that can be used to modify built row props
	 *
	 * If props.rowFactory is specified, it will be used to build the ReactElement
	 * corresponding to this row. In case it returns undefined, the default RowFactory will be used
	 * (this case occurs when the rowFactory was specified just to modify the row props)
	 *
	 * @return {ReactElement}
	 */
	module.exports = function renderRow(props, data, index, fn) {
	    var factory = props.rowFactory || RowFactory;
	    var key = data[props.idProperty];
	    var selectedKey = key;
	    var renderKey = key;

	    if (!props.groupBy) {
	        renderKey = index - props.startIndex;
	    }

	    var selected = false;

	    if (_typeof(props.selected) == 'object' && props.selected) {
	        selected = !!props.selected[selectedKey];
	    } else if (props.selected) {
	        selected = selectedKey === props.selected;
	    }

	    var config = assign({}, props.rowProps, {
	        selected: selected,

	        key: renderKey,
	        data: data,
	        index: index,

	        cellFactory: props.cellFactory,
	        renderCell: props.renderCell,
	        renderText: props.renderText,
	        cellPadding: props.cellPadding,
	        rowHeight: props.rowHeight,
	        minWidth: props.minRowWidth - props.scrollbarSize,
	        columns: props.columns,

	        rowContextMenu: props.rowContextMenu,
	        showMenu: props.showMenu,

	        _onClick: this ? this.handleRowClick : null
	    });

	    var style;
	    var rowStyle = props.rowStyle;

	    if (rowStyle) {
	        style = {};

	        if (typeof rowStyle == 'function') {
	            style = rowStyle(data, config);
	        } else {
	            assign(style, rowStyle);
	        }

	        config.style = style;
	    }

	    var className = props.rowClassName;

	    if (typeof className == 'function') {
	        className = className(data, config);
	    }

	    if (className) {
	        config.className = className;
	    }

	    if (typeof fn == 'function') {
	        config = fn(config);
	    }

	    var row = factory(config);

	    if (row === undefined) {
	        row = RowFactory(config);
	    }

	    if (config.selected && this) {
	        this.selIndex = index;
	    }

	    // var cached = this.rowCache && this.rowCache[renderKey]

	    // if (cached){
	    // return React.cloneElement(cached, {
	    //     children: config.columns.map(function(col, index){
	    //         return renderCell(config, col, index)
	    //     })
	    // })
	    // }

	    // if (this.rowCache){
	    //     this.rowCache[renderKey] = row
	    // }

	    return row;
	};

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Region = __webpack_require__(8);
	var assign = __webpack_require__(5);
	var normalize = __webpack_require__(20);
	var Cell = __webpack_require__(127);
	var CellFactory = React.createFactory(Cell);
	var ReactMenu = __webpack_require__(92);
	var ReactMenuFactory = React.createFactory(ReactMenu);

	module.exports = React.createClass({

	  displayName: 'ReactDataGrid.Row',

	  propTypes: {
	    data: React.PropTypes.object,
	    columns: React.PropTypes.array,
	    index: React.PropTypes.number
	  },

	  getDefaultProps: function getDefaultProps() {

	    return {
	      defaultStyle: {}
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      mouseOver: false
	    };
	  },

	  render: function render() {
	    var props = this.prepareProps(this.props);
	    var cells = props.children || props.columns.map(this.renderCell.bind(this, this.props));

	    return React.createElement(
	      'div',
	      props,
	      cells
	    );
	  },

	  prepareProps: function prepareProps(thisProps) {
	    var props = assign({}, thisProps);

	    props.className = this.prepareClassName(props, this.state);
	    props.style = this.prepareStyle(props);

	    props.onMouseEnter = this.handleMouseEnter;
	    props.onMouseLeave = this.handleMouseLeave;
	    props.onContextMenu = this.handleContextMenu;
	    props.onClick = this.handleRowClick;

	    delete props.data;
	    delete props.cellPadding;

	    return props;
	  },

	  handleRowClick: function handleRowClick(event) {

	    if (this.props.onClick) {
	      this.props.onClick(event);
	    }

	    if (this.props._onClick) {
	      this.props._onClick(this.props, event);
	    }
	  },

	  handleContextMenu: function handleContextMenu(event) {

	    if (this.props.rowContextMenu) {
	      this.showMenu(event);
	    }

	    if (this.props.onContextMenu) {
	      this.props.onContextMenu(event);
	    }
	  },

	  showMenu: function showMenu(event) {
	    var factory = this.props.rowContextMenu;
	    var alignTo = Region.from(event);

	    var props = {
	      style: {
	        position: 'absolute'
	      },
	      rowProps: this.props,
	      data: this.props.data,
	      alignTo: alignTo,
	      alignPositions: ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
	      items: [{
	        label: 'stop'
	      }]
	    };

	    var menu = factory(props);

	    if (menu === undefined) {
	      menu = ReactMenuFactory(props);
	    }

	    event.preventDefault();

	    this.props.showMenu(function () {
	      return menu;
	    });
	  },

	  handleMouseLeave: function handleMouseLeave(event) {
	    this.setState({
	      mouseOver: false
	    });

	    if (this.props.onMouseLeave) {
	      this.props.onMouseLeave(event);
	    }
	  },

	  handleMouseEnter: function handleMouseEnter(event) {
	    this.setState({
	      mouseOver: true
	    });

	    if (this.props.onMouseEnter) {
	      this.props.onMouseEnter(event);
	    }
	  },

	  renderCell: function renderCell(props, column, index) {

	    var text = props.data[column.name];
	    var columns = props.columns;

	    var cellProps = {
	      style: column.style,
	      className: column.className,

	      key: column.name,
	      name: column.name,

	      data: props.data,
	      columns: columns,
	      index: index,
	      rowIndex: props.index,
	      textPadding: props.cellPadding,
	      renderCell: props.renderCell,
	      renderText: props.renderText
	    };

	    if (typeof column.render == 'function') {
	      text = column.render(text, props.data, cellProps);
	    }

	    cellProps.text = text;

	    var result;

	    if (props.cellFactory) {
	      result = props.cellFactory(cellProps);
	    }

	    if (result === undefined) {
	      result = CellFactory(cellProps);
	    }

	    return result;
	  },

	  prepareClassName: function prepareClassName(props, state) {
	    var className = props.className || '';

	    className += ' z-row ';

	    if (props.index % 2 === 0) {
	      className += ' z-even ' + (props.evenClassName || '');
	    } else {
	      className += ' z-odd ' + (props.oddClassName || '');
	    }

	    if (state.mouseOver) {
	      className += ' z-over ' + (props.overClassName || '');
	    }

	    if (props.selected) {
	      className += ' z-selected ' + (props.selectedClassName || '');
	    }

	    return className;
	  },

	  prepareStyle: function prepareStyle(props) {

	    var style = assign({}, props.defaultStyle, props.style);

	    style.height = props.rowHeight;
	    style.minWidth = props.minWidth;

	    return style;
	  }
	});

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var normalize = __webpack_require__(20);

	var colors = ['blue', 'red', 'magenta'];
	module.exports = function (props) {
	    var scrollTop = props.virtualRendering ? -(props.topOffset || 0) : props.scrollTop;

	    return normalize({
	        transform: 'translate3d(' + -props.scrollLeft + 'px, ' + -scrollTop + 'px, 0px)'
	    });
	};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var Row = __webpack_require__(136);
	var Cell = __webpack_require__(127);
	var CellFactory = React.createFactory(Cell);

	var renderRow = __webpack_require__(135);

	function renderData(props, data, depth) {

	    return data.map(function (data, index) {

	        return renderRow(props, data, index, function (config) {
	            config.cellFactory = function (cellProps) {
	                if (cellProps.index === 0) {
	                    cellProps.style.paddingLeft = depth * props.groupNestingWidth;
	                }

	                return CellFactory(cellProps);
	            };

	            config.className += ' z-grouped';

	            return config;
	        });
	    });
	}

	function renderGroupRow(props, groupData) {

	    var cellStyle = {
	        minWidth: props.totalColumnWidth,
	        paddingLeft: (groupData.depth - 1) * props.groupNestingWidth
	    };

	    return React.createElement(
	        Row,
	        { className: 'z-group-row', key: 'group-' + groupData.valuePath, rowHeight: props.rowHeight },
	        React.createElement(Cell, {
	            className: 'z-group-cell',
	            contentPadding: props.cellPadding,
	            text: groupData.value,
	            style: cellStyle
	        })
	    );
	}

	function renderGroup(props, groupData) {

	    var result = [renderGroupRow(props, groupData)];

	    if (groupData && groupData.leaf) {
	        result.push.apply(result, renderData(props, groupData.data, groupData.depth));
	    } else {
	        groupData.keys.forEach(function (key) {
	            var items = renderGroup(props, groupData.data[key]);
	            result.push.apply(result, items);
	        });
	    }

	    return result;
	}

	function renderGroups(props, groupsData) {
	    var result = [];

	    groupsData.keys.map(function (key) {
	        result.push.apply(result, renderGroup(props, groupsData.data[key]));
	    });

	    return result;
	}

	module.exports = function (props, groupData) {
	    return renderGroups(props, groupData);
	};

/***/ },
/* 139 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function preventDefault(event) {
	    event.preventDefault();
	};

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var assign = __webpack_require__(5);
	var getSelected = __webpack_require__(141);

	var hasOwn = function hasOwn(obj, prop) {
	    return Object.prototype.hasOwnProperty.call(obj, prop);
	};

	/**
	 * Here is how multi selection is implemented - trying to emulate behavior in OSX Finder
	 *
	 * When there is no selection, and an initial click for selection is done, keep that index (SELINDEX)
	 *
	 * Next, if we shift+click, we mark as selected the items from initial index to current click index.
	 *
	 * Now, if we ctrl+click elsewhere, keep the selection, but also add the selected file,
	 * and set SELINDEX to the new index. Now on any subsequent clicks, have the same behavior,
	 * selecting/deselecting items starting from SELINDEX to the new click index
	 */

	module.exports = {

	    findInitialSelectionIndex: function findInitialSelectionIndex() {
	        var selected = getSelected(this.p, this.state);
	        var index = undefined;

	        if (!Object.keys(selected).length) {
	            return index;
	        }

	        var i = 0;
	        var data = this.p.data;
	        var len = data.length;
	        var id;
	        var idProperty = this.props.idProperty;

	        for (; i < len; i++) {
	            id = data[i][idProperty];

	            if (selected[id]) {
	                index = i;
	            }
	        }

	        return index;
	    },

	    notifySelection: function notifySelection(selected, data) {
	        if (typeof this.props.onSelectionChange == 'function') {
	            this.props.onSelectionChange(selected, data);
	        }

	        if (!hasOwn(this.props, 'selected')) {
	            this.cleanCache();
	            this.setState({
	                defaultSelected: selected
	            });
	        }
	    },

	    handleSingleSelection: function handleSingleSelection(data, event) {
	        var props = this.p;

	        var rowSelected = this.isRowSelected(data);
	        var newSelected = !rowSelected;

	        var ctrlKey = event.metaKey || event.ctrlKey;
	        if (rowSelected && event && !ctrlKey) {
	            //if already selected and not ctrl, keep selected
	            newSelected = true;
	        }

	        var selectedId = newSelected ? data[props.idProperty] : null;

	        this.notifySelection(selectedId, data);
	    },

	    handleMultiSelection: function handleMultiSelection(data, event, config) {

	        var selIndex = config.selIndex;
	        var prevShiftKeyIndex = config.prevShiftKeyIndex;

	        var props = this.p;
	        var map = selIndex == null ? {} : assign({}, getSelected(props, this.state));

	        if (prevShiftKeyIndex != null && selIndex != null) {
	            var min = Math.min(prevShiftKeyIndex, selIndex);
	            var max = Math.max(prevShiftKeyIndex, selIndex);

	            var removeArray = props.data.slice(min, max + 1) || [];

	            removeArray.forEach(function (item) {
	                if (item) {
	                    var id = item[props.idProperty];
	                    delete map[id];
	                }
	            });
	        }

	        data.forEach(function (item) {
	            if (item) {
	                var id = item[props.idProperty];
	                map[id] = item;
	            }
	        });

	        this.notifySelection(map, data);
	    },

	    handleMultiSelectionRowToggle: function handleMultiSelectionRowToggle(data, event) {

	        var selected = getSelected(this.p, this.state);
	        var isSelected = this.isRowSelected(data);

	        var clone = assign({}, selected);
	        var id = data[this.p.idProperty];

	        if (isSelected) {
	            delete clone[id];
	        } else {
	            clone[id] = data;
	        }

	        this.notifySelection(clone, data);

	        return isSelected;
	    },

	    handleSelection: function handleSelection(rowProps, event) {

	        var props = this.p;

	        if (!hasOwn(props, 'selected') && !hasOwn(props, 'defaultSelected')) {
	            return;
	        }

	        var isSelected = this.isRowSelected(rowProps.data);
	        var multiSelect = this.isMultiSelect();

	        if (!multiSelect) {
	            this.handleSingleSelection(rowProps.data, event);
	            return;
	        }

	        if (this.selIndex === undefined) {
	            this.selIndex = this.findInitialSelectionIndex();
	        }

	        var selIndex = this.selIndex;

	        //multi selection
	        var index = rowProps.index;
	        var prevShiftKeyIndex = this.shiftKeyIndex;
	        var start;
	        var end;
	        var data;

	        if (event.metaKey || event.ctrlKey) {
	            this.selIndex = index;
	            this.shiftKeyIndex = null;

	            var unselect = this.handleMultiSelectionRowToggle(props.data[index], event);

	            if (unselect) {
	                this.selIndex++;
	                this.shiftKeyIndex = prevShiftKeyIndex;
	            }

	            return;
	        }

	        if (!event.shiftKey) {
	            //set selIndex, for future use
	            this.selIndex = index;
	            this.shiftKeyIndex = null;

	            //should not select many, so make selIndex null
	            selIndex = null;
	        } else {
	            this.shiftKeyIndex = index;
	        }

	        if (selIndex == null) {
	            data = [props.data[index]];
	        } else {
	            start = Math.min(index, selIndex);
	            end = Math.max(index, selIndex) + 1;
	            data = props.data.slice(start, end);
	        }

	        this.handleMultiSelection(data, event, {
	            selIndex: selIndex,
	            prevShiftKeyIndex: prevShiftKeyIndex
	        });
	    },

	    isRowSelected: function isRowSelected(data) {
	        var selectedMap = this.getSelectedMap();
	        var id = data[this.props.idProperty];

	        return selectedMap[id];
	    },

	    isMultiSelect: function isMultiSelect() {
	        var selected = getSelected(this.p, this.state);

	        return selected && (typeof selected === 'undefined' ? 'undefined' : _typeof(selected)) == 'object';
	    },

	    getSelectedMap: function getSelectedMap() {
	        var selected = getSelected(this.p, this.state);
	        var multiSelect = selected && (typeof selected === 'undefined' ? 'undefined' : _typeof(selected)) == 'object';
	        var map;

	        if (multiSelect) {
	            map = selected;
	        } else {
	            map = {};
	            map[selected] = true;
	        }

	        return map;
	    }
	};

/***/ },
/* 141 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (props, state) {
	                    var selected = props.selected == null ? state.defaultSelected : props.selected;

	                    return selected;
	};

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var assign = __webpack_require__(5);
	var ReactMenu = __webpack_require__(92);
	var findDOMNode = __webpack_require__(1).findDOMNode;

	function stopPropagation(event) {
	    event.stopPropagation();
	}

	function emptyFn() {}

	var FILTER_FIELDS = {};

	module.exports = {

	    getColumnFilterFieldFactory: function getColumnFilterFieldFactory(column) {

	        var type = column.type || 'string';

	        return FILTER_FIELDS[type] || React.DOM.input;
	    },

	    getFilterField: function getFilterField(props) {
	        var column = props.column;
	        var filterValue = this.filterValues ? this.filterValues[column.name] : '';

	        var fieldProps = {
	            autoFocus: true,
	            defaultValue: filterValue,
	            column: column,
	            onChange: this.onFilterChange.bind(this, column),
	            onKeyUp: this.onFilterKeyUp.bind(this, column)
	        };

	        var fieldFactory = column.renderFilterField || this.props.renderFilterField;
	        var field;

	        if (fieldFactory) {
	            field = fieldFactory(fieldProps);
	        }

	        if (field === undefined) {
	            field = this.getColumnFilterFieldFactory(column)(fieldProps);
	        }

	        return field;
	    },

	    onFilterKeyUp: function onFilterKeyUp(column, event) {
	        if (event.key == 'Enter') {
	            this.onFilterClick(column, event);
	        }
	    },

	    onFilterChange: function onFilterChange(column, eventOrValue) {

	        var value = eventOrValue;

	        if (eventOrValue && eventOrValue.target) {
	            value = eventOrValue.target.value;
	        }

	        this.filterValues = this.filterValues || {};
	        this.filterValues[column.name] = value;

	        if (this.props.liveFilter) {
	            this.filterBy(column, value);
	        }
	    },

	    filterBy: function filterBy(column, value, event) {
	        ;(this.props.onFilter || emptyFn)(column, value, this.filterValues, event);
	    },

	    onFilterClick: function onFilterClick(column, event) {
	        this.showMenu(null);

	        var value = this.filterValues ? this.filterValues[column.name] : '';

	        this.filterBy(column, value, event);
	    },

	    onFilterClear: function onFilterClear(column) {
	        this.showMenu(null);

	        if (this.filterValues) {
	            this.filterValues[column.name] = '';
	        }

	        this.filterBy(column, '');(this.props.onClearFilter || emptyFn).apply(null, arguments);
	    },

	    getFilterButtons: function getFilterButtons(props) {

	        var column = props.column;
	        var factory = column.renderFilterButtons || this.props.renderFilterButtons;

	        var result;

	        if (factory) {
	            result = factory(props);
	        }

	        if (result !== undefined) {
	            return result;
	        }

	        var doFilter = this.onFilterClick.bind(this, column);
	        var doClear = this.onFilterClear.bind(this, column);

	        return React.createElement(
	            'div',
	            { style: { textAlign: 'center' } },
	            React.createElement(
	                'button',
	                { onClick: doFilter },
	                'Filter'
	            ),
	            React.createElement(
	                'button',
	                { onClick: doClear, style: { marginLeft: 5 } },
	                'Clear'
	            )
	        );
	    },

	    filterMenuFactory: function filterMenuFactory(props) {

	        var overStyle = {
	            background: 'white',
	            color: 'auto'
	        };

	        var column = props.column;
	        var field = this.getFilterField(props);
	        var buttons = this.getFilterButtons({
	            column: column
	        });

	        var children = [field, buttons].map(function (x, index) {
	            return React.createElement(
	                ReactMenu.Item,
	                { key: index },
	                React.createElement(
	                    ReactMenu.Item.Cell,
	                    null,
	                    x
	                )
	            );
	        });

	        props.itemOverStyle = props.itemOverStyle || overStyle;
	        props.itemActiveStyle = props.itemActiveStyle || overStyle;
	        props.onClick = props.onClick || stopPropagation;

	        var factory = this.props.filterMenuFactory;
	        var result;

	        if (factory) {
	            result = factory(props);

	            if (result !== undefined) {
	                return result;
	            }
	        }

	        props.onMount = this.onFilterMenuMount;

	        return React.createElement(
	            ReactMenu,
	            props,
	            children
	        );
	    },

	    onFilterMenuMount: function onFilterMenuMount(menu) {
	        var dom = findDOMNode(menu);

	        if (dom) {
	            var input = dom.querySelector('input');

	            if (input) {
	                setTimeout(function () {
	                    input.focus();
	                }, 10);
	            }
	        }
	    }
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	if (!global.fetch && global.window) {
	    __webpack_require__(144);
	}

	var fetch = global.fetch;

	module.exports = function () {
	    return {
	        fetch: fetch,
	        defaultPageSize: 20,
	        defaultPage: 1,

	        appendDataSourceQueryParams: true,
	        pagination: null,
	        // virtualPagination: false,

	        loading: null,
	        showLoadMask: true,
	        columnMinWidth: 50,
	        cellPadding: '0px 5px',
	        headerPadding: '10px 5px',
	        filterIconColor: '#6EB8F1',
	        menuIconColor: '#6EB8F1',
	        scrollbarSize: 20,

	        scrollBy: undefined,
	        virtualRendering: true,

	        styleAlternateRowsCls: 'z-style-alternate',
	        withColumnMenuCls: 'z-with-column-menu',
	        cellEllipsisCls: 'z-cell-ellipsis',
	        defaultClassName: 'react-datagrid',

	        withColumnMenu: true,
	        sortable: true,

	        filterable: null,
	        resizableColumns: null,
	        reorderColumns: null,

	        emptyCls: 'z-empty',
	        emptyTextStyle: null,
	        emptyWrapperStyle: null,

	        loadMaskOverHeader: true,

	        showCellBordersCls: 'z-cell-borders',
	        showCellBorders: false,
	        styleAlternateRows: true,
	        cellEllipsis: true,
	        rowHeight: 31,

	        groupNestingWidth: 20,

	        defaultStyle: {
	            position: 'relative'
	        }
	    };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 144 */
/***/ function(module, exports) {

	(function() {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();


/***/ }
/******/ ])
});
;