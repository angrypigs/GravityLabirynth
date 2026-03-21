import { View, StyleSheet } from "react-native";
import Button from "../components/Button";

export default function HomeScreen({ navigation }) {
    return (
        <>
            <View style={styles.container}>
                <Button
                    title={"Game"}
                    onPress={() => {
                        navigation.navigate("Game");
                    }}
                />
                <Button
                    title={"Editor"}
                    onPress={() => {
                        navigation.navigate("Editor");
                    }}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5a93cd",
        justifyContent: "center",
        padding: "20%",
    },
});
