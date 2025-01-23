import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        animation: "fade_from_bottom", // Smooth screen transitions
        gestureEnabled: true, // Enable gesture-based navigation
      }}
    />
  );
}
