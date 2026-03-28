import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { X } from "lucide-react-native";
import { useStore } from "@/hooks/store-context";
import { snacks } from "@/data/snacks";

const { height: screenHeight } = Dimensions.get("window");

interface SnackBarProps {
  onClose: () => void;
}

export function SnackBar({ onClose }: SnackBarProps) {
  const { selectedSnacks, toggleSnack } = useStore();
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>CONCESSION STAND</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X color="#FFD700" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.snackList} showsVerticalScrollIndicator={false}>
        {snacks.map((snack) => (
          <TouchableOpacity
            key={snack.id}
            style={[
              styles.snackItem,
              selectedSnacks.includes(snack.name) && styles.snackItemSelected,
            ]}
            onPress={() => toggleSnack(snack.name)}
          >
            <View style={styles.snackInfo}>
              <Text style={styles.snackIcon}>{snack.icon}</Text>
              <View>
                <Text style={styles.snackName}>{snack.name}</Text>
                <Text style={styles.snackPrice}>${snack.price}</Text>
              </View>
            </View>
            {selectedSnacks.includes(snack.name) && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          {selectedSnacks.length} items selected
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
    borderBottomWidth: 0,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
  },
  closeButton: {
    padding: 5,
  },
  snackList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  snackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a3e",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  snackItemSelected: {
    borderColor: "#FFD700",
    backgroundColor: "#3a3a4e",
  },
  snackInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  snackIcon: {
    fontSize: 24,
  },
  snackName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  snackPrice: {
    color: "#FFD700",
    fontSize: 14,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#005DAA",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    alignItems: "center",
  },
  totalText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
});