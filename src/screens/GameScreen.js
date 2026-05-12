import React, { useState, useEffect, useRef } from "react";
import { View, useWindowDimensions, Alert } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Accelerometer } from "expo-sensors";
import { PhysicsSystem } from "../systems/Physics";
import { BALL, GOAL, WALLS } from "../utils/objectsData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createEntity } from "../utils/entityCreator";
import ScreenLayout from "../components/ScreenLayout";

export default function GameScreen() {
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

        const levelData = [
            ...WALLS(width, height),
            ...BALL(0.5, 0.2),
            ...GOAL(0.5, 0.8),
        ];

        let setupEntities = {
            physics: { engine, world },
        };

        levelData.forEach((obj, index) => {
            if (!obj.isBuiltin && obj.position) {
                obj.position[0] = obj.position[0] * width;
                obj.position[1] = obj.position[1] * height;
            }

            const entityData = createEntity(world, obj);

            if (obj.type === "ball") {
                setupEntities.ball = entityData;
            } else {
                setupEntities[`obj_${index}`] = entityData;
            }
        });

        setEntities(setupEntities);

        Accelerometer.setUpdateInterval(16);
        const subscription = Accelerometer.addListener((accelerometerData) => {
            engine.world.gravity.x = -accelerometerData.x * 2;
            engine.world.gravity.y = accelerometerData.y * 2;
        });

        return () => {
            subscription.remove();
            Matter.World.clear(world);
            Matter.Engine.clear(engine);
        };
    }, [width, height]);

    const onEvent = (e) => {
        if (e.type === "goalReached") {
            Alert.alert("Wygrana!", "Poziom ukończony.");
        }
    };

    if (!entities) return null;

    return (
        <ScreenLayout bgColor="#d5be73">
            <GameEngine
                systems={[PhysicsSystem]}
                entities={entities}
                onEvent={onEvent}
                style={{ flex: 1 }}
                running={true}
            />
        </ScreenLayout>
    );
}