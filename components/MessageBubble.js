import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.alignRight : styles.alignLeft,
      ]}
    >
      {/* Avatar للبوت فقط */}
      {!isUser && (
        <Image
          source={require('../assets/paylogo.jpg')} 
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.text}>{message.text}</Text>
      </View>
    </View>
  );
}

const PRIMARY = '#5B3FFF';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },

  alignLeft: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },

  alignRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 6,
  },

  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  userBubble: {
    backgroundColor: PRIMARY,
    borderBottomRightRadius: 4,
  },

  botBubble: {
    backgroundColor: '#23254A',
    borderBottomLeftRadius: 4,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});