'use strict';

var React  = require('react')
var assign = require('object-assign')
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

module.exports = createReactClass({

    displayName: 'ReactDataGrid.ResizeProxy',

    propTypes: {
        active: PropTypes.bool
    },

    getInitialState: function(){
        return {
            offset: 0
        }
    },

    render: function(){

        var props = assign({}, this.props)
        var state = this.state

        var style  = {}
        var active = props.active

        if (active){
            style.display = 'block'
            style.left    = state.offset
        }

        return <div className='z-resize-proxy' style={style} />
    }
})