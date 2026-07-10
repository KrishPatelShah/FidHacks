import { Image, ImageStyle, StyleProp } from "react-native";

const source = require("../../assets/logo.png");
const RATIO = 499 / 630; // intrinsic width / height

// The Fluuurish sunflower-coin brand mark, sized by height (width follows the
// image's aspect ratio).
export function Logo({ height = 40, style }: { height?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      accessibilityLabel="Fluuurish logo"
      resizeMode="contain"
      source={source}
      style={[{ height, width: height * RATIO }, style]}
    />
  );
}
