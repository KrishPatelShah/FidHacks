import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { colors, shadow } from "@/theme/colors";
import { Plant } from "@/types/domain";

const petalColors: Record<string, string> = {
  Daisy: colors.white,
  Marigold: colors.softOrange,
  Rose: colors.roseRed,
  Orchid: colors.orchidPurple,
  "Blue Iris": colors.skyBlue,
  "White Lily": "#FDFBF4",
  Bluebell: colors.skyBlue,
  "Purple Tulip": colors.orchidPurple,
  "Red Poppy": "#E84E43"
};

const positions = [
  [62, 214],
  [132, 222],
  [204, 216],
  [276, 222],
  [318, 200],
  [96, 176],
  [168, 182],
  [240, 178],
  [300, 168],
  [44, 190]
];

function Flower({ x, y, color, index }: { x: number; y: number; color: string; index: number }) {
  const center = index % 3 === 0 ? colors.sunflowerYellow : "#8B5A28";

  return (
    <G transform={`translate(${x - 27}, ${y - 58})`}>
      <Line x1="27" y1="31" x2="27" y2="71" stroke={colors.deepGreen} strokeWidth="5" strokeLinecap="round" />
      <Path d="M26 56 C17 48 10 51 8 60 C17 64 23 63 26 56Z" fill={colors.mintGreen} />
      <Path d="M29 58 C39 49 46 52 48 61 C39 65 33 64 29 58Z" fill="#7CD8B8" />
      <Ellipse cx="15" cy="28" rx="12" ry="10" fill={color} />
      <Ellipse cx="39" cy="28" rx="12" ry="10" fill={color} />
      <Ellipse cx="27" cy="16" rx="10" ry="13" fill={color} />
      <Ellipse cx="27" cy="40" rx="10" ry="13" fill={color} />
      <Circle cx="27" cy="29" r="8" fill={center} />
    </G>
  );
}

export function GardenPreview({ plants, showStarterPot = false }: { plants: Plant[]; showStarterPot?: boolean }) {
  const flowers = plants.flatMap((plant) => Array.from({ length: plant.quantity }).map((_, index) => ({ plant, index })));

  return (
    <View style={styles.card}>
      <Svg width="100%" height={286} viewBox="0 0 360 286">
        <Circle cx="70" cy="58" r="42" fill="#FFF4CB" opacity="0.8" />
        <Circle cx="306" cy="55" r="20" fill="#D9F3E8" />
        <Path d="M37 197 C50 162 80 135 128 122 C184 107 269 109 318 145 C359 175 342 224 288 242 C212 270 92 254 49 226 C34 216 31 207 37 197Z" fill="#5DCAA5" opacity="0.42" />
        <Path d="M28 185 C54 118 143 91 245 106 C313 116 355 158 337 203 C319 249 231 266 132 249 C59 237 10 224 28 185Z" fill="#8AD7A9" />
        <Path d="M43 196 C78 166 119 160 169 173 C213 185 253 184 314 160 C327 173 332 189 326 203 C308 242 225 254 136 239 C81 230 45 217 43 196Z" fill="#74C98F" />
        <Path d="M104 218 C126 189 170 184 203 198 C223 207 245 207 271 197" stroke="#C9975D" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.55" />
        {[58, 88, 279, 300, 147, 228].map((x, index) => (
          <Circle key={x} cx={x} cy={index % 2 ? 192 : 211} r={index % 2 ? 5 : 4} fill="#E8E0CF" />
        ))}
        {showStarterPot || flowers.length === 0 ? (
          <Svg x="138" y="116" width="86" height="92" viewBox="0 0 86 92">
            <Rect x="23" y="42" width="40" height="38" rx="10" fill={colors.softOrange} />
            <Rect x="16" y="35" width="54" height="18" rx="9" fill="#C97935" />
            <Path d="M31 38 C36 24 50 24 55 38" stroke={colors.deepGreen} strokeWidth="5" strokeLinecap="round" fill="none" />
            <SvgText x="43" y="88" fill={colors.darkText} fontSize="10" fontWeight="700" textAnchor="middle">Starter pot</SvgText>
          </Svg>
        ) : null}
        {flowers.slice(0, 10).map(({ plant }, index) => {
          const [x, y] = positions[index % positions.length];
          return <Flower key={`${plant.id}_${index}`} x={x} y={y} color={petalColors[plant.flowerName] ?? colors.white} index={index} />;
        })}
      </Svg>
      <View style={styles.footer}>
        <Text style={styles.caption}>Your garden grows through lessons, reflection, and consistency.</Text>
        <Text style={styles.meta}>{flowers.length || 1} flowers visible · {plants.filter((plant) => plant.unlocked).length} categories unlocked</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EAF7E7",
    borderRadius: 32,
    overflow: "hidden",
    ...shadow
  },
  footer: {
    gap: 4,
    padding: 18,
    paddingTop: 0
  },
  caption: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center"
  },
  meta: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  }
});
