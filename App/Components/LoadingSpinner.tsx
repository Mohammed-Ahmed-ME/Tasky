import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const LoadingSpinner = ({ message = 'Loading tasks...' }) => (
  <View className="flex-1 items-center justify-center py-12">
    <ActivityIndicator size="large" color="#3B82F6" />
    <Text className="text-gray-600 mt-2">{message}</Text>
  </View>
);

export default LoadingSpinner;