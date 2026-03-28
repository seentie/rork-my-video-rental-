import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Shield, Mail, Phone, MapPin, ExternalLink, Info, HelpCircle, Film } from "lucide-react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "@/hooks/store-context";

export default function Settings() {
  const { setStoreName, setCustomMovies, setUseCustomMovies } = useStore();

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will reset your store name, custom movies, and all preferences. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setStoreName("MY VIDEO RENTAL");
              setCustomMovies([]);
              setUseCustomMovies(false);
              Alert.alert("Success", "All data has been cleared.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleContactPress = (type: 'email' | 'phone' | 'website') => {
    switch (type) {
      case 'email':
        Linking.openURL('mailto:sarah@oldskoolapps.com');
        break;
      case 'phone':
        Linking.openURL('tel:+16465409602');
        break;
      case 'website':
        Linking.openURL('https://www.oldskoolapps.com');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#0f0f1e"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color="#FFD700" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* How to Play Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle color="#FFD700" size={20} />
              <Text style={styles.sectionTitle}>How to Play</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.howToTitle}>Welcome to Your Virtual Video Rental Store!</Text>
              <Text style={styles.howToText}>
                Just like the old days at the video rental store, you get to browse and select your perfect movie night.
              </Text>
              
              <View style={styles.stepContainer}>
                <Text style={styles.stepNumber}>1.</Text>
                <Text style={styles.stepText}>
                  <Text style={styles.stepBold}>Choose Your Movies:</Text> Select a genre from our curated collection, or create your own custom movie list
                </Text>
              </View>
              
              <View style={styles.stepContainer}>
                <Text style={styles.stepNumber}>2.</Text>
                <Text style={styles.stepText}>
                  <Text style={styles.stepBold}>Pick Your Snacks:</Text> Visit the virtual snack counter and choose your favorite treats
                </Text>
              </View>
              
              <View style={styles.stepContainer}>
                <Text style={styles.stepNumber}>3.</Text>
                <Text style={styles.stepText}>
                  <Text style={styles.stepBold}>Select Your Movie:</Text>
                  {"\n"}• <Text style={styles.stepBold}>Shuffle:</Text> Let the store pick for you
                  {"\n"}• <Text style={styles.stepBold}>Mystery:</Text> Tap the "?" cards to randomly reveal a movie
                </Text>
              </View>
              
              <View style={styles.stepContainer}>
                <Text style={styles.stepNumber}>4.</Text>
                <Text style={styles.stepText}>
                  <Text style={styles.stepBold}>Enjoy & Reset:</Text> View your selection and reset to play again!
                </Text>
              </View>
              
              <View style={styles.noteCard}>
                <Text style={styles.noteTitle}>Note:</Text>
                <Text style={styles.noteText}>
                  We don't provide the actual movies - we assume you have your own access through streaming services or personal collection. VHS may be gone, but the rental store selection experience is back. Enjoy the nostalgia!
                </Text>
              </View>
            </View>
          </View>

          {/* Watched Movies Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Film color="#FFD700" size={20} />
              <Text style={styles.sectionTitle}>My Collection</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/watched-log')}
            >
              <Text style={styles.settingText}>We Watched Log</Text>
              <ExternalLink color="#FFD700" size={16} />
            </TouchableOpacity>
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info color="#FFD700" size={20} />
              <Text style={styles.sectionTitle}>App Information</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.appName}>My Movie Rental Shop</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                A nostalgic VHS rental experience with mystery movie selection, 
                custom movie lists, and virtual snack counter.
              </Text>
            </View>
          </View>

          {/* Privacy & Legal Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield color="#FFD700" size={20} />
              <Text style={styles.sectionTitle}>Privacy & Legal</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/privacy-policy')}
            >
              <Text style={styles.settingText}>Privacy Policy</Text>
              <ExternalLink color="#FFD700" size={16} />
            </TouchableOpacity>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Mail color="#FFD700" size={20} />
              <Text style={styles.sectionTitle}>Contact & Support</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleContactPress('email')}
            >
              <View style={styles.contactRow}>
                <Mail color="#FFD700" size={16} />
                <Text style={styles.contactText}>sarah@oldskoolapps.com</Text>
              </View>
              <ExternalLink color="#FFD700" size={16} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleContactPress('phone')}
            >
              <View style={styles.contactRow}>
                <Phone color="#FFD700" size={16} />
                <Text style={styles.contactText}>(646) 540-9602</Text>
              </View>
              <ExternalLink color="#FFD700" size={16} />
            </TouchableOpacity>
            
            <View style={styles.settingItem}>
              <View style={styles.contactRow}>
                <MapPin color="#FFD700" size={16} />
                <Text style={styles.contactText}>
                  2114 N Flamingo Road #867{"\n"}
                  Pembroke Pines, FL 33028
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleContactPress('website')}
            >
              <View style={styles.contactRow}>
                <ExternalLink color="#FFD700" size={16} />
                <Text style={styles.contactText}>www.oldskoolapps.com</Text>
              </View>
              <ExternalLink color="#FFD700" size={16} />
            </TouchableOpacity>
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Data Management</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.dangerItem]}
              onPress={handleClearAllData}
            >
              <Text style={styles.dangerText}>Clear All Data</Text>
            </TouchableOpacity>
            
            <Text style={styles.warningText}>
              This will reset your store name, custom movies, and all preferences. 
              This action cannot be undone.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 OLD SKOOL APPS{"\n"}
              Made with ❤️ for movie lovers
            </Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  appName: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  appVersion: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.8,
  },
  appDescription: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  settingItem: {
    backgroundColor: "#2a2a3e",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  contactText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  dangerItem: {
    borderColor: "#FF4444",
    backgroundColor: "#2a1a1a",
  },
  dangerText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  warningText: {
    color: "#FFD700",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 5,
    opacity: 0.8,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    color: "#FFD700",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
  },
  howToTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  howToText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 15,
    paddingLeft: 5,
  },
  stepNumber: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    width: 20,
  },
  stepText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    opacity: 0.9,
  },
  stepBold: {
    fontWeight: "bold",
    color: "#FFD700",
  },
  noteCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
    borderStyle: "dashed" as const,
  },
  noteTitle: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteText: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
});