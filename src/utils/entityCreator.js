import Matter from "matter-js";
import { BallRenderer, PolygonRenderer } from "../components/Renderers";

export const createEntity = (world, obj) => {
    const isBuiltin = obj.isBuiltin || false;
    let body;
    let renderer;

    if (obj.type === "ball") {
        body = Matter.Bodies.circle(
            obj.position[0],
            obj.position[1],
            obj.radius,
            {
                restitution: 0.6,
                frictionAir: 0.02,
                friction: 0,
                frictionStatic: 0,
                label: obj.type,
                isBuiltin: isBuiltin,
            },
        );
        renderer = BallRenderer;
    } else if (obj.renderType === "polygon") {
        const vertices = obj.polygon.map((p) => ({ x: p[0], y: p[1] }));
        const sortedVertices = Matter.Vertices.clockwiseSort(vertices);
        const centreX =
            vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
        const centreY =
            vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;

        body = Matter.Bodies.fromVertices(centreX, centreY, [sortedVertices], {
            isStatic: true,
            isSensor: obj.type === "fan",
            label: obj.type,
            isBuiltin: isBuiltin,
            friction: 0,
            frictionStatic: 0,
        });
        renderer = PolygonRenderer;
    } else if (obj.renderType === "circle") {
        body = Matter.Bodies.circle(
            obj.position[0],
            obj.position[1],
            obj.radius,
            {
                isStatic: true,
                isSensor:
                    obj.type === "fan" ||
                    obj.type === "goal" ||
                    obj.type === "hole",
                label: obj.type,
                isBuiltin: isBuiltin,
            },
        );
        renderer = BallRenderer;
    }

    if (body) {
        Matter.World.add(world, [body]);
    }

    return {
        body: body,
        renderer: renderer,
        grad: obj.grad,
        colors: obj.colors,
        offsets: obj.offsets,
        type: obj.type,
        isFan: obj.type === "fan",
        isGoal: obj.type === "goal",
        isHole: obj.type === "hole",
        spawnPoint:
            obj.type === "ball"
                ? { x: obj.position[0], y: obj.position[1] }
                : undefined,
    };
};
