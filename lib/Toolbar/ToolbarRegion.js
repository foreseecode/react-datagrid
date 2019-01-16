'use strict';

var React = require('react');
var createClass = require('create-react-class');
var normalize = require('react-style-normalizer');
var assign = require('object-assign');

var cloneWithProps = React.cloneElement || require('react-clonewithprops');
var DISPLAY_NAME = 'ReactToolbarRegion';

var JUSTIFY_MAP = {
	start: 'flex-start',
	left: 'flex-start',

	end: 'flex-end',
	right: 'flex-end'
};

var TEXT_ALIGN = {
	start: 'left',
	left: 'left',

	right: 'right',
	end: 'right'
};

module.exports = createClass({

	displayName: DISPLAY_NAME,

	getDefaultProps: function getDefaultProps() {
		return {
			'data-display-name': DISPLAY_NAME,

			isToolbarRegion: true,

			flex: 1,
			flexShrink: null,
			flexBasis: null,

			defaultStyle: {
				boxSizing: 'border-box',

				alignItems: 'center',
				flexShrink: 1,
				flexBasis: 0,

				position: 'relative',
				display: 'inline-block',

				overflow: 'hidden',
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis'
			},

			defaultHorizontalStyle: {
				flexFlow: 'row'
			},

			defaultVerticalStyle: {
				flexFlow: 'column'
			}
		};
	},

	render: function render() {
		var props = this.prepareProps(this.props);

		return React.createElement('div', props);
	},

	prepareProps: function prepareProps(thisProps) {
		var props = assign({}, thisProps);

		props.vertical = props.orientation == 'vertical';
		props.style = this.prepareStyle(props);

		return props;
	},

	prepareStyle: function prepareStyle(props) {
		var alignStyle = {
			justifyContent: JUSTIFY_MAP[props.align] || 'center',
			textAlign: TEXT_ALIGN[props.align] || 'center'
		};

		var defaultOrientationStyle = props.defaultHorizontalStyle;
		var orientationStyle = props.horizontalStyle;

		if (props.vertical) {
			defaultOrientationStyle = props.defaultVerticalStyle;
			orientationStyle = props.verticalStyle;
		}

		var style = assign({}, props.defaultStyle, defaultOrientationStyle, props.style, orientationStyle, alignStyle);

		if (props.flex !== false && props.flex != null) {
			var flex;
			var flexShrink = 0;
			var flexBasis = 0;

			if (typeof props.flex == 'number') {
				flex = props.flex + ' ' + (props.flexShrink || style.flexShrink || flexShrink) + ' ' + (props.flexBasis || style.flexBasis || flexBasis);
			} else {
				flex = props.flex;
			}

			style.flex = flex;
		}

		return normalize(style);
	}
});