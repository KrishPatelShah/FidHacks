import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { colors } from "@/theme/colors";

type FlowerName =
  | "Daisy"
  | "Marigold"
  | "Rose"
  | "Orchid"
  | "Blue Iris"
  | "White Lily"
  | "Bluebell"
  | "Purple Tulip"
  | "Red Poppy"
  | "Sunflower";

type Props = {
  name: FlowerName | string;
  size?: number;
};

const petals: Record<string, string> = {
  Daisy: colors.white,
  Marigold: colors.softOrange,
  Rose: colors.roseRed,
  Orchid: colors.orchidPurple,
  "Blue Iris": colors.skyBlue,
  "White Lily": "#FDFBF4",
  Bluebell: colors.skyBlue,
  "Purple Tulip": colors.orchidPurple,
  "Red Poppy": "#E84E43",
  Sunflower: colors.sunflowerYellow
};

export function FlowerIcon({ name, size = 44 }: Props) {
  const fill = petals[name] ?? colors.mintGreen;
  const isTulip = name.includes("Tulip");
  const isRose = name === "Rose";
  const isPoppy = name.includes("Poppy");

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d="M32 31 C31 40 31 49 32 60" stroke={colors.deepGreen} strokeWidth="5" strokeLinecap="round" />
      <Path d="M31 48 C21 39 13 42 11 51 C20 55 27 54 31 48Z" fill={colors.mintGreen} />
      <Path d="M34 50 C44 40 52 43 54 52 C45 56 38 55 34 50Z" fill="#7CD8B8" />
      {isTulip ? (
        <Path d="M18 30 C18 13 30 10 32 25 C35 10 47 13 47 30 C47 42 18 42 18 30Z" fill={fill} />
      ) : isRose ? (
        <>
          <Circle cx="32" cy="28" r="17" fill={fill} />
          <Path d="M22 28 C27 18 40 19 43 30 C36 25 29 30 32 38 C25 37 21 34 22 28Z" fill="#B94759" />
          <Path d="M28 25 C33 19 39 24 36 31 C31 29 28 28 28 25Z" fill="#F07B87" />
        </>
      ) : isPoppy ? (
        <>
          <Circle cx="22" cy="27" r="13" fill={fill} />
          <Circle cx="42" cy="27" r="13" fill={fill} />
          <Circle cx="32" cy="17" r="13" fill={fill} />
          <Circle cx="32" cy="36" r="13" fill={fill} />
          <Circle cx="32" cy="28" r="7" fill={colors.darkText} />
        </>
      ) : (
        <>
          <Ellipse cx="20" cy="28" rx="12" ry="10" fill={fill} />
          <Ellipse cx="44" cy="28" rx="12" ry="10" fill={fill} />
          <Ellipse cx="32" cy="16" rx="10" ry="13" fill={fill} />
          <Ellipse cx="32" cy="40" rx="10" ry="13" fill={fill} />
          <Circle cx="32" cy="29" r="9" fill={name === "Sunflower" ? "#8B5A28" : colors.sunflowerYellow} />
        </>
      )}
      {name === "Sunflower" ? <Rect x="20" y="56" width="24" height="7" rx="3" fill={colors.softOrange} /> : null}
    </Svg>
  );
}
