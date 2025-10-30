import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Plus, Trash2, Calendar, Users, Film } from "lucide-react-native";
import { router } from "expo-router";
import { useStore } from "@/hooks/store-context";
import * as Haptics from "expo-haptics";

export default function WatchedLog() {
  const { watchedMovies, addWatchedMovie, deleteWatchedMovie, clearWatchedMovies } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [watchedDate, setWatchedDate] = useState("");
  const [watchedWith, setWatchedWith] = useState("");

  const handleAddMovie = () => {
    if (!movieName.trim()) {
      Alert.alert("Missing Info", "Please enter a movie name.");
      return;
    }

    const finalDate = watchedDate.trim() || new Date().toLocaleDateString();
    const finalWith = watchedWith.trim() || "Solo";

    addWatchedMovie({
      movieName: movieName.trim(),
      watchedDate: finalDate,
      watchedWith: finalWith,
    });

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setMovieName("");
    setWatchedDate("");
    setWatchedWith("");
    setShowAddModal(false);
  };

  const handleDeleteMovie = (id: string, name: string) => {
    Alert.alert(
      "Delete Entry",
      `Remove "${name}" from your watched log?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWatchedMovie(id);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Entries",
      "This will delete all movies from your watched log. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearWatchedMovies();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#0f0f1e"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>We Watched</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color="#FFD700" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Film color="#FFD700" size={20} />
            <Text style={styles.statText}>{watchedMovies.length} / 365</Text>
          </View>
          {watchedMovies.length > 0 && (
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAll}
            >
              <Trash2 color="#FF4444" size={16} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {watchedMovies.length === 0 ? (
            <View style={styles.emptyState}>
              <Film color="#FFD700" size={64} />
              <Text style={styles.emptyTitle}>No Movies Yet</Text>
              <Text style={styles.emptyText}>
                Start logging the movies you watch! Track up to 365 entries.
              </Text>
            </View>
          ) : (
            watchedMovies.map((movie) => (
              <View key={movie.id} style={styles.movieCard}>
                <View style={styles.movieCardHeader}>
                  <Film color="#FFD700" size={20} />
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.movieName}
                  </Text>
                </View>
                
                <View style={styles.movieDetails}>
                  <View style={styles.detailRow}>
                    <Calendar color="#FFD700" size={14} />
                    <Text style={styles.detailText}>{movie.watchedDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Users color="#FFD700" size={14} />
                    <Text style={styles.detailText}>{movie.watchedWith}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMovie(movie.id, movie.movieName)}
                >
                  <Trash2 color="#FF4444" size={18} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus color="#005DAA" size={28} />
        </TouchableOpacity>

        <Modal
          visible={showAddModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Movie</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X color="#FFD700" size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Movie Name *</Text>
                <TextInput
                  style={styles.input}
                  value={movieName}
                  onChangeText={setMovieName}
                  placeholder="Enter movie name"
                  placeholderTextColor="#888"
                  autoFocus
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date Watched</Text>
                <TextInput
                  style={styles.input}
                  value={watchedDate}
                  onChangeText={setWatchedDate}
                  placeholder="e.g., 01/15/2025 (optional)"
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Watched With</Text>
                <TextInput
                  style={styles.input}
                  value={watchedWith}
                  onChangeText={setWatchedWith}
                  placeholder="e.g., Family, Friends (optional)"
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddMovie}
                >
                  <Text style={styles.saveButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  closeButton: {
    padding: 5,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#2a2a3e",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2a1a1a",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  clearAllText: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  movieCard: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
    position: "relative",
  },
  movieCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingRight: 40,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  movieDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#FFD700",
    fontSize: 14,
  },
  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#2a2a3e",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  cancelButtonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FFD700",
  },
  saveButtonText: {
    color: "#005DAA",
    fontSize: 16,
    fontWeight: "bold",
  },
});
