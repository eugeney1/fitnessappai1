import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function WorkoutFilterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Search</Text>
      </View>

      {/* Filter Options */}
      <View style={styles.filterBox}>
        <Text style={styles.filterTitle}>Equipment Options:</Text>
        <Text>○ Equipment</Text>
        <Text>○ No Equipment</Text>

        <Text style={styles.filterTitle}>Target Muscle Options:</Text>
        <Text>○ Arms</Text>
        <Text>○ Legs</Text>
        <Text>○ Back</Text>
        <Text>○ Chest</Text>
        <Text>○ Shoulder</Text>

        <Text style={styles.filterTitle}>Workout Type Options:</Text>
        <Text>○ Cardio</Text>
        <Text>○ Weightlifting</Text>
        <Text>○ Powerlifting</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  filterBox: { padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 },
  filterTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15 }
});
