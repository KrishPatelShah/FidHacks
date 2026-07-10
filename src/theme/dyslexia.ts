import { StyleSheet, Text, TextInput } from "react-native";

export const DYSLEXIC_FONT = "OpenDyslexic";
export const DYSLEXIC_FONT_BOLD = "OpenDyslexic-Bold";

// Custom fonts don't respond to fontWeight, so pick the matching face manually.
const BOLD_WEIGHTS = new Set(["bold", "600", "700", "800", "900", 600, 700, 800, 900]);

function fontForStyle(style: unknown): string {
  const flat = (StyleSheet.flatten(style as never) ?? {}) as { fontWeight?: string | number };
  return BOLD_WEIGHTS.has(flat.fontWeight as never) ? DYSLEXIC_FONT_BOLD : DYSLEXIC_FONT;
}

// Module-level flag read by the patched render functions below. It's set during
// render by GardenThemeProvider (before children render) so every Text/TextInput
// picks up the dyslexia font in the same commit that toggles it.
let enabled = false;

export function setDyslexiaEnabled(value: boolean) {
  enabled = value;
}

// Patch a react-native text host component so its rendered element gets the
// OpenDyslexic font appended (winning over any existing fontFamily) when the
// dyslexia flag is on. Applied once per component at import time.
function patch(Component: unknown) {
  const target = Component as { render?: ((props: unknown, ref: unknown) => any) & { __dyslexiaPatched?: boolean } };
  const original = target.render;
  if (!original || original.__dyslexiaPatched) return;

  const patched = function (props: unknown, ref: unknown) {
    const element = original(props, ref);
    if (!enabled || !element) return element;
    return {
      ...element,
      props: {
        ...element.props,
        style: [element.props.style, { fontFamily: fontForStyle(element.props.style) }]
      }
    };
  };
  patched.__dyslexiaPatched = true;
  target.render = patched;
}

patch(Text);
patch(TextInput);
