import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientButton({ title, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={["#ff7e5f", "#feb47b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
