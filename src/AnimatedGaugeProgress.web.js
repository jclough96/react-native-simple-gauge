import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, View } from 'react-native';

export default class AnimatedGaugeProgress extends React.Component {
	constructor(props) {
		super(props);
		this.animate = this.animate.bind(this);
		requestAnimationFrame(this.animate);

		this.state = {
			arcAnimationProgress: 0
		};
	}

	// componentDidMount() {
	// 	this.update();
	// }

	// update = () => {
	// 	const endpoint = 90;
	// 	if (endpoint <= this.state.arcAnimationProgress) {
	// 		return;
	// 	}
	// 	const incr = 1;

	// 	this.setState({
	// 		arcAnimationProgress:
	// 			(this.state.arcAnimationProgress + incr) % endpoint
	// 	});

	// 	window.requestAnimationFrame(this.update);
	// };
	
	componentDidUpdate(prevProps) {
	    if (prevProps.fill !== this.props.fill) {
	      this.setState({ arcAnimationProgress: 0 });
	      requestAnimationFrame(this.animate);
	    }
	  }

	animate(time) {
		// console.log(this.props.fill);
		const endpoint = this.props.fill;
		if (
			endpoint <= this.state.arcAnimationProgress ||
			this.state.arcAnimationProgress === 180 - this.props.capWidth * 1.5
		) {
			return;
		}
		const incr = 1;

		this.setState({
			arcAnimationProgress: Math.min(
				this.state.arcAnimationProgress + incr,
				endpoint
			)
		});

		requestAnimationFrame(this.animate);
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

		// console.log(d);
		return { d, x: start.x, y: start.y };
	};

	backgroundArc = () => {
		const d = this.describeArc(
			this.props.size / 2,
			this.props.size / 2,
			this.props.size / 2 - this.props.capWidth,
			0,
			180
		);
		// console.log(d);
		return d.d;
	};

	foregroundArc = () => {
		const d = this.describeArc(
			this.props.size / 2 + 2,
			this.props.size / 2,
			this.props.size / 2 - this.props.capWidth,
			0,
			this.state.arcAnimationProgress
		);
		return d.d;
	};

	capX = () => {
		const d = this.describeArc(
			this.props.size / 2 + 2,
			this.props.size / 2,
			this.props.size / 2 - this.props.capWidth,
			0,
			this.state.arcAnimationProgress
		);
		return d.x;
	};

	capY = () => {
		const d = this.describeArc(
			this.props.size / 2 + 2,
			this.props.size / 2,
			this.props.size / 2 - this.props.capWidth,
			0,
			this.state.arcAnimationProgress < this.props.capWidth
				? this.state.arcAnimationProgress + this.props.capWidth * 1.5
				: this.state.arcAnimationProgress
		);
		return d.y;
	};

	render() {
		// console.log(this.state.arcAnimationProgress);
		const namespacedSVG = `<animateMotion fill="freeze" dur="${
			this.props.speed
		}s" repeatCount="forwards" keyPoints="1;0" keyTimes="0;1" rotate="auto" calcMode="linear"><mpath xlink:href="#arc2"/></animateMotion>`;
		return (
			<View style={this.props.style}>
				<svg
				// width={}
				// height={}
				>
					<path
						id="arc1"
						fill="none"
						stroke={this.props.backgroundColor}
						strokeWidth={this.props.width}
						strokeCap={this.props.strokeCap}
						d={this.backgroundArc()}
					/>
					<path
						className="path"
						id="arc2"
						fill="none"
						stroke={this.props.tintColor}
						strokeCap={this.props.strokeCap}
						strokeMiterlimit={10}
						strokeWidth={this.props.width}
						d={this.foregroundArc()}
					/>
					<circle
						r={this.props.capWidth / 2}
						stroke={this.props.capColor}
						strokeWidth={this.props.capWidth}
						// dangerouslySetInnerHTML={{ __html: namespacedSVG }}
						cx={this.capX()}
						cy={this.capY()}
					/>
				</svg>
			</View>
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
