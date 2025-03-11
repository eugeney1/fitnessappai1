import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { askGemini } from "../services/geminiAI";

export default function ChatbotScreen() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // Append user message to the conversation
    const updatedMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(updatedMessages);

    try {
      const aiResponse = await askGemini(userMessage);
      setMessages([...updatedMessages, { text: aiResponse, sender: "bot" }]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { text: "Error: Unable to get a response.", sender: "bot" },
      ]);
    }

    setUserMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <Text style={styles.title}>Fitness AI Chatbot</Text>

      <ScrollView 
        style={styles.chatBox}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.sender === "user"
                ? styles.userMessageContainer
                : styles.botMessageContainer,
            ]}
          >
            <Text style={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about fitness..."
          placeholderTextColor="#888"
          value={userMessage}
          onChangeText={setUserMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#e0f2f1", 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#004d40",
    textAlign: "center",
    marginBottom: 20,
  },
  chatBox: { 
    flex: 1, 
    backgroundColor: "#fff", 
    borderRadius: 15, 
    paddingHorizontal: 10, 
    paddingVertical: 15,
    marginBottom: 15,
  },
  chatContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
  },
  userMsg: {
    backgroundColor: "#00796b",
    color: "#fff",
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
  },
  botMsg: {
    backgroundColor: "#cfd8dc",
    color: "#000",
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#00796b",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

