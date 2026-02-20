import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Ionicons } from '@expo/vector-icons';

type Role = 'user' | 'assistant';
type Message = { id: string; role: Role; text: string; time?: number };

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi — I can help with crop water, soil forecasts, and allocation. Ask me anything.', time: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text, time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // simulate assistant typing and reply
    setIsTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: generateAssistantReply(text),
        time: Date.now(),
      };
      setMessages((m) => [...m, reply]);
      setIsTyping(false);
    }, 900 + Math.min(1200, text.length * 20));
  };

  const generateAssistantReply = (userText: string) => {
    // Lightweight simulated response — replace with real API call later
    if (/soil|moisture|forecast/i.test(userText)) return 'Soil moisture forecasts show moderate dryness in the next 3 days — consider light irrigation early morning.';
    if (/crop|water|requirement/i.test(userText)) return 'Crop water requirement varies by stage — provide me crop type and days after sowing for a tailored value.';
    if (/allocation|village|optimi/i.test(userText)) return 'Allocation suggestion: prioritize fields with lower soil moisture and critical crops like vegetables.';
    return `I heard: "${userText}". Try asking for crop-specific water needs or soil forecasts for a location.`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
        {!isUser && <View style={styles.avatar} />}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>{item.text}</Text>
          <Text style={styles.timeText}>{new Date(item.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        {isUser && <View style={styles.avatarPlaceholder} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/farmer/dashboard')}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>FarmAI Chat</Text>
      </View>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
        />

        {isTyping && (
          <View style={styles.typingRow}>
            <View style={styles.avatar} />
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Ask about crop water, soil, or allocation..."
            value={input}
            onChangeText={setInput}
            style={styles.input}
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} accessibilityLabel="Send message">
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.bg },
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 12 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
  messageRowAssistant: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#d1fae5', marginRight: 8 },
  avatarPlaceholder: { width: 44 },
  bubble: { maxWidth: '78%', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  bubbleAssistant: { backgroundColor: '#fff', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: Theme.colors.primary, borderTopRightRadius: 4, alignItems: 'flex-end' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextAssistant: { color: Theme.colors.text },
  bubbleTextUser: { color: '#fff' },
  timeText: { fontSize: 10, color: '#888', marginTop: 6, textAlign: 'right' },
  typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  typingBubble: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, borderColor: Theme.colors.border, backgroundColor: Theme.colors.bg },
  input: { flex: 1, minHeight: 44, maxHeight: 120, backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: Theme.colors.border },
  sendBtn: { marginLeft: 8, width: 48, height: 48, borderRadius: 24, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
});
