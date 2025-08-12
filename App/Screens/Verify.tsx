import { Text, View, TextInput, TouchableOpacity, Alert, StatusBar, Keyboard } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Shield } from 'lucide-react-native';

interface VerifyProps {
    navigation: any; // Should be properly typed with navigation prop
    onVerificationSuccess?: (code: string) => void;
    email?: string;
    phoneNumber?: string;
    resendInterval?: number; // Time in seconds before allowing resend
}

const Verify: React.FC<VerifyProps> = ({
                                           navigation,
                                           onVerificationSuccess,
                                           email,
                                           phoneNumber,
                                           resendInterval = 30
                                       }) => {
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Timer for resend functionality
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleCodeChange = useCallback((text: string, index: number) => {
        // Clear any existing error
        if (error) setError('');

        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');

        // Handle paste operation - if multiple characters, distribute them
        if (numericText.length > 1) {
            const pastedDigits = numericText.split('').slice(0, 6);
            const newCode = [...code];

            pastedDigits.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });

            setCode(newCode);

            // Focus the next empty input or the last input
            const nextIndex = Math.min(index + pastedDigits.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        // Update the code array
        const newCode = [...code];
        newCode[index] = numericText;
        setCode(newCode);

        // Auto-focus next input
        if (numericText && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [code, error]);

    const handleKeyPress = useCallback((e: any, index: number) => {
        // Handle backspace to go to previous input
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            // Also clear the previous input
            const newCode = [...code];
            newCode[index - 1] = '';
            setCode(newCode);
        }
    }, [code]);

    const handleResendCode = useCallback(async () => {
        if (resendTimer > 0) return;

        setIsResending(true);
        setError('');

        try {
            // Simulate API call - replace with actual API call
            await new Promise<void>(resolve => setTimeout(resolve, 1000));

            // Reset the code inputs
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

            // Start resend timer
            setResendTimer(resendInterval);

            Alert.alert(
                'Code Resent',
                `A new verification code has been sent to ${email || phoneNumber || 'your contact'}.`
            );
        } catch (error) {
            setError('Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    }, [email, phoneNumber, resendTimer, resendInterval]);

    const handleVerify = useCallback(async () => {
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call - replace with actual verification API
            await new Promise<void>(resolve => setTimeout(resolve, 2000));

            // Simulate random success/failure for demo
            const isSuccess = Math.random() > 0.3; // 70% success rate for demo

            if (isSuccess) {
                // Dismiss keyboard
                Keyboard.dismiss();

                // Call success callback if provided
                if (onVerificationSuccess) {
                    onVerificationSuccess(fullCode);
                } else {
                    Alert.alert('Success', 'Your account has been verified successfully!');
                }
            } else {
                throw new Error('Invalid verification code');
            }
        } catch (error) {
            setError('Invalid verification code. Please try again.');
            // Clear the code and focus first input
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    }, [code, onVerificationSuccess]);

    const handleBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const isCodeComplete = code.join('').length === 6;
    const contactInfo = email || phoneNumber || 'your contact';
    const isEmailVerification = !!email;
    const canResend = resendTimer === 0 && !isResending;

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header with back button */}
            <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
                <TouchableOpacity
                    onPress={handleBackPress}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={20} color="#374151" />
                </TouchableOpacity>
                <View className="flex-1" />
            </View>

            {/* Main content */}
            <View className="flex-1 px-6 justify-center">
                <View className="items-center mb-8">
                    <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
                        {isEmailVerification ? (
                            <Mail size={32} color="#3B82F6" />
                        ) : (
                            <Phone size={32} color="#3B82F6" />
                        )}
                    </View>

                    <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
                        Verify Your Account
                    </Text>

                    <Text className="text-gray-600 text-center text-base leading-6 px-4">
                        We've sent a 6-digit verification code to{'\n'}
                        <Text className="font-semibold text-gray-800">{contactInfo}</Text>
                    </Text>
                </View>

                {/* Code input fields */}
                <View className="flex-row justify-center gap-3 mb-4">
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref; }}
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            className={`w-12 h-14 border-2 ${
                                error
                                    ? 'border-red-500 bg-red-50'
                                    : digit
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-gray-50'
                            } text-center rounded-xl text-xl font-bold text-gray-900 
              ${isLoading ? 'opacity-50' : ''}`}
                            maxLength={1}
                            keyboardType="numeric"
                            textAlign="center"
                            editable={!isLoading}
                            selectTextOnFocus
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                {/* Error message */}
                {error ? (
                    <View className="items-center mb-4">
                        <Text className="text-red-500 text-sm text-center">
                            {error}
                        </Text>
                    </View>
                ) : null}

                {/* Verify button */}
                <TouchableOpacity
                    onPress={handleVerify}
                    className={`py-4 rounded-xl mb-6 ${
                        isCodeComplete && !isLoading
                            ? 'bg-blue-600 active:bg-blue-700'
                            : 'bg-gray-300'
                    }`}
                    disabled={!isCodeComplete || isLoading}
                    activeOpacity={0.8}
                >
                    <Text className={`text-center font-semibold text-lg ${
                        isCodeComplete && !isLoading ? 'text-white' : 'text-gray-500'
                    }`}>
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </Text>
                </TouchableOpacity>

                {/* Resend code section */}
                <View className="items-center">
                    <Text className="text-gray-600 text-sm mb-2">
                        Didn't receive the code?
                    </Text>
                    <TouchableOpacity
                        onPress={handleResendCode}
                        disabled={!canResend}
                        className="py-2 px-4 rounded-lg active:bg-gray-100"
                        activeOpacity={0.7}
                    >
                        <Text className={`font-semibold text-sm ${
                            canResend ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                            {isResending
                                ? 'Sending...'
                                : resendTimer > 0
                                    ? `Resend in ${resendTimer}s`
                                    : 'Resend Code'
                            }
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Security note */}
                <View className="mt-8 flex-row items-center justify-center px-4">
                    <Shield size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-2 text-center">
                        For security, this code will expire in 10 minutes
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Verify;