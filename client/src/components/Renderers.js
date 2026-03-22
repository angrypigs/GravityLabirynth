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
    const { body, colors, offsets, grad } = props;
    const { position, circleRadius, id } = body;
    const gradId = `grad_${id}`;

    const cx = grad?.cx || "35%";
    const cy = grad?.cy || "35%";
    const rx = grad?.rx || "50%";
    const ry = grad?.ry || "50%";
    const fx = grad?.fx || "35%";
    const fy = grad?.fy || "35%";

    const cStart = colors?.start || "#ff9999";
    const cMid = colors?.mid || "#ff0000";
    const cEnd = colors?.end || "#660000";

    const oStart = offsets?.start || "0%";
    const oMid = offsets?.mid || "40%";
    const oEnd = offsets?.end || "100%";

    return (
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
            <Defs>
                <RadialGradient
                    id={gradId}
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    fx={fx}
                    fy={fy}
                >
                    <Stop offset={oStart} stopColor={cStart} />
                    <Stop offset={oMid} stopColor={cMid} />
                    <Stop offset={oEnd} stopColor={cEnd} />
                </RadialGradient>
            </Defs>
            <Circle
                cx={position.x}
                cy={position.y}
                r={circleRadius}
                fill={`url(#${gradId})`}
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
