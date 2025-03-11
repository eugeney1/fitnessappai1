import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function WorkoutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity>
          <Icon name="plus" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navText}>Following</Text>
        <Text style={[styles.navText, styles.inactive]}>For You</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutSearch')}>
          <Icon name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* Video Section */}
      <View style={styles.videoContainer}>
        <Image source={{ uri: 'https://source.unsplash.com/featured/?workout' }} style={styles.video} />
      </View>
      
      {/* Right-Side Actions */}
      <View style={styles.rightPanel}>
        <TouchableOpacity style={styles.profilePicButton}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} style={styles.profilePic} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="comment" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40, // Lowered the top navigation bar
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inactive: {
    color: 'gray',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '70%',
  },
  rightPanel: {
    position: 'absolute',
    right: 10,
    bottom: 120, // Lowered the icon column
    alignItems: 'center',
  },
  profilePicButton: {
    marginBottom: 25, // More space between profile pic and heart icon
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20, // More spacing between action icons
  },
});
