import {
    Modal,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    PanResponder,
    Alert
} from 'react-native';
import React, {useState} from "react";
import { CreateTaskAPI } from '../API/TaskAPI';
import {ChevronDown, ChevronUp, CalendarDays, Clock, X} from "lucide-react-native";
import {Calendar} from 'react-native-calendars';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const AddTask = ({isVisible, closeModal, handleCategorySelect, handleRetry}) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '09:00',
        status: 'pending',
    });

    const [categoryDropdown, setCategoryDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Time picker state
    const initialTime = task.dueTime;
    const [selectedHour, setSelectedHour] = useState(parseInt(initialTime.split(':')[0]));
    const [selectedMinute, setSelectedMinute] = useState(parseInt(initialTime.split(':')[1]));
    const [isSelectingMinutes, setIsSelectingMinutes] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const clockSize = Math.min(screenWidth * 0.7, 280);
    const clockRadius = clockSize / 2 - 20;
    const centerX = clockSize / 2;
    const centerY = clockSize / 2;
    const modalHeight = screenHeight * 0.8;

    const categories = ['Work', 'Personal', 'Health', 'Education', 'Shopping', 'Other'];

    // Format time for display (12-hour format)
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const minute = parseInt(minutes);
        const displayHour = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    // Format time for display (for clock picker)
    const formatClockTime = (hour, minute) => {
        const displayHour = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate angle for clock positions
    const getAngle = (value, max) => {
        return (value * 360) / max - 90; // -90 to start from top
    };

    // Convert angle to coordinates
    const getCoordinates = (angle, radius) => {
        const radian = (angle * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(radian),
            y: centerY + radius * Math.sin(radian)
        };
    };

    // Handle touch on clock
    const handleClockTouch = (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const dx = locationX - centerX;
        const dy = locationY - centerY;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const normalizedAngle = (angle + 90 + 360) % 360;

        if (isSelectingMinutes) {
            const minute = Math.round(normalizedAngle / 6) % 60;
            setSelectedMinute(minute);
        } else {
            const hour = Math.round(normalizedAngle / 30) % 12;
            setSelectedHour(hour === 0 ? 12 : hour);
        }
    };

    // Create pan responder for dragging
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: handleClockTouch,
        onPanResponderMove: handleClockTouch,
    });

    // Generate clock numbers
    const renderClockNumbers = () => {
        const numbers = [];
        const values = isSelectingMinutes ?
            [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] :
            [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        values.forEach((value, index) => {
            const angle = isSelectingMinutes ?
                getAngle(value, 60) :
                getAngle(index, 12);
            const coords = getCoordinates(angle, clockRadius - 25);

            const isSelected = isSelectingMinutes ?
                value === selectedMinute :
                (value === 12 ? 0 : value) === (selectedHour % 12);

            numbers.push(
                <SvgText
                    key={value}
                    x={coords.x}
                    y={coords.y + 6}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight={isSelected ? "bold" : "normal"}
                    fill={isSelected ? "#0055ff" : "#374151"}
                >
                    {isSelectingMinutes ? value.toString().padStart(2, '0') : value}
                </SvgText>
            );
        });
        return numbers;
    };

    // Render clock hand
    const renderClockHand = () => {
        const currentValue = isSelectingMinutes ? selectedMinute : selectedHour % 12;
        const maxValue = isSelectingMinutes ? 60 : 12;
        const angle = getAngle(currentValue, maxValue);
        const handLength = clockRadius - 40;
        const handCoords = getCoordinates(angle, handLength);

        return (
            <>
                <Line
                    x1={centerX}
                    y1={centerY}
                    x2={handCoords.x}
                    y2={handCoords.y}
                    stroke="#0055ff"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <Circle
                    cx={handCoords.x}
                    cy={handCoords.y}
                    r="8"
                    fill="#0055ff"
                />
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r="6"
                    fill="#0055ff"
                />
            </>
        );
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setTask({ ...task, [field]: value });
    };

    // Reset task to default values
    const resetTask = () => {
        setTask({
            title: '',
            description: '',
            category: 'Work',
            priority: 'Medium',
            dueDate: new Date().toISOString().split('T')[0],
            dueTime: '09:00',
            status: 'pending',
        });
        setSelectedHour(9);
        setSelectedMinute(0);
        setCategoryDropdown(false);
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    // Save task
    const saveTask = async () => {
        if (!task.title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        try {
            await CreateTaskAPI(task);
            handleRetry();
            handleCategorySelect('all');
            resetTask();
            closeModal();
        } catch (error) {
            Alert.alert('Error', 'Failed to create task. Please try again.');
            console.error('Error creating task:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        resetTask();
        closeModal();
    };

    // Handle time picker confirm
    const handleTimeConfirm = () => {
        // Convert to 24-hour format
        const hour24 = selectedHour === 12 ?
            (selectedHour >= 12 ? 12 : 0) :
            selectedHour + (selectedHour >= 12 ? 0 : 0);

        const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        handleInputChange('dueTime', timeString);
        setShowTimePicker(false);
    };

    // Toggle AM/PM
    const toggleAMPM = () => {
        setSelectedHour(prevHour => {
            if (prevHour >= 12) {
                return prevHour - 12;
            } else {
                return prevHour + 12;
            }
        });
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={handleCancel}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                {/* Transparent overlay area */}
                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={handleCancel}
                />

                {/* Modal content */}
                <View
                    style={{
                        height: modalHeight,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: -2},
                        shadowOpacity: 0.25,
                        shadowRadius: 10,
                        elevation: 10,
                    }}
                >
                    {/* Header */}
                    <View className="bg-white border-b border-gray-200 pt-4 pb-4 px-6 rounded-t-3xl">
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity
                                className="py-2 px-3 rounded-lg"
                                onPress={handleCancel}
                            >
                                <Text className="text-lg text-gray-600 font-medium">Cancel</Text>
                            </TouchableOpacity>

                            <Text className="text-2xl font-bold text-[#0055ff]">New Task</Text>

                            <TouchableOpacity
                                className="py-2 px-3 rounded-lg bg-[#0055ff]"
                                onPress={saveTask}
                            >
                                <Text className="text-lg text-white font-medium">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView
                        className="flex-1 bg-white px-6"
                        contentContainerStyle={{paddingBottom: 20}}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Task Title */}
                        <View className="mb-6 mt-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-base font-semibold text-gray-800">
                                    Task Title
                                </Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>
                            <TextInput
                                onChangeText={(text) => handleInputChange('title', text)}
                                value={task.title}
                                placeholder="Enter task title..."
                                placeholderTextColor="#9ca3af"
                                className="bg-gray-50 border border-gray-200 w-full h-14 rounded-xl px-4 text-gray-900 text-base focus:border-[#0055ff]"
                                autoCapitalize="sentences"
                                autoCorrect={true}
                            />
                        </View>

                        {/* Task Description */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-base font-semibold text-gray-800">
                                    Description
                                </Text>
                            </View>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => handleInputChange('description', text)}
                                value={task.description}
                                placeholder="Add task description (optional)..."
                                placeholderTextColor="#9ca3af"
                                className="bg-gray-50 border border-gray-200 w-full h-32 rounded-xl px-4 py-3 text-gray-900 text-base focus:border-[#0055ff]"
                                textAlignVertical="top"
                                autoCapitalize="sentences"
                                autoCorrect={true}
                            />
                        </View>

                        {/* Category */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-base font-semibold text-gray-800">
                                    Category
                                </Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setCategoryDropdown(!categoryDropdown)}
                                className="flex-row justify-between items-center bg-gray-50 border border-gray-200 w-full h-14 rounded-xl px-4"
                            >
                                <Text className="text-gray-900 text-base font-medium">{task.category}</Text>
                                <View>
                                    {categoryDropdown ?
                                        <ChevronUp size={20} color="#6b7280" /> :
                                        <ChevronDown size={20} color="#6b7280" />
                                    }
                                </View>
                            </TouchableOpacity>

                            {categoryDropdown && (
                                <View className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    {categories.map((category, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                handleInputChange('category', category);
                                                setCategoryDropdown(false);
                                            }}
                                            className={`p-4 ${index !== categories.length - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            <Text className={`text-base ${task.category === category ? 'text-[#0055ff] font-semibold' : 'text-gray-700'}`}>
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Priority */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-base font-semibold text-gray-800">
                                    Priority
                                </Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <TouchableOpacity
                                    onPress={() => handleInputChange('priority', 'Low')}
                                    className={`flex-1 mr-2 h-14 rounded-xl justify-center items-center border-2 ${
                                        task.priority === 'Low'
                                            ? 'bg-green-500 border-green-500'
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <Text className={`text-base font-semibold ${
                                        task.priority === 'Low' ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        Low
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleInputChange('priority', 'Medium')}
                                    className={`flex-1 mx-1 h-14 rounded-xl justify-center items-center border-2 ${
                                        task.priority === 'Medium'
                                            ? 'bg-orange-500 border-orange-500'
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <Text className={`text-base font-semibold ${
                                        task.priority === 'Medium' ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        Medium
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleInputChange('priority', 'High')}
                                    className={`flex-1 ml-2 h-14 rounded-xl justify-center items-center border-2 ${
                                        task.priority === 'High'
                                            ? 'bg-red-500 border-red-500'
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <Text className={`text-base font-semibold ${
                                        task.priority === 'High' ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        High
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Due Date & Time */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-base font-semibold text-gray-800">
                                    Due Date & Time
                                </Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>

                            <View className="flex-row space-x-3">
                                {/* Date Picker */}
                                <TouchableOpacity
                                    className="flex-1 flex-row justify-between items-center bg-gray-50 border border-gray-200 h-14 rounded-xl px-4 mr-2"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <View className="flex-1">
                                        <Text className="text-gray-900 text-base font-medium">
                                            {formatDate(task.dueDate)}
                                        </Text>
                                    </View>
                                    <CalendarDays size={20} color="#6b7280" />
                                </TouchableOpacity>

                                {/* Time Picker */}
                                <TouchableOpacity
                                    className="flex-1 flex-row justify-between items-center bg-gray-50 border border-gray-200 h-14 rounded-xl px-4 ml-2"
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <View className="flex-1">
                                        <Text className="text-gray-900 text-base font-medium">
                                            {formatTime(task.dueTime)}
                                        </Text>
                                    </View>
                                    <Clock size={20} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            {/* Date Picker Calendar */}
                            {showDatePicker && (
                                <View className="mt-4 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                    <View className="bg-gradient-to-r from-[#0055ff] to-[#0066ff] p-4">
                                        <Text className="text-white text-lg font-semibold text-center">
                                            Select Due Date
                                        </Text>
                                    </View>
                                    <Calendar
                                        style={{
                                            borderWidth: 0,
                                            height: 350,
                                        }}
                                        theme={{
                                            backgroundColor: '#ffffff',
                                            calendarBackground: '#ffffff',
                                            textSectionTitleColor: '#b6c1cd',
                                            selectedDayBackgroundColor: '#0055ff',
                                            selectedDayTextColor: '#ffffff',
                                            todayTextColor: '#0055ff',
                                            dayTextColor: '#2d4150',
                                            textDisabledColor: '#dd99ee',
                                            monthTextColor: '#2d4150',
                                            indicatorColor: '#0055ff',
                                            textDayFontWeight: '500',
                                            textMonthFontWeight: '600',
                                            textDayHeaderFontWeight: '600',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 18,
                                            textDayHeaderFontSize: 14
                                        }}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        onDayPress={(day) => {
                                            handleInputChange('dueDate', day.dateString);
                                            setShowDatePicker(false);
                                        }}
                                        markedDates={{
                                            [task.dueDate]: {
                                                selected: true,
                                                selectedColor: '#0055ff'
                                            }
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Time Picker Modal */}
            {showTimePicker && (
                <Modal
                    visible={showTimePicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowTimePicker(false)}
                >
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 24,
                            width: screenWidth * 0.9,
                            maxWidth: 400,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                            elevation: 20,
                        }}>
                            {/* Header */}
                            <View className="bg-gradient-to-r from-[#0055ff] to-[#0066ff] p-4 rounded-t-3xl">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-white text-xl font-bold">Select Time</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowTimePicker(false)}
                                        className="p-2 rounded-full bg-white/20"
                                    >
                                        <X size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Time Display */}
                            <View className="bg-gray-50 py-4 px-6">
                                <View className="flex-row items-center justify-center space-x-4">
                                    <Text className="text-4xl font-bold text-gray-800">
                                        {formatClockTime(selectedHour, selectedMinute)}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={toggleAMPM}
                                        className="bg-[#0055ff] px-3 py-1 rounded-lg"
                                    >
                                        <Text className="text-white font-semibold">
                                            {selectedHour >= 12 ? 'PM' : 'AM'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Mode Toggle */}
                            <View className="flex-row bg-gray-100 mx-4 mt-4 rounded-xl p-1">
                                <TouchableOpacity
                                    onPress={() => setIsSelectingMinutes(false)}
                                    className={`flex-1 py-2 rounded-lg ${!isSelectingMinutes ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <Text className={`text-center font-semibold ${!isSelectingMinutes ? 'text-[#0055ff]' : 'text-gray-600'}`}>
                                        Hours
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setIsSelectingMinutes(true)}
                                    className={`flex-1 py-2 rounded-lg ${isSelectingMinutes ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <Text className={`text-center font-semibold ${isSelectingMinutes ? 'text-[#0055ff]' : 'text-gray-600'}`}>
                                        Minutes
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Clock */}
                            <View className="p-6 items-center">
                                <View
                                    style={{
                                        width: clockSize,
                                        height: clockSize,
                                        borderRadius: clockSize / 2,
                                        backgroundColor: '#f9fafb',
                                        borderWidth: 2,
                                        borderColor: '#e5e7eb',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                    {...panResponder.panHandlers}
                                >
                                    <Svg width={clockSize} height={clockSize}>
                                        {/* Clock face */}
                                        <Circle
                                            cx={centerX}
                                            cy={centerY}
                                            r={clockRadius}
                                            fill="transparent"
                                            stroke="#e5e7eb"
                                            strokeWidth="1"
                                        />

                                        {/* Hour markers */}
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const angle = (i * 30) - 90;
                                            const outerCoords = getCoordinates(angle, clockRadius - 5);
                                            const innerCoords = getCoordinates(angle, clockRadius - 15);
                                            return (
                                                <Line
                                                    key={i}
                                                    x1={outerCoords.x}
                                                    y1={outerCoords.y}
                                                    x2={innerCoords.x}
                                                    y2={innerCoords.y}
                                                    stroke="#d1d5db"
                                                    strokeWidth="2"
                                                />
                                            );
                                        })}

                                        {/* Numbers */}
                                        {renderClockNumbers()}

                                        {/* Clock hand */}
                                        {renderClockHand()}
                                    </Svg>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between p-4 border-t border-gray-200">
                                <TouchableOpacity
                                    onPress={() => setShowTimePicker(false)}
                                    className="flex-1 py-3 mr-2 bg-gray-100 rounded-xl"
                                >
                                    <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleTimeConfirm}
                                    className="flex-1 py-3 ml-2 bg-[#0055ff] rounded-xl"
                                >
                                    <Text className="text-center text-white font-semibold">Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </Modal>
    );
};

export default AddTask;