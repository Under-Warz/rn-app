import type { Config } from "@/app/config/index.type";
import RNConfig from "react-native-config";
import { STREAMLIKE } from "./config.streamlike";

enum E_BRAND {
  STREAMLIKE = "streamlike",
}

const CONFIGURATIONS: Record<E_BRAND, Config> = {
  [E_BRAND.STREAMLIKE]: STREAMLIKE,
};

const currentConfig: Config =
  CONFIGURATIONS[RNConfig.BRAND || E_BRAND.STREAMLIKE];

export default currentConfig;
