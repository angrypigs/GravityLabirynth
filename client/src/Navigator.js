import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GameScreen from "./screens/GameScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={GameScreen}
                options={{ title: "Menu Główne", headerShown: false }}
            />
        </Stack.Navigator>
    );
}
