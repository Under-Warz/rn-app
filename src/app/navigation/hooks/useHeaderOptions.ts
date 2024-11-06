import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useTheme } from "@ui-kitten/components";

export const useHeaderOptions = (): NativeStackNavigationOptions => {
  const theme = useTheme();

  return {
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: theme["color-basic-1000"],
    },
    headerTintColor: theme["text-basic-color"],
  };
};
