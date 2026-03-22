import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, useWindowDimensions, Pressable } from "react-native";
import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { BallRenderer, PolygonRenderer } from "../components/Renderers";
import { PhysicsSystem } from "../systems/Physics";
import { BALL, GOAL, WALLS, HOLE, FAN } from "../utils/objectsData";
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
            GOAL(width - 200, height - 200),
            HOLE(100, 100),
            HOLE(100, 150),
            HOLE(100, 200),
            HOLE(100, 250),
            HOLE(100, 300),
            HOLE(100, 350),
            BALL(width / 2, 150),
            ...WALLS(width, height),
            FAN(400, 600),
        ];

        let setupEntities = {
            physics: { engine, world, offsetY: insets.top },
        };

        currentLevelData.forEach((obj, index) => {
            const isBuiltin = obj.isBuiltin || false;
            let body;

            if (obj.type === "ball") {
                body = Matter.Bodies.circle(
                    obj.position[0],
                    obj.position[1],
                    obj.radius,
                    {
                        restitution: 0.6,
                        frictionAir: 0.02,
                        label: obj.type,
                        isBuiltin: isBuiltin,
                    },
                );

                Matter.World.add(world, [body]);
                setupEntities.ball = {
                    body: body,
                    renderer: BallRenderer,
                    colors: obj.colors,
                    offsets: obj.offsets,
                    grad: obj.grad,
                    type: obj.type,
                };
            } else if (obj.renderType === "polygon") {
                const vertices = obj.polygon.map((p) => ({ x: p[0], y: p[1] }));
                const sortedVertices = Matter.Vertices.clockwiseSort(vertices);
                const centreX =
                    vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
                const centreY =
                    vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;

                body = Matter.Bodies.fromVertices(
                    centreX,
                    centreY,
                    [sortedVertices],
                    {
                        isStatic: true,
                        isSensor: obj.type === "fan",
                        label: obj.type,
                        isBuiltin: isBuiltin,
                    },
                );
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
            }

            if (body && obj.type !== "ball") {
                Matter.World.add(world, [body]);
                setupEntities[`obj_${index}`] = {
                    body: body,
                    renderer: PolygonRenderer,
                    grad: obj.grad,
                    colors: obj.colors,
                    type: obj.type,
                    isFan: obj.type === "fan",
                    isGoal: obj.type === "goal",
                    isHole: obj.type === "hole",
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
                    onEvent={(e) => {
                        if (e.type === "goalReached") {
                            alert("Kula jest w mecie!");
                        }
                    }}
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
            <View style={styles.footer}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#5a93cd" },
    gameContainer: { flex: 1 },
    footer: {
        width: "100%",
        height: 100,
        position: "absolute",
        bottom: 48,
        backgroundColor: "red",
    },
});
