import { createElement, useState } from "react";
import { LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { shadow } from "@/theme/colors";

// Pull the 11-char video id out of any common YouTube URL shape
// (youtu.be/ID, watch?v=ID, /embed/ID, /shorts/ID).
function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

type VideoEmbedProps = {
  url: string;
};

export function VideoEmbed({ url }: VideoEmbedProps) {
  const videoId = getYouTubeId(url);
  const [width, setWidth] = useState(0);

  if (!videoId) return null;

  if (Platform.OS === "web") {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
    return (
      <View style={styles.webFrame}>
        {createElement("iframe", {
          src: embedUrl,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          style: { width: "100%", height: "100%", border: "0" }
        })}
      </View>
    );
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next && next !== width) setWidth(next);
  };

  return (
    <View onLayout={onLayout} style={styles.nativeFrame}>
      {width > 0 ? (
        <YoutubePlayer
          height={Math.round((width * 9) / 16)}
          initialPlayerParams={{ controls: true }}
          videoId={videoId}
          width={width}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  webFrame: {
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 22,
    overflow: "hidden",
    width: "100%",
    ...shadow
  },
  nativeFrame: {
    backgroundColor: "#000",
    borderRadius: 22,
    overflow: "hidden",
    width: "100%",
    ...shadow
  }
});
