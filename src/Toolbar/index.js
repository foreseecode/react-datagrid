'use strict';

var React     = require('react')
var createClass = require('create-react-class')
var normalize = require('react-style-normalizer')
var assign    = require('object-assign')
var clone = React.cloneElement
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

var Toolbar = createClass({

	displayName: DISPLAY_NAME,

	getInitialState: function(){
		return {}
	},

	render: function(){

		var state = this.state
		var props = this.prepareProps(this.props, state)

		return <div {...props} />
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
				<Toolbar.Region>
					{children}
				</Toolbar.Region>
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

Toolbar.Region = require('./ToolbarRegion')
Toolbar.themes = THEMES

Toolbar.defaultProps = {
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
};

module.exports = Toolbar
