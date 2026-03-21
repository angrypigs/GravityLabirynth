import Matter from "matter-js";

export const EditorSystem = (entities, { touches }) => {
    const start = touches.find((t) => t.type === "start");
    const move = touches.find((t) => t.type === "move");
    const end = touches.find((t) => t.type === "end");

    const physics = entities.physics;
    const world = physics.world;
    const offsetY = physics.offsetY || 0;

    if (start) {
        const bodies = Matter.Composite.allBodies(world);
        const touchX = start.event.pageX;
        const touchY = start.event.pageY - offsetY;

        const editableBodies = bodies.filter((b) => !b.isBuiltin);
        let closestBody = null;
        let minDistance = 60;

        editableBodies.forEach((body) => {
            const dist = Matter.Vector.magnitude(
                Matter.Vector.sub(body.position, { x: touchX, y: touchY }),
            );
            if (dist < minDistance) {
                minDistance = dist;
                closestBody = body;
            }
        });

        if (closestBody) {
            physics.selected = closestBody;
        }
    }

    if (move && physics.selected) {
        const touchX = move.event.pageX;
        const touchY = move.event.pageY - offsetY;

        Matter.Body.setPosition(physics.selected, {
            x: touchX,
            y: touchY,
        });
        Matter.Body.setVelocity(physics.selected, { x: 0, y: 0 });
    }

    if (end && physics.selected) {
        physics.selected = null;
    }

    Matter.Engine.update(physics.engine, 16.667);

    return entities;
};
