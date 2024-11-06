import { SettingsStackParamsList } from "@/app/navigation/navigators/settings.types";
import { SafeAreaLayout } from "@/app/technical/components/SafeAreaLayout";
import { useAppDispatch } from "@/app/technical/hooks/useAppDispatch";
import { signOut } from "@/features/auth/state/auth.slice";
import { CommonActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, ListItem } from "@ui-kitten/components";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import i18next from "i18next";
import { AppVersion } from "@/app/components/AppVersion";

const I18N_KEY = "features.settings.settingsList";

const AVAILABLE_LANGUAGES = [
  {
    code: "fr",
    label: "🇫🇷 Français",
  },
  {
    code: "en",
    label: "🇺🇸 English",
  },
];

export const SettingsListScreen = ({
  navigation,
}: NativeStackScreenProps<SettingsStackParamsList, "SETTINGS_LIST">) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const handleChangeLanguage = useCallback(() => {
    const options = [
      ...AVAILABLE_LANGUAGES.map(({ label }) => label),
      t("common.cancel"),
    ];
    const cancelButtonIndex = AVAILABLE_LANGUAGES.length;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number) => {
        if (selectedIndex < options.length - 1) {
          i18next.changeLanguage(AVAILABLE_LANGUAGES[selectedIndex].code);
        }
      }
    );
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(signOut());

    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: "LOGIN",
          },
        ],
      })
    );
  }, []);

  const handleNavigate = useCallback(
    (route: keyof SettingsStackParamsList) => () => {
      navigation.navigate(route);
    },
    []
  );

  return (
    <SafeAreaLayout style={styles.safeArea}>
      <View style={styles.list}>
        <ListItem
          title={t(`${I18N_KEY}.items.logs.title`)}
          description={t(`${I18N_KEY}.items.logs.description`)}
          accessoryLeft={<Icon name="file-text-outline" />}
          accessoryRight={<Icon name="arrow-ios-forward-outline" />}
          onPress={handleNavigate("LOGS")}
        />
        <ListItem
          title={t(`${I18N_KEY}.items.language.title`)}
          description={t(`${I18N_KEY}.items.language.description`)}
          accessoryLeft={<Icon name="flag-outline" />}
          accessoryRight={<Icon name="arrow-ios-forward-outline" />}
          onPress={handleChangeLanguage}
        />
      </View>
      <Button status="danger" appearance="ghost" onPress={handleLogout}>
        {t(`${I18N_KEY}.logout`)}
      </Button>
      <AppVersion />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  list: {
    width: "100%",
    paddingVertical: 24,
  },
});
