import { Button } from "@/app/components/Button";
import { ErrorView } from "@/app/components/ErrorView";
import { LoadingView } from "@/app/components/LoadingView";
import { useAppDispatch } from "@/app/technical/hooks/useAppDispatch";
import type { E_MEDIA_TYPE } from "@/app/technical/types";
import { addEntry } from "@/features/settings/state/logs.slice";
import {
  MetaDataForm,
  FormData,
} from "@/features/upload/components/MetaDataForm";
import { useMediaProcessFlow } from "@/features/upload/hooks/useMediaProcessFlow";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Icon, Spinner, Text, useTheme } from "@ui-kitten/components";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

type ProcessMediaProps = {
  fileName: string;
  fileUri: string;
  fileSize: number;
  mediaType: E_MEDIA_TYPE;
  fileMimeType: string;
};

const ICON_SIZE = 84;
const I18N_KEY = "features.upload.processingMedia";

export const ProcessingMedia = ({
  fileName,
  fileUri,
  fileSize,
  mediaType,
  fileMimeType,
}: ProcessMediaProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const {
    isLoading,
    mediaId,
    status,
    error,
    isUploaded,
    isCancelled,
    onResume,
  } = useMediaProcessFlow({
    fileName,
    fileSize,
    mediaType,
    fileUri,
    fileMimeType,
  });

  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  const [metaDataFormSubmitted, setMetaDataFormSubmitted] = useState(false);
  const [finalFileName, setFinalFileName] = useState(fileName);

  const isCompleted = isUploaded && metaDataFormSubmitted;

  const handleMetaDataFormSubmitted = useCallback((data: FormData) => {
    setShouldDisplayForm(false);
    setMetaDataFormSubmitted(true);
    setFinalFileName(data.name);
  }, []);

  const goBack = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: "TABBAR_ROOT",
          },
        ],
      })
    );
  }, [navigation]);

  useEffect(() => {
    if (mediaId && !shouldDisplayForm) {
      setShouldDisplayForm(true);
    }
  }, [mediaId]);

  useEffect(() => {
    if (isCancelled) {
      goBack();
    }
  }, [isCancelled, goBack]);

  useEffect(() => {
    if (isCompleted) {
      dispatch(addEntry(`Success ${finalFileName}`));
    }

    if (!!error) {
      dispatch(addEntry(`Error ${finalFileName} - ${error}`));
    }
  }, [error, isCompleted]);

  if (!!error) {
    return (
      <>
        <ErrorView error={error} />
        {onResume && (
          <Button onPress={onResume} style={styles.cta}>
            {t(`${I18N_KEY}.resumeUpload`)}
          </Button>
        )}
      </>
    );
  }

  if (shouldDisplayForm) {
    return (
      <MetaDataForm
        id={mediaId}
        fileName={fileName}
        defaultValues={{ name: "" }}
        onSubmitCompleted={handleMetaDataFormSubmitted}
      />
    );
  }

  if (isLoading) {
    return <LoadingView message={status} />;
  }

  if (isUploaded) {
    return (
      <View style={styles.container}>
        <Icon
          name="checkmark-circle-outline"
          fill={theme["color-success-default"]}
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
        <Text status="success" style={styles.text}>
          {t(`${I18N_KEY}.status.completed`)}
        </Text>

        <Button onPress={goBack} style={styles.cta}>
          {t("common.continue")}
        </Button>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    marginTop: 24,
  },
  cta: {
    marginTop: 24,
  },
});
