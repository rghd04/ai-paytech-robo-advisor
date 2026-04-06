import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyCW_mTIKn2becc3GDS4F1hpBJhp8JmZkDw",
  authDomain: "paytech-tracking.firebaseapp.com",
  projectId: "paytech-tracking",
  storageBucket: "paytech-tracking.firebasestorage.app",
  messagingSenderId: "1089601430309",
  appId: "1:1089601430309:web:f3dfb5ff4856ea3fe0f0cc",
  measurementId: "G-DET9KRYLM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
/**
 * 3 preset questions (no OpenAI) + Other
 * you can edit the text/answers anytime
 */
const PRESET = [
  {
    id: "card",
    title: "Card Processing",
    subtitle: "How does card payment processing work?",
    answer:
      "Card processing usually follows this flow:\n" +
      "1) Customer taps/inserts card → a request is sent to the payment gateway.\n" +
      "2) The acquirer (merchant’s bank) forwards it to the card network (Visa/Mastercard).\n" +
      "3) The issuer (customer’s bank) approves/declines based on balance + fraud checks.\n" +
      "4) Authorization happens instantly, but settlement (moving funds) often happens later (e.g., T+1/T+2).\n\n" +
      "Common reasons for issues: incorrect merchant setup, AVS/CVV mismatch, issuer declines, or risk rules.",
  },
  {
    id: "wallets",
    title: "Digital Wallets",
    subtitle: "What are digital wallets and how do they work?",
    answer:
      "Digital wallets (Apple Pay, Google Pay, etc.) store a tokenized version of a card.\n" +
      "Instead of sending the real PAN (card number), they send a token + cryptogram.\n\n" +
      "Benefits:\n" +
      "- Better security (tokenization + device authentication)\n" +
      "- Faster checkout (tap-to-pay)\n" +
      "- Lower fraud risk vs. manual card entry\n\n" +
      "If you’re implementing wallets, you typically need a PSP/gateway that supports wallet tokenization and the right merchant configuration.",
  },
  {
    id: "fraud",
    title: "Fraud Prevention",
    subtitle: "Best practices to reduce payment fraud?",
    answer:
      "Practical fraud prevention checklist:\n" +
      "- Use 3D Secure (where applicable) for risky transactions.\n" +
      "- Use AVS/CVV checks (for card-not-present).\n" +
      "- Add velocity limits (too many attempts per minute/hour).\n" +
      "- Block obvious patterns (mismatched country, disposable emails, repeated failed CVV).\n" +
      "- Use device fingerprinting + risk scoring.\n" +
      "- Log everything (IP, device, timestamps) and review chargeback reasons.\n\n" +
      "Balance is key: too strict = more false declines; too loose = more fraud/chargebacks.",
  },
];

const OTHER_CHOICE = {
  id: "other",
  title: "Other",
  subtitle: "Ask anything else",
};

export default function ChatScreen({ route }) {
  const { profile = "Freelancer", topic = null } = route?.params || {};

  const [messages, setMessages] = useState([]); // start empty (clean page)
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // if user pressed Other, next typed message should go to OpenAI
  const [awaitingOtherQuestion, setAwaitingOtherQuestion] = useState(false);

  const welcomeText = useMemo(() => {
    return (
      "Welcome 👋 I’m your PayTech Robo-Advisor.\n" +
      "Pick a topic below or ask your own question about payment technology."
    );
  }, []);

  const quickChoices = useMemo(() => {
    return [...PRESET, OTHER_CHOICE];
  }, []);

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, sender, text },
    ]);
  };

  const simulateBotReply = async (text) => {
    setTyping(true);
    // small delay so TypingIndicator appears nicely
    await new Promise((r) => setTimeout(r, 450));
    addMessage("bot", text);
    setTyping(false);
  };

  const sendToOpenAI = async (value) => {
    setTyping(true);

    logEvent(analytics, "chat_used");

    try {
      const response = await fetch("https://paytech-roboadvisor.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: value,
          history: [], // you can later send previous messages if you want context
        }),
      });
const data = await response.json();

      addMessage("bot", data.response ?? "No response");
    } catch (error) {
      addMessage("bot", "Server connection error");
    }
    setTyping(false);
  };

  // user taps one of the 4 bubbles
  const onPickChoice = async (choice) => {
    // show the choice as a user bubble
    addMessage("user", choice.title);

    // 3 preset answers (no OpenAI)
    const presetItem = PRESET.find((x) => x.id === choice.id);
    if (presetItem) {
      setAwaitingOtherQuestion(false);
      await simulateBotReply(presetItem.answer);
      return;
    }

    // Other
    if (choice.id === "other") {
      setAwaitingOtherQuestion(true);
      await simulateBotReply("What’s your question?");
      return;
    }
  };

  const onSend = async () => {
    const value = input.trim();
    if (!value) return;

    // show user message
    addMessage("user", value);
    setInput("");

    // if they pressed Other before, route to OpenAI
    if (awaitingOtherQuestion) {
      setAwaitingOtherQuestion(false);
      await sendToOpenAI(value);
      return;
    }

    // if user typed directly without choosing anything → OpenAI
    await sendToOpenAI(value);
  };

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.header}>
  <View style={styles.headerRow}>
    <Image
      source={require("../assets/paylogo.jpg")} // عدّلي الاسم لو مختلف
      style={styles.headerAvatar}
      resizeMode="contain"
    />
    <Text style={styles.headerTitle}>AI-Based PayTech Advisor</Text>
  </View>

  <Text style={styles.headerSubtitle}>
    Human-centered guidance for payment technology.
  </Text>
</View>

  

     <KeyboardAvoidingView
  style={styles.flex}
>
      <FlatList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <MessageBubble message={item} />}
  contentContainerStyle={styles.listContent}

  ListHeaderComponent={() => (
    <View style={styles.topIntro}>
      <Text style={styles.welcomeTitle}>Welcome 👋</Text>

      <Text style={styles.welcomeDesc}>
        I'm your PayTech Robo-Advisor.{"\n"}
        Pick a topic below or ask your own question about payment technology.
      </Text>

      <View style={styles.quickWrap}>
        {quickChoices.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.quickChip}
            onPress={() => onPickChoice(c)}
            activeOpacity={0.85}
          >
            <Text style={styles.quickTitle}>{c.title}</Text>

            <Text style={styles.quickSubtitle} numberOfLines={2}>
              {c.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )}
/>


        {typing && <TypingIndicator />}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about payment technology..."
            placeholderTextColor="#7C7FB0"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BACKGROUND = "#0F1020";
const PRIMARY = "#5B3FFF";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  flex: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#23254A",
    backgroundColor: BACKGROUND,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 12, color: "#B0B3E6", marginTop: 2 },

  topIntro: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },


welcomeTitle: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "700",
  marginBottom: 4,
},

welcomeDesc: {
  color: "#B0B3E6",
  fontSize: 12,
  lineHeight: 18,
},

  quickWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
marginTop: 10,
  },
  quickChip: {
    width: "48%",
    backgroundColor: "#1B1D3A",
    borderWidth: 1,
    borderColor: "#23254A",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  quickTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  quickSubtitle: {
    color: "#B0B3E6",
    fontSize: 12,
    lineHeight: 16,
  },

  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  inputRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#23254A",
    backgroundColor: "#141529",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1E2040",
    color: "#FFFFFF",
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },

  headerRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

headerAvatar: {
  width: 28,
  height: 28,
  borderRadius: 8,
},
  
})