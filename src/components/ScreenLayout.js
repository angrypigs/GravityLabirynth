import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenLayout = ({ children, footerContent, bgColor = "#fff" }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar barStyle="dark-content" />
            
            <View style={[styles.safeAreaTop, { height: insets.top }]} />

            <View style={styles.content}>
                {children}
            </View>

            {footerContent && (
                <View style={styles.footerWrapper}>
                    <View style={styles.footer}>
                        {footerContent}
                    </View>
                    <View style={[styles.safeAreaBottom, { height: insets.bottom }]} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeAreaTop: {
        width: "100%",
    },
    content: {
        flex: 1,
    },
    footerWrapper: {
        width: "100%",
        backgroundColor: "#111111",
    },
    footer: {
        width: "100%",
        height: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    safeAreaBottom: {
        width: "100%",
        backgroundColor: "#111111",
    },
});

export default ScreenLayout;