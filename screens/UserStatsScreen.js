import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, 
  ActivityIndicator, Share, Animated, Easing
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { askGemini } from '../services/geminiAI';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // For icons

export default function UserStatsScreen() {
  // Existing states
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyGoal, setBodyGoal] = useState('Lose Weight');
  const [mealCalories, setMealCalories] = useState('');
  const [foodPreferences, setFoodPreferences] = useState('');
  const [workoutExperience, setWorkoutExperience] = useState('Beginner');
  const [workoutType, setWorkoutType] = useState('Mixed');
  const [workoutFrequency, setWorkoutFrequency] = useState('3-4 days');
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);

  // New states for workout plan
  const [expandedDay, setExpandedDay] = useState(null); // For collapsible workout days
  const [completedExercises, setCompletedExercises] = useState({}); // Track completed exercises

  // Animation states
  const sunAnim = new Animated.Value(0);
  const dropletAnim = new Animated.Value(0);

  useEffect(() => {
    // Sun and droplet animations (unchanged)
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(sunAnim, { toValue: 0, duration: 5000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(dropletAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(dropletAnim, { toValue: 0, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      return `BMI: ${(weight / (heightInMeters * heightInMeters)).toFixed(2)}`;
    }
    return 'BMI: N/A';
  };

  const suggestCalories = () => {
    if (age && height && weight) {
      const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      const activityFactors = { 'Sedentary': 1.2, 'Lightly Active': 1.375, 'Moderately Active': 1.55, 'Very Active': 1.725 };
      return `Suggested Calories: ${Math.round(bmr * activityFactors[activityLevel])}`;
    }
    return 'Suggested Calories: N/A';
  };

  const logProgress = () => {
    const date = new Date().toLocaleDateString();
    setProgress([...progress, { date, weight, bmi: calculateBMI() }]);
  };

  const savePlan = () => {
    const date = new Date().toLocaleDateString();
    setSavedPlans([...savedPlans, { date, plan: aiResponse }]);
  };

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
      - Workout Experience: ${workoutExperience}
      - Preferred Workout Type: ${workoutType}
      - Weekly Workout Frequency: ${workoutFrequency}
      - Activity Level: ${activityLevel}

      Generate a detailed fitness plan with these sections:
      - **Workout Plan**: 
        - Structure it by days (e.g., Day 1, Day 2) based on the weekly frequency (${workoutFrequency}).
        - For each day, include:
          - Warm-up exercises (5-10 minutes)
          - Main exercises with specific names, sets, reps, and rest intervals
          - Cool-down/stretching (5-10 minutes)
        - Tailor exercises to the workout type (${workoutType}) and experience level (${workoutExperience}).
        - Include progression tips (e.g., increase weight over time).
      - **Meal Plan**: 
        - Suggest meals for breakfast, lunch, dinner, and snacks with approximate calorie counts.
        - Align with the food preferences (${foodPreferences}) and target calories (${mealCalories}).
    `;

    try {
      const response = await askGemini(prompt);
      setAiResponse(parseAIResponse(response));
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiResponse("Error: Could not generate a fitness plan.");
    }
    setLoading(false);
  };

  const parseAIResponse = (response) => {
    if (typeof response !== 'string') return [];
    const sections = response.split(/\*\*(.*?)\*\*/g);
    let formattedSections = [];
    for (let i = 1; i < sections.length; i += 2) {
      const title = sections[i].trim();
      const content = sections[i + 1] ? sections[i + 1].trim().split("\n").filter(line => line) : [];
      if (title === 'Workout Plan') {
        // Parse workout plan into days
        const days = {};
        let currentDay = null;
        content.forEach(line => {
          if (line.match(/^Day \d+/)) {
            currentDay = line;
            days[currentDay] = [];
          } else if (currentDay) {
            days[currentDay].push(line);
          }
        });
        formattedSections.push({ title, content: days });
      } else {
        formattedSections.push({ title, content });
      }
    }
    return formattedSections;
  };

  const toggleExerciseCompletion = (day, exerciseIndex) => {
    setCompletedExercises(prev => ({
      ...prev,
      [`${day}-${exerciseIndex}`]: !prev[`${day}-${exerciseIndex}`],
    }));
  };

  const sharePlan = async () => {
    let shareContent = `${calculateBMI()}\n${suggestCalories()}\n\n`;
    aiResponse.forEach(section => {
      shareContent += `${section.title}:\n`;
      if (section.title === 'Workout Plan') {
        Object.entries(section.content).forEach(([day, exercises]) => {
          shareContent += `${day}:\n${exercises.map(item => `- ${item}`).join('\n')}\n\n`;
        });
      } else {
        section.content.forEach(item => shareContent += `- ${item}\n`);
      }
      shareContent += "\n";
    });
    await Share.share({ message: shareContent });
  };

  const resetForm = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setBodyGoal('Lose Weight');
    setMealCalories('');
    setFoodPreferences('');
    setWorkoutExperience('Beginner');
    setWorkoutType('Mixed');
    setWorkoutFrequency('3-4 days');
    setActivityLevel('Moderately Active');
    setAiResponse(null);
    setCompletedExercises({});
  };

  const sunPosition = sunAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '20%'] });
  const dropletOpacity = dropletAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <LinearGradient colors={['#FF9A9E', '#FAD0C4', '#A1C4FD']} style={styles.container}>
      <ScrollView>
        <Animated.View style={[styles.sun, { top: sunPosition }]}>
          <View style={styles.sunGlow} />
        </Animated.View>
        <Animated.View style={[styles.droplet, { opacity: dropletOpacity }]} />
        <Animated.View style={[styles.droplet, { opacity: dropletOpacity, left: '70%', top: '10%' }]} />
        <Animated.View style={[styles.droplet, { opacity: dropletOpacity, left: '30%', top: '20%' }]} />

        <Text style={styles.header}>Personalized Fitness Plan</Text>
        <View style={styles.inputCard}>
          {/* Input fields remain largely unchanged */}
          <View style={styles.horizontalContainer}>
            <View style={styles.inputBlock}><Text style={styles.label}>Age</Text><TextInput style={styles.input} keyboardType="numeric" placeholder="e.g., 25" value={age} onChangeText={setAge} /></View>
            <View style={styles.inputBlock}><Text style={styles.label}>Height (cm)</Text><TextInput style={styles.input} keyboardType="numeric" placeholder="e.g., 170" value={height} onChangeText={setHeight} /></View>
            <View style={styles.inputBlock}><Text style={styles.label}>Weight (kg)</Text><TextInput style={styles.input} keyboardType="numeric" placeholder="e.g., 65" value={weight} onChangeText={setWeight} /></View>
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.inputBlock}><Text style={styles.label}>BMI</Text><Text style={styles.bmiText}>{calculateBMI()}</Text></View>
            <View style={styles.inputBlock}><Text style={styles.label}>Suggested Calories</Text><Text style={styles.calorieText}>{suggestCalories()}</Text></View>
          </View>
          {/* Other input fields remain the same */}
          <Text style={styles.label}>Body Goal</Text><View style={styles.pickerWrapper}><Picker selectedValue={bodyGoal} onValueChange={setBodyGoal} style={styles.picker}><Picker.Item label="Lose Weight" value="Lose Weight" /><Picker.Item label="Gain Muscle" value="Gain Muscle" /><Picker.Item label="Maintain Weight" value="Maintain Weight" /></Picker></View>
          <Text style={styles.label}>Target Calories</Text><TextInput style={styles.input} keyboardType="numeric" placeholder="e.g., 2000" value={mealCalories} onChangeText={setMealCalories} />
          <Text style={styles.label}>Food Preferences</Text><TextInput style={styles.input} placeholder="E.g., Vegetarian" value={foodPreferences} onChangeText={setFoodPreferences} />
          <Text style={styles.label}>Workout Experience</Text><View style={styles.pickerWrapper}><Picker selectedValue={workoutExperience} onValueChange={setWorkoutExperience} style={styles.picker}><Picker.Item label="Beginner" value="Beginner" /><Picker.Item label="Intermediate" value="Intermediate" /><Picker.Item label="Advanced" value="Advanced" /></Picker></View>
          <Text style={styles.label}>Workout Type</Text><View style={styles.pickerWrapper}><Picker selectedValue={workoutType} onValueChange={setWorkoutType} style={styles.picker}><Picker.Item label="Cardio" value="Cardio" /><Picker.Item label="Strength" value="Strength" /><Picker.Item label="Flexibility" value="Flexibility" /><Picker.Item label="Mixed" value="Mixed" /></Picker></View>
          <Text style={styles.label}>Workout Frequency</Text><View style={styles.pickerWrapper}><Picker selectedValue={workoutFrequency} onValueChange={setWorkoutFrequency} style={styles.picker}><Picker.Item label="1-2 days" value="1-2 days" /><Picker.Item label="3-4 days" value="3-4 days" /><Picker.Item label="5-6 days" value="5-6 days" /><Picker.Item label="7 days" value="7 days" /></Picker></View>
          <Text style={styles.label}>Activity Level</Text><View style={styles.pickerWrapper}><Picker selectedValue={activityLevel} onValueChange={setActivityLevel} style={styles.picker}><Picker.Item label="Sedentary" value="Sedentary" /><Picker.Item label="Lightly Active" value="Lightly Active" /><Picker.Item label="Moderately Active" value="Moderately Active" /><Picker.Item label="Very Active" value="Very Active" /></Picker></View>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={generateFitnessPlan}>
          <Text style={styles.generateButtonText}>Generate Fitness Plan</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#00796B" style={styles.loading} />}

        {aiResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseHeader}>Your Personalized Plan</Text>
            {aiResponse.map((section, index) => (
              <View key={index} style={styles.planCard}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.title === 'Workout Plan' ? (
                  Object.entries(section.content).map(([day, exercises]) => (
                    <View key={day} style={styles.daySection}>
                      <TouchableOpacity
                        style={styles.dayHeader}
                        onPress={() => setExpandedDay(expandedDay === day ? null : day)}
                      >
                        <Text style={styles.dayTitle}>{day}</Text>
                        <Ionicons name={expandedDay === day ? 'chevron-up' : 'chevron-down'} size={20} color="#00796B" />
                      </TouchableOpacity>
                      {expandedDay === day && (
                        <View style={styles.exerciseList}>
                          {exercises.map((exercise, i) => (
                            <TouchableOpacity
                              key={i}
                              style={[
                                styles.exerciseItem,
                                completedExercises[`${day}-${i}`] && styles.completedExercise,
                              ]}
                              onPress={() => toggleExerciseCompletion(day, i)}
                            >
                              <Ionicons
                                name={completedExercises[`${day}-${i}`] ? 'checkmark-circle' : 'ellipse-outline'}
                                size={20}
                                color={completedExercises[`${day}-${i}`] ? '#28A745' : '#555'}
                              />
                              <Text style={styles.exerciseText}>{exercise}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  section.content.map((item, i) => (
                    <View key={i} style={styles.planItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.planText}>{item}</Text>
                    </View>
                  ))
                )}
              </View>
            ))}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.groupButton} onPress={sharePlan}>
                <Text style={styles.groupButtonText}>Share Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.groupButton} onPress={resetForm}>
                <Text style={styles.groupButtonText}>Reset Form</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.progressContainer}>
          <Text style={styles.progressHeader}>Progress</Text>
          {progress.map((entry, index) => (
            <View key={index} style={styles.progressEntry}>
              <Text style={styles.progressText}>Date: {entry.date}</Text>
              <Text style={styles.progressText}>Weight: {entry.weight} kg</Text>
              <Text style={styles.progressText}>{entry.bmi}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.logButton} onPress={logProgress}>
            <Text style={styles.logButtonText}>Log Progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.savedPlansContainer}>
          <Text style={styles.savedPlansHeader}>Saved Plans</Text>
          {savedPlans.map((plan, index) => (
            <TouchableOpacity key={index} style={styles.savedPlan} onPress={() => setAiResponse(plan.plan)}>
              <Text style={styles.savedPlanText}>Plan from {plan.date}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.saveButton} onPress={savePlan}>
            <Text style={styles.saveButtonText}>Save Current Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#fff' },
  inputCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5, marginBottom: 20 },
  horizontalContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  inputBlock: { flex: 1, marginHorizontal: 5 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, color: '#555' },
  input: { borderWidth: 1, borderColor: '#bbb', padding: 10, borderRadius: 8, marginTop: 5, fontSize: 16, color: '#333', backgroundColor: '#fff' },
  pickerWrapper: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, marginTop: 5, overflow: 'hidden', backgroundColor: '#fff' },
  picker: { height: 50, width: '100%', color: '#333' },
  generateButton: { backgroundColor: '#00796B', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  generateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loading: { marginVertical: 10 },
  responseContainer: { marginTop: 20, padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  responseHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#00796B' },
  planCard: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#004D40' },
  daySection: { marginBottom: 10 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  dayTitle: { fontSize: 16, fontWeight: '600', color: '#00796B' },
  exerciseList: { paddingTop: 10 },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  completedExercise: { backgroundColor: '#E8F5E9' },
  exerciseText: { fontSize: 16, color: '#555', marginLeft: 10, flex: 1 },
  planItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bullet: { fontSize: 16, marginRight: 8, color: '#00796B' },
  planText: { fontSize: 16, color: '#555', flex: 1 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  groupButton: { backgroundColor: '#00796B', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  groupButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  progressContainer: { marginTop: 20, padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  progressHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#00796B' },
  progressEntry: { marginBottom: 10, padding: 10, backgroundColor: '#E8F5E9', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  progressText: { fontSize: 16, color: '#555' },
  logButton: { backgroundColor: '#00796B', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  logButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  savedPlansContainer: { marginTop: 20, padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  savedPlansHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#00796B' },
  savedPlan: { marginBottom: 10, padding: 10, backgroundColor: '#E8F5E9', borderRadius: 8 },
  savedPlanText: { fontSize: 16, color: '#555' },
  saveButton: { backgroundColor: '#00796B', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bmiText: { fontSize: 16, marginTop: 5, color: '#333' },
  calorieText: { fontSize: 16, marginTop: 5, color: '#333' },
  sun: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFD700', left: '50%', transform: [{ translateX: -50 }] },
  sunGlow: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 215, 0, 0.3)', position: 'absolute', top: -10, left: -10 },
  droplet: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(173, 216, 230, 0.7)', top: '5%', left: '20%' },
});