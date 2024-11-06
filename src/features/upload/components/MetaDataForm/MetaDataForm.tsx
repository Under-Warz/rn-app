import { Button } from "@/app/components/Button";
import { useUpdateMediaMutation } from "@/app/services/streamlike";
import type { Media } from "@/app/technical/types";
import { Icon, Input, Text } from "@ui-kitten/components";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, StyleSheet, View } from "react-native";

export type FormData = Pick<Media, "name" | "description" | "credits">;

type MetaDataFormProps = {
  id: Media["id"];
  fileName: Media["name"];
  onSubmitCompleted: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
};

const I18N_KEY = "features.upload.metaDataForm";

export const MetaDataForm = ({
  id,
  fileName,
  defaultValues,
  onSubmitCompleted,
}: MetaDataFormProps) => {
  const { t } = useTranslation();
  const [updateMedia, { isError, error }] = useUpdateMediaMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = useCallback(async (data: FormData) => {
    Keyboard.dismiss();
    await updateMedia({ id, ...data, name: data.name || fileName });
    onSubmitCompleted(data);
  }, []);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { invalid },
        }) => (
          <Input
            placeholder={t(`${I18N_KEY}.name`)}
            size="large"
            enablesReturnKeyAutomatically
            blurOnSubmit
            returnKeyType="next"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.inputView}
            onSubmitEditing={handleSubmit(onSubmit)}
            status={invalid ? "danger" : "basic"}
            accessoryLeft={<Icon name="pricetags-outline" />}
          />
        )}
        name="name"
      />
      <Button
        size="giant"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        isLoading={isSubmitting}
      >
        {t(`${I18N_KEY}.cta`)}
      </Button>
      {isError && <Text status="danger">{JSON.stringify(error)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  inputView: {
    marginBottom: 12,
  },
});
