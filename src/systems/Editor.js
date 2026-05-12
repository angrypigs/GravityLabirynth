import Matter from "matter-js";

export const EditorSystem = (entities, { touches, dispatch }) => {
    const engine = entities.physics.engine;

    const startTouch = touches.find((t) => t.type === "start");
    if (startTouch) {
        const touchPos = {
            x: startTouch.event.pageX,
            y: startTouch.event.pageY - entities.physics.offsetY,
        };

        const bodies = Object.keys(entities)
            .filter((key) => entities[key].body && !entities[key].isBuiltin)
            .map((key) => entities[key].body);

        const hit = Matter.Query.point(bodies, touchPos);

        if (hit.length > 0) {
            const activeBody = hit[0];
            entities.physics.activeId = activeBody.id;
            entities.physics.dragOffset = {
                x: activeBody.position.x - touchPos.x,
                y: activeBody.position.y - touchPos.y,
            };
            dispatch({ type: "select", id: activeBody.id });
        } else {
            entities.physics.activeId = null;
            dispatch({ type: "select", id: null });
        }
    }

    const moveTouch = touches.find((t) => t.type === "move");
    if (moveTouch && entities.physics.activeId) {
        const activeEntityKey = Object.keys(entities).find(
            (key) =>
                entities[key].body &&
                entities[key].body.id === entities.physics.activeId,
        );

        if (activeEntityKey) {
            const touchPos = {
                x: moveTouch.event.pageX,
                y: moveTouch.event.pageY - entities.physics.offsetY,
            };
            const newPos = {
                x: touchPos.x + entities.physics.dragOffset.x,
                y: touchPos.y + entities.physics.dragOffset.y,
            };

            Matter.Body.setPosition(entities[activeEntityKey].body, newPos);
        }
    }

    Matter.Engine.update(engine, 16.666);
    return entities;
};