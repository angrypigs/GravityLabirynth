import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, useWindowDimensions, Pressable } from "react-native";
import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { BallRenderer, PolygonRenderer } from "../components/Renderers";
import { PhysicsSystem } from "../systems/Physics";
import { BALL, GOAL, WALLS, HOLE, FAN } from "../utils/objectsData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createEntity } from "../utils/entityCreator";

export default function GameScreen() {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const [entities, setEntities] = useState(null);

    const engineRef = useRef(Matter.Engine.create({ enableSleeping: false }));

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
            const entityData = createEntity(world, obj);

            if (obj.type === "ball") {
                setupEntities.ball = entityData;
            } else {
                setupEntities[`obj_${index}`] = entityData;
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
