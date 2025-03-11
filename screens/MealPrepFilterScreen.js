import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function MealPrepSearchScreen({ navigation }) {
  const recentSearches = ["Recent Search 1", "Recent Search 2", "Recent Search 3"];
  const trendingMeals = ["Trending Meal Prep #1", "Trending Meal Prep #2", "Trending Meal Prep #3", "Trending Meal Prep #4"];

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => navigation.navigate('MealPrepFilter')}>
            <Icon name="sliders" size={20} color="black" />
          </TouchableOpacity>
          <TextInput style={styles.searchInput} placeholder="Search meal plans..." />
          <TouchableOpacity onPress={() => alert('Voice search activated!')}>
            <Icon name="microphone" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.searchText}>Search</Text>
      </View>

      {/* Recent Searches */}
      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.searchItem}>
            <Text>⏳ {item}</Text>
            <TouchableOpacity>
              <Icon name="times" size={16} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity><Text style={styles.showMore}>See More ⌄</Text></TouchableOpacity>

      {/* Trending Searches */}
      <Text style={styles.sectionHeader}>🔥 Trending Searches</Text>
      {trendingMeals.map((item, index) => (
        <Text key={index} style={styles.trendingItem}>{item}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10 },
  searchInput: { flex: 1, marginLeft: 10 },
  searchText: { color: 'red', fontSize: 16, marginLeft: 10 },
  searchItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, color: 'red' },
  trendingItem: { marginTop: 5 },
  showMore: { color: 'blue', marginTop: 10 }
});
