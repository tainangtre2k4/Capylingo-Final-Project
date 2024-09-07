import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ResultScreen = () => {
  // Nhận các tham số từ `router.push`
  const { correctAnswers, wrongAnswers, totalQuestions } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết Quả</Text>
      <Text style={styles.resultText}>Số câu trả lời đúng: {correctAnswers}</Text>
      <Text style={styles.resultText}>Số câu trả lời sai: {wrongAnswers}</Text>
      <Text style={styles.resultText}>Tổng số câu hỏi: {totalQuestions}</Text>
      <Text style={styles.resultText}>
        Tỷ lệ đúng: {((Number(correctAnswers) / Number(totalQuestions)) * 100).toFixed(2)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ResultScreen;
