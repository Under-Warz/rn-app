import { SettingsStackParamsList } from "@/app/navigation/navigators/settings.types";
import { UploadStackParamsList } from "@/app/navigation/navigators/upload.types";
import { NavigatorScreenParams } from "@react-navigation/native";

export type TabBarBottomParamsList = {
  UPLOAD_ROOT: NavigatorScreenParams<UploadStackParamsList>;
  SETTINGS_ROOT: NavigatorScreenParams<SettingsStackParamsList>;
};
