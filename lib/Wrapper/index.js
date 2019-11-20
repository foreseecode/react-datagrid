'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var assign = require('object-assign');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

function emptyFn() {}

var Wrapper = createReactClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        scrollLeft: PropTypes.number,
        scrollTop: PropTypes.number,
        scrollbarSize: PropTypes.number,
        rowHeight: PropTypes.any,
        renderCount: PropTypes.number
    },

    onMount: function onMount(scroller) {
        ;(this.props.onMount || emptyFn)(this, scroller);
    },

    toTheTop: function toTheTop() {
        if (this.refs.scroller) {
            this.refs.scroller.toTheTop();
        }
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

        return content;
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

Wrapper.defaultProps = {
    scrollLeft: 0,
    scrollTop: 0
};
module.exports = Wrapper;