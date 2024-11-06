import { RootStackParamsList } from "@/app/navigation/navigators/root.types";
import { E_MEDIA_TYPE } from "@/app/technical/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { FileSystem } from "react-native-file-access";

export const useMediaSelectionNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const navigateToUploadScreen = useCallback(
    async ({ uri, mimeType }: { uri: string; mimeType: string }) => {
      try {
        const { filename, size } = await FileSystem.stat(uri);

        navigation.reset({
          routes: [
            {
              name: "TABBAR_ROOT",
              params: {
                screen: "UPLOAD_ROOT",
                params: {
                  state: {
                    index: 1,
                    routes: [
                      { name: "SELECT_MEDIA" },
                      {
                        name: "UPLOAD_MEDIA",
                        params: {
                          uri,
                          name: filename,
                          mediaType: mimeType.startsWith("audio/")
                            ? E_MEDIA_TYPE.AUDIO
                            : E_MEDIA_TYPE.VIDEO,
                          size,
                          mimeType,
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        });
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  return navigateToUploadScreen;
};
