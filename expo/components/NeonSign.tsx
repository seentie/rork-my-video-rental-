import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface NeonSignProps {
  text: string;
}

export function NeonSign({ text }: NeonSignProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 20],
  });

  return (
    <View style={styles.container}>
      <View style={styles.signBoard}>
        <Animated.Text
          style={[
            styles.neonText,
            {
              textShadowRadius: shadowRadius,
            },
          ]}
        >
          {text}
        </Animated.Text>
        <View style={styles.signFrame} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  signBoard: {
    backgroundColor: "#0a0a0a",
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#333",
  },
  neonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff00ff",
    textAlign: "center",
    textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 3,
  },
  signFrame: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
  },
});