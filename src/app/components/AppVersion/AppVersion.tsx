import { Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";

export const AppVersion = () => (
  <Text style={styles.text}>v{DeviceInfo.getReadableVersion()}</Text>
);

const styles = StyleSheet.create({
  text: {
    paddingVertical: 8,
    opacity: 0.5,
    textAlign: "center",
    fontSize: 12,
  },
});
