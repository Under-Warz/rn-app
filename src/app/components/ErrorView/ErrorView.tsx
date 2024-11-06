import { Icon, Text, useTheme } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

type ErrorViewProps = {
  error: string;
};

export const ErrorView = ({ error }: ErrorViewProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon
        name="alert-circle-outline"
        fill={theme["color-danger-default"]}
        width={84}
        height={84}
      />
      <Text key={error} status="danger" style={styles.text}>
        {error}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    marginTop: 24,
  },
});
