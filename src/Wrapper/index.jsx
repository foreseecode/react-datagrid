'use strict';

var React    = require('react')
var assign   = require('object-assign')
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

function emptyFn(){}

const Wrapper = createReactClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        scrollLeft   : PropTypes.number,
        scrollTop    : PropTypes.number,
        scrollbarSize: PropTypes.number,
        rowHeight   : PropTypes.any,
        renderCount : PropTypes.number
    },

    onMount: function(scroller){
        ;(this.props.onMount || emptyFn)(this, scroller)
    },
    
    toTheTop: function() {
      if(this.refs.scroller) {
        this.refs.scroller.toTheTop();
      }
    },

    render: function() {

        var props     = this.prepareProps(this.props)
        var rowsCount = props.renderCount

        var groupsCount = 0
        if (props.groupData){
            groupsCount = props.groupData.groupsCount
        }

        rowsCount += groupsCount

        // var loadersSize = props.loadersSize
        var verticalScrollerSize = (props.totalLength + groupsCount) * props.rowHeight// + loadersSize

        var content = props.empty?
            <div className="z-empty-text" style={props.emptyTextStyle}>{props.emptyText}</div>:
            <div {...props.tableProps} ref="table"/>


        return content
    },

    onVerticalScrollOverflow: function() {
    },

    onHorizontalScrollOverflow: function() {
    },

    onHorizontalScroll: function(scrollLeft) {
        this.props.onScrollLeft(scrollLeft)
    },

    onVerticalScroll: function(pos){
        this.props.onScrollTop(pos)
    },

    prepareProps: function(thisProps){
        var props = {}

        assign(props, thisProps)

        return props
    }
})

Wrapper.defaultProps = {
    scrollLeft: 0,
    scrollTop : 0
};
module.exports = Wrapper;
