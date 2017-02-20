'use strict';

var React    = require('react')
var assign   = require('object-assign')

function emptyFn(){}

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
    },

    getDefaultProps: function(){
        return {
        }
    },

    render: function() {
        var props     = this.prepareProps(this.props)
          
        return props.empty ? 
          <div className="z-empty-text" style={props.emptyTextStyle}>{props.emptyText}</div> :
          <div {...props.tableProps} ref="table"/>;
    },
    
    prepareProps: function(thisProps){
        var props = {}

        assign(props, thisProps)

        return props
    }
})
