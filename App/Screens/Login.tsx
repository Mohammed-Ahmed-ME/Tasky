import {
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ListRenderItem,
  ActivityIndicator
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { Label } from '@react-navigation/elements';
import { useStateContext } from "../context";
import { AxiosError } from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginAPI, RegisterAPI } from '../API/UserAPI';

// Type definitions
interface LoginProps {
  navigation: {
    navigate: (route: string) => void;
    replace: (route: string) => void;
  };
}

interface CardinalState {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  gender?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  isVerified: boolean;
}

interface GenderOption {
  value: string;
  label: string;
  icon: string;
}

interface PasswordStrengthResult {
  strength: number;
  label: string;
  color: string;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface AdvancedGenderSelectorProps {
  onSelect: (value: string) => void;
  selectedValue: string;
  error?: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [cardinals, setCardinals] = useState<CardinalState>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: ''
  });
  const [newAccount, setNewAccount] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { setUser } = useStateContext();

  // Memoized validation function to prevent unnecessary re-renders
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cardinals.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(cardinals.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!cardinals.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (cardinals.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // New account validations
    if (newAccount) {
      if (!cardinals.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!cardinals.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (cardinals.password !== cardinals.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!cardinals.gender.trim()) {
        newErrors.gender = 'Gender is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [cardinals, newAccount]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      if (newAccount) {
        const registerResponse = await RegisterAPI({
          name: cardinals.name,
          email: cardinals.email,
          password: cardinals.password,
          gender: cardinals.gender
        });

        if (registerResponse.status === 201) {
          Alert.alert(
              "Success",
              "Account created successfully! Please verify your email to continue.",
              [{ text: "OK", onPress: () => navigation.navigate('Verify') }]
          );
          setCardinals({ email: '', password: '', confirmPassword: '', name: '', gender: '' });
        }
      } else {
        const res = await LoginAPI({
          email: cardinals.email,
          password: cardinals.password
        });

        if (res.status === 200 && res.data.token) {
          await AsyncStorage.setItem('token', res.data.token);
          await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
          const user = res.data.user;
          // @ts-ignore
          setUser(user);

          if (!res.data.user.isVerified) {
            navigation.navigate('Verify');
          } else {
            navigation.replace('Home');
          }
        }
      }
    } catch (error) {
      console.log('Request failed:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          (newAccount ? "Failed to create account" : "Login failed. Please check your credentials.");

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, newAccount, cardinals, navigation, setUser]);

  const handleInputChange = useCallback((field: keyof CardinalState, value: string): void => {
    setCardinals(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const toggleAccountType = useCallback(() => {
    setNewAccount(prev => !prev);
    setErrors({});
    setCardinals({ email: '', password: '', confirmPassword: '', name: '', gender: '' });
  }, []);

  const dismissKeyboard = useCallback((): void => {
    Keyboard.dismiss();
  }, []);

  // Memoized input style to prevent recalculation
  const getInputStyle = useCallback((fieldError?: string) => {
    return `bg-gray-100 dark:bg-gray-800 w-full h-12 rounded-lg px-4 text-gray-900 dark:text-white ${
        fieldError ? 'border-2 border-red-500' : 'border border-gray-300 dark:border-gray-600'
    }`;
  }, []);

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white dark:bg-black"
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 items-center justify-center px-4 py-1">
              {/* Logo Section */}
              <View className="items-center mb-1">
                <Image
                    source={require('../Assets/Logo.png')}
                    style={{ width: 200, height: 60 }}
                    resizeMode="contain"
                    className="mb-4"
                />
                <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                  {newAccount ? 'Create Account' : 'Welcome Back'}
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 text-center mt-2">
                  {newAccount ? 'Sign up to get started' : 'Sign in to your account'}
                </Text>
              </View>

              {/* Form Fields */}
              <View className="w-full max-w-sm">
                {/* Name Field - Only for new accounts */}
                {newAccount && (
                    <View className="mb-4">
                      <View className="flex-row items-center mb-1">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </Label>
                        <Text className="text-red-500 ml-1">*</Text>
                      </View>
                      <TextInput
                          onChangeText={(text: string) => handleInputChange('name', text)}
                          value={cardinals.name}
                          placeholder="Enter your full name"
                          placeholderTextColor="#6b7280"
                          inputMode="text"
                          keyboardType="default"
                          autoCapitalize="words"
                          autoComplete="name"
                          autoCorrect={false}
                          textContentType="name"
                          accessibilityLabel="Name input"
                          className={getInputStyle(errors.name)}
                          editable={!isLoading}
                      />
                      {errors.name && (
                          <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
                      )}
                    </View>
                )}

                {/* Email Field */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <Text className="text-red-500 ml-1">*</Text>
                  </View>
                  <TextInput
                      onChangeText={(text: string) => handleInputChange('email', text)}
                      value={cardinals.email}
                      placeholder="Enter your email"
                      placeholderTextColor="#6b7280"
                      inputMode="email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      textContentType="emailAddress"
                      accessibilityLabel="Email input"
                      className={getInputStyle(errors.email)}
                      editable={!isLoading}
                  />
                  {errors.email && (
                      <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                  )}
                </View>

                {/* Password Field */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <Text className="text-red-500 ml-1">*</Text>
                  </View>
                  <View className="relative">
                    <TextInput
                        onChangeText={(text: string) => handleInputChange('password', text)}
                        value={cardinals.password}
                        secureTextEntry={true}
                        placeholder="Enter your password"
                        placeholderTextColor="#6b7280"
                        inputMode="text"
                        keyboardType="default"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        textContentType="password"
                        accessibilityLabel="Password input"
                        className={getInputStyle(errors.password)}
                        editable={!isLoading}
                    />
                    {newAccount && (
                        <PasswordStrengthIndicator password={cardinals.password} />
                    )}
                  </View>
                  {errors.password && (
                      <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
                  )}
                  {!newAccount && (
                      <TouchableOpacity className="mt-2" disabled={isLoading}>
                        <Text className="text-blue-600 dark:text-blue-400 text-sm">
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>
                  )}
                </View>

                {/* Confirm Password Field - Only for new accounts */}
                {newAccount && (
                    <View className="mb-4">
                      <View className="flex-row items-center mb-1">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm Password
                        </Label>
                        <Text className="text-red-500 ml-1">*</Text>
                      </View>
                      <TextInput
                          onChangeText={(text: string) => handleInputChange('confirmPassword', text)}
                          value={cardinals.confirmPassword}
                          secureTextEntry={true}
                          placeholder="Confirm your password"
                          placeholderTextColor="#6b7280"
                          inputMode="text"
                          keyboardType="default"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect={false}
                          textContentType="password"
                          accessibilityLabel="Confirm password input"
                          className={getInputStyle(errors.confirmPassword)}
                          editable={!isLoading}
                      />
                      {errors.confirmPassword && (
                          <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword}</Text>
                      )}
                    </View>
                )}

                {/* Advanced Gender Selection - Only for new accounts */}
                {newAccount && (
                    <View className="mb-6">
                      <View className="flex-row items-center mb-1">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gender Identity
                        </Label>
                        <Text className="text-red-500 ml-1">*</Text>
                      </View>
                      <AdvancedGenderSelector
                          onSelect={(value: string) => handleInputChange('gender', value)}
                          selectedValue={cardinals.gender}
                          error={errors.gender}
                          disabled={isLoading}
                      />
                      {errors.gender && (
                          <Text className="text-red-500 text-xs mt-1">{errors.gender}</Text>
                      )}
                    </View>
                )}

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading}
                    className={`w-full h-12 rounded-lg items-center justify-center mb-4 flex-row ${
                        isLoading
                            ? 'bg-gray-400 dark:bg-gray-600'
                            : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                >
                  {isLoading && (
                      <ActivityIndicator size="small" color="white" className="mr-2" />
                  )}
                  <Text className="text-white font-semibold text-lg">
                    {isLoading ? 'Please wait...' : (newAccount ? 'Create Account' : 'Sign In')}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center z-50">
                  <Text className="text-gray-600 dark:text-gray-300 text-sm">
                    {newAccount ? "Already" : "Don't"} have an account?{' '}
                    <Text
                        onPress={toggleAccountType}
                        className="text-blue-600 dark:text-blue-400 font-medium"
                        accessibilityRole="button"
                        accessibilityLabel={newAccount ? "Switch to login" : "Switch to sign up"}
                    >
                      {newAccount ? "Sign In" : "Sign Up"}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {!newAccount && (
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                }}>
                  <Image
                      source={require('../Assets/MLogo.png')}
                      style={{
                        width: 200,
                        height: 128,
                      }}
                      resizeMode="contain"
                      className={'relative'}
                  />
                  <Text className={' absolute bottom-[75px] right-[120px] text-black '}>Powered By</Text>
                </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  );
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = React.memo(({ password }) => {
  const strengthData = useMemo((): PasswordStrengthResult => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-300' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { strength: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { strength: score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { strength: score, label: 'Good', color: 'bg-blue-500' };
    return { strength: score, label: 'Strong', color: 'bg-green-500' };
  }, [password]);

  const { strength, label, color } = strengthData;

  if (!password) return null;

  return (
      <View className="mt-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Password Strength</Text>
          <Text className={`text-xs font-medium ${
              strength <= 2 ? 'text-red-500' :
                  strength <= 3 ? 'text-yellow-500' :
                      strength <= 4 ? 'text-blue-500' : 'text-green-500'
          }`}>
            {label}
          </Text>
        </View>
        <View className="flex-row space-x-1">
          {[1, 2, 3, 4, 5].map((i: number) => (
              <View
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                      i <= strength ? color : 'bg-gray-300 dark:bg-gray-600'
                  }`}
              />
          ))}
        </View>
      </View>
  );
});

interface ExtendedAdvancedGenderSelectorProps extends AdvancedGenderSelectorProps {
  disabled?: boolean;
}

const AdvancedGenderSelector: React.FC<ExtendedAdvancedGenderSelectorProps> = React.memo(({
                                                                                            onSelect,
                                                                                            selectedValue,
                                                                                            error,
                                                                                            disabled = false
                                                                                          }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const genderOptions: GenderOption[] = useMemo(() => [
    { value: 'male', label: 'Male', icon: '♂️' },
    { value: 'female', label: 'Female', icon: '♀️' },
  ], []);

  const toggleModal = useCallback((): void => {
    if (!disabled) {
      setModalVisible(prev => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback((item: GenderOption): void => {
    onSelect(item.value);
    toggleModal();
  }, [onSelect, toggleModal]);

  const selectedOption = useMemo((): GenderOption | undefined => {
    return genderOptions.find((option: GenderOption) => option.value === selectedValue);
  }, [genderOptions, selectedValue]);

  const renderGenderOption: ListRenderItem<GenderOption> = useCallback(({ item, index }) => (
      <TouchableOpacity
          onPress={() => handleSelect(item)}
          className={`p-4 flex-row items-center transition-all ${
              index === 0 ? 'rounded-t-lg' : ''
          } ${
              index === genderOptions.length - 1 ? 'rounded-b-lg border-b-0' : 'border-b border-gray-100 dark:border-gray-700'
          } ${
              selectedValue === item.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
          }`}
          activeOpacity={0.7}
      >
        <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mr-3">
          <Text className="text-lg">{item.icon}</Text>
        </View>

        <Text className={`text-base flex-1 ${
            selectedValue === item.value
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-900 dark:text-white font-medium'
        }`}>
          {item.label}
        </Text>

        {selectedValue === item.value && (
            <View className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 items-center justify-center">
              <Text className="text-white text-sm font-bold">✓</Text>
            </View>
        )}
      </TouchableOpacity>
  ), [handleSelect, selectedValue, genderOptions.length]);

  return (
      <>
        <TouchableOpacity
            onPress={toggleModal}
            disabled={disabled}
            className={`bg-white dark:bg-gray-800 w-full h-14 rounded-xl px-4 flex-row items-center justify-between shadow-sm ${
                error
                    ? 'border-2 border-red-500 shadow-red-100 dark:shadow-red-900/20'
                    : 'border border-gray-200 dark:border-gray-600 shadow-gray-100 dark:shadow-gray-900/20'
            } ${disabled ? 'opacity-50' : ''}`}
            activeOpacity={disabled ? 1 : 0.8}
        >
          <View className="flex-row items-center flex-1">
            {selectedOption && (
                <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mr-3">
                  <Text className="text-base">{selectedOption.icon}</Text>
                </View>
            )}
            <Text className={`text-base ${
                selectedValue
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 dark:text-gray-400'
            }`}>
              {selectedOption?.label || "Select your gender identity"}
            </Text>
          </View>

          <Text className={`text-gray-400 dark:text-gray-500 text-lg ${
              isModalVisible ? 'rotate-180' : 'rotate-0'
          }`}>
            ▼
          </Text>
        </TouchableOpacity>

        <Modal
            visible={isModalVisible}
            transparent
            animationType="slide"
            onRequestClose={toggleModal}
            statusBarTranslucent
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View className="flex-1 bg-black/60 justify-center items-center px-4">
              <TouchableWithoutFeedback onPress={() => {}}>
                <View className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                  {/* Header */}
                  <View className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
                      Select Gender Identity
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                      Choose the option that best describes you
                    </Text>
                  </View>

                  {/* Options List */}
                  <FlatList
                      data={genderOptions}
                      keyExtractor={(item: GenderOption) => item.value}
                      renderItem={renderGenderOption}
                      showsVerticalScrollIndicator={false}
                      className="max-h-80"
                  />

                  {/* Footer */}
                  <View className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <TouchableOpacity
                        onPress={toggleModal}
                        className="bg-gray-200 dark:bg-gray-600 rounded-xl p-4 active:bg-gray-300 dark:active:bg-gray-500"
                        activeOpacity={0.8}
                    >
                      <Text className="text-gray-700 dark:text-gray-200 text-center font-semibold text-base">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
  );
});

export default Login;