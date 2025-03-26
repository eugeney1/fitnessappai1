import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Animated,
  Easing,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Share } from 'react-native';

const { height, width } = Dimensions.get('window');

const VideoCard = ({ video, isActive }) => {
  const videoId = video.id.videoId;
  const title = video.snippet.title;
  const channelTitle = video.snippet.channelTitle;
  const thumbnail = video.snippet.thumbnails.high.url;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(112);
  const [shareCount, setShareCount] = useState(3);
  const [showHeart, setShowHeart] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [comments, setComments] = useState([
    { id: '1', text: '🔥 Awesome!' },
    { id: '2', text: 'LOL this is great' },
    { id: '3', text: 'Where was this filmed?' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      triggerLike();
    } else {
      lastTap.current = now;
    }
  };

  const handleLikePress = () => {
    if (!liked) {
      triggerLike();
    } else {
      setLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));
    }
  };

  const triggerLike = () => {
    setLiked(true);
    setLikeCount((prev) => prev + 1);
    setShowHeart(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowHeart(false));
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments((prev) => [
        ...prev,
        { id: Date.now().toString(), text: newComment },
      ]);
      setNewComment('');
      Keyboard.dismiss();
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const result = await Share.share({
        message: `Check out this video!\n${shareUrl}`,
        url: shareUrl,
        title: title,
      });
      if (result.action === Share.sharedAction) {
        setShareCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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

      <Pressable style={StyleSheet.absoluteFill} onPress={handleDoubleTap}>
        {isActive && (
          <WebView
            source={{ html: embedHtml }}
            style={{ ...StyleSheet.absoluteFillObject, zIndex: 1 }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        )}
        {showHeart && (
          <Animated.View
            style={[styles.heartContainer, { transform: [{ scale: scaleAnim }] }]}
          >
            <Ionicons name="heart" size={100} color="white" />
          </Animated.View>
        )}
      </Pressable>

      <SafeAreaView style={styles.overlayContainer}>
        <View style={styles.textBox}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
          <Text style={styles.channel}>{channelTitle}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? 'red' : '#fff'} />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setCommentModalVisible(true)}>
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>{comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Feather name="share" size={22} color="#fff" />
            <Text style={styles.actionText}>{shareCount}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.commentBox}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                  <Ionicons name="chevron-down" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Comments</Text>
                <View style={{ width: 28 }} />
              </View>

              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text style={styles.comment}>{item.text}</Text>
                )}
                style={{ marginBottom: 10 }}
              />

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Add a comment..."
                  placeholderTextColor="#aaa"
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handleAddComment}>
                  <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 30,
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 999,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  heartContainer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    zIndex: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentBox: {
    backgroundColor: '#111',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  comment: {
    color: '#eee',
    paddingVertical: 6,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
    marginRight: 10,
  },
});

export default VideoCard;
