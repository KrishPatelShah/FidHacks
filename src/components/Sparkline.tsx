import Svg, { Path, Polyline } from "react-native-svg";
import { colors } from "@/theme/colors";

type Props = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
};

export function Sparkline({ data, width = 96, height = 36, color = colors.deepGreen }: Props) {
  if (data.length < 2) {
    return <Svg width={width} height={height} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / span) * (height - 4) - 2;
    return { x, y };
  });

  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `M0,${height} L${line.replace(/ /g, " L")} L${width},${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Path d={area} fill={color} opacity={0.12} />
      <Polyline points={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
