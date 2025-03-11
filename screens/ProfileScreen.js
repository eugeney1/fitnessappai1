import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="plus" size={24} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} style={styles.profilePic} />
        <TouchableOpacity>
          <Icon name="cog" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.username}>@username</Text>
      <View style={styles.stats}>
        <Text>0 Following</Text>
        <Text>0 Meal Plans</Text>
        <Text>0 Likes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});
