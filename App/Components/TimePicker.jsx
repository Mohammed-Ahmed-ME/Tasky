import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const ClockTimePicker = ({ visible, onClose, onTimeSelect, initialTime = "09:00", title = "Select Time" }) => {
    const [selectedHour, setSelectedHour] = useState(parseInt(initialTime.split(':')[0]));
    const [selectedMinute, setSelectedMinute] = useState(parseInt(initialTime.split(':')[1]));
    const [isSelectingMinutes, setIsSelectingMinutes] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const clockSize = Math.min(screenWidth * 0.7, 280);
    const clockRadius = clockSize / 2 - 20;
    const centerX = clockSize / 2;
    const centerY = clockSize / 2;

    // Format time for display
    const formatTime = (hour, minute) => {
        const displayHour = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
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

    const handleConfirm = () => {
        const hour24 = selectedHour === 12 ? 0 : selectedHour;
        const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        onTimeSelect(timeString);
        onClose();
    };

    const toggleAMPM = () => {
        setSelectedHour(selectedHour + (selectedHour >= 12 ? -12 : 12));
    };

    if (!visible) return null;

    return (
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
        }} className={'z-50'}>
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
                        <Text className="text-white text-xl font-bold">{title}</Text>
                        <TouchableOpacity
                            onPress={onClose}
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
                            {formatTime(selectedHour, selectedMinute)}
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
                        onPress={onClose}
                        className="flex-1 py-3 mr-2 bg-gray-100 rounded-xl"
                    >
                        <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        className="flex-1 py-3 ml-2 bg-[#0055ff] rounded-xl"
                    >
                        <Text className="text-center text-white font-semibold">Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ClockTimePicker;