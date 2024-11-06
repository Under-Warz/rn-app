import { useHeaderOptions } from "@/app/navigation/hooks/useHeaderOptions";
import { UploadStackParamsList } from "@/app/navigation/navigators/upload.types";
import { UploadMediaScreen } from "@/features/upload/screens/UploadMedia";
import { SelectMediaScreen } from "@/features/upload/screens/SelectMedia";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleService, useStyleSheet, useTheme } from "@ui-kitten/components";
import { useTranslation } from "react-i18next";
import { AudioRecordingScreen } from "@/features/upload/screens/AudioRecording";

const Stack = createNativeStackNavigator<UploadStackParamsList>();

export const UploadNavigator = () => {
  const { t } = useTranslation();
  const headerOptions = useHeaderOptions();

  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="SELECT_MEDIA"
        component={SelectMediaScreen}
        options={{ title: t("features.upload.mediaSelection.heading") }}
      />
      <Stack.Screen
        name="AUDIO_RECORDING"
        component={AudioRecordingScreen}
        options={{ title: t("features.upload.audioRecording.heading") }}
      />
      <Stack.Screen
        name="UPLOAD_MEDIA"
        component={UploadMediaScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
};
