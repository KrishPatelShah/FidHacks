import Svg, { Circle, Line, Path } from "react-native-svg";

export function SunflowerCompanion({ size = 72 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Line x1="60" y1="58" x2="60" y2="104" stroke="#3c7a3f" strokeWidth="8" strokeLinecap="round" />
      <Path d="M35 91 C46 79 56 83 60 99 C48 101 39 99 35 91Z" fill="#4f9954" />
      <Path d="M85 91 C74 79 64 83 60 99 C72 101 81 99 85 91Z" fill="#4f9954" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * Math.PI * 2) / 12;
        const x = 60 + Math.cos(angle) * 30;
        const y = 42 + Math.sin(angle) * 30;
        return <Circle key={index} cx={x} cy={y} r="12" fill="#f5c542" />;
      })}
      <Circle cx="60" cy="42" r="22" fill="#7b4e20" />
      <Circle cx="53" cy="38" r="3" fill="#23180b" />
      <Circle cx="67" cy="38" r="3" fill="#23180b" />
      <Path d="M52 49 C57 55 63 55 68 49" stroke="#23180b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <Path d="M36 106 H84 L78 120 H42 Z" fill="#c96f33" />
    </Svg>
  );
}
