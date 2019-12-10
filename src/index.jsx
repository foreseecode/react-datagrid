'use strict';

require('es6-promise').polyfill()


import { findDOMNode } from 'react-dom'
import React from 'react'
import _ from 'lodash'
var DOM = require('react-dom-factories')

var createClass = require('create-react-class')
var assign   = require('object-assign')
import LoadMask from 'react-load-mask'
var Region   = require('region')

var PaginationToolbar = React.createFactory(require('./PaginationToolbar'))
var Column = require('./models/Column')

var PropTypes      = require('prop-types')
var RowPropTypes      = require('./PropTypes')
var Wrapper        = require('./Wrapper')
var Header         = require('./Header')
var WrapperFactory = React.createFactory(Wrapper)
var HeaderFactory  = React.createFactory(Header)
var ResizeProxy = require('./ResizeProxy')

var findIndexByName = require('./utils/findIndexByName')
var group           = require('./utils/group')

var slice          = require('./render/slice')
var getTableProps    = require('./render/getTableProps')
var getGroupedRows = require('./render/getGroupedRows')
var renderMenu     = require('./render/renderMenu')

var preventDefault = require('./utils/preventDefault')

var isArray = Array.isArray

var SIZING_ID = '___SIZING___'

function clamp(value, min, max){
    return value < min?
        min:
        value > max?
            max:
            value
}

function signum(x){
    return x < 0? -1: 1
}

function emptyFn(){}

function getVisibleCount(props, state){
    return getVisibleColumns(props, state).length
}

function getVisibleColumns(props, state){

    var visibility     = state.visibility
    var visibleColumns = props.columns.filter(function(c){
        var name = c.name
        var visible = c.visible

        if (name in visibility){
            visible = !!visibility[name]
        }

        return visible
    })

    return visibleColumns
}

function findColumn(columns, column){

    var name = typeof column === 'string'? column: column.name
    var index = findIndexByName(columns, name)

    if (~index){
        return columns[index]
    }
}

const ReactDataGrid = createClass({

    displayName: 'ReactDataGrid',

    mixins: [
        require('./RowSelect'),
        require('./ColumnFilter')
    ],

    propTypes: {
        loading          : PropTypes.bool,
        virtualRendering : PropTypes.bool,

        //specify false if you don't want any column to be resizable
        resizableColumns : PropTypes.bool,
        filterable: PropTypes.bool,

        //specify false if you don't want column menus to be displayed
        withColumnMenu   : PropTypes.bool,
        cellEllipsis     : PropTypes.bool,
        sortable         : PropTypes.bool,
        loadMaskOverHeader : PropTypes.bool,
        idProperty       : PropTypes.string.isRequired,

        //you can customize the column menu by specifying a factory
        columnMenuFactory: PropTypes.func,
        onDataSourceResponse: PropTypes.func,
        onDataSourceSuccess: PropTypes.func,
        onDataSourceError: PropTypes.func,

        /**
         * @cfg {Number/String} columnMinWidth=50
         */
        columnMinWidth   : RowPropTypes.numeric,
        scrollBy         : RowPropTypes.numeric,
        rowHeight        : RowPropTypes.numeric,
        sortInfo         : RowPropTypes.sortInfo,
        columns          : RowPropTypes.column,

        data: function(props, name){
            var value = props[name]
            if (isArray(value)){
                return new Error('We are deprecating the "data" array prop. Use "dataSource" instead! It can either be an array (for local data) or a remote data source (string url, promise or function)')
            }
        }
    },

    componentDidMount: function(){
        window.addEventListener('click', this.windowClickListener = this.onWindowClick)
        this.hasVerticalScrollbar();
        // this.checkRowHeight(this.props)
    },

    componentDidUpdate: function() {
        this.hasVerticalScrollbar();
      },

    componentWillUnmount: function(){
        this.scroller = null
        window.removeEventListener('click', this.windowClickListener)
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

    onWindowClick: function(event){
        if (this.state.menu){
            this.setState({
                menuColumn: null,
                menu      : null
            })
        }
    },

    getInitialState: function(){
        this.scrollLeft = 0;

        var props = this.props
        var defaultSelected = props.defaultSelected

        return {
            startIndex: 0,
            menuColumn: null,
            defaultSelected: defaultSelected,
            visibility: {},
            defaultPageSize: props.defaultPageSize,
            defaultPage : props.defaultPage
        }
    },

    hasVerticalScrollbar: function() {
        if(this.refs.wrapper && this.refs.wrapper.refs.table) {
            const tableElement = this.refs.wrapper.refs.table;
            const hasVerticalScrollbar = tableElement.scrollHeight > tableElement.clientHeight;
            
            const header = this.refs.header; 
            const zHeader = header && header.refs.zHeader;
            
            
            if(zHeader && hasVerticalScrollbar) {
            zHeader.classList.add("z-has-vertical-scroller");
            } else if(zHeader) {
            zHeader.classList.remove("z-has-vertical-scroller");
            }
        }
    },

    toTheTop: function() {
        if(this.refs.wrapper) {
            this.refs.wrapper.toTheTop();
        }
    },
      
    updateStartIndex: function() {
        this.handleScrollTop()
    },

    handleScrollLeft: function(scrollLeft){
        this.scrollLeft = scrollLeft;
    
        if(this.refs.header && this.refs.header.refs.zHeader) {
            this.refs.header.scrollLeft(scrollLeft);
        }
        
        // this.setState({
        //     menuColumn: null
        // })
    },

    getRenderEndIndex: function(props, state){
        var startIndex = state.startIndex
        var rowCount   = props.rowCountBuffer
        var length     = props.data.length

        if (state.groupData){
            length += state.groupData.groupsCount
        }

        if (!rowCount){
            var maxHeight
            if (props.style && typeof props.style.height === 'number'){
                maxHeight = props.style.height
            } else {
                maxHeight = window.screen.height
            }
            rowCount = Math.floor(maxHeight / props.rowHeight)
        }

        var endIndex = startIndex + rowCount

        if (endIndex > length - 1){
            endIndex = length
        }

        return length;
    },

    onDropColumn: function(index, dropIndex){
        ;(this.props.onColumnOrderChange || emptyFn)(index, dropIndex)
    },

    toggleColumn: function(props, column){

        var visible = column.visible
        var visibility = this.state.visibility

        if (column.name in visibility){
            visible = visibility[column.name]
        }

        column = findColumn(this.props.columns, column)

        if (visible && getVisibleCount(props, this.state) === 1){
            return
        }

        var onHide  = this.props.onColumnHide || emptyFn
        var onShow  = this.props.onColumnShow || emptyFn

        visible?
            onHide(column):
            onShow(column)

        var onChange = this.props.onColumnVisibilityChange || emptyFn

        onChange(column, !visible)

        if (column.visible == null && column.hidden == null){
            var visibility = this.state.visibility

            visibility[column.name] = !visible

            this.cleanCache()
            this.setState({})
        }
    },

    cleanCache: function() {
        //so grouped rows are re-rendered
        delete this.groupedRows

        //clear row cache
        this.rowCache = {}
    },

    showMenu: function(menu, state){

        state = state || {}
        state.menu = menu

        if (this.state.menu){
            this.setState({
                menu: null,
                menuColumn: null
            })
        }

        setTimeout(function(){
            //since menu is hidden on click on window,
            //show it in a timeout, after the click event has reached the window
            this.setState(state)
        }.bind(this), 0)
    },

    prepareHeader: function(props, state){

        var allColumns = props.columns
        var columns    = getVisibleColumns(props, state)

        return (props.headerFactory || HeaderFactory)({
            ref             : 'header',
            scrollLeft       : state.scrollLeft,
            resizing         : state.resizing,
            columns          : columns,
            allColumns       : allColumns,
            columnVisibility : state.visibility,
            cellPadding      : props.headerPadding || props.cellPadding,
            filterIconColor  : props.filterIconColor,
            menuIconColor    : props.menuIconColor,
            menuIcon    : props.menuIcon,
            sortIcons     : props.sortIcons,
            filterIcon    : props.filterIcon,
            scrollbarSize    : props.scrollbarSize,
            sortInfo         : props.sortInfo,
            resizableColumns : props.resizableColumns,
            reorderColumns   : props.reorderColumns,
            filterable: props.filterable,
            withColumnMenu   : props.withColumnMenu,
            sortable         : props.sortable,

            onDropColumn     : this.onDropColumn,
            onSortChange     : props.onSortChange,
            onMenuClick      : props.onMenuClick,
            onColumnResizeDragStart: this.onColumnResizeDragStart,
            onColumnResizeDrag: this.onColumnResizeDrag,
            onColumnResizeDrop: this.onColumnResizeDrop,

            toggleColumn     : this.toggleColumn.bind(this, props),
            showMenu         : this.showMenu,
            filterMenuFactory : this.filterMenuFactory,
            menuColumn       : state.menuColumn,
            columnMenuFactory: props.columnMenuFactory

        })
    },

    prepareFooter: function(props, state){
        return (props.footerFactory || DOM.div)({
            className: 'z-footer-wrapper'
        })
    },

    prepareRenderProps: function(props){

        var result = {}
        var list = {
            className: true,
            style: true
        }

        Object.keys(props).forEach(function(name){
            // if (list[name] || name.indexOf('data-') == 0 || name.indexOf('on') === 0){
            if (list[name]){
                result[name] = props[name]
            }
        })

        return result
    },

    render: function(){

        var props = this.prepareProps(this.props, this.state)

        this.p = props

        this.data       = props.data
        this.dataSource = props.dataSource

        var fixedColumns = _.filter(props.columns, { fixed: true }) ;
        var nonFixedColumns = _.filter(props.columns, { fixed: false }) ;
        props.columns = fixedColumns.concat(nonFixedColumns);

        var header      = this.prepareHeader(props, this.state)
        var wrapper     = this.prepareWrapper(props, this.state)
        var footer      = this.prepareFooter(props, this.state)
        var resizeProxy = this.prepareResizeProxy(props, this.state)

        var renderProps = this.prepareRenderProps(props)

        var menuProps = {
            columns: props.columns,
            menu   : this.state.menu
        }

        var loadMask

        if (props.loadMaskOverHeader){
            loadMask = <LoadMask visible={`${props.loading}`} />
        }

        var paginationToolbar

        if (props.pagination){
            var page    = props.page
            var minPage = props.minPage
            var maxPage = props.maxPage

            var paginationToolbarFactory = props.paginationFactory || PaginationToolbar
            var paginationProps = assign({
                dataSourceCount : props.dataSourceCount,
                page            : page,
                pageSize        : props.pageSize,
                minPage         : minPage,
                maxPage         : maxPage,
                reload          : this.reload,
                onPageChange    : this.gotoPage,
                onPageSizeChange: this.setPageSize,
                border          : props.style.border
            }, props.paginationToolbarProps)

            paginationToolbar = paginationToolbarFactory(paginationProps)

            if (paginationToolbar === undefined){
                paginationToolbar = PaginationToolbar(paginationProps)
            }
        }

        var topToolbar
        var bottomToolbar

        if (paginationToolbar){
            if (paginationToolbar.props.position == 'top'){
                topToolbar = paginationToolbar
            } else {
                bottomToolbar = paginationToolbar
            }
        }

        if(renderProps.style.height) {
            const HEADER_HEIGHT = 40;
            renderProps.style.height += HEADER_HEIGHT;
        }

        var result = (
            <div {...renderProps}>
                {topToolbar}
                <div className="z-inner">
                    {header}
                    {wrapper}
                    {footer}
                    {resizeProxy}
                </div>

                {this.props.loadingNode && props.loading &&
                  <div className="react-load-mask react-load-mask--visible">
                    {this.props.loadingNode}
                  </div>
                }
                {!this.props.loadingNode && loadMask}
                
                {renderMenu(menuProps)}
                {bottomToolbar}
            </div>
        )

        return result
    },

    getTableProps: function(props, state){
        var table
        var rows

        if (props.groupBy){
            rows = this.groupedRows = this.groupedRows || getGroupedRows(props, state.groupData)
            rows = slice(rows, props)
        }

        table = getTableProps.call(this, props, rows)

        return table
    },

    handleVerticalScrollOverflow: function(sign, scrollTop) {

        var props = this.p
        var page  = props.page

        if (this.isValidPage(page + sign, props)){
            this.gotoPage(page + sign)
        }
    },

    fixHorizontalScrollbar: function() {
        var scroller = this.scroller

        if (scroller){
            scroller.fixHorizontalScrollbar()
        }
    },

    onWrapperMount: function(wrapper, scroller){
        this.scroller = scroller
    },

    prepareWrapper: function(props, state){
        var virtualRendering = props.virtualRendering

        var data       = props.data
        var startIndex = state.startIndex
        var endIndex   = virtualRendering?
                            this.getRenderEndIndex(props, state):
                            0

        var renderCount = virtualRendering?
                            endIndex + 1 - startIndex:
                            data.length

        var totalLength = state.groupData?
                            data.length + state.groupData.groupsCount:
                            data.length

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
            ref             : 'wrapper',
            onMount         : this.onWrapperMount,
            topOffset       : state.topOffset,
            startIndex      : startIndex,
            totalLength     : totalLength,
            renderCount     : renderCount,
            endIndex        : endIndex,

            allColumns      : props.columns,

            onScroll        : this.handleScroll,
            // onScrollOverflow: props.virtualPagination? this.handleVerticalScrollOverflow: null,

            menu            : state.menu,
            menuColumn      : state.menuColumn,
            showMenu        : this.showMenu,
            scrollerHeight  : props.style.height,

            // cellFactory     : props.cellFactory,
            // rowStyle        : props.rowStyle,
            // rowClassName    : props.rowClassName,
            // rowContextMenu  : props.rowContextMenu,

            // topLoader: topLoader,
            // bottomLoader: bottomLoader,
            // loadersSize: loadersSize,

            // onRowClick: this.handleRowClick,
            selected        : props.selected == null?
                state.defaultSelected:
                props.selected
        }, props)

        wrapperProps.columns    = getVisibleColumns(props, state)
        wrapperProps.tableProps = this.getTableProps(wrapperProps, state)

        return (props.WrapperFactory || WrapperFactory)(wrapperProps)

    },
   
    handleScroll() {
        if(this.scrollLeft !== this.refs.wrapper.refs.table.scrollLeft) {
          this.handleScrollLeft(this.refs.wrapper.refs.table.scrollLeft);
        }
    },

    handleRowClick: function(rowProps, event){
        if (this.props.onRowClick){
            this.props.onRowClick(rowProps.data, rowProps, event)
        }

        this.handleSelection(rowProps, event)
    },

    prepareProps: function(thisProps, state){
        var props = assign({}, thisProps)

        props.loading    = this.prepareLoading(props)
        props.data       = this.prepareData(props)
        props.dataSource = this.prepareDataSource(props)
        props.empty      = !props.data.length

        props.rowHeight = this.prepareRowHeight(props)
        props.virtualRendering = this.isVirtualRendering(props)

        props.filterable = this.prepareFilterable(props)
        props.resizableColumns = this.prepareResizableColumns(props)
        props.reorderColumns = this.prepareReorderColumns(props)

        this.prepareClassName(props)
        props.style = this.prepareStyle(props)

        this.preparePaging(props, state)
        this.prepareColumns(props, state)

        props.minRowWidth = props.totalColumnWidth + props.scrollbarSize

        return props
    },

    prepareLoading: function(props) {
        var showLoadMask = props.showLoadMask || !this.isMounted() //ismounted check for initial load
        return props.loading == null? showLoadMask && this.state.defaultLoading: props.loading
    },

    preparePaging: function(props, state) {
        props.pagination = this.preparePagination(props)

        if (props.pagination){
            props.pageSize = this.preparePageSize(props)
            props.dataSourceCount = this.prepareDataSourceCount(props)

            props.minPage = 1
            props.maxPage = Math.ceil((props.dataSourceCount || 1) / props.pageSize)
            props.page    = clamp(this.preparePage(props), props.minPage, props.maxPage)
        }
    },

    preparePagination: function(props) {
        return props.pagination === false?
                false:
                !!props.pageSize || !!props.paginationFactory || this.isRemoteDataSource(props)
    },

    prepareDataSourceCount: function(props) {
        return props.dataSourceCount == null? this.state.defaultDataSourceCount: props.dataSourceCount
    },

    preparePageSize: function(props) {
        return props.pageSize == null? this.state.defaultPageSize: props.pageSize
    },

    preparePage: function(props) {
        return props.page == null?
            this.state.defaultPage:
            props.page
    },
    /**
     * Returns true if in the current configuration,
     * the datagrid should load its data remotely.
     *
     * @param  {Object}  [props] Optional. If not given, this.props will be used
     * @return {Boolean}
     */
    isRemoteDataSource: function(props) {
        props = props || this.props

        return props.dataSource && !isArray(props.dataSource)
    },

    prepareDataSource: function(props) {
        var dataSource = props.dataSource

        if (isArray(dataSource)){
            dataSource = null
        }

        return dataSource
    },

    prepareData: function(props) {

        var data = null

        if (isArray(props.data)){
            data = props.data
        }

        if (isArray(props.dataSource)){
            data = props.dataSource
        }

        data = data == null? this.state.defaultData: data

        if (!isArray(data)){
            data = []
        }

        return data
    },

    prepareFilterable: function(props) {
        if (props.filterable === false){
            return false
        }

        return props.filterable || !!props.onFilter
    },

    prepareResizableColumns: function(props) {
        if (props.resizableColumns === false){
            return false
        }

        return props.resizableColumns || !!props.onColumnResize
    },

    prepareReorderColumns: function(props) {
        if (props.reorderColumns === false){
            return false
        }

        return props.reorderColumns || !!props.onColumnOrderChange
    },

    isVirtualRendering: function(props){
        props = props || this.props

        return props.virtualRendering || (props.rowHeight != null)
    },

    prepareRowHeight: function(){
        return this.props.rowHeight == null? this.state.rowHeight: this.props.rowHeight
    },

    groupData: function(props){
        if (props.groupBy){
            var data = this.prepareData(props)

            this.setState({
                groupData: group(data, props.groupBy)
            })

            delete this.groupedRows
        }
    },

    isValidPage: function(page, props) {
        return page >= 1 && page <= this.getMaxPage(props)
    },

    getMaxPage: function(props) {
        props = props || this.props

        var count    = this.prepareDataSourceCount(props) || 1
        var pageSize = this.preparePageSize(props)

        return Math.ceil(count / pageSize)
    },

    reload: function() {
        if (this.dataSource){
            return this.loadDataSource(this.dataSource, this.props)
        }
    },

    clampPage: function(page) {
        return clamp(page, 1, this.getMaxPage(this.props))
    },

    setPageSize: function(pageSize) {

        var stateful
        var newPage = this.preparePage(this.props)
        var newState = {}

        if (typeof this.props.onPageSizeChange == 'function'){
            this.props.onPageSizeChange(pageSize, this.p)
        }

        if (this.props.pageSize == null){
            stateful = true
            this.state.defaultPageSize = pageSize
            newState.defaultPageSize = pageSize
        }

        if (!this.isValidPage(newPage, this.props)){

            newPage = this.clampPage(newPage)

            if (typeof this.props.onPageChange == 'function'){
                this.props.onPageChange(newPage)
            }

            if (this.props.page == null){
                stateful = true
                this.state.defaultPage = newPage
                newState.defaultPage   = newPage
            }
        }

        if (stateful){
            this.reload()
            this.setState(newState)
        }
    },

    gotoPage: function(page) {
        if (typeof this.props.onPageChange == 'function'){
            this.props.onPageChange(page)
        } else {
            this.state.defaultPage = page
            var result = this.reload()
            this.setState({
                defaultPage: page
            })

            return result
        }
    },

    /**
     * Loads remote data
     *
     * @param  {String/Function/Promise} [dataSource]
     * @param  {Object} [props]
     */
    loadDataSource: function(dataSource, props) {
        props = props || this.props

        if (!arguments.length){
            dataSource = props.dataSource
        }

        var dataSourceQuery = {}

        if (props.sortInfo){
            dataSourceQuery.sortInfo = props.sortInfo
        }

        var pagination = this.preparePagination(props)
        var pageSize
        var page

        if (pagination){
            pageSize = this.preparePageSize(props)
            page     = this.preparePage(props)

            assign(dataSourceQuery, {
                pageSize: pageSize,
                page    : page,
                skip    : (page - 1) * pageSize
            })
        }

        if (typeof dataSource == 'function'){
            dataSource = dataSource(dataSourceQuery, props)
        }

        if (typeof dataSource == 'string'){
            var fetch = this.props.fetch || global.fetch

            var keys = Object.keys(dataSourceQuery)
            if (props.appendDataSourceQueryParams && keys.length){
                //dataSource was initially passed as a string
                //so we append quey params
                dataSource += '?' + keys.map(function(param){
                    return param + '=' + JSON.stringify(dataSourceQuery[param])
                }).join('&')
            }

            dataSource = fetch(dataSource)
        }

        if (dataSource && dataSource.then){

            if (props.onDataSourceResponse){
                dataSource.then(props.onDataSourceResponse, props.onDataSourceResponse)
            } else {
                this.setState({
                    defaultLoading: true
                })

                var errorFn = function(err){
                    if (props.onDataSourceError){
                        props.onDataSourceError(err)
                    }

                    this.setState({
                        defaultLoading: false
                    })
                }.bind(this)

                var noCatchFn = dataSource['catch']? null: errorFn

                dataSource = dataSource
                    .then(function(response){
                        return response && typeof response.json == 'function'?
                                    response.json():
                                    response
                    })
                    .then(function(json){

                        if (props.onDataSourceSuccess){
                            props.onDataSourceSuccess(json)
                            this.setState({
                                defaultLoading: false
                            })
                            return
                        }

                        var info
                        if (typeof props.getDataSourceInfo == 'function'){
                            info = props.getDataSourceInfo(json)
                        }

                        var data = info?
                            info.data:
                            Array.isArray(json)?
                                json:
                                json.data

                        var count = info?
                            info.count:
                            json.count != null?
                                json.count:
                                null


                        var newState = {
                            defaultData: data,
                            defaultLoading: false
                        }
                        if (props.groupBy){
                            newState.groupData = group(data, props.groupBy)
                            delete this.groupedRows
                        }

                        if (count != null){
                            newState.defaultDataSourceCount = count
                        }

                        this.setState(newState)
                    }.bind(this), noCatchFn)

                if (dataSource['catch']){
                    dataSource['catch'](errorFn)
                }
            }

            if (props.onDataSourceLoaded){
                dataSource.then(props.onDataSourceLoaded)
            }
        }

        return dataSource
    },

    componentDidMount: function(){
        this.rowCache = {}
        this.groupData(this.props)

        if (this.isRemoteDataSource(this.props)){
            this.loadDataSource(this.props.dataSource, this.props)
        }
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.groupBy !== prevProps.groupBy) {
            this.rowCache = {}
            this.groupData(nextProps)
        }

        if (this.isRemoteDataSource(this.props)){
            var otherPage     = this.props.page != prevProps.page
            var otherPageSize = this.props.pageSize != prevProps.pageSize

            if (nextProps.reload || otherPage || otherPageSize){
                this.loadDataSource(this.props.dataSource, this.props)
            }
        }
    },

    prepareStyle: function(props){
        var style = {}

        assign(style, props.defaultStyle, props.style)

        return style
    },

    prepareClassName: function(props){
        props.className = props.className || ''
        props.className += ' ' + props.defaultClassName

        if (props.cellEllipsis){
            props.className += ' ' + props.cellEllipsisCls
        }

        if (props.styleAlternateRows){
            props.className += ' ' + props.styleAlternateRowsCls
        }

        if (props.showCellBorders){
            var cellBordersCls = props.showCellBorders === true?
            props.showCellBordersCls + '-horizontal ' + props.showCellBordersCls + '-vertical':
            props.showCellBordersCls + '-' + props.showCellBorders

            props.className += ' ' + cellBordersCls

        }

        if (props.withColumnMenu){
            props.className += ' ' + props.withColumnMenuCls
        }

        if (props.empty){
            props.className += ' ' + props.emptyCls
        }
    },

    ///////////////////////////////////////
    ///
    /// Code dealing with preparing columns
    ///
    ///////////////////////////////////////
    prepareColumns: function(props, state){
        props.columns = props.columns.map(function(col, index){
            col = Column(col, props)
            col.index = index
            return col
        }, this)

        this.prepareColumnSizes(props, state)

        props.columns.forEach(this.prepareColumnStyle.bind(this, props))
    },

    prepareColumnStyle: function(props, column){
        var style = column.sizeStyle = {}

        column.style     = assign({}, column.style)
        column.textAlign = column.textAlign || column.style.textAlign

        var minWidth = column.minWidth || props.columnMinWidth

        style.minWidth = minWidth

        if (column.flexible){
            style.flex = column.flex || 1
        } else {
            style.width    = column.width
            style.minWidth = column.width
        }
    },

    prepareColumnSizes: function(props, state){

        var visibleColumns = getVisibleColumns(props, state)
        var totalWidth     = 0
        var flexCount      = 0

        visibleColumns.forEach(function(column){
            column.minWidth = column.minWidth || props.columnMinWidth

            if (!column.flexible){
                totalWidth += column.width
                return 0
            } else if (column.minWidth){
                totalWidth += column.minWidth
            }

            flexCount++
        }, this)

        props.columnFlexCount  = flexCount
        props.totalColumnWidth = totalWidth
    },

    prepareResizeProxy: function(props, state){
        return <ResizeProxy ref="resizeProxy" active={state.resizing}/>
    },

    onColumnResizeDragStart: function(config){

        var domNode = findDOMNode(this)
        var region  = Region.from(domNode)

        this.resizeProxyLeft = config.resizeProxyLeft - region.left

        this.setState({
            resizing: true,
            resizeOffset: this.resizeProxyLeft
        })

    },

    onColumnResizeDrag: function(config){
        this.refs.resizeProxy.setState({
            offset: this.resizeProxyLeft + config.resizeProxyDiff
        })
    },

    onColumnResizeDrop: function(config, resizeInfo){

        var horizScrollbar = this.refs.wrapper.refs.horizScrollbar

        if (horizScrollbar && this.scrollLeft){

            setTimeout(function(){
                //FF needs this, since it does not trigger scroll event when scrollbar dissapears
                //so we might end up with grid content not visible (to the left)

                var domNode = findDOMNode(horizScrollbar)
                if (domNode && !domNode.scrollLeft){
                    this.handleScrollLeft(0)
                }
            }.bind(this), 1)

        }

        var props   = this.props
        var columns = props.columns

        var onColumnResize = props.onColumnResize || emptyFn
        var first = resizeInfo[0]

        var firstCol  = findColumn(columns, first.name)
        var firstSize = first.size

        var second = resizeInfo[1]
        var secondCol = second? findColumn(columns, second.name): undefined
        var secondSize = second? second.size: undefined

        //if defaultWidth specified, update it
        if (firstCol.width == null && firstCol.defaultWidth){
            firstCol.defaultWidth = firstSize
        }

        if (secondCol && secondCol.width == null && secondCol.defaultWidth){
            secondCol.defaultWidth = secondSize
        }

        this.setState(config)

        onColumnResize(firstCol, firstSize, secondCol, secondSize)
    }
})

ReactDataGrid.defaultProps = require('./getDefaultProps');

module.exports = ReactDataGrid;