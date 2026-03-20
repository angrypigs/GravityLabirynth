import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, useWindowDimensions, Pressable } from "react-native";
import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { BallRenderer, PolygonRenderer } from "../components/Renderers";
import { PhysicsSystem } from "../systems/Physics";
import { WALLS } from "../utils/wallData";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GameScreen() {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const [entities, setEntities] = useState(null);

    const engineRef = useRef(Matter.Engine.create({ enableSleeping: false }));

    const updateWallGradients = () => {
        setEntities((prevEntities) => {
            if (!prevEntities) return prevEntities;

            const updatedEntities = { ...prevEntities };
            const freshWallsData = WALLS(width, height);
            let wallCounter = 0;

            for (const key in updatedEntities) {
                if (
                    updatedEntities[key].type === "wall" &&
                    freshWallsData[wallCounter]
                ) {
                    updatedEntities[key].grad =
                        freshWallsData[wallCounter].grad;
                    updatedEntities[key].colors =
                        freshWallsData[wallCounter].colors;
                    wallCounter++;
                }
            }

            return updatedEntities;
        });
    };

    useEffect(() => {
        const engine = engineRef.current;
        const world = engine.world;

        Matter.World.clear(world);
        Matter.Engine.clear(engine);

        const ball = Matter.Bodies.circle(width / 2, 50, 20, {
            restitution: 0.6,
            frictionAir: 0.02,
        });
        Matter.World.add(world, [ball]);

        const currentLevelData = [
            ...WALLS(width, height),
            {
                type: "fan",
                renderType: "polygon",
                polygon: [
                    [100, 100],
                    [250, 150],
                    [230, 250],
                    [80, 200],
                ],
                grad: { x1: "0.5", y1: "0.5", x2: "1", y2: "1" },
                colors: {
                    start: "rgba(180, 52, 219, 0.7)",
                    end: "rgba(0, 0, 0, 0.1)",
                },
            },
        ];

        let setupEntities = {
            physics: { engine, world },
            ball: { body: ball, renderer: BallRenderer },
        };

        currentLevelData.forEach((obj, index) => {
            let body;
            if (obj.renderType === "polygon") {
                const vertices = obj.polygon.map((p) => ({ x: p[0], y: p[1] }));
                const sortedVertices = Matter.Vertices.clockwiseSort(vertices);
                const centre = Matter.Vertices.centre(sortedVertices);
                body = Matter.Bodies.fromVertices(
                    centre.x,
                    centre.y,
                    [sortedVertices],
                    {
                        isStatic: true,
                        isSensor: obj.type === "fan" || obj.type === "goal",
                        label: obj.type,
                    },
                );
            } else if (obj.renderType === "circle") {
                body = Matter.Bodies.circle(
                    obj.position[0],
                    obj.position[1],
                    obj.radius,
                    {
                        isStatic: true,
                        isSensor: obj.type === "fan" || obj.type === "goal",
                        label: obj.type,
                    },
                );
            }

            if (body) {
                Matter.World.add(world, [body]);
                setupEntities[`obj_${index}`] = {
                    body: body,
                    renderer: PolygonRenderer,
                    grad: obj.grad,
                    colors: obj.colors,
                    type: obj.type,
                    isFan: obj.type === "fan",
                    isGoal: obj.type === "goal",
                };
            }
        });

        setEntities(setupEntities);

        const subscribe = Accelerometer.addListener((data) => {
            engine.world.gravity.x = -data.x * 2.5;
            engine.world.gravity.y = data.y * 2.5;
        });

        Accelerometer.setUpdateInterval(16);

        return () => {
            subscribe.remove();
        };
    }, [width, height]);

    const resetBall = () => {
        if (entities && entities.ball) {
            Matter.Body.setPosition(entities.ball.body, {
                x: width / 2,
                y: 50,
            });
            Matter.Body.setVelocity(entities.ball.body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(entities.ball.body, 0);
        }
        updateWallGradients();
    };

    if (!entities) return <View style={styles.container} />;

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
        >
            <Pressable style={styles.container} onPress={resetBall}>
                <GameEngine
                    systems={[PhysicsSystem]}
                    entities={entities}
                    style={styles.gameContainer}
                />
            </Pressable>
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: width,
                    height: insets.bottom,
                    backgroundColor: "#000000",
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#5a93cd" },
    gameContainer: { flex: 1 },
});
