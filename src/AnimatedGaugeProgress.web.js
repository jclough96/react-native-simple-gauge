import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import './innerCss.css';

export default class AnimatedGaugeProgress extends React.Component {
	state = {};

	componentDidMount() {
		let styleSheet = document.styleSheets[0];

		let animationName = `animation${Math.round(Math.random() * 100)}`;

		let keyframes = `@-webkit-keyframes ${animationName} {
            from {
                stroke-dashoffset: -${(this.props.fill * 180) / 100};
            }
            to {
                stroke-dashoffset: 0;
            }
        }`;

		styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

		this.setState({
			animationName: animationName
		});
	}

	polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
		var angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180;

		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	};

	describeArc = (x, y, radius, startAngle, endAngle) => {
		var start = this.polarToCartesian(x, y, radius, endAngle);
		var end = this.polarToCartesian(x, y, radius, startAngle);

		var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

		var d = [
			'M',
			start.x,
			start.y,
			'A',
			radius,
			radius,
			0,
			largeArcFlag,
			0,
			end.x,
			end.y
		].join(' ');

		console.log(d);
		return d;
	};

	backgroundArc = (x, y, radius, startAngle, endAngle) => {
		const d = this.describeArc(x, y, radius, startAngle, endAngle);
		console.log(d);
		return d;
	};

	foregroundArc = (x, y, radius, startAngle, endAngle) => {
		const d = this.describeArc(x, y, radius, startAngle, endAngle);
		return d;
	};

	render() {
		const namespacedSVG = `<animateMotion fill="freeze" dur="${
			this.props.speed
		}s" repeatCount="forwards" keyPoints="1;0" keyTimes="0;1" rotate="auto" calcMode="linear"><mpath xlink:href="#arc2"/></animateMotion>`;

		let style = {
			animationName: this.state.animationName,
			animationDuration: `${this.props.speed}s`,
			animationDelay: '0.0s',
			animationIterationCount: 1,
			animationDirection: 'normal',
			animationFillMode: 'forwards',
			strokeDasharray: 90,
			strokeDashoffset: -((this.props.fill * 180) / 100)
		};

		return (
			<svg
				width={this.props.size + this.props.offset + 5}
				height={this.props.size + this.props.offset + 5}
			>
				<path
					id="arc1"
					fill="none"
					stroke={this.props.backgroundColor}
					strokeWidth={this.props.width}
					strokeCap={this.props.strokeCap}
					d={this.backgroundArc(
						this.props.size / 2,
						this.props.size / 2,
						this.props.size / 2 - this.props.width / 2,
						0,
						180
					)}
				/>
				<path
					style={style}
					id="arc2"
					fill="none"
					stroke={this.props.tintColor}
					strokeCap={this.props.strokeCap}
					strokeMiterlimit={10}
					strokeWidth={this.props.width}
					d={this.foregroundArc(
						this.props.size / 2,
						this.props.size / 2,
						this.props.size / 2 - this.props.width / 2,
						0,
						(180 * this.props.fill) / 100
					)}
				/>
				<circle
					width={10}
					height={10}
					r={this.props.capWidth / 2}
					stroke={this.props.capColor}
					strokeWidth={this.props.capWidth}
					dangerouslySetInnerHTML={{ __html: namespacedSVG }}
				/>
			</svg>
		);
	}
}

AnimatedGaugeProgress.propTypes = {
	style: ViewPropTypes.style,
	size: PropTypes.number.isRequired,
	fill: PropTypes.number,
	prefill: PropTypes.number,
	width: PropTypes.number.isRequired,
	tintColor: PropTypes.string,
	backgroundColor: PropTypes.string,
	stroke: PropTypes.arrayOf(PropTypes.number),
	strokeCap: PropTypes.string,
	backgroundColor: PropTypes.string,
	rotation: PropTypes.number,
	offset: PropTypes.number,
	cropDegree: PropTypes.number,
	speed: PropTypes.number,
	capColor: PropTypes.string,
	capWidth: PropTypes.number,
	circleRadian: PropTypes.number,
	onAnimationComplete: PropTypes.func,
	onLinearAnimationComplete: PropTypes.func
};

AnimatedGaugeProgress.defaultProps = {
	tintColor: 'black',
	backgroundColor: '#e4e4e4',
	rotation: 90,
	cropDegree: 90,
	strokeCap: 'butt',
	capColor: 'black',
	capWidth: 0,
	circleRadian: 360,
	offset: 0,
	speed: 0.6
};
