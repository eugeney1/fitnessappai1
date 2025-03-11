import React, { useState } from 'react';
import { 
  View, Text, TextInput, Picker, TouchableOpacity, 
  StyleSheet, ScrollView, ActivityIndicator 
} from 'react-native';
import { askGemini } from '../services/geminiAI';

export default function UserStatsScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyGoal, setBodyGoal] = useState('Lose Weight');
  const [mealCalories, setMealCalories] = useState('');
  const [foodPreferences, setFoodPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const generateFitnessPlan = async () => {
    if (!age || !height || !weight || !mealCalories || !foodPreferences) {
      alert('Please fill in all fields before generating your plan.');
      return;
    }

    setLoading(true);
    setAiResponse(null);

    const prompt = `
      User Stats:
      - Age: ${age} years
      - Height: ${height} cm
      - Weight: ${weight} kg
      - Goal: ${bodyGoal}
      - Daily Target Calories: ${mealCalories}
      - Food Preferences: ${foodPreferences}

      Generate a structured workout and meal plan with bullet points:
      - **Workout Plan**: Provide a detailed plan, including exercises, sets, and reps.
      - **Meal Plan**: Recommend meals for breakfast, lunch, dinner, and snacks.
    `;

    try {
      const response = await askGemini(prompt);
      setAiResponse(parseAIResponse(response));
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiResponse("Error: Could not generate a fitness plan. Try again.");
    }

    setLoading(false);
  };

  const parseAIResponse = (response) => {
    const sections = response.split(/\*\*(.*?)\*\*/g);
    let formattedSections = [];

    for (let i = 1; i < sections.length; i += 2) {
      formattedSections.push({
        title: sections[i].trim(),
        content: sections[i + 1] ? sections[i + 1].trim().split("\n") : [],
      });
    }

    return formattedSections;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Personalized Fitness Plan</Text>

      <View style={styles.inputCard}>
        {/* Side-by-side inputs for Age, Height, and Weight */}
        <View style={styles.horizontalContainer}>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Age</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              placeholder="e.g., 25" 
              placeholderTextColor="#888"
              value={age} 
              onChangeText={setAge} 
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              placeholder="e.g., 170" 
              placeholderTextColor="#888"
              value={height} 
              onChangeText={setHeight} 
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              placeholder="e.g., 65" 
              placeholderTextColor="#888"
              value={weight} 
              onChangeText={setWeight} 
            />
          </View>
        </View>

        {/* Vertical inputs for the remaining fields */}
        <Text style={styles.label}>Body Goal</Text>
        <View style={styles.pickerWrapper}>
          <Picker 
            selectedValue={bodyGoal} 
            onValueChange={(itemValue) => setBodyGoal(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Lose Weight" value="Lose Weight" />
            <Picker.Item label="Gain Muscle" value="Gain Muscle" />
            <Picker.Item label="Maintain Weight" value="Maintain Weight" />
          </Picker>
        </View>

        <Text style={styles.label}>Target Calories (per day)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="e.g., 2000" 
          placeholderTextColor="#888"
          value={mealCalories} 
          onChangeText={setMealCalories} 
        />

        <Text style={styles.label}>Food Preferences</Text>
        <TextInput 
          style={styles.input} 
          placeholder="E.g., Vegetarian, High Protein, Gluten-Free" 
          placeholderTextColor="#888"
          value={foodPreferences} 
          onChangeText={setFoodPreferences} 
        />
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generateFitnessPlan}>
        <Text style={styles.generateButtonText}>Generate Fitness Plan</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#00796B" style={styles.loading} />}

      {aiResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseHeader}>Your Personalized Plan</Text>
          {aiResponse.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.content.map((item, i) => (
                <Text key={i} style={styles.responseText}>• {item}</Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F0F4F8', 
    padding: 20 
  },
  header: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#00796B' 
  },
  inputCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 4, 
    marginBottom: 20 
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBlock: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 15, 
    color: '#555'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#bbb', 
    padding: 10, 
    borderRadius: 8, 
    marginTop: 5, 
    fontSize: 16,
    color: '#333'
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: { 
    height: 50, 
    width: '100%',
    color: '#333'
  },
  pickerItem: {
    height: 50,
  },
  generateButton: { 
    backgroundColor: '#00796B', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginVertical: 20, 
    shadowOpacity: 0.2, 
    elevation: 4 
  },
  generateButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  loading: { 
    marginVertical: 10 
  },
  responseContainer: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    shadowOpacity: 0.1, 
    elevation: 3 
  },
  responseHeader: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#00796B'
  },
  section: { 
    marginBottom: 15, 
    padding: 10, 
    backgroundColor: '#E8F5E9', 
    borderRadius: 8, 
    shadowOpacity: 0.1, 
    elevation: 2 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: '#004D40' 
  },
  responseText: { 
    fontSize: 16, 
    marginLeft: 10, 
    color: '#555' 
  },
});
