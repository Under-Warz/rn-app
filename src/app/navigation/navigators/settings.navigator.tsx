import { useHeaderOptions } from "@/app/navigation/hooks/useHeaderOptions";
import { SettingsStackParamsList } from "@/app/navigation/navigators/settings.types";
import { LogsScreen } from "@/features/settings/screens/Logs";
import { SettingsListScreen } from "@/features/settings/screens/SettingsList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator<SettingsStackParamsList>();

export const SettingsNavigator = () => {
  const { t } = useTranslation();
  const headerOptions = useHeaderOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
      }}
    >
      <Stack.Screen
        name="SETTINGS_LIST"
        component={SettingsListScreen}
        options={{ title: t("features.settings.heading") }}
      />
      <Stack.Screen
        name="LOGS"
        component={LogsScreen}
        options={{ title: t("features.settings.logs.heading") }}
      />
    </Stack.Navigator>
  );
};
