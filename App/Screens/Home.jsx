import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StatusBar,
    Image,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useStateContext } from '../context';

// Components
import TaskList from '../Components/TaskList';
import CategoryFilter from '../Components/CategoryFilter';
import SearchBar from '../Components/SearchBar';
import TaskStats from '../Components/TaskStates';
import { GetTasksAPI } from '../API/TaskAPI';

// Services and utilities
import {
    CATEGORIES,
    getCurrentDate,
    filterTasks,
    calculateTaskStats
} from '../Components/TaskConstants';
import AddTask from "../Components/AddTask";
import Footer from "../Components/UI/Footer";
import Navbar from "../Components/UI/Navbar";

const Home = ({navigation}) => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [addTask, setAddTask] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useStateContext();

    const { day, month, year } = getCurrentDate();

    // Fetch tasks from API
    const fetchTasks = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);

            const fetchedTasks = await GetTasksAPI();
            setTasks(fetchedTasks.tasks);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Handle pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks(false);
    };

    // Handle retry
    const handleRetry = () => {
        fetchTasks(true);
    };

    // Handle task press
    const handleTaskPress = (task) => {
        console.log('Task pressed:', task);
        // Navigate to task details screen
    };

    // Handle add task
    const handleAddTask = () => {
        console.log('Add task pressed');
        setAddTask(true)
    };

    // Handle search query change
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    // Handle search clear
    const handleSearchClear = () => {
        setSearchQuery('');
    };

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // Dismiss keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    // Filter tasks based on search and category
    const filteredTasks = filterTasks(tasks, searchQuery, selectedCategory);

    // Get task statistics
    const { completedTasks, totalTasks, pendingTasks } = calculateTaskStats(tasks);

    // Load tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);
    return (
        <View className="flex-1 bg-gray-50 dark">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
          <Navbar navigation={navigation} user={user}/>
            <AddTask isVisible={addTask} closeModal={() => setAddTask(false)}  user={user} handleCategorySelect={handleCategorySelect} handleRetry={handleRetry}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#3B82F6']}
                                tintColor="#3B82F6"
                            />
                        }
                    >
                        {/* Welcome Section */}
                        <View className="px-4 pt-6 pb-4">
                            <Text className="text-2xl font-bold text-gray-800">
                                Welcome back, {user?.name || 'User'}!
                            </Text>
                            <Text className="text-gray-600 mt-1">
                                {month} {day}, {year}
                            </Text>
                        </View>

                        {/* Task Statistics */}
                        <View className="px-4 pb-4">
                            <TaskStats
                                totalTasks={totalTasks}
                                completedTasks={completedTasks}
                                pendingTasks={pendingTasks}
                            />
                        </View>

                        {/* Search Bar */}
                        <View className="px-4 pb-4">
                            <SearchBar
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                                onClear={handleSearchClear}
                                placeholder="Search tasks..."
                            />
                        </View>

                        {/* Category Filter */}
                        <View className="pb-4">
                            <CategoryFilter
                                categories={CATEGORIES}
                                selectedCategory={selectedCategory}
                                onCategorySelect={handleCategorySelect}
                            />
                        </View>

                        {/* Task List */}
                        <View className="flex-1 px-4">
                            {error ? (
                                <View className="flex-1 justify-center items-center py-8">
                                    <Text className="text-red-500 text-center text-lg mb-4">
                                        {error}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleRetry}
                                        className="bg-blue-500 px-6 py-3 rounded-lg"
                                    >
                                        <Text className="text-white font-semibold">
                                            Retry
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TaskList
                                    tasks={filteredTasks}
                                    loading={loading}
                                    onTaskPress={handleTaskPress}
                                    setTasks={setTasks}
                                    selectedCategory={selectedCategory}
                                    categories={CATEGORIES}
                                    onAddTask={handleAddTask}
                                />
                            )}
                        </View>

                        {/* Add Task Button */}

                    </ScrollView>

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          <Footer handleAddTask={handleAddTask} navigation={navigation}/>
        </View>
    );
};

export default Home;