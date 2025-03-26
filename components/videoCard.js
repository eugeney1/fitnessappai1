import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { height, width } = Dimensions.get('window');

const VideoCard = ({ video, isActive }) => {
  const videoId = video.id.videoId;
  const title = video.snippet.title;
  const channelTitle = video.snippet.channelTitle;
  const thumbnail = video.snippet.thumbnails.high.url;

  const embedHtml = `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:black;">
        <iframe
          width="100%" height="100%"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
          style="position:absolute;top:0;left:0;width:100%;height:100%;"
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Blurred thumbnail background */}
      <ImageBackground
        source={{ uri: thumbnail }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 100 : 90}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      {/* Fullscreen YouTube video (only when active) */}
      {isActive && (
        <WebView
          source={{ html: embedHtml }}
          style={StyleSheet.absoluteFill}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
        />
      )}

      {/* Overlay content: title + buttons */}
      <View style={styles.overlayContainer}>
        {/* Bottom-left: title + channel */}
        <View style={styles.textBox}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
          <Text style={styles.channel}>{channelTitle}</Text>
        </View>

        {/* Bottom-right: actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="share" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  textBox: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  channel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default VideoCard;
