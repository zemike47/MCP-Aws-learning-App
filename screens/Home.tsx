import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

const loadDatabase = async () => {
  const dbName = "SQLites.db";
  const dbAsset = require("../assets/SQLites.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function Home({ navigation }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const db = useSQLiteContext();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await loadDatabase();
        const result = await db.getAllAsync<{ category: string }>(
          "SELECT DISTINCT category FROM Question"
        );
        setCategories(result.map((row) => row.category));
        setLoading(false);
      } catch (error) {
        console.error("Error loading categories:", error);
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Categories...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Category</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate("QuestionScreen", { category: item })
            }
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#2C3E50",
  },
  categoryButton: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#3498DB",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  categoryText: { color: "white", textAlign: "center", fontSize: 18 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
