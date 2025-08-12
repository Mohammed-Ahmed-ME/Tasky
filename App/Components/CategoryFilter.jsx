import React from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ paddingHorizontal: 16 }}
        >
            {categories.map((category) => (
                <TouchableOpacity
                    key={category?.id}
                    onPress={() => onCategorySelect(category?.id)}
                    className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                        selectedCategory === category?.id
                            ? 'bg-blue-500'
                            : 'bg-gray-100'
                    }`}
                >
                    <Text className="mr-1">{category?.icon}</Text>
                    <Text
                        className={`text-sm font-medium ${
                            selectedCategory === category?.id ? 'text-white' : 'text-gray-700'
                        }`}
                    >
                        {category?.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default CategoryFilter;