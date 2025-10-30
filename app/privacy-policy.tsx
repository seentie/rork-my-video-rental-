import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import { router } from "expo-router";

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#0f0f1e"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
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
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.paragraph}>
                OLD SKOOL APPS ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information We Collect</Text>
              
              <Text style={styles.subTitle}>Information You Provide</Text>
              <Text style={styles.bulletPoint}>• Account information (name, email address)</Text>
              <Text style={styles.bulletPoint}>• Profile information you choose to share</Text>
              <Text style={styles.bulletPoint}>• Content you create or upload</Text>
              <Text style={styles.bulletPoint}>• Communications with us</Text>
              
              <Text style={styles.subTitle}>Information Automatically Collected</Text>
              <Text style={styles.bulletPoint}>• Device information (device type, operating system)</Text>
              <Text style={styles.bulletPoint}>• Usage data (how you interact with the app)</Text>
              <Text style={styles.bulletPoint}>• Log data (app crashes, performance metrics)</Text>
              <Text style={styles.bulletPoint}>• Location data (if you grant permission)</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How We Use Your Information</Text>
              <Text style={styles.paragraph}>We use your information to:</Text>
              <Text style={styles.bulletPoint}>• Provide and improve our app services</Text>
              <Text style={styles.bulletPoint}>• Create and maintain your account</Text>
              <Text style={styles.bulletPoint}>• Send important updates and notifications</Text>
              <Text style={styles.bulletPoint}>• Respond to your questions and support requests</Text>
              <Text style={styles.bulletPoint}>• Analyze app usage to improve user experience</Text>
              <Text style={styles.bulletPoint}>• Ensure app security and prevent fraud</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information Sharing</Text>
              <Text style={styles.paragraph}>
                We do not sell your personal information. We may share your information only in these situations:
              </Text>
              <Text style={styles.bulletPoint}>• With your consent - When you explicitly agree</Text>
              <Text style={styles.bulletPoint}>• Service providers - Third parties who help us operate the app</Text>
              <Text style={styles.bulletPoint}>• Legal requirements - When required by law or to protect rights and safety</Text>
              <Text style={styles.bulletPoint}>• Business transfers - If our company is sold or merged</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Security</Text>
              <Text style={styles.paragraph}>
                We implement appropriate security measures to protect your information, including:
              </Text>
              <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
              <Text style={styles.bulletPoint}>• Secure data transmission</Text>
              <Text style={styles.bulletPoint}>• Regular security assessments</Text>
              <Text style={styles.bulletPoint}>• Limited access to personal information</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights</Text>
              <Text style={styles.paragraph}>You have the right to:</Text>
              <Text style={styles.bulletPoint}>• Access your personal information</Text>
              <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
              <Text style={styles.bulletPoint}>• Delete your account and data</Text>
              <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
              <Text style={styles.bulletPoint}>• Request data portability (where applicable)</Text>
              <Text style={styles.paragraph}>
                To exercise these rights, contact us at www.oldskoolapps.com
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Children's Privacy</Text>
              <Text style={styles.paragraph}>
                Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it promptly.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Third-Party Services</Text>
              <Text style={styles.paragraph}>
                Our app may contain links to third-party services or integrate with other platforms. This privacy policy does not apply to those services. Please review their privacy policies separately.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Changes to This Policy</Text>
              <Text style={styles.paragraph}>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by:
              </Text>
              <Text style={styles.bulletPoint}>• Posting the updated policy in the app</Text>
              <Text style={styles.bulletPoint}>• Sending you an email notification</Text>
              <Text style={styles.bulletPoint}>• Displaying a notice when you next open the app</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <Text style={styles.paragraph}>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </Text>
              <Text style={styles.contactInfo}>Email: sarah@oldskoolapps.com</Text>
              <Text style={styles.contactInfo}>
                Address: 2114 N Flamingo Road #867, Pembroke Pines, FL 33028
              </Text>
              <Text style={styles.contactInfo}>Phone: (646) 540-9602</Text>
              <Text style={styles.contactInfo}>App version: 1.0</Text>
            </View>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  lastUpdated: {
    color: "#FFD700",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    opacity: 0.9,
  },
  bulletPoint: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    opacity: 0.9,
    paddingLeft: 10,
  },
  contactInfo: {
    color: "#FFD700",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    fontWeight: "600",
  },
});