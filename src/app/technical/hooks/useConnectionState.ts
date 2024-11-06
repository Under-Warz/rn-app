import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";
import { useCallback } from "react";

export const useConnectionState = () => {
  const getConnectionState = useCallback(
    () =>
      new Promise<NetInfoStateType>((resolve, reject) => {
        NetInfo.fetch()
          .then((state) => {
            resolve(state.type);
          })
          .catch((error) => reject(error));
      }),
    []
  );

  return { getConnectionState };
};
