import { StyleSheet, Text, TextInput } from "react-native";

export const DYSLEXIC_FONT = "OpenDyslexic";
export const DYSLEXIC_FONT_BOLD = "OpenDyslexic-Bold";

// Custom fonts don't respond to fontWeight, so pick the matching face manually.
const BOLD_WEIGHTS = new Set(["bold", "600", "700", "800", "900", 600, 700, 800, 900]);

function fontForWeight(fontWeight: unknown): string {
  return BOLD_WEIGHTS.has(fontWeight as never) ? DYSLEXIC_FONT_BOLD : DYSLEXIC_FONT;
}

// Module-level flag read by the patched render below. GardenThemeProvider sets it
// during render (ancestors render before descendants) so every Text picks up the
// dyslexia font in the same commit that toggles it — no navigator remount.
let enabled = false;

export function setDyslexiaEnabled(value: boolean) {
  enabled = value;
}

// Patch react-native's Text/TextInput so the dyslexia font is appended to the
// INPUT style before the component renders. Appending to input props (not the
// rendered output) lets each platform flatten the style itself — a style array on
// native, a resolved CSS object on react-native-web — so it works on web without
// touching the DOM element's CSSStyleDeclaration.
function patch(Component: unknown) {
  const target = Component as {
    render?: ((props: unknown, ref: unknown) => unknown) & { __dyslexiaPatched?: boolean };
  };
  const original = target.render;
  if (!original || original.__dyslexiaPatched) return;

  const patched = function (props: unknown, ref: unknown) {
    if (!enabled || !props || typeof props !== "object") return original(props, ref);
    try {
      const p = props as { style?: unknown };
      const flat = (StyleSheet.flatten(p.style as never) ?? {}) as { fontWeight?: string | number };
      // Put the dyslexia font FIRST so a component's own fontFamily (e.g. an icon
      // font like Ionicons) still wins and its glyphs render correctly. Text with
      // no fontFamily of its own falls back to OpenDyslexic.
      const nextProps = { ...p, style: [{ fontFamily: fontForWeight(flat.fontWeight) }, p.style] };
      return original(nextProps, ref);
    } catch {
      return original(props, ref);
    }
  };
  patched.__dyslexiaPatched = true;
  target.render = patched;
}

patch(Text);
patch(TextInput);
