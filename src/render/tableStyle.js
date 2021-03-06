'use strict';

var normalize = require('react-style-normalizer')

var colors = [
	'blue',
	'red',
	'magenta'
]
module.exports = function(props){
    var scrollTop  = props.virtualRendering?
                        -(props.topOffset || 0):
                        props.scrollTop

    return normalize({
				height: props.scrollerHeight,
				overflow: 'auto'
    })
}
