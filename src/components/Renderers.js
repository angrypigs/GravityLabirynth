import React from "react";
import { View } from "react-native";
import Svg, { Circle, Polygon, Defs, RadialGradient, LinearGradient, Stop } from "react-native-svg";

export const BallRenderer = (props) => {
    const { body, radius, colors, offsets, grad, zIndex } = props;

    if (!body) return null;

    const x = body.position.x - radius;
    const y = body.position.y - radius;

    return (
        <View
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: radius * 2,
                height: radius * 2,
                zIndex: zIndex || 10,
            }}
        >
            <Svg height="100%" width="100%">
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx={grad.cx}
                        cy={grad.cy}
                        rx={grad.rx}
                        ry={grad.ry}
                        fx={grad.fx}
                        fy={grad.fy}
                    >
                        <Stop offset={offsets.start} stopColor={colors.start} stopOpacity="1" />
                        {offsets.mid && <Stop offset={offsets.mid} stopColor={colors.mid} stopOpacity="1" />}
                        <Stop offset={offsets.end} stopColor={colors.end} stopOpacity="1" />
                    </RadialGradient>
                </Defs>
                <Circle cx={radius} cy={radius} r={radius} fill="url(#grad)" />
            </Svg>
        </View>
    );
};

export const PolygonRenderer = (props) => {
    const { body, verticesOffsets, polygon, position, colors, grad, zIndex } = props;

    if (!body) return null;

    let pointsArr = [];
    if (position && verticesOffsets) {
        pointsArr = verticesOffsets.map((p) => ({
            x: p[0] + position[0],
            y: p[1] + position[1],
        }));
    } else if (polygon) {
        pointsArr = polygon.map((p) => ({ x: p[0], y: p[1] }));
    }

    const xs = pointsArr.map((p) => p.x);
    const ys = pointsArr.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    let pointsString = "";
    if (position && verticesOffsets) {
        pointsString = verticesOffsets
            .map((p) => `${p[0] + width / 2},${p[1] + height / 2}`)
            .join(" ");
    } else if (polygon) {
        pointsString = polygon
            .map((p) => `${p[0] - minX},${p[1] - minY}`)
            .join(" ");
    }

    return (
        <View
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                zIndex: zIndex || 10,
            }}
        >
            <Svg height="100%" width="100%">
                <Defs>
                    <LinearGradient
                        id="polyGrad"
                        x1={grad.x1}
                        y1={grad.y1}
                        x2={grad.x2}
                        y2={grad.y2}
                    >
                        <Stop offset="0" stopColor={colors.start} stopOpacity="1" />
                        <Stop offset="1" stopColor={colors.end} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Polygon points={pointsString} fill="url(#polyGrad)" />
            </Svg>
        </View>
    );
};