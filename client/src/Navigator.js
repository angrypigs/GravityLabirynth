import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GameScreen from "./screens/GameScreen";
import HomeScreen from "./screens/HomeScreen";
import EditorScreen from "./screens/EditorScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Home", headerShown: false }}
            />
            <Stack.Screen
                name="Game"
                component={GameScreen}
                options={{ title: "Game", headerShown: false }}
            />
            <Stack.Screen
                name="Editor"
                component={EditorScreen}
                options={{ title: "Editor", headerShown: false }}
            />
        </Stack.Navigator>
    );
}
