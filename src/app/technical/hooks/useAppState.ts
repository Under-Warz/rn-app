import { useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  const handleStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      handleStateChange(nextAppState);
    });
  }, []);

  return { appState };
};
