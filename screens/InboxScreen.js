import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

export default function InboxScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Inbox</Text>
      <FlatList
        data={[
          { id: '1', name: 'John Doe', message: 'Sent you a message' },
          { id: '2', name: 'Lana Smith', message: 'Liked your workout' },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item.name}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notification: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
});
