import React from "react";
import PropTypes from "prop-types";
import { View, Platform, ViewPropTypes, AppState, ART } from "react-native";
const ActiveState = "active";

const { Surface, Shape, Path, Group } = ART;

export default class GaugeProgress extends React.Component {
    state = {
        show: true
    };

    componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        this.setState({ show: nextAppState === ActiveState });
    };

    circlePath(cx, cy, r, startDegree, endDegree) {
        let p = Path();
        p.path.push(0, cx + r, cy);
        p.path.push(
            4,
            cx,
            cy,
            r,
            (startDegree * Math.PI) / 180,
            (endDegree * Math.PI) / 180,
            1
        );
        return p;
    }

    extractFill(fill) {
        if (fill < 0.01) {
            return 0;
        } else if (fill > 100) {
            return 100;
        }

        return fill;
    }

    render() {
        const {
            size,
            width,
            tintColor,
            backgroundColor,
            style,
            stroke,
            strokeCap,
            capColor,
            capWidth,
            rotation,
            cropDegree,
            children,
            circleRadian,
            offset
        } = this.props;
        const backgroundPath = this.circlePath(
            size / 2,
            size / 2,
            size / 2 - width / 2,
            0,
            (360 * 99.9) / 100 - cropDegree
        );

        const borderWidth = capWidth > width ? capWidth : width;
        const radius = (size - borderWidth) / 2;
        const center = size / 2;

        const fill = this.extractFill(this.props.fill);
        const circlePath = this.circlePath(
            size / 2,
            size / 2,
            size / 2 - width / 2,
            0,
            (((360 * 99.9) / 100 - cropDegree) * fill) / 100
        );
        const { show } = this.state;

        const radian = (Math.PI * circleRadian * fill) / (50 * 360);
        const capX = radius * Math.cos(radian) + center - offset;
        const capY = radius * Math.sin(radian) + center;
        return (
            <View style={style}>
                {!!show && (
                    <Surface width={size + offset} height={size + offset}>
                        <Group
                            rotation={rotation + cropDegree / 2}
                            originX={size / 2}
                            originY={size / 2}
                        >
                            <Shape
                                d={backgroundPath}
                                strokeDash={stroke}
                                stroke={backgroundColor}
                                strokeWidth={width}
                                strokeCap={strokeCap}
                            />
                            <Shape
                                d={circlePath}
                                strokeDash={stroke}
                                stroke={tintColor}
                                strokeWidth={width}
                                strokeCap={strokeCap}
                            />
                            <Shape
                                d={this.circlePath(
                                    capX,
                                    capY,
                                    capWidth / 4,
                                    0,
                                    360
                                )}
                                stroke={capColor}
                                strokeWidth={capWidth / 2}
                            />
                        </Group>
                    </Surface>
                )}
                {typeof children === "function" ? children(fill) : children}
            </View>
        );
    }
}

GaugeProgress.propTypes = {
    style: ViewPropTypes.style,
    size: PropTypes.number.isRequired,
    fill: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    tintColor: PropTypes.string,
    stroke: PropTypes.arrayOf(PropTypes.number),
    strokeCap: PropTypes.string,
    backgroundColor: PropTypes.string,
    rotation: PropTypes.number,
    offset: PropTypes.number,
    cropDegree: PropTypes.number,
    capColor: PropTypes.string,
    capWidth: PropTypes.number,
    circleRadian: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
        PropTypes.array
    ])
};

GaugeProgress.defaultProps = {
    tintColor: "black",
    backgroundColor: "#e4e4e4",
    rotation: 90,
    cropDegree: 90,
    strokeCap: "butt",
    capColor: "black",
    capWidth: 0,
    circleRadian: 360,
    offset: 0
};
