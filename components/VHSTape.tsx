import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface VHSTapeProps {
  movie: {
    id: string;
    title: string;
    year: string;
    genre: string;
    color: string;
  };
  mysteryMode: boolean;
  large?: boolean;
}

export function VHSTape({ movie, mysteryMode, large = false }: VHSTapeProps) {
  const scale = large ? 1.2 : 1;
  const width = 100 * scale;
  const height = 170 * scale;

  return (
    <View style={[styles.container, { width, height }]}>
      <LinearGradient
        colors={mysteryMode ? ["#2a2a2a", "#1a1a1a"] : [movie.color, "#1a1a1a"]}
        style={styles.tape}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Top label area */}
        <View style={styles.topLabel}>
          <View style={styles.labelStripe} />
        </View>

        {/* Main label */}
        <View style={styles.mainLabel}>
          {!mysteryMode ? (
            <>
              <Text 
                style={[styles.title, large && styles.titleLarge]} 
                numberOfLines={3}
              >
                {movie.title}
              </Text>
              <Text style={[styles.year, large && styles.yearLarge]}>{movie.year}</Text>
              <View style={styles.genreTag}>
                <Text style={[styles.genre, large && styles.genreLarge]}>{movie.genre}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.mysteryText}>?</Text>
          )}
        </View>

        {/* Bottom details */}
        <View style={styles.bottomSection}>
          <View style={styles.reelWindow}>
            <View style={styles.reel} />
            <View style={styles.reel} />
          </View>
        </View>

        {/* Side ridges */}
        <View style={styles.leftRidge} />
        <View style={styles.rightRidge} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  tape: {
    flex: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
  },
  topLabel: {
    height: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    marginBottom: 4,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  labelStripe: {
    height: 2,
    backgroundColor: "#ff0000",
    borderRadius: 1,
  },
  mainLabel: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 3,
    padding: 6,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 2,
    width: "100%",
  },
  titleLarge: {
    fontSize: 13,
  },
  year: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  yearLarge: {
    fontSize: 12,
  },
  genreTag: {
    backgroundColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  genre: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "600",
  },
  genreLarge: {
    fontSize: 10,
  },
  mysteryText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#666",
  },
  bottomSection: {
    height: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  reelWindow: {
    flexDirection: "row",
    gap: 10,
  },
  reel: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#222",
    borderWidth: 2,
    borderColor: "#444",
  },
  leftRidge: {
    position: "absolute",
    left: 0,
    top: "20%",
    bottom: "20%",
    width: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  rightRidge: {
    position: "absolute",
    right: 0,
    top: "20%",
    bottom: "20%",
    width: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});