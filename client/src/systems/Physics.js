import Matter from "matter-js";

export const PhysicsSystem = (entities, { time }) => {
    const engine = entities.physics.engine;
    const ball = entities.ball.body;

    Object.values(entities).forEach((entity) => {
        if (entity.isFan) {
            const collision =
                Matter.Query.point([entity.body], ball.position).length > 0;
            if (collision) {
                Matter.Body.applyForce(
                    ball,
                    ball.position,
                    entity.force || { x: 0.001, y: 0.001 },
                );
            }
        }
    });

    Matter.Engine.update(engine, Math.min(time.delta, 16.667));
    return entities;
};
