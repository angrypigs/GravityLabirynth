import React, { useState, useEffect, useRef } from "react";
import {
    View,
    useWindowDimensions,
    StyleSheet,
    Text,
    Pressable,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { EditorSystem } from "../systems/Editor";
import { BALL, FAN, GOAL, WALLS, HOLE, WALL } from "../utils/objectsData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createEntity } from "../utils/entityCreator";
import ScreenLayout from "../components/ScreenLayout";

export default function EditorScreen() {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const [entities, setEntities] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const engineRef = useRef(Matter.Engine.create({ enableSleeping: false }));

    const itemsList = [
        ["FAN", "Fan"],
        ["HOLE", "Hole"],
        ["WALL_HORIZONTAL", "Wall (horizontal)"],
        ["WALL_VERTICAL", "Wall (vertical)"],
        ["WALL_RECT", "Wall (rectangle)"],
    ];
    const [currentItem, setCurrentItem] = useState(0);

    useEffect(() => {
        const engine = engineRef.current;
        const world = engine.world;

        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0;

        Matter.World.clear(world);
        Matter.Engine.clear(engine);

        const currentLevelData = [
            ...WALLS(width, height),
            ...BALL(0.25, 0.25),
            ...GOAL(0.75, 0.75),
            ...FAN(0.5, 0.5),
        ];

        let setupEntities = {
            physics: { engine, world, offsetY: insets.top },
        };

        currentLevelData.forEach((obj, index) => {
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
    }, [width, height, insets.top]);

    const addItemHandle = () => {
        const itemName = itemsList[currentItem][0];
        const startX = 0.5;
        const startY = 0.5;

        let objParams;
        if (itemName === "HOLE") objParams = HOLE(startX, startY)[0];
        else if (itemName === "WALL_HORIZONTAL") objParams = WALL(startX, startY, 150, 20)[0];
        else if (itemName === "WALL_VERTICAL") objParams = WALL(startX, startY, 20, 150)[0];
        else if (itemName === "WALL_RECT") objParams = WALL(startX, startY, 50, 50)[0];
        else if (itemName === "FAN") objParams = FAN(startX, startY)[0];
        else return;

        const world = engineRef.current.world;

        if (objParams.position) {
            objParams.position[0] = objParams.position[0] * width;
            objParams.position[1] = objParams.position[1] * height;
        }

        const entityData = createEntity(world, objParams);
        const newId = `obj_${Date.now()}`;

        entities[newId] = entityData;
        entities.physics.activeId = entityData.body.id;

        setSelectedId(entityData.body.id);
    };

    const engineEventHandle = (e) => {
        if (e.type === "select") {
            setSelectedId(e.id);
        }
        if (e.type === "delete") {
            for (const key in entities) {
                if (
                    entities[key].body &&
                    entities[key].body.id === e.id
                ) {
                    Matter.World.remove(
                        engineRef.current.world,
                        entities[key].body
                    );
                    delete entities[key];
                    break;
                }
            }
            if (selectedId === e.id) setSelectedId(null);
        }
    };

    const exportLevel = () => {
        const levelData = [];

        for (const key in entities) {
            if (key === "physics") continue;

            const entity = entities[key];

            if (entity.isBuiltin) continue;

            const x = entity.body.position.x / width;
            const y = entity.body.position.y / height;

            const savedObj = {
                type: entity.type,
                renderType: entity.renderType,
                position: [x, y],
                isBuiltin: false,
                colors: entity.colors,
                grad: entity.grad,
                offsets: entity.offsets,
                radius: entity.radius,
                verticesOffsets: entity.verticesOffsets,
            };

            Object.keys(savedObj).forEach(
                (k) => savedObj[k] === undefined && delete savedObj[k]
            );

            levelData.push(savedObj);
        }

        return JSON.stringify(levelData);
    };

    if (!entities) {
        return <View style={{ flex: 1, backgroundColor: "#d5be73" }} />;
    }

    return (
        <ScreenLayout
            bgColor="#d5be73"
            footerContent={
                <>
                    <View style={styles.footerLeftBox}>
                        <Pressable
                            style={styles.footerLeftBoxAddBtn}
                            onPress={() =>
                                setCurrentItem(
                                    (prev) =>
                                        (prev - 1 + itemsList.length) %
                                        itemsList.length,
                                )
                            }
                        >
                            <Text style={styles.arrowText}>{"◀"}</Text>
                        </Pressable>
                        <Pressable style={styles.middlePressable} onPress={addItemHandle}>
                            <Text
                                style={styles.itemText}
                                numberOfLines={1}
                                adjustsFontSizeToFit={true}
                                minimumFontScale={0.4}
                            >
                                {itemsList[currentItem][1]}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={styles.footerLeftBoxAddBtn}
                            onPress={() =>
                                setCurrentItem(
                                    (prev) => (prev + 1) % itemsList.length,
                                )
                            }
                        >
                            <Text style={styles.arrowText}>{"▶"}</Text>
                        </Pressable>
                    </View>
                </>
            }
        >
            <GameEngine
                systems={[EditorSystem]}
                entities={entities}
                style={{ flex: 1 }}
                onEvent={engineEventHandle}
            />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    footerLeftBox: {
        width: "80%",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111111",
        padding: 5,
    },
    footerLeftBoxAddBtn: {
        aspectRatio: 1,
        height: "100%",
        backgroundColor: "#222222",
        justifyContent: "center",
        alignItems: "center",
    },
    arrowText: {
        fontSize: 32,
        color: "#ffffff",
        textAlign: "center",
    },
    middlePressable: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    itemText: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 24,
    },
});