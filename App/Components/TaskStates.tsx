import React from 'react';
import { View, Text } from 'react-native';

const TaskStats = ({ totalTasks, completedTasks, pendingTasks }) => {
    return (
        <View className="flex-row justify-between">
            <View className="bg-blue-50 px-4 py-3 rounded-lg flex-1 mr-2">
                <Text className="text-2xl font-bold text-blue-600">{totalTasks}</Text>
                <Text className="text-sm text-blue-600">Total Tasks</Text>
            </View>
            <View className="bg-green-50 px-4 py-3 rounded-lg flex-1 mx-1">
                <Text className="text-2xl font-bold text-green-600">{completedTasks}</Text>
                <Text className="text-sm text-green-600">Completed</Text>
            </View>
            <View className="bg-orange-50 px-4 py-3 rounded-lg flex-1 ml-2">
                <Text className="text-2xl font-bold text-orange-600">{pendingTasks}</Text>
                <Text className="text-sm text-orange-600">Pending</Text>
            </View>
        </View>
    );
};

export default TaskStats;