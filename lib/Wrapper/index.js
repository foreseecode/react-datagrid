'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var assign = require('object-assign');

function emptyFn() {}

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        rowHeight: React.PropTypes.any,
        renderCount: React.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {};
    },

    render: function render() {
        var props = this.prepareProps(this.props);

        return props.empty ? React.createElement(
            'div',
            { className: 'z-empty-text', style: props.emptyTextStyle },
            props.emptyText
        ) : React.createElement('div', _extends({}, props.tableProps, { ref: 'table' }));
    },

    prepareProps: function prepareProps(thisProps) {
        var props = {};

        assign(props, thisProps);

        return props;
    }
});