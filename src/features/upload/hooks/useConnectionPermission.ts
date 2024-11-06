import { useConnectionState } from "@/app/technical/hooks/useConnectionState";
import { NetInfoStateType } from "@react-native-community/netinfo";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

const I18N_KEY = "features.upload.processingMedia.connectionPermission";

export const useConnectionPermission = () => {
  const { t } = useTranslation();
  const { getConnectionState } = useConnectionState();

  const askPermission = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        Alert.alert(t(`${I18N_KEY}.title`), t(`${I18N_KEY}.message`), [
          {
            text: t(`common.continue`),
            onPress: () => resolve(true),
          },
          {
            text: t(`common.cancel`),
            onPress: () => resolve(false),
            style: "cancel",
          },
        ]);
      }),
    []
  );

  const requestConnectionPermission = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        getConnectionState()
          .then(async (connectionState) => {
            if (connectionState === NetInfoStateType.cellular) {
              const permission = await askPermission();
              return resolve(permission);
            }

            return resolve(true);
          })
          .catch(() => resolve(true));
      }),
    []
  );

  return requestConnectionPermission;
};
