import Matter from "matter-js";

export const PhysicsSystem = (entities, { time, dispatch }) => {
    const engine = entities.physics.engine;
    const ball = entities.ball.body;
    const spawnPoint = entities.ball.spawnPoint || { x: 200, y: 50 };

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

        if (entity.isHole) {
            const collision =
                Matter.Query.point([entity.body], ball.position).length > 0;
            if (collision) {
                Matter.Body.setPosition(ball, spawnPoint);
                Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                Matter.Body.setAngularVelocity(ball, 0);
            }
        }

        if (entity.isGoal) {
            const collision =
                Matter.Query.point([entity.body], ball.position).length > 0;
            if (collision) {
                dispatch({ type: "goalReached" });
            }
        }
    });

    Matter.Engine.update(engine, Math.min(time.delta, 16.666));
    return entities;
};
