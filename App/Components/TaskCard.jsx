import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { UpdateTaskAPI } from '../API/TaskAPI';

const TaskCard = ({ data, onToggleComplete, onPress,tasks,setTasks }) => {
    const categories = [
        { id: 'all', name: 'All', icon: '📋', color: '#6B7280' },
        { id: 'work', name: 'Work', icon: '💼', color: '#3B82F6' },
        { id: 'personal', name: 'Personal', icon: '👤', color: '#10B981' },
        { id: 'health', name: 'Health', icon: '🏃', color: '#F59E0B' },
        { id: 'learning', name: 'Learning', icon: '📚', color: '#8B5CF6' },
    ];

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return '#EF4444';
            case 'medium': return '#F59E0B';
            case 'low': return '#10B981';
            default: return '#6B7280';
        }
    };

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category?.toLowerCase());
        return cat ? cat.color : '#6B7280';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';

        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays > 0) return `${diffDays} days left`;
        return `${Math.abs(diffDays)} days ago`;
    };


  const handleToggleComplete = async (taskId) => {
    try {
      // Optimistically update UI
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, completed: !task?.completed } : task
      );
      setTasks(updatedTasks);

      const task = tasks.find(t => t.id === taskId);
      await UpdateTaskAPI(taskId, {
        ...task,
        completed: !task?.completed
      });

    } catch (error) {
      console.error('Error toggling task completion:', error);

      // Revert optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );

      Alert.alert(
        'Error',
        'Failed to update task. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white rounded-xl p-4 mb-3 shadow-sm border ${
                data.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
            }}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className={`text-lg font-semibold ${
                        data.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                    }`}>
                        {data.title}
                    </Text>
                    <Text className={`text-sm mt-1 ${
                        data.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        {data.description}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={()=>{handleToggleComplete(data._id)}}
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        data.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                    }`}
                >
                    {data.completed && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center space-x-2">
                    <View
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: getCategoryColor(data.category) + '20' }}
                    >
                        <Text
                            className="text-xs font-medium capitalize"
                            style={{ color: getCategoryColor(data.category) }}
                        >
                            {data.category || 'General'}
                        </Text>
                    </View>
                    <View
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: getPriorityColor(data.priority) + '20' }}
                    >
                        <Text
                            className="text-xs font-medium capitalize"
                            style={{ color: getPriorityColor(data.priority) }}
                        >
                            {data.priority || 'medium'}
                        </Text>
                    </View>
                </View>
                <Text className="text-xs text-gray-500">
                    {formatDate(data.dueDate)}
                </Text>
            </View>

            {data.tags && data.tags.length > 0 && (
                <View className="flex-row mt-2 flex-wrap">
                    {data.tags.map((tag, index) => (
                        <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-1 mb-1">
                            <Text className="text-xs text-gray-600">#{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default TaskCard;