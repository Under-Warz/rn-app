import { useMediaSelectionNavigation } from "@/app/navigation/hooks/useMediaSelectionNavigation";
import { useAppSelector } from "@/app/technical/hooks/useAppSelector";
import { selectIsLoggedIn } from "@/features/auth/state/auth.slice";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import ShareMenu from "react-native-share-menu";

type SharedItem = {
  mimeType: string;
  data: string;
};

export const useShareMenu = () => {
  const navigateToUploadScreen = useMediaSelectionNavigation();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const handleShare = useCallback(
    async (item?: SharedItem | { data: SharedItem[] }) => {
      if (!item) {
        return;
      }

      const { data, mimeType } = (
        Platform.OS === "ios" ? item.data[0] : item
      ) as SharedItem;

      if (data && mimeType && isLoggedIn) {
        navigateToUploadScreen({ uri: data, mimeType });
      }
    },
    [isLoggedIn]
  );

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);
};
