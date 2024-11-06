import { TabBarBottomParamsList } from "@/app/navigation/navigators/tabbar.types";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamsList = {
  LOGIN: undefined;
  TABBAR_ROOT: NavigatorScreenParams<TabBarBottomParamsList>;
};
