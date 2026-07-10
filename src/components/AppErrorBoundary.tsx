import { Component, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

type Props = { children: ReactNode };
type State = { error: Error | null };

// Catches render errors anywhere below it and shows a recoverable message
// instead of a blank white screen, so a single screen crash can't take down
// the whole app.
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{error.message}</Text>
        <Pressable onPress={this.reset} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    flexGrow: 1,
    gap: 16,
    justifyContent: "center",
    padding: 28
  },
  title: {
    color: colors.darkText,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center"
  },
  message: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 18,
    padding: 16
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  }
});
