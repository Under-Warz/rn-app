import { Spinner, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

type LoadingViewProps = {
  message?: string;
};

export const LoadingView = ({ message }: LoadingViewProps) => (
  <View style={styles.container}>
    <Spinner size="giant" status="control" />
    {!!message && <Text style={styles.text}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 24,
    textAlign: "center",
  },
});
