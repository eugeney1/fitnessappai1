import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { YOUTUBE_API_KEY } from '@env';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WorkoutScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchQuery = "full body workout exercises for beginners OR home workout routine OR gym training exercises short video";
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&maxResults=30&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}`
        );

        const videoData = response.data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          videoUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=0&loop=1&controls=0&playsinline=1&enablejsapi=1`,
          likes: Math.floor(Math.random() * 1000) + 100, // Random likes
          comments: Math.floor(Math.random() * 500) + 50, // Random comments
          shares: Math.floor(Math.random() * 300) + 20, // Random shares
        }));

        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      {Platform.OS === 'web' ? (
        <iframe
          src={item.videoUrl}
          style={styles.webVideo}
          allowFullScreen
        ></iframe>
      ) : (
        <WebView
          source={{ uri: item.videoUrl }}
          style={styles.video}
          allowsFullscreenVideo={true}
        />
      )}
      <Text style={styles.title}>{item.title}</Text>
      
      {/* Right-side Action Panel */}
      <View style={styles.rightPanel}>
        <TouchableOpacity style={styles.profilePicButton}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/45.jpg' }} style={styles.profilePic} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="heart" size={30} color="white" />
          <Text style={styles.iconText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="comment" size={30} color="white" />
          <Text style={styles.iconText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share" size={30} color="white" />
          <Text style={styles.iconText}>{item.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity>
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.navText, styles.inactive]}>Following</Text>
        <Text style={styles.navText}>For You</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutSearch')}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Video List */}
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
        />
      )}
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
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 10,
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inactive: {
    color: 'gray',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  webVideo: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  title: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  rightPanel: {
    position: 'absolute',
    right: 10,
    bottom: 120,
    alignItems: 'center',
  },
  profilePicButton: {
    marginBottom: 25,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
