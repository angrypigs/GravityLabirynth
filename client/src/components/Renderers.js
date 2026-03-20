import React from "react";
import Svg, {
    Polygon,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    Circle,
} from "react-native-svg";

export const BallRenderer = (props) => {
    const { position, circleRadius } = props.body;
    return (
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
            <Defs>
                <RadialGradient
                    id="ballGrad"
                    cx="35%"
                    cy="35%"
                    rx="50%"
                    ry="50%"
                    fx="35%"
                    fy="35%"
                >
                    <Stop offset="0%" stopColor="#ff9999" />
                    <Stop offset="40%" stopColor="#ff0000" />
                    <Stop offset="100%" stopColor="#660000" />
                </RadialGradient>
            </Defs>
            <Circle
                cx={position.x}
                cy={position.y}
                r={circleRadius}
                fill="url(#ballGrad)"
            />
        </Svg>
    );
};

export const PolygonRenderer = (props) => {
    const { body, grad, colors } = props;
    const gradId = `grad_${body.id}`;
    const points = body.vertices.map((v) => `${v.x},${v.y}`).join(" ");

    const x1 = grad?.x1 || "0";
    const y1 = grad?.y1 || "0";
    const x2 = grad?.x2 || "0";
    const y2 = grad?.y2 || "1";

    const startColor = colors?.start || "#555";
    const endColor = colors?.end || "#000";

    return (
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
            <Defs>
                <LinearGradient id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}>
                    <Stop offset="0%" stopColor={startColor} />
                    <Stop offset="100%" stopColor={endColor} />
                </LinearGradient>
            </Defs>
            <Polygon points={points} fill={`url(#${gradId})`} />
        </Svg>
    );
};
