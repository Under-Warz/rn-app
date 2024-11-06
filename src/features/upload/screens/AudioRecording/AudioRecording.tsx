import { ErrorView } from "@/app/components/ErrorView";
import { useMediaSelectionNavigation } from "@/app/navigation/hooks/useMediaSelectionNavigation";
import { SafeAreaLayout } from "@/app/technical/components/SafeAreaLayout";
import { millisToMinutesAndSeconds } from "@/app/technical/utils/millisToMinutesAndSeconds";
import { Button, Icon, Text } from "@ui-kitten/components";
import { Audio } from "expo-av";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
  Recording,
  RecordingOptionsPresets,
  RecordingStatus,
} from "expo-av/build/Audio";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as mime from "react-native-mime-types";

const I18N_KEY = "features.upload.audioRecording";

export const AudioRecordingScreen = () => {
  const { t } = useTranslation();
  const navigateToUploadScreen = useMediaSelectionNavigation();

  const [recording, setRecording] = useState<Recording>();
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<string>();
  const [fileUri, setFileUri] = useState<string>();

  const onRecordingStatusUpdate = useCallback((status: RecordingStatus) => {
    if (status.isRecording) {
      setDuration(status.durationMillis);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setFileUri(undefined);

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        RecordingOptionsPresets.HIGH_QUALITY,
        onRecordingStatusUpdate
      );
      setRecording(recording);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    setFileUri(uri);
  }, [recording]);

  const handleContinue = useCallback(() => {
    const mimeType = mime.lookup(fileUri);
    navigateToUploadScreen({ uri: fileUri, mimeType });
  }, [fileUri]);

  return (
    <SafeAreaLayout style={styles.safeArea}>
      <View style={styles.container}>
        {!!error ? (
          <ErrorView error={error} />
        ) : (
          <>
            <Button
              size="giant"
              status={recording ? "danger" : "primary"}
              onPress={recording ? stopRecording : startRecording}
              accessoryLeft={
                <Icon
                  name={recording ? "stop-circle-outline" : "mic-outline"}
                />
              }
            />

            <Text style={styles.duration}>
              {millisToMinutesAndSeconds(duration)}
            </Text>

            {!!fileUri && (
              <Button style={styles.continueBtn} onPress={handleContinue}>
                Continuer
              </Button>
            )}
          </>
        )}
      </View>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 24,
  },
  duration: {
    marginTop: 16,
  },
  continueBtn: {
    marginTop: 24,
  },
});
