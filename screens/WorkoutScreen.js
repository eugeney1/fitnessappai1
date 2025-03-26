import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import VideoCard from '../components/videoCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const API_KEY = 'AIzaSyDol3xpH7qwuO4MAFRD20PbQzaoi91brJ8';

// 🔥 Hardcoded search query (change this to anything)
const HARDCODED_QUERY = ' gym workout short videos';

const ShortsScreen = () => {
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 });
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(HARDCODED_QUERY)}&type=video&videoDuration=short&key=${API_KEY}`
      );
      const data = await response.json();
      setVideos(data.items);
    } catch (error) {
      console.error('YouTube API error:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.videoId}
        renderItem={({ item, index }) => (
          <VideoCard video={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig.current}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default ShortsScreen;
