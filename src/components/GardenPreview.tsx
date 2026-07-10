import { LinearGradient as ScreenGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/AppText";
import { FlowerIcon } from "@/components/FlowerIcon";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Stop
} from "react-native-svg";

// Vertical sky gradient shared by the card background so it flows seamlessly
// from the illustration down into the footer.
const SKY_GRADIENT = ["#DCEEFF", "#EFFAF0"] as const;
import { colors, shadow } from "@/theme/colors";
import { Plant, PlantCategory } from "@/types/domain";

// What each flower means and which learning module teaches it. Categories
// without their own module fall back to the Learn tab.
const categoryInfo: Record<PlantCategory, { label: string; meaning: string; moduleId: string | null }> = {
  budgeting: {
    label: "Budgeting Basics",
    meaning: "Grows when you budget, track spending, and compare expected vs. actual.",
    moduleId: "module_budgeting"
  },
  savings: {
    label: "Savings & Emergency Fund",
    meaning: "Grows as you learn about saving goals and building an emergency fund.",
    moduleId: "module_savings"
  },
  credit_debt: {
    label: "Credit & Debt",
    meaning: "Grows with lessons on credit cards, credit scores, APR, and paying down debt.",
    moduleId: "module_credit"
  },
  retirement: {
    label: "Retirement Accounts",
    meaning: "Grows as you learn about Roth IRAs, 401(k)s, and employer matches.",
    moduleId: "module_retirement"
  },
  career_taxes: {
    label: "Career Money & Taxes",
    meaning: "Grows with lessons on paychecks, taxes, benefits, and take-home pay.",
    moduleId: null
  },
  cash: {
    label: "Cash & Savings Accounts",
    meaning: "The safest rung of the risk / return ladder: lowest risk, lowest growth.",
    moduleId: "module_investing"
  },
  bonds: {
    label: "Bonds",
    meaning: "Low-to-moderate risk investments that grow a bit faster than savings.",
    moduleId: "module_investing"
  },
  funds: {
    label: "Index & Mutual Funds",
    meaning: "Diversified, medium-risk investments - the balanced middle of the ladder.",
    moduleId: "module_investing"
  },
  stocks: {
    label: "Individual Stocks",
    meaning: "The boldest rung: highest risk with the highest potential return.",
    moduleId: "module_investing"
  }
};

const AnimatedG = Animated.createAnimatedComponent(G);

const petalColors: Record<string, string> = {
  Daisy: "#FFFFFF",
  Marigold: colors.softOrange,
  Rose: "#F48AA8",
  Orchid: colors.orchidPurple,
  "Blue Iris": colors.skyBlue,
  "White Lily": "#FDFBF4",
  Bluebell: colors.skyBlue,
  "Purple Tulip": "#B08AE0",
  "Red Poppy": "#E84E43"
};

// Flowers that read best as a tulip cup rather than a round daisy.
const tulipFlowers = new Set(["Purple Tulip", "Orchid", "Red Poppy"]);

const MAX_FLOWERS = 14;

type Slot = { x: number; y: number; scale: number };

// Lay flowers out to fill the current soil bed. Flowers keep a constant size,
// it's the garden (soil + green) that grows with the flower count, so early
// gardens are small and clustered while mature ones spread across a wide bed.
function buildSlots(count: number, cx: number, soilCy: number, soilRx: number, soilRy: number): Slot[] {
  if (count <= 0) return [];
  const half = Math.max(0, soilRx - 22);
  const backY = soilCy - soilRy * 0.18;
  const frontY = soilCy + soilRy * 0.42;

  const spread = (n: number, y: number, scale: number, widthFactor: number): Slot[] => {
    const w = half * widthFactor;
    return Array.from({ length: n }, (_, i) => ({
      x: n === 1 ? cx : cx - w + (2 * w * i) / (n - 1),
      y,
      scale
    }));
  };

  if (count <= 3) return spread(count, frontY, 1.2, 0.72);
  const backN = Math.floor(count / 2);
  const frontN = count - backN;
  // Back row drawn first so the larger front row overlaps in front of it.
  return [...spread(backN, backY, 0.92, 0.82), ...spread(frontN, frontY, 1.2, 1)];
}

function Face({ cy }: { cy: number }) {
  return (
    <G>
      <Circle cx={-3.1} cy={cy - 0.5} r={1.5} fill="#3A2A1A" />
      <Circle cx={3.1} cy={cy - 0.5} r={1.5} fill="#3A2A1A" />
      <Path
        d={`M-3.4 ${cy + 2.4} Q0 ${cy + 5.2} 3.4 ${cy + 2.4}`}
        stroke="#3A2A1A"
        strokeWidth={1.3}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={-6.2} cy={cy + 2.6} r={1.7} fill="#F49AA6" opacity={0.55} />
      <Circle cx={6.2} cy={cy + 2.6} r={1.7} fill="#F49AA6" opacity={0.55} />
    </G>
  );
}

// Flower drawn in local coordinates with the base of the stem at (0, 0) and the
// bloom lifted well above it. The parent group handles placement, scale and sway.
function Flower({ color, tulip }: { color: string; tulip: boolean }) {
  const stemTop = tulip ? -70 : -60;
  return (
    <G>
      <Line x1={0} y1={0} x2={0} y2={stemTop} stroke={colors.deepGreen} strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M0 -34 C-9 -40 -16 -37 -18 -28 C-9 -24 -3 -26 0 -34Z" fill={colors.mintGreen} />
      <Path d="M0 -44 C9 -50 16 -47 18 -38 C9 -34 3 -36 0 -44Z" fill="#7CD8B8" />
      {tulip ? (
        <G>
          <Path
            d="M-14 -74 C-14 -92 -6 -100 0 -100 C6 -100 14 -92 14 -74 C8 -69 4 -68 0 -68 C-4 -68 -8 -69 -14 -74Z"
            fill={color}
          />
          <Path d="M-6.5 -98 C-9 -88 -9 -78 -6 -71" stroke="#00000018" strokeWidth={1.6} fill="none" />
          <Path d="M6.5 -98 C9 -88 9 -78 6 -71" stroke="#00000018" strokeWidth={1.6} fill="none" />
          <Path d="M0 -100 L0 -72" stroke="#00000012" strokeWidth={1.6} fill="none" />
          <Face cy={-82} />
        </G>
      ) : (
        <G>
          {Array.from({ length: 9 }).map((_, i) => (
            <Ellipse
              key={i}
              cx={0}
              cy={-87}
              rx={5.6}
              ry={11}
              fill={color}
              transform={`rotate(${(360 / 9) * i} 0 -74)`}
            />
          ))}
          <Circle cx={0} cy={-74} r={9.5} fill="#FFC53D" />
          <Circle cx={0} cy={-74} r={9.5} fill="none" stroke="#F0A92E" strokeWidth={1.4} />
          <Face cy={-74} />
        </G>
      )}
    </G>
  );
}

function Bee({ x, y }: { x: number; y: number }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <Path d="M-11 -6 Q-6 -11 0 -8" stroke="#C9A24B" strokeWidth={1} strokeDasharray="2 3" fill="none" opacity={0.6} />
      <Ellipse cx={-2} cy={-4} rx={4} ry={2.8} fill="#EAF6FF" opacity={0.85} />
      <Ellipse cx={2.4} cy={-4} rx={4} ry={2.8} fill="#EAF6FF" opacity={0.85} />
      <Ellipse cx={0} cy={0} rx={6.2} ry={4.4} fill="#FFCE47" />
      <Path d="M-2.4 -4.1 L-2.4 4.1" stroke="#3A2A1A" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M1.4 -4.3 L1.4 4.3" stroke="#3A2A1A" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={5.4} cy={-1} r={1} fill="#3A2A1A" />
    </G>
  );
}

export function GardenPreview({ plants, ownGarden = true }: { plants: Plant[]; ownGarden?: boolean }) {
  const [selected, setSelected] = useState<Plant | null>(null);
  const flowers = plants.flatMap((plant) =>
    Array.from({ length: plant.quantity }).map((_, index) => ({ plant, index }))
  );
  const shown = flowers.slice(0, MAX_FLOWERS);
  const count = shown.length;
  const isEmpty = count === 0;
  const unlockedCount = plants.filter((plant) => plant.unlocked).length;

  // The garden grows with the flowers you collect: an empty clearing starts as a
  // small soil patch and the bed widens toward its full size around 10 flowers.
  const t = Math.min(1, count / 10);
  const cx = 180;
  const greenCy = 206;
  const soilCy = 210;
  const soilRx = 40 + t * 84;
  const soilRy = 18 + t * 18;
  const greenRx = soilRx + 40;
  const greenRy = soilRy + 26;

  const slots = buildSlots(count, cx, soilCy, soilRx, soilRy);

  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(sway, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [sway]);

  const swayA = sway.interpolate({ inputRange: [0, 1], outputRange: [-2.6, 2.6] });
  const swayB = sway.interpolate({ inputRange: [0, 1], outputRange: [2.6, -2.6] });

  return (
    <ScreenGradient colors={SKY_GRADIENT} style={styles.card}>
      <Svg width="100%" height={400} viewBox="0 0 360 300">
        <Defs>
          <LinearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#B9814E" />
            <Stop offset="1" stopColor="#8C5A30" />
          </LinearGradient>
        </Defs>

        {/* Sun with rays, top-left */}
        <G>
          {Array.from({ length: 10 }).map((_, i) => (
            <Line
              key={i}
              x1={44}
              y1={44}
              x2={44}
              y2={12}
              stroke="#FFDE87"
              strokeWidth={3.4}
              strokeLinecap="round"
              opacity={0.75}
              transform={`rotate(${(360 / 10) * i} 44 44)`}
            />
          ))}
          <Circle cx={44} cy={44} r={20} fill="#FFE08A" />
          <Circle cx={44} cy={44} r={14} fill="#FFD75E" />
        </G>

        {/* Cloud, top-right */}
        <G opacity={0.92}>
          <Ellipse cx={296} cy={52} rx={20} ry={13} fill="#FFFFFF" />
          <Ellipse cx={315} cy={54} rx={15} ry={11} fill="#FFFFFF" />
          <Ellipse cx={280} cy={56} rx={14} ry={10} fill="#FFFFFF" />
        </G>

        {/* Garden bed: a floating green oval that grows with the garden */}
        <Ellipse cx={cx} cy={greenCy} rx={greenRx + 8} ry={greenRy + 4} fill="#5DCAA5" opacity={0.35} />
        <Ellipse cx={cx} cy={greenCy} rx={greenRx} ry={greenRy} fill="#8AD7A9" />
        <Ellipse cx={cx} cy={greenCy - 4} rx={greenRx * 0.84} ry={greenRy * 0.82} fill="#74C98F" />

        {/* Tilled soil bed: centered within the green oval */}
        <Ellipse cx={cx} cy={soilCy} rx={soilRx} ry={soilRy} fill="url(#soil)" />
        <Ellipse cx={cx} cy={soilCy - 3} rx={soilRx * 0.9} ry={soilRy * 0.8} fill="#A56B3C" opacity={0.55} />
        {[-0.58, -0.2, 0.2, 0.58].map((f, i) => {
          const rx = cx + f * soilRx;
          const ry = soilCy + (i % 2 ? 2 : -1);
          return (
            <Path
              key={f}
              d={`M${rx - 14} ${ry} Q${rx} ${ry + 4} ${rx + 14} ${ry}`}
              stroke="#7A4E29"
              strokeWidth={1.4}
              fill="none"
              opacity={0.5}
            />
          );
        })}

        {isEmpty ? (
          // Empty clearing: seeds resting in fresh soil, waiting to be grown.
          <G>
            {[-0.42, -0.12, 0.2, 0.46].map((f, i) => {
              const sx = cx + f * soilRx;
              const sy = soilCy + (i % 2 ? 3 : -1);
              return <Ellipse key={f} cx={sx} cy={sy} rx={3} ry={2.1} fill="#5B3A20" transform={`rotate(20 ${sx} ${sy})`} />;
            })}
            {/* a single tiny sprout hinting at what's to come */}
            <G transform={`translate(${cx} ${soilCy})`}>
              <Line x1={0} y1={0} x2={0} y2={-12} stroke={colors.deepGreen} strokeWidth={2.4} strokeLinecap="round" />
              <Path d="M0 -8 C-5 -12 -9 -10 -9 -5 C-4 -4 -1 -5 0 -8Z" fill={colors.mintGreen} />
              <Path d="M0 -11 C5 -15 9 -13 9 -8 C4 -7 1 -8 0 -11Z" fill="#7CD8B8" />
            </G>
          </G>
        ) : (
          slots.map((pos, index) => {
            const plant = shown[index].plant;
            const color = petalColors[plant.flowerName] ?? "#FFFFFF";
            // Position + scale live on a static outer <G> (string transforms
            // render reliably), while only the sway rotation lives on the
            // animated inner <G>. Combining a static translate/scale with an
            // animated rotation on a single node drops the translate and
            // collapses every flower into the top-left corner.
            return (
              <G
                key={`${plant.id}_${shown[index].index}_${index}`}
                transform={`translate(${pos.x} ${pos.y}) scale(${pos.scale})`}
                onPress={() => setSelected(plant)}
              >
                <AnimatedG originX={0} originY={0} rotation={index % 2 === 0 ? swayA : swayB}>
                  <Flower color={color} tulip={tulipFlowers.has(plant.flowerName)} />
                  {/* Invisible disc over the bloom so taps register reliably. */}
                  <Circle cx={0} cy={-80} r={28} fill="#FFFFFF" fillOpacity={0.01} />
                </AnimatedG>
              </G>
            );
          })
        )}

        {/* Bees drifting over the garden */}
        <Bee x={150} y={64} />
        <Bee x={252} y={92} />
        <Bee x={96} y={110} />
      </Svg>
      <View style={styles.footer}>
        {isEmpty ? (
          <>
            <Text style={styles.caption}>Your clearing is ready.</Text>
            <Text style={styles.meta}>Complete a lesson or quiz to plant your first flower.</Text>
          </>
        ) : (
          <>
            <Text style={styles.caption}>Your garden grows through lessons, reflection, and consistency.</Text>
            <Text style={styles.meta}>
              {flowers.length} {flowers.length === 1 ? "flower" : "flowers"} grown · {unlockedCount} categories unlocked · tap a flower to learn about it
            </Text>
          </>
        )}
      </View>

      <Modal transparent animationType="fade" visible={selected !== null} onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.popupBackdrop} onPress={() => setSelected(null)}>
          {selected ? (
            <Pressable style={styles.popupCard} onPress={() => {}}>
              <View style={styles.popupFlower}>
                <FlowerIcon name={selected.flowerName} size={64} />
              </View>
              <Text style={styles.popupName}>{selected.flowerName}</Text>
              <Text style={styles.popupCategory}>{categoryInfo[selected.type]?.label ?? "Financial Garden"}</Text>
              <Text style={styles.popupMeaning}>{categoryInfo[selected.type]?.meaning ?? ""}</Text>
              <Text style={styles.popupCount}>
                {ownGarden
                  ? `You've grown ${selected.quantity} of these · ${selected.growth}% to the next stage`
                  : `They've grown ${selected.quantity} of these flowers`}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.popupButton}
                onPress={() => {
                  const moduleId = categoryInfo[selected.type]?.moduleId;
                  setSelected(null);
                  router.push(moduleId ? `/module/${moduleId}` : "/(tabs)/learn");
                }}
              >
                <Text style={styles.popupButtonText}>
                  {categoryInfo[selected.type]?.moduleId ? "Go to its lessons" : "Explore lessons"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.popupClose} onPress={() => setSelected(null)}>
                <Text style={styles.popupCloseText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#DCEEFF",
    borderRadius: 32,
    overflow: "hidden",
    ...shadow
  },
  footer: {
    gap: 4,
    padding: 18,
    paddingTop: 12
  },
  caption: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginTop: -40,
  },
  meta: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  },
  popupBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(15, 61, 48, 0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 28
  },
  popupCard: {
    alignItems: "center",
    backgroundColor: colors.cream,
    borderRadius: 30,
    gap: 6,
    padding: 26,
    width: "100%",
    ...shadow
  },
  popupFlower: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 26,
    height: 92,
    justifyContent: "center",
    marginBottom: 6,
    width: 92
  },
  popupName: {
    color: colors.darkText,
    fontSize: 24,
    fontWeight: "900"
  },
  popupCategory: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  popupMeaning: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    marginTop: 4,
    textAlign: "center"
  },
  popupCount: {
    color: colors.darkText,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
    textAlign: "center"
  },
  popupButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.deepGreen,
    borderRadius: 18,
    marginTop: 12,
    padding: 15
  },
  popupButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  },
  popupClose: {
    marginTop: 2,
    padding: 8
  },
  popupCloseText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "800"
  }
});
