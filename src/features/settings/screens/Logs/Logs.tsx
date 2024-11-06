import { Button } from "@/app/components/Button";
import { SafeAreaLayout } from "@/app/technical/components/SafeAreaLayout";
import { useAppDispatch } from "@/app/technical/hooks/useAppDispatch";
import { useAppSelector } from "@/app/technical/hooks/useAppSelector";
import { clear, selectEntries } from "@/features/settings/state/logs.slice";
import { Text } from "@ui-kitten/components";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export const LogsScreen = () => {
  const { t } = useTranslation();
  const entries = useAppSelector(selectEntries);
  const dispatch = useAppDispatch();

  const handleClear = useCallback(() => {
    dispatch(clear());
  }, []);

  return (
    <SafeAreaLayout style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <Text style={styles.text}>
          {entries
            .map(
              (entry) =>
                `${dayjs(entry.datetime).format("YYYY/MM/DD HH:mm:ss")} ${
                  entry.message
                }`
            )
            .join("\n\n")}
        </Text>
      </ScrollView>
      <Button onPress={handleClear}>{t("features.settings.logs.clear")}</Button>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: 24,
  },
  scrollView: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: "gray",
    marginBottom: 16,
  },
  scrollViewContentContainer: {
    padding: 12,
  },
  text: {
    color: "black",
    fontSize: 12,
  },
});
