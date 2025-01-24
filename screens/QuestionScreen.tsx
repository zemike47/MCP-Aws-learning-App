import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useSQLiteContext } from "expo-sqlite";

export default function QuestionScreen({ route }) {
  const { category } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackColor, setFeedbackColor] = useState(null);

  const db = useSQLiteContext();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const result = await db.getAllAsync<{
          id: number;
          question: string;
          option_1: string;
          option_2: string;
          option_3: string;
          option_4: string;
          answer: string;
        }>("SELECT * FROM Question WHERE category = ?", [category]);
        setQuestions(result);
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };

    loadQuestions();
  }, [category]);

  if (questions.length === 0)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Questions...</Text>
      </View>
    );

  const handleOptionPress = (option) => {
    const correctAnswer = questions[currentIndex].answer;
    setSelectedOption(option);
    if (option === correctAnswer) {
      setFeedbackColor("green");
    } else {
      setFeedbackColor("red");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setFeedbackColor(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setFeedbackColor(null);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Questions for {category}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {["option_1", "option_2", "option_3", "option_4"].map((key, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === currentQuestion[key]
                ? { backgroundColor: feedbackColor }
                : null,
            ]}
            onPress={() => handleOptionPress(currentQuestion[key])}
          >
            <Text>{`${index + 1}. ${currentQuestion[key]}`}</Text>
          </TouchableOpacity>
        ))}
        {selectedOption && feedbackColor === "red" && (
          <Text style={styles.correctAnswer}>
            Correct Answer: {currentQuestion.answer}
          </Text>
        )}
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.button, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            currentIndex === questions.length - 1 && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#2E86C1",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#27AE60",
  },
  questionContainer: { marginBottom: 24 },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#34495E",
  },
  option: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#BDC3C7",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  correctAnswer: {
    marginTop: 16,
    fontSize: 16,
    color: "#1ABC9C",
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2980B9",
  },
  disabledButton: {
    backgroundColor: "#BDC3C7",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
