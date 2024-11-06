import { LoadingView } from "@/app/components/LoadingView";
import { useMediaSelectionNavigation } from "@/app/navigation/hooks/useMediaSelectionNavigation";
import { UploadStackParamsList } from "@/app/navigation/navigators/upload.types";
import { SafeAreaLayout } from "@/app/technical/components/SafeAreaLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, Text } from "@ui-kitten/components";
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
} from "react-native-image-picker";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

enum E_MEDIA_SOURCE {
  LIBRARY = "LIBRARY",
  CAMERA = "CAMERA",
}

const I18N_KEY = "features.upload.mediaSelection";

export const SelectMediaScreen = ({
  navigation,
}: NativeStackScreenProps<UploadStackParamsList, "SELECT_MEDIA">) => {
  const { t } = useTranslation();
  const navigateToUploadScreen = useMediaSelectionNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const pickMedia = useCallback(async (source: E_MEDIA_SOURCE) => {
    try {
      setIsLoading(true);

      let saveToPhotos = Platform.OS === "ios" ? true : false;

      if (source === E_MEDIA_SOURCE.CAMERA) {
        // Camera request
        const cameraRequest = await request(
          Platform.select({
            ios: PERMISSIONS.IOS.CAMERA,
            android: PERMISSIONS.ANDROID.CAMERA,
          })
        );

        if (
          cameraRequest === RESULTS.DENIED ||
          cameraRequest === RESULTS.BLOCKED
        ) {
          throw Error("Vous n'avez pas autorisé l'application");
        }

        if (cameraRequest === RESULTS.UNAVAILABLE) {
          throw Error("La caméra n'est pas disponible");
        }

        // Write to external request
        if (Platform.OS === "android") {
          const writeRequest = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          );
          saveToPhotos = writeRequest === RESULTS.GRANTED;
        }
      }

      const args: CameraOptions = {
        mediaType: "video",
        quality: 1,
        saveToPhotos,
      };

      let result = await (source === E_MEDIA_SOURCE.CAMERA
        ? launchCamera(args)
        : launchImageLibrary(args));

      if (!result.didCancel) {
        const file = result.assets[0];
        navigateToUploadScreen({ uri: file.uri, mimeType: file.type });
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  }, []);

  const recordAudio = useCallback(() => {
    navigation.navigate("AUDIO_RECORDING");
  }, []);

  return (
    <SafeAreaLayout style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <LoadingView message={t(`${I18N_KEY}.preparing`)} />
        ) : (
          <>
            <Text category="h3" style={styles.title}>
              {t(`${I18N_KEY}.title`)}
            </Text>
            <Button
              size="large"
              style={styles.btn}
              accessoryLeft={<Icon name="image-outline" />}
              onPress={() => pickMedia(E_MEDIA_SOURCE.LIBRARY)}
            >
              {t(`${I18N_KEY}.fromLibrary`)}
            </Button>
            <Button
              size="large"
              style={styles.btn}
              accessoryLeft={<Icon name="camera-outline" />}
              onPress={() => pickMedia(E_MEDIA_SOURCE.CAMERA)}
            >
              {t(`${I18N_KEY}.fromCamera`)}
            </Button>
            {/* <Button
          size="large"
          style={styles.btn}
          accessoryLeft={<Icon name="mic-outline" />}
          onPress={recordAudio}
        >
          {t(`${I18N_KEY}.recordAudio`)}
  </Button> */}
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
    padding: 24,
  },
  title: {
    marginBottom: 24,
  },
  btn: {
    width: "100%",
    marginBottom: 12,
  },
});
