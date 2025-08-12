import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SearchBar = ({ searchQuery, onSearchChange, onClear }) => {
    return (
        <View className="px-4 py-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Text className="text-gray-400 mr-3">🔍</Text>
                <TextInput
                    placeholder="Search tasks, tags, or descriptions..."
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    className="flex-1 text-gray-800"
                    placeholderTextColor="#9CA3AF"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Text className="text-gray-400 text-lg">✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default SearchBar;