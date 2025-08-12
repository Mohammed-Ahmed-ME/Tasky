import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ErrorMessage = ({ message, onRetry }) => (
  <View className="flex-1 items-center justify-center py-12">
    <Text className="text-6xl mb-4">⚠️</Text>
    <Text className="text-xl font-semibold text-gray-600 mb-2">
      Something went wrong
    </Text>
    <Text className="text-gray-500 text-center mb-4">
      {message}
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      className="bg-blue-500 px-6 py-3 rounded-lg"
    >
      <Text className="text-white font-medium">Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default ErrorMessage;