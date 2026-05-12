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
        let vertices;

        if (obj.position && obj.verticesOffsets) {
            vertices = obj.verticesOffsets.map((p) => ({
                x: p[0] + obj.position[0],
                y: p[1] + obj.position[1],
            }));
        } else {
            vertices = obj.polygon.map((p) => ({ x: p[0], y: p[1] }));
        }

        const centreX =
            vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
        const centreY =
            vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;

        body = Matter.Bodies.fromVertices(centreX, centreY, [vertices], {
            isStatic: true,
            friction: 0,
            frictionStatic: 0,
            isSensor: obj.type === "wall_custom" || obj.type === "fan",
            label: obj.type,
            isBuiltin: isBuiltin,
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

    let zIndex = 10;
    if (obj.isBuiltin) zIndex = 40;
    else if (obj.type === "ball") zIndex = 30;
    else if (obj.type === "goal") zIndex = 20;

    return {
        body: body,
        renderer: renderer,
        zIndex: zIndex,
        isFan: obj.type === "fan",
        isGoal: obj.type === "goal",
        isHole: obj.type === "hole",
        spawnPoint:
            obj.type === "ball"
                ? { x: obj.position[0], y: obj.position[1] }
                : undefined,
        ...obj,
    };
};