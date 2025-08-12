import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const TaskList = ({
                    tasks,
                    setTasks,
                    loading,
                    error,
                    searchQuery,
                    selectedCategory,
                    categories,
                    onTaskPress,
                    onRetry,
                    onAddTask,
                  }) => {
  const getSectionTitle = () => {
    if (selectedCategory === 'all') return 'All Tasks';
    const category = categories?.find(c => c.id === selectedCategory);
    return `${category?.name || 'Unknown'} Tasks`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <View className="flex-1 px-4 py-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-800">
          {getSectionTitle()}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={onAddTask}
        >
          <Text className="text-white font-medium">+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TaskCard
              data={item}
              onPress={() => onTaskPress(item)}
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default TaskList;