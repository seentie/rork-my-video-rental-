import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Star, Clock, Calendar, Plus, CheckCircle } from "lucide-react-native";
import { router } from "expo-router";
import { useStore } from "@/hooks/store-context";
import { VHSTape } from "@/components/VHSTape";
import { snacks } from "@/data/snacks";
import * as Haptics from "expo-haptics";



const getSnackByName = (name: string) => snacks.find(s => s.name === name);

export default function MovieResult() {
  const { selectedMovie, selectedSnacks, addWatchedMovie } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [watchedWith, setWatchedWith] = useState("");
  const [added, setAdded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAddToLog = () => {
    if (!selectedMovie) return;
    
    if (showAddForm) {
      const finalWith = watchedWith.trim() || "Solo";
      addWatchedMovie({
        movieName: selectedMovie.title,
        watchedDate: new Date().toLocaleDateString(),
        watchedWith: finalWith,
      });
      
      setAdded(true);
      setShowAddForm(false);
      setWatchedWith("");
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setTimeout(() => setAdded(false), 3000);
    } else {
      setShowAddForm(true);
    }
  };

  if (!selectedMovie) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#0f0f1e"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color="#FFD700" size={28} />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Text style={styles.title}>TONIGHT'S SELECTION</Text>
            
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{selectedMovie.title}</Text>
              
              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Calendar color="#FFD700" size={16} />
                  <Text style={styles.detailText}>{selectedMovie.year}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock color="#FFD700" size={16} />
                  <Text style={styles.detailText}>{selectedMovie.runtime}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Star color="#FFD700" size={16} />
                  <Text style={styles.detailText}>{selectedMovie.rating}/10</Text>
                </View>
              </View>

              <Text style={styles.genre}>{selectedMovie.genre}</Text>
              
              <Text style={styles.description}>{selectedMovie.description}</Text>
            </View>

            {/* Movie and Snacks Layout */}
            <View style={styles.movieSnacksContainer}>
              {/* Large Movie Tape */}
              <View style={styles.largeTapeContainer}>
                <VHSTape movie={selectedMovie} mysteryMode={false} large />
              </View>

              {/* Snacks Pile */}
              {selectedSnacks.length > 0 && (
                <View style={styles.snacksPile}>
                  <Text style={styles.snacksTitle}>YOUR SNACKS</Text>
                  <View style={styles.snacksGrid}>
                    {selectedSnacks.map((snackName, index) => {
                      const snack = getSnackByName(snackName);
                      if (!snack) return null;
                      
                      return (
                        <View 
                          key={`${snack.id}-${index}`} 
                          style={[
                            styles.snackPileItem,
                            {
                              transform: [
                                { rotate: `${(Math.random() - 0.5) * 20}deg` },
                                { translateX: (Math.random() - 0.5) * 10 },
                                { translateY: (Math.random() - 0.5) * 10 }
                              ]
                            }
                          ]}
                        >
                          <Text style={styles.snackPileIcon}>{snack.icon}</Text>
                          <Text style={styles.snackPileName}>{snack.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.finalSection}>
              {!added ? (
                <>
                  {showAddForm && (
                    <View style={styles.addForm}>
                      <Text style={styles.addFormLabel}>Watched with:</Text>
                      <TextInput
                        style={styles.addFormInput}
                        value={watchedWith}
                        onChangeText={setWatchedWith}
                        placeholder="Family, Friends, Solo..."
                        placeholderTextColor="#888"
                      />
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.addToLogButton, showAddForm && styles.addToLogButtonActive]} 
                    onPress={handleAddToLog}
                  >
                    <Plus color="#005DAA" size={20} />
                    <Text style={styles.addToLogButtonText}>
                      {showAddForm ? "Save to Watched Log" : "Add to Watched Log"}
                    </Text>
                  </TouchableOpacity>
                  
                  {showAddForm && (
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={() => {
                        setShowAddForm(false);
                        setWatchedWith("");
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.addedConfirmation}>
                  <CheckCircle color="#00FF00" size={24} />
                  <Text style={styles.addedText}>Added to Watched Log!</Text>
                </View>
              )}

              <TouchableOpacity style={styles.watchButton} onPress={handleClose}>
                <Text style={styles.watchButtonText}>ENJOY YOUR MOVIE!</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 10,
    backgroundColor: "#005DAA",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 3,
    marginBottom: 30,
    textShadowColor: "#005DAA",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  movieSnacksContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 30,
    paddingHorizontal: 20,
    gap: 30,
  },
  largeTapeContainer: {
    transform: [{ scale: 1.4 }],
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  snacksPile: {
    alignItems: "center",
    maxWidth: 120,
  },
  snacksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
  },
  snackPileItem: {
    backgroundColor: "#2a2a3e",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    minWidth: 50,
    borderWidth: 1,
    borderColor: "#FFD700",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  snackPileIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  snackPileName: {
    color: "#FFD700",
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  finalSection: {
    alignItems: "center",
    width: "100%",
  },
  movieInfo: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  details: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  genre: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#005DAA",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 20,
  },
  description: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  snacksTitle: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 5,
  },
  watchButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    marginTop: 20,
  },
  watchButtonText: {
    color: "#005DAA",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  addToLogButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToLogButtonActive: {
    backgroundColor: "#00FF88",
  },
  addToLogButtonText: {
    color: "#005DAA",
    fontSize: 16,
    fontWeight: "bold",
  },
  addForm: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 16,
    backgroundColor: "#2a2a3e",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  addFormLabel: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  addFormInput: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 10,
    marginBottom: 12,
  },
  cancelButtonText: {
    color: "#FFD700",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  addedConfirmation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#2a2a3e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#00FF00",
  },
  addedText: {
    color: "#00FF00",
    fontSize: 16,
    fontWeight: "bold",
  },
});