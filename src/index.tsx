import { RootNavigator } from "@/app/navigation/navigators/root.navigator";
import { store, persistor } from "@/app/store";
import "@/app/technical/i18n";
import { default as theme } from "@/app/theme.json";
import * as eva from "@eva-design/eva";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

const App = () => (
  <>
    <StatusBar style="light" />
    <IconRegistry icons={EvaIconsPack} />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ActionSheetProvider>
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
              <RootNavigator />
            </ApplicationProvider>
          </ActionSheetProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  </>
);

registerRootComponent(App);
