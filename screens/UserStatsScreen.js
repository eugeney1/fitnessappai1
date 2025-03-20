import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Share,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { askGemini } from '../services/geminiAI';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height: windowHeight } = Dimensions.get('window');

export default function UserStatsScreen() {
  // User stats state (renamed height to userHeight)
  const [age, setAge] = useState('');
  const [userHeight, setUserHeight] = useState('');
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
  const [expandedDay, setExpandedDay] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [expandedSection, setExpandedSection] = useState({});

  // Theme-related states
  const [theme, setTheme] = useState('Sun');
  const [gradientColors, setGradientColors] = useState(['#FF9A9E', '#FAD0C4', '#A1C4FD']);
  const [celestialOpacity] = useState(new Animated.Value(1));
  const [particles, setParticles] = useState([]);

  const sunAnim = new Animated.Value(0);
  const dropletAnim = new Animated.Value(0);
  const starAnims = Array(20).fill().map(() => new Animated.Value(0));

  // Themes object with additional themes
  const themes = {
    Sun: {
      gradient: ['#FF9A9E', '#FAD0C4', '#A1C4FD'],
      celestialColor: '#FFD700',
      particleColor: 'rgba(173, 216, 230, 0.7)',
      particleType: 'droplet',
      primaryColor: '#FF6F61',
      secondaryColor: '#FF3D00',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      accentColor: '#FFCA28',
      textColor: '#333',
      headerColor: '#fff',
    },
    Moon: {
      gradient: ['#1A237E', '#283593', '#3F51B5'],
      celestialColor: '#E0E0E0',
      particleColor: 'rgba(255, 255, 255, 0.8)',
      particleType: 'star',
      primaryColor: '#4A90E2',
      secondaryColor: '#2E6DB4',
      cardBackground: 'rgba(30, 40, 80, 0.95)',
      accentColor: '#42A5F5',
      textColor: '#E0E0E0',
      headerColor: '#E0E0E0',
    },
    BloodMoon: {
      gradient: ['#B71C1C', '#D32F2F', '#EF5350'],
      celestialColor: '#D32F2F',
      particleColor: 'rgba(255, 87, 34, 0.7)',
      particleType: 'ember',
      primaryColor: '#FF5722',
      secondaryColor: '#D84315',
      cardBackground: 'rgba(80, 20, 20, 0.95)',
      accentColor: '#EF5350',
      textColor: '#FFEBEE',
      headerColor: '#FFEBEE',
    },
    Desert: {
      gradient: ['#EDC9AF', '#C2B280', '#A67B5B'], // sandy, earthy tones
      celestialColor: '#D2B48C',
      particleColor: 'rgba(210, 180, 140, 0.7)',
      particleType: 'sand',
      primaryColor: '#DAA520',
      secondaryColor: '#B8860B',
      cardBackground: 'rgba(245, 222, 179, 0.95)',
      accentColor: '#CD853F',
      textColor: '#5D4037',
      headerColor: '#3E2723',
    },
    Nature: {
      gradient: ['#8BC34A', '#AED581', '#DCEDC8'], // greens and light earth tones
      celestialColor: '#4CAF50',
      particleColor: 'rgba(139, 195, 74, 0.7)',
      particleType: 'leaf',
      primaryColor: '#388E3C',
      secondaryColor: '#2E7D32',
      cardBackground: 'rgba(200, 230, 201, 0.95)',
      accentColor: '#66BB6A',
      textColor: '#33691E',
      headerColor: '#1B5E20',
    },
    Ocean: {
      gradient: ['#2193b0', '#6dd5ed', '#b2ebf2'], // cool blues and teals
      celestialColor: '#00BCD4',
      particleColor: 'rgba(0, 150, 136, 0.7)',
      particleType: 'bubble',
      primaryColor: '#0097A7',
      secondaryColor: '#00796B',
      cardBackground: 'rgba(178, 235, 242, 0.95)',
      accentColor: '#00ACC1',
      textColor: '#006064',
      headerColor: '#004D40',
    },
    Lava: {
      gradient: ['#FF5722', '#E64A19', '#D84315'], // fiery reds and oranges
      celestialColor: '#FF8A65',
      particleColor: 'rgba(255, 87, 34, 0.7)',
      particleType: 'ember',
      primaryColor: '#BF360C',
      secondaryColor: '#D32F2F',
      cardBackground: 'rgba(255, 205, 210, 0.95)',
      accentColor: '#E53935',
      textColor: '#B71C1C',
      headerColor: '#FFCDD2',
    },
  };

  useEffect(() => {
    // Sun animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(sunAnim, { toValue: 0, duration: 5000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();

    // Droplet animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(dropletAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(dropletAnim, { toValue: 0, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();

    // Star animations loop
    starAnims.forEach(anim => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 1000 + Math.random() * 2000, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1000 + Math.random() * 2000, easing: Easing.linear, useNativeDriver: true }),
        ])
      ).start();
    });

    // Create random particles for background effect
    const newParticles = Array(20)
      .fill()
      .map(() => ({
        left: Math.random() * width,
        top: Math.random() * windowHeight,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 2000 + 1000,
      }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    Animated.timing(celestialOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setGradientColors(themes[theme].gradient);
      Animated.timing(celestialOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, [theme]);

  const calculateBMI = () => {
    if (userHeight && weight) {
      const heightInMeters = userHeight / 100;
      return `BMI: ${(weight / (heightInMeters * heightInMeters)).toFixed(2)}`;
    }
    return 'BMI: N/A';
  };

  const suggestCalories = () => {
    if (age && userHeight && weight) {
      const bmr = 10 * weight + 6.25 * userHeight - 5 * age + 5;
      const activityFactors = {
        Sedentary: 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
      };
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
    if (!age || !userHeight || !weight || !mealCalories || !foodPreferences) {
      alert('Please fill in all fields before generating your plan.');
      return;
    }
    setLoading(true);
    setAiResponse(null);

    const prompt = `
      User Stats:
      - Age: ${age} years
      - Height: ${userHeight} cm
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
  
    // Split the response into sections based on **Section Title**
    const sections = response.split(/\*\*(.*?)\*\*/g);
    let formattedSections = [];
  
    for (let i = 1; i < sections.length; i += 2) {
      const title = sections[i].trim();
      const content = sections[i + 1] ? sections[i + 1].trim().split("\n").filter(line => line) : [];
  
      // Clean up the content by removing stray markdown symbols like * or - at the start of lines
      const cleanedContent = content.map(line => {
        return line.replace(/^\s*[\*\-]\s*/, '').trim();
      }).filter(line => line);
  
      if (title === 'Workout Plan') {
        const days = {};
        let currentDay = null;
        let currentSection = null;
  
        cleanedContent.forEach(line => {
          if (line.match(/^Day \d+/)) {
            currentDay = line;
            days[currentDay] = { sections: [], content: [] };
          } else if (line.match(/^(Warm-up|Main Workout|Cool-down|Cardio|Strength Training|Flexibility|Progression)/)) {
            currentSection = line;
            days[currentDay].sections.push({ title: currentSection, content: [] });
          } else if (currentDay && currentSection) {
            days[currentDay].sections[days[currentDay].sections.length - 1].content.push(line);
          } else if (currentDay) {
            days[currentDay].content.push(line);
          }
        });
        formattedSections.push({ title, content: days });
      } else {
        formattedSections.push({ title, content: cleanedContent });
      }
    }
    return formattedSections;
  };

  const toggleExerciseCompletion = (day, sectionIndex, exerciseIndex) => {
    setCompletedExercises(prev => ({
      ...prev,
      [`${day}-${sectionIndex}-${exerciseIndex}`]: !prev[`${day}-${sectionIndex}-${exerciseIndex}`],
    }));
  };

  const getCompletionPercentage = (day, sections) => {
    let total = 0;
    let completed = 0;
    sections.forEach((section, sectionIndex) => {
      section.content.forEach((_, exerciseIndex) => {
        total++;
        if (completedExercises[`${day}-${sectionIndex}-${exerciseIndex}`]) {
          completed++;
        }
      });
    });
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const sharePlan = async () => {
    let shareContent = `${calculateBMI()}\n${suggestCalories()}\n\n`;
    aiResponse.forEach(section => {
      shareContent += `${section.title}:\n`;
      if (section.title === 'Workout Plan') {
        Object.entries(section.content).forEach(([day, data]) => {
          shareContent += `${day}:\n`;
          data.content.forEach(item => shareContent += `- ${item}\n`);
          data.sections.forEach(section => {
            shareContent += `  ${section.title}:\n`;
            section.content.forEach(item => shareContent += `    - ${item}\n`);
          });
          shareContent += "\n";
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
    setUserHeight('');
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
    setExpandedDay(null);
    setExpandedSection({});
  };

  const sunPosition = sunAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '20%'] });
  const dropletOpacity = dropletAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      {/* Background Elements */}
      <Animated.View style={[styles.celestial, { top: sunPosition, backgroundColor: themes[theme].celestialColor, opacity: celestialOpacity }]}>
        <View style={styles.celestialGlow} />
      </Animated.View>

      {/* Particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              backgroundColor: themes[theme].particleColor,
              opacity: dropletOpacity,
              borderRadius: themes[theme].particleType === 'star' ? 0 : particle.size / 2,
              transform: [{ translateY: dropletAnim.interpolate({ inputRange: [0, 1], outputRange: [0, particle.size * 2] }) }],
            },
            themes[theme].particleType === 'star' && {
              opacity: starAnims[index],
              borderRadius: 2,
              transform: [{ scale: starAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }],
            },
          ]}
        />
      ))}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Theme Selector */}
        <View style={styles.themeSelector}>
          {Object.keys(themes).map(themeName => (
            <TouchableOpacity
              key={themeName}
              style={[styles.themeButton, theme === themeName && styles.themeButtonActive]}
              onPress={() => setTheme(themeName)}
            >
              <Ionicons
                name={themeName === 'Sun' ? 'sunny' : themeName === 'Moon' ? 'moon' : themeName === 'BloodMoon' ? 'planet' : 'color-palette'}
                size={20}
                color={theme === themeName ? '#fff' : themes[theme].textColor}
              />
              <Text style={[styles.themeButtonText, theme === themeName && styles.themeButtonTextActive, { color: themes[theme].textColor }]}>
                {themeName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.header, { color: themes[theme].headerColor }]}>Personalized Fitness Plan</Text>

        {/* Input Form */}
        <View style={[styles.card, { backgroundColor: themes[theme].cardBackground }]}>
          <View style={styles.inputRow}>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Age</Text>
              <TextInput
                style={[styles.input, { color: themes[theme].textColor }]}
                keyboardType="numeric"
                placeholder="e.g., 25"
                placeholderTextColor={themes[theme].textColor + '80'}
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Height (cm)</Text>
              <TextInput
                style={[styles.input, { color: themes[theme].textColor }]}
                keyboardType="numeric"
                placeholder="e.g., 170"
                placeholderTextColor={themes[theme].textColor + '80'}
                value={userHeight}
                onChangeText={setUserHeight}
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Weight (kg)</Text>
              <TextInput
                style={[styles.input, { color: themes[theme].textColor }]}
                keyboardType="numeric"
                placeholder="e.g., 65"
                placeholderTextColor={themes[theme].textColor + '80'}
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>BMI</Text>
              <Text style={[styles.infoText, { color: themes[theme].textColor }]}>{calculateBMI()}</Text>
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Suggested Calories</Text>
              <Text style={[styles.infoText, { color: themes[theme].textColor }]}>{suggestCalories()}</Text>
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Body Goal</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={bodyGoal}
                  onValueChange={setBodyGoal}
                  style={[styles.picker, { color: themes[theme].textColor }]}
                >
                  <Picker.Item label="Lose Weight" value="Lose Weight" />
                  <Picker.Item label="Gain Muscle" value="Gain Muscle" />
                  <Picker.Item label="Maintain Weight" value="Maintain Weight" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Target Calories</Text>
              <TextInput
                style={[styles.input, { color: themes[theme].textColor }]}
                keyboardType="numeric"
                placeholder="e.g., 2000"
                placeholderTextColor={themes[theme].textColor + '80'}
                value={mealCalories}
                onChangeText={setMealCalories}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Food Preferences</Text>
              <TextInput
                style={[styles.input, { color: themes[theme].textColor }]}
                placeholder="E.g., Vegetarian"
                placeholderTextColor={themes[theme].textColor + '80'}
                value={foodPreferences}
                onChangeText={setFoodPreferences}
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Workout Experience</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={workoutExperience}
                  onValueChange={setWorkoutExperience}
                  style={[styles.picker, { color: themes[theme].textColor }]}
                >
                  <Picker.Item label="Beginner" value="Beginner" />
                  <Picker.Item label="Intermediate" value="Intermediate" />
                  <Picker.Item label="Advanced" value="Advanced" />
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Workout Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={workoutType}
                  onValueChange={setWorkoutType}
                  style={[styles.picker, { color: themes[theme].textColor }]}
                >
                  <Picker.Item label="Cardio" value="Cardio" />
                  <Picker.Item label="Strength" value="Strength" />
                  <Picker.Item label="Flexibility" value="Flexibility" />
                  <Picker.Item label="Mixed" value="Mixed" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Workout Frequency</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={workoutFrequency}
                  onValueChange={setWorkoutFrequency}
                  style={[styles.picker, { color: themes[theme].textColor }]}
                >
                  <Picker.Item label="1-2 days" value="1-2 days" />
                  <Picker.Item label="3-4 days" value="3-4 days" />
                  <Picker.Item label="5-6 days" value="5-6 days" />
                  <Picker.Item label="7 days" value="7 days" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: themes[theme].textColor }]}>Activity Level</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={activityLevel}
                  onValueChange={setActivityLevel}
                  style={[styles.picker, { color: themes[theme].textColor }]}
                >
                  <Picker.Item label="Sedentary" value="Sedentary" />
                  <Picker.Item label="Lightly Active" value="Lightly Active" />
                  <Picker.Item label="Moderately Active" value="Moderately Active" />
                  <Picker.Item label="Very Active" value="Very Active" />
                </Picker>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themes[theme].primaryColor }]}
            onPress={generateFitnessPlan}
          >
            <Text style={styles.actionButtonText}>Generate Plan</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color={themes[theme].primaryColor} style={styles.loading} />}
        </View>

        {/* Fitness Plan */}
        {aiResponse && (
          <View style={[styles.card, { backgroundColor: themes[theme].cardBackground }]}>
            <Text style={[styles.sectionHeaderText, { color: themes[theme].textColor }]}>Your Personalized Plan</Text>
            {aiResponse.map((section, index) => (
              <View key={index}>
                <View style={styles.subSectionHeader}>
                  <Ionicons
                    name={section.title === 'Workout Plan' ? 'barbell' : 'restaurant'}
                    size={20}
                    color={themes[theme].primaryColor}
                    style={styles.subSectionIcon}
                  />
                  <Text style={[styles.subSectionTitle, { color: themes[theme].textColor }]}>{section.title}</Text>
                </View>
                {section.title === 'Workout Plan' ? (
                  Object.entries(section.content).map(([day, data]) => (
                    <View key={day} style={styles.daySection}>
                      <TouchableOpacity
                        style={[styles.dayHeader, { borderColor: themes[theme].primaryColor + '40' }]}
                        onPress={() => setExpandedDay(expandedDay === day ? null : day)}
                      >
                        <Text style={[styles.dayTitle, { color: themes[theme].textColor }]}>{day}</Text>
                        <Ionicons
                          name={expandedDay === day ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color={themes[theme].primaryColor}
                        />
                      </TouchableOpacity>
                      {expandedDay === day && (
                        <View style={styles.dayContent}>
                          {data.content.length > 0 && (
                            <Text style={[styles.dayDescription, { color: themes[theme].textColor }]}>{data.content.join('\n')}</Text>
                          )}
                          <View style={[styles.progressBarContainer, { backgroundColor: themes[theme].primaryColor + '20' }]}>
                            <View
                              style={[styles.progressBar, { width: `${getCompletionPercentage(day, data.sections)}%`, backgroundColor: themes[theme].accentColor }]}
                            />
                          </View>
                          {data.sections.map((subSection, sectionIndex) => (
                            <View key={sectionIndex} style={styles.subSection}>
                              <TouchableOpacity
                                style={[styles.subSectionHeader, { borderColor: themes[theme].primaryColor + '20' }]}
                                onPress={() =>
                                  setExpandedSection(prev => ({
                                    ...prev,
                                    [`${day}-${sectionIndex}`]: !prev[`${day}-${sectionIndex}`],
                                  }))
                                }
                              >
                                <Ionicons
                                  name={subSection.title.includes('Warm-up') ? 'sunny' : subSection.title.includes('Cool-down') ? 'snow' : 'fitness'}
                                  size={18}
                                  color={subSection.title.includes('Warm-up') ? '#FF9800' : subSection.title.includes('Cool-down') ? '#2196F3' : themes[theme].primaryColor}
                                  style={styles.subSectionIcon}
                                />
                                <Text style={[styles.subSectionTitle, { color: themes[theme].textColor }]}>{subSection.title}</Text>
                                <Ionicons
                                  name={expandedSection[`${day}-${sectionIndex}`] ? 'chevron-up' : 'chevron-down'}
                                  size={18}
                                  color={themes[theme].primaryColor}
                                />
                              </TouchableOpacity>
                              {expandedSection[`${day}-${sectionIndex}`] && (
                                <View style={styles.exerciseList}>
                                  {subSection.content.map((exercise, exerciseIndex) => (
                                    <TouchableOpacity
                                      key={exerciseIndex}
                                      style={[
                                        styles.exerciseItem,
                                        completedExercises[`${day}-${sectionIndex}-${exerciseIndex}`] && [styles.completedExercise, { borderColor: themes[theme].accentColor }],
                                        subSection.title.includes('Warm-up') && styles.warmUpItem,
                                        subSection.title.includes('Cool-down') && styles.coolDownItem,
                                      ]}
                                      onPress={() => toggleExerciseCompletion(day, sectionIndex, exerciseIndex)}
                                    >
                                      <Ionicons
                                        name={
                                          completedExercises[`${day}-${sectionIndex}-${exerciseIndex}`]
                                            ? 'checkmark-circle'
                                            : 'ellipse-outline'
                                        }
                                        size={20}
                                        color={
                                          completedExercises[`${day}-${sectionIndex}-${exerciseIndex}`]
                                            ? themes[theme].accentColor
                                            : subSection.title.includes('Warm-up')
                                            ? '#FF9800'
                                            : subSection.title.includes('Cool-down')
                                            ? '#2196F3'
                                            : themes[theme].textColor
                                        }
                                      />
                                      <Text style={[styles.exerciseText, { color: themes[theme].textColor }]}>{exercise}</Text>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <View style={styles.mealPlan}>
                    {section.content.map((item, i) => {
                      const mealType = item.match(/^(Breakfast|Lunch|Dinner|Snacks|Important Notes)/);
                      return (
                        <View key={i} style={styles.mealItem}>
                          {mealType && (
                            <View style={styles.mealHeader}>
                              <Ionicons
                                name={
                                  mealType[1] === 'Breakfast'
                                    ? 'sunny'
                                    : mealType[1] === 'Lunch'
                                    ? 'pizza'
                                    : mealType[1] === 'Dinner'
                                    ? 'moon'
                                    : mealType[1] === 'Snacks'
                                    ? 'fast-food'
                                    : 'information-circle'
                                }
                                size={18}
                                color={themes[theme].primaryColor}
                                style={styles.mealIcon}
                              />
                              <Text style={[styles.mealTitle, { color: themes[theme].textColor }]}>{mealType[1]}</Text>
                            </View>
                          )}
                          <View style={styles.mealContent}>
                            <Text style={[styles.bullet, { color: themes[theme].primaryColor }]}>•</Text>
                            <Text style={[styles.mealText, { color: themes[theme].textColor }]}>{item.replace(mealType ? mealType[0] + ': ' : '', '')}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: themes[theme].primaryColor }]}
                onPress={sharePlan}
              >
                <Text style={styles.actionButtonText}>Share Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#FF5252' }]}
                onPress={resetForm}
              >
                <Text style={styles.actionButtonText}>Reset Form</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Progress Section */}
        <View style={[styles.card, { backgroundColor: themes[theme].cardBackground }]}>
          <Text style={[styles.sectionHeaderText, { color: themes[theme].textColor }]}>Progress</Text>
          {progress.map((entry, index) => (
            <View key={index} style={styles.progressEntry}>
              <Text style={[styles.progressText, { color: themes[theme].textColor }]}>Date: {entry.date}</Text>
              <Text style={[styles.progressText, { color: themes[theme].textColor }]}>Weight: {entry.weight} kg</Text>
              <Text style={[styles.progressText, { color: themes[theme].textColor }]}>{entry.bmi}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themes[theme].primaryColor }]}
            onPress={logProgress}
          >
            <Text style={styles.actionButtonText}>Log Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Plans Section */}
        <View style={[styles.card, { backgroundColor: themes[theme].cardBackground }]}>
          <Text style={[styles.sectionHeaderText, { color: themes[theme].textColor }]}>Saved Plans</Text>
          {savedPlans.map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.savedPlan, { borderColor: themes[theme].primaryColor + '40' }]}
              onPress={() => setAiResponse(plan.plan)}
            >
              <Text style={[styles.savedPlanText, { color: themes[theme].textColor }]}>Plan from {plan.date}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themes[theme].primaryColor }]}
            onPress={savePlan}
          >
            <Text style={styles.actionButtonText}>Save Current Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  celestial: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    left: '50%',
    transform: [{ translateX: -40 }],
    shadowColor: '#fff',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  celestialGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    top: -10,
    left: -10,
  },
  particle: {
    position: 'absolute',
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  themeButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  themeButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  themeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputBlock: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  actionButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    marginVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subSectionIcon: {
    marginRight: 8,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  daySection: {
    marginBottom: 15,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayContent: {
    paddingTop: 10,
  },
  dayDescription: {
    fontSize: 14,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  subSection: {
    marginBottom: 10,
  },
  exerciseList: {
    paddingTop: 8,
    paddingHorizontal: 5,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedExercise: {
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  warmUpItem: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  coolDownItem: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  exerciseText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  mealPlan: {
    paddingHorizontal: 5,
  },
  mealItem: {
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mealIcon: {
    marginRight: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 25,
  },
  mealText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  progressEntry: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  savedPlan: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  savedPlanText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export { UserStatsScreen };
