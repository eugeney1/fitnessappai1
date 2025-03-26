import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

// Sample notifications with timestamp
const initialNotifications = [
  { id: "1", name: "John Doe", message: "Sent you a message", avatar: "https://via.placeholder.com/50", time: "10:30 AM" },
  { id: "2", name: "Lana Smith", message: "Liked your workout", avatar: "https://via.placeholder.com/50", time: "9:15 AM" },
  { id: "3", name: "Alice Johnson", message: "Commented on your post", avatar: "https://via.placeholder.com/50", time: "Yesterday" },
  { id: "4", name: "Mark Wilson", message: "Sent you a friend request", avatar: "https://via.placeholder.com/50", time: "2 days ago" },
  // Add more notifications as needed
];

export default function InboxScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [fitnessGoal, setFitnessGoal] = useState("Run 5 km in under 30 minutes");
  const [checkedIn, setCheckedIn] = useState(false);

  // Filter notifications based on search text (case-insensitive)
  const filteredNotifications = notifications.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(lowerSearch) ||
      item.message.toLowerCase().includes(lowerSearch)
    );
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request; replace with your actual refresh logic
    setTimeout(() => {
      setNotifications(initialNotifications);
      setRefreshing(false);
    }, 1500);
  }, []);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    // Optionally, you can trigger an API call or local persistence here.
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Inbox</Text>
      {/* Fitness Goal Section */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalTitle}>Today's Fitness Goal</Text>
        <Text style={styles.goalText}>{fitnessGoal}</Text>
        <TouchableOpacity
          style={[styles.checkInButton, checkedIn && styles.checkedInButton]}
          onPress={handleCheckIn}
          disabled={checkedIn}
        >
          <Text style={styles.checkInButtonText}>
            {checkedIn ? "Checked In ✔" : "Check In"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search notifications..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />
      {/* Clear All Button */}
      <TouchableOpacity style={styles.clearButton} onPress={clearAllNotifications}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#004d40" />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#e0f2f1", 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#004d40",
    textAlign: "center",
    marginBottom: 20,
  },
  goalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004d40",
    marginBottom: 5,
  },
  goalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  checkInButton: {
    backgroundColor: "#004d40",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  checkedInButton: {
    backgroundColor: "#00796b",
  },
  checkInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    backgroundColor: "#004d40",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#004d40",
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  separator: {
    height: 15,
  },
});

