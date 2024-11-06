import { UploadStackParamsList } from "@/app/navigation/navigators/upload.types";
import KeyboardAwareScrollViewWrapper from "@/app/technical/components/KeyboardAwareScrollViewWrapper/KeyboardAwareScrollViewWrapper";
import { SafeAreaLayout } from "@/app/technical/components/SafeAreaLayout";
import { ProcessingMedia } from "@/features/upload/components/ProcessingMedia";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

export const UploadMediaScreen = ({
  route: { params },
}: NativeStackScreenProps<UploadStackParamsList, "UPLOAD_MEDIA">) => (
  <SafeAreaLayout style={styles.safeArea}>
    <KeyboardAwareScrollViewWrapper contentContainerStyle={styles.container}>
      <ProcessingMedia
        fileName={params.name}
        fileUri={params.uri}
        fileSize={params.size}
        mediaType={params.mediaType}
        fileMimeType={params.mimeType}
      />
    </KeyboardAwareScrollViewWrapper>
  </SafeAreaLayout>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
