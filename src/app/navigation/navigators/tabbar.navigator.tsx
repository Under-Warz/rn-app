import { SettingsNavigator } from "@/app/navigation/navigators/settings.navigator";
import { TabBarBottomParamsList } from "@/app/navigation/navigators/tabbar.types";
import { UploadNavigator } from "@/app/navigation/navigators/upload.navigator";
import { useShareMenu } from "@/app/technical/hooks/useShareMenu";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Icon,
  StyleService,
  useStyleSheet,
  useTheme,
} from "@ui-kitten/components";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<TabBarBottomParamsList>();

const I18N_KEY = "navigation.tabBar";

export const TabBarNavigator = () => {
  useShareMenu();

  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarInactiveTintColor: theme["text-hint-color"],
        tabBarActiveTintColor: theme["color-primary-500"],
      }}
    >
      <Tab.Screen
        name="UPLOAD_ROOT"
        component={UploadNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="cloud-upload-outline"
              fill={color}
              width={size}
              height={size}
            />
          ),
          tabBarLabel: t(`${I18N_KEY}.upload`),
        }}
      />
      <Tab.Screen
        name="SETTINGS_ROOT"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="settings-2-outline"
              fill={color}
              width={size}
              height={size}
            />
          ),
          tabBarLabel: t(`${I18N_KEY}.settings`),
        }}
      />
    </Tab.Navigator>
  );
};

const themedStyles = StyleService.create({
  tabBar: {
    backgroundColor: "color-basic-1000",
    borderTopColor: "transparent",
  },
});
