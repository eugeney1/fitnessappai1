import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function WorkoutSearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Yoga for beginners',
    'HIIT cardio',
    'Full body strength',
  ]);
  const trendingWorkouts = [
    'Quick abs workout',
    'No equipment training',
    'Stretching routine',
    '10 min morning yoga',
  ];

  const handleSearch = (searchText) => {
    if (!searchText.trim()) return;
    // Navigate to WorkoutScreen with the query
    navigation.navigate('Workout', { query: searchText });

    // Add to recent (avoid duplicates)
    if (!recentSearches.includes(searchText)) {
      setRecentSearches([searchText, ...recentSearches.slice(0, 4)]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TouchableOpacity>
            <Icon name="sliders" size={18} color="black" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
          />

          <TouchableOpacity onPress={() => alert('Voice search activated!')}>
            <Icon name="microphone" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleSearch(query)}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      <Text style={styles.sectionHeader}>🕓 Recent Searches</Text>
      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSearch(item)}>
            <View style={styles.searchItem}>
              <Text>⏳ {item}</Text>
              <TouchableOpacity>
                <Icon name="times" size={14} color="gray" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Trending Searches */}
      <Text style={styles.sectionHeader}>🔥 Trending Workouts</Text>
      {trendingWorkouts.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleSearch(item)}>
          <Text style={styles.trendingItem}># {item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  searchText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 10,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  trendingItem: {
    paddingVertical: 6,
    fontSize: 14,
    color: '#555',
  },
});
