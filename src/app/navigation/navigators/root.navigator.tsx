import { RootStackParamsList } from "@/app/navigation/navigators/root.types";
import { TabBarNavigator } from "@/app/navigation/navigators/tabbar.navigator";
import { LoginScreen } from "@/features/auth/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamsList>();

export const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="LOGIN"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LOGIN" component={LoginScreen} />
      <Stack.Screen name="TABBAR_ROOT" component={TabBarNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);
