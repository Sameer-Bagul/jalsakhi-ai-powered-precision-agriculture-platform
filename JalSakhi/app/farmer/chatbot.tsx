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
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;

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

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text, time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

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
    if (/soil|moisture|forecast/i.test(userText)) return 'Soil moisture forecasts show moderate dryness in the next 3 days — consider light irrigation early morning.';
    if (/crop|water|requirement/i.test(userText)) return 'Crop water requirement varies by stage — provide me crop type and days after sowing for a tailored value.';
    if (/allocation|village|optimi/i.test(userText)) return 'Allocation suggestion: prioritize fields with lower soil moisture and critical crops like vegetables.';
    return `I heard: "${userText}". Try asking for crop-specific water needs or soil forecasts for a location.`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
        {!isUser && (
          <View style={styles.assistantAvatar}>
            <Image source={require('../../assets/images/logo.png')} style={styles.botLogo} />
          </View>
        )}
        <View style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          { borderTopLeftRadius: isUser ? 20 : 4, borderTopRightRadius: isUser ? 4 : 20 }
        ]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>{item.text}</Text>
          <View style={styles.bubbleFooter}>
            <Text style={[styles.timeText, isUser && { color: 'rgba(255,255,255,0.7)' }]}>
              {new Date(item.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isUser && <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Decorative Layer */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '30%', right: -60, transform: [{ rotate: '-30deg' }] }]} />
        <View style={[styles.designLine, { bottom: '20%', left: -80, width: 300, transform: [{ rotate: '15deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} />
            <View>
              <Text style={styles.topTitle}>JalSakhi AI</Text>
              <View style={styles.onlineStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusTextLine}>Online</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.infoBtn}>
            <Feather name="info" size={20} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(i) => i.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {isTyping && (
            <View style={styles.typingRow}>
              <BlurView intensity={30} tint="light" style={styles.typingBubble}>
                <View style={styles.dot} />
                <View style={[styles.dot, { opacity: 0.5 }]} />
                <View style={[styles.dot, { opacity: 0.2 }]} />
              </BlurView>
            </View>
          )}

          <BlurView intensity={80} tint="light" style={styles.inputArea}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Ask your question..."
                placeholderTextColor="#94a3b8"
                value={input}
                onChangeText={setInput}
                style={[styles.input, { maxHeight: 100 }]}
                multiline
              />
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!input.trim()}
              >
                <LinearGradient
                  colors={input.trim() ? ['#10b981', '#059669'] : ['#e2e8f0', '#cbd5e1']}
                  style={styles.sendBtn}
                >
                  <Ionicons name="send" size={18} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  decorativeLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  designLine: {
    position: 'absolute',
    width: 350,
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: { width: 36, height: 36, borderRadius: 10 },
  topTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.text, letterSpacing: -0.4 },
  onlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  statusTextLine: { fontSize: 12, color: Theme.colors.textMuted, fontWeight: '600' },
  backBtn: {},
  infoBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, paddingBottom: 24 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 8 },
  messageRowAssistant: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'white',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  botLogo: { width: 20, height: 20 },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  bubbleAssistant: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  bubbleUser: {
    backgroundColor: Theme.colors.primary,
  },
  bubbleText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  bubbleTextAssistant: { color: Theme.colors.text },
  bubbleTextUser: { color: '#fff' },
  bubbleFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  timeText: { fontSize: 10, color: Theme.colors.textMuted },
  typingRow: { paddingLeft: 56, marginBottom: 12 },
  typingBubble: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Theme.colors.primary },
  inputArea: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: '600',
    paddingVertical: 10,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  }
});
