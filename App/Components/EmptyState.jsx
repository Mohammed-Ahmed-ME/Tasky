import React from 'react';
import {View, Text} from 'react-native';

const EmptyState = ({searchQuery}) => (
    <View className="flex-1 items-center justify-center py-12">
        <Text className="text-6xl mb-4">📝</Text>
        <Text className="text-xl font-semibold text-gray-600 mb-2">
            {searchQuery ? 'No tasks found' : 'No tasks yet'}
        </Text>
        <Text className="text-gray-500 text-center">
            {searchQuery
                ? 'Try adjusting your search or category filter'
                : 'Add your first task to get started!'
            }
        </Text>
    </View>
);

export default EmptyState;