import {
  ButtonProps as UIButtonProps,
  Button as UIButton,
  Spinner,
} from "@ui-kitten/components";
import { View } from "react-native";

type ButtonProps = UIButtonProps & {
  isLoading?: boolean;
};

export const Button = ({ isLoading, children, ...props }: ButtonProps) => (
  <UIButton {...props} disabled={isLoading || props.disabled}>
    {isLoading ? (
      <View>
        <Spinner status="control" />
      </View>
    ) : (
      children
    )}
  </UIButton>
);
