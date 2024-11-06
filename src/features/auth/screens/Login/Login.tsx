import KeyboardAwareScrollViewWrapper from "@/app/technical/components/KeyboardAwareScrollViewWrapper/KeyboardAwareScrollViewWrapper";
import {
  SafeAreaLayout,
  SaveAreaInset,
} from "@/app/technical/components/SafeAreaLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Text } from "@ui-kitten/components";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AppVersion } from "@/app/components/AppVersion";

export const LoginScreen = () => {
  // Temporary fix to check why long white screen on Android
  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
    })();
  }, []);

  return (
    <SafeAreaLayout style={styles.safeArea} insets={SaveAreaInset.BOTTOM}>
      <KeyboardAwareScrollViewWrapper contentContainerStyle={styles.container}>
        <View>
          <Text category="h3" style={styles.title}>
            Streamlike Upload
          </Text>
          <LoginForm />
        </View>
        <AppVersion />
      </KeyboardAwareScrollViewWrapper>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  title: {
    marginTop: 128,
    marginBottom: 128,
    textAlign: "center",
  },
});
