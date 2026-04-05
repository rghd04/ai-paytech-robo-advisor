import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const PROFILES = ['Freelancer', 'Small Business', 'Company'];
const TOPICS = [
  'Payment delays',
  'Pricing and fees',
  'Refunds and disputes',
];

export default function OnboardingScreen({ navigation }) {
  const [profile, setProfile] = useState('Freelancer');
  const [topic, setTopic] = useState('Payment delays');

  const onStart = () => {
    navigation.navigate('Chat', { profile, topic });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>AI-Based PayTech Advisor</Text>
        <Text style={styles.subtitle}>
          I’m here to explain payment issues and help with pricing decisions.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select profile</Text>
          <View style={styles.row}>
            {PROFILES.map((item) => {
              const selected = profile === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setProfile(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select help topic</Text>
          {TOPICS.map((item) => {
            const selected = topic === item;
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.topicRow,
                  selected && styles.topicRowSelected,
                ]}
                onPress={() => setTopic(item)}
              >
                <Text
                  style={[
                    styles.topicText,
                    selected && styles.topicTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Concept prototype only — mock guidance, no real payments.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = '#5B3FFF';
const BACKGROUND = '#0F1020';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#181A32',
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#C3C7FF',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A3D66',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    color: '#C3C7FF',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  topicRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3A3D66',
    marginBottom: 8,
  },
  topicRowSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#252854',
  },
  topicText: {
    color: '#C3C7FF',
    fontSize: 13,
  },
  topicTextSelected: {
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  footerNote: {
    marginTop: 12,
    fontSize: 11,
    color: '#8184B0',
    textAlign: 'center',
  },
});
