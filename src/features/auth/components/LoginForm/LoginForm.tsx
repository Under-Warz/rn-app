import { Button } from "@/app/components/Button";
import Config from "@/app/config";
import { useAppSelector } from "@/app/technical/hooks/useAppSelector";
import { useAuthFlow } from "@/features/auth/hooks/useAuthFlow";
import {
  selectApiHostname,
  selectCredentials,
} from "@/features/auth/state/auth.slice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Icon, Input, Text } from "@ui-kitten/components";
import { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, StyleSheet, View } from "react-native";

type FormData = {
  apiHostname: string;
  login: string;
  password: string;
};

const I18N_KEY = "features.auth.login";

export const LoginForm = () => {
  const loginInput = useRef<Input>();
  const passwordInput = useRef<Input>();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const { authenticate, isError } = useAuthFlow();

  const apiHostname = useAppSelector(selectApiHostname);
  const { login, password } = useAppSelector(selectCredentials);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      apiHostname: apiHostname || Config.apiHostname,
      login,
      password,
    },
  });

  const onSubmit = useCallback(async (data: FormData) => {
    Keyboard.dismiss();
    try {
      await authenticate(data);

      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: "TABBAR_ROOT",
            },
          ],
        })
      );
    } catch (e) {
      if (e.status === "FETCH_ERROR") {
        setError("root", { message: t(`errors.FETCH_ERROR`) });
      } else if (e.name) {
        setError("root", { message: t(`errors.${e.name}`) });
      } else if (e.data?.data?.errors) {
        setError("root", { message: t(`errors.${e.data.data.errors[0]}`) });
      }
    }
  }, []);

  return (
    <View>
      {Config.apiHostnameEditable && (
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t(`${I18N_KEY}.apiHostname`)}
              size="large"
              enablesReturnKeyAutomatically
              autoCapitalize="none"
              blurOnSubmit
              returnKeyType="next"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.inputView}
              onSubmitEditing={() => loginInput.current.focus()}
              accessoryLeft={<Icon name="globe-2-outline" />}
              status={isError ? "danger" : "basic"}
            />
          )}
          name="apiHostname"
        />
      )}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={loginInput}
            placeholder={t(`${I18N_KEY}.login`)}
            size="large"
            enablesReturnKeyAutomatically
            autoCapitalize="none"
            blurOnSubmit
            returnKeyType="next"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.inputView}
            onSubmitEditing={() => passwordInput.current.focus()}
            accessoryLeft={<Icon name="person-outline" />}
            status={isError ? "danger" : "basic"}
          />
        )}
        name="login"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={passwordInput}
            placeholder={t(`${I18N_KEY}.password`)}
            size="large"
            secureTextEntry
            enablesReturnKeyAutomatically
            blurOnSubmit
            returnKeyType="done"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.inputView}
            onSubmitEditing={handleSubmit(onSubmit)}
            accessoryLeft={<Icon name="lock-outline" />}
            status={isError ? "danger" : "basic"}
          />
        )}
        name="password"
      />

      <Button
        size="giant"
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        {t(`${I18N_KEY}.cta`)}
      </Button>

      {errors.root && (
        <Text status="danger" style={styles.errorMessage}>
          {errors.root.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
  inputView: {
    marginBottom: 12,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    textAlign: "center",
    marginTop: 24,
  },
});
