import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { BallRenderer, PolygonRenderer } from "../components/Renderers";
import { EditorSystem } from "../systems/Editor";
import { WALLS } from "../utils/objectsData";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditorScreen() {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const [entities, setEntities] = useState(null);

    const engineRef = useRef(Matter.Engine.create({ enableSleeping: false }));

    useEffect(() => {
        const engine = engineRef.current;
        const world = engine.world;

        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0;

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
            physics: { engine, world, offsetY: insets.top },
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
                        isBuiltin: obj.isBuiltin,
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
    }, [width, height]);

    if (!entities) return <View style={styles.container} />;

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
        >
            <GameEngine
                systems={[EditorSystem]}
                entities={entities}
                style={styles.gameContainer}
            />
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
    container: { flex: 1, backgroundColor: "#d5be73" },
    gameContainer: { flex: 1 },
    footer: {
        width: "100%",
        height: 100,
        position: "absolute",
        bottom: 48,
        backgroundColor: "black",
    },
});
