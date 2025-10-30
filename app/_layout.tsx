import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StoreProvider } from "@/hooks/store-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="movie-result" options={{ presentation: "modal", animation: "fade" }} />
      <Stack.Screen name="settings" options={{ presentation: "modal", animation: "slide_from_right" }} />
      <Stack.Screen name="privacy-policy" options={{ presentation: "modal", animation: "slide_from_right" }} />
      <Stack.Screen name="watched-log" options={{ presentation: "modal", animation: "slide_from_right" }} />
    </Stack>
  );
}

function AppContent() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}