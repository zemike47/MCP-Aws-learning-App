import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About the Developer</Text>
      <Text style={styles.content}>
        Mikiyas Alemayehu is a passionate software developer and an AWS
        Certified professional. Dedicated to delivering high-quality software
        solutions with a strong focus on cloud technologies and user experience.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2C3E50",
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    color: "#34495E",
    textAlign: "center",
    lineHeight: 24,
  },
});
