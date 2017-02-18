'use strict';

var React = require('react');
var renderMenu = require('./renderMenu');
var renderRow = require('./renderRow');
var slice = require('./slice');
var LoadMask = require('react-load-mask');

function getData(props) {
    return props.data;
}

module.exports = function (props, rows) {
    rows = rows || getData(props).map(function (data, index) {
        return renderRow.call(this, props, data, index);
    }, this);

    return {
        className: 'z-table',
        children: rows
    };
};