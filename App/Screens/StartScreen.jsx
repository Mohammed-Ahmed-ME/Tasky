import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Svg, Rect, Path, Text as SvgText, TSpan } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
    const [showButton, setShowButton] = useState(false);
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);

    useEffect(() => {
        // Show button after logo animation completes
        const timer = setTimeout(() => {
            setShowButton(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                })
            ]).start();
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const handleGetStarted = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Svg width={width * 0.9} height={120} viewBox="0 0 400 100">
                    {/* Blue rounded square background */}
                    <Rect x="10" y="10" width="80" height="80" rx="20" ry="20" fill="#1E90FF">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0,100; 0,-10; 0,5; 0,-2; 0,0"
                            dur="1.5s"
                            begin="0s"
                            fill="freeze"
                        />
                    </Rect>

                    {/* White checkmark */}
                    <Path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0,100; 0,-10; 0,5; 0,-2; 0,0"
                            dur="1.5s"
                            begin="0.2s"
                            fill="freeze"
                        />
                    </Path>

                    {/* Text "Tasky" */}
                    <SvgText x="110" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#000">
                        <TSpan opacity="0">T
                            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="1.8s" fill="freeze"/>
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,20; 0,-5; 0,2; 0,0"
                                dur="0.8s"
                                begin="1.8s"
                                fill="freeze"
                            />
                        </TSpan>
                    </SvgText>

                    <SvgText x="140" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#000">
                        <TSpan opacity="0">a
                            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.0s" fill="freeze"/>
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,20; 0,-5; 0,2; 0,0"
                                dur="0.8s"
                                begin="2.0s"
                                fill="freeze"
                            />
                        </TSpan>
                    </SvgText>

                    <SvgText x="170" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#000">
                        <TSpan opacity="0">s
                            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.2s" fill="freeze"/>
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,20; 0,-5; 0,2; 0,0"
                                dur="0.8s"
                                begin="2.2s"
                                fill="freeze"
                            />
                        </TSpan>
                    </SvgText>

                    <SvgText x="195" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#000">
                        <TSpan opacity="0">k
                            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.4s" fill="freeze"/>
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,20; 0,-5; 0,2; 0,0"
                                dur="0.8s"
                                begin="2.4s"
                                fill="freeze"
                            />
                        </TSpan>
                    </SvgText>

                    <SvgText x="225" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#000">
                        <TSpan opacity="0">y
                            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.6s" fill="freeze"/>
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,20; 0,-5; 0,2; 0,0"
                                dur="0.8s"
                                begin="2.6s"
                                fill="freeze"
                            />
                        </TSpan>
                    </SvgText>
                </Svg>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.subtitle}>Your Personal Task Manager</Text>
                <Text style={styles.description}>
                    Organize your life, one task at a time. Simple, efficient, and beautifully designed.
                </Text>
            </View>

            {showButton && (
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGetStarted}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Ready to boost your productivity?
                    </Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    contentContainer: {
        alignItems: 'center',
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
    },
    buttonContainer: {
        alignItems: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 25,
        shadowColor: '#1E90FF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#95a5a6',
        textAlign: 'center',
    },
});

export default StartScreen;