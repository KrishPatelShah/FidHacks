import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { Plant } from "@/types/domain";

const colors: Record<string, string> = {
  Daisy: "#ffffff",
  Marigold: "#f2a43a",
  Rose: "#d94862",
  Orchid: "#9d72c7",
  "Blue Iris": "#4f86c6",
  "White Lily": "#f6f1e7",
  Bluebell: "#5478c8",
  "Purple Tulip": "#8d5ab8",
  "Red Poppy": "#d83b32"
};

export function GardenPreview({ plants }: { plants: Plant[] }) {
  const flowers = plants.flatMap((plant) => Array.from({ length: plant.quantity }).map((_, index) => ({ plant, index })));

  return (
    <View style={styles.card}>
      <Svg width="100%" height={220} viewBox="0 0 340 220">
        <Path d="M0 184 C60 160 115 204 176 180 C230 159 281 163 340 184 L340 220 L0 220 Z" fill="#8cb369" />
        {flowers.map(({ plant }, index) => {
          const x = 38 + ((index * 49) % 265);
          const y = 158 - ((index * 17) % 48);
          const petal = colors[plant.flowerName] ?? "#ffffff";
          return (
            <Svg key={`${plant.id}_${index}`} x={x - 18} y={y - 50} width={48} height={70} viewBox="0 0 48 70">
              <Line x1="24" y1="30" x2="24" y2="66" stroke="#3c7a3f" strokeWidth="5" strokeLinecap="round" />
              <Circle cx="14" cy="22" r="10" fill={petal} />
              <Circle cx="34" cy="22" r="10" fill={petal} />
              <Circle cx="24" cy="12" r="10" fill={petal} />
              <Circle cx="24" cy="31" r="10" fill={petal} />
              <Circle cx="24" cy="23" r="9" fill="#e7b73f" />
            </Svg>
          );
        })}
      </Svg>
      <Text style={styles.caption}>Flowers increase in number and variety, not height.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d9edc2",
    borderRadius: 28,
    overflow: "hidden"
  },
  caption: {
    color: "#456140",
    fontSize: 13,
    fontWeight: "800",
    padding: 14,
    paddingTop: 0,
    textAlign: "center"
  }
});
