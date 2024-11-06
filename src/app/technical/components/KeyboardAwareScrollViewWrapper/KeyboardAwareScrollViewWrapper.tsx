import { ComponentProps } from "react";
import { StyleSheet, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props extends ComponentProps<typeof KeyboardAwareScrollView> {
  // Get the ref for ScrollToEnd/ScrollToStart
  getWrapperRef?: (ref: KeyboardAwareScrollView) => void;
}

const KeyboardAwareScrollViewWrapper = ({
  children,
  getWrapperRef,
  contentContainerStyle,
  style,
  ...props
}: Props) => {
  const EXTRA_HEIGHT_MINIMUM = 60;
  const { bottom, top } = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      {...props}
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      extraHeight={EXTRA_HEIGHT_MINIMUM + bottom + top}
      onScrollBeginDrag={Keyboard.dismiss}
      innerRef={(ref) => getWrapperRef && getWrapperRef(ref as any)}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default KeyboardAwareScrollViewWrapper;
