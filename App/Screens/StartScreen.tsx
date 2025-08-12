import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Image } from 'react-native';
import Svg, {
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateContext } from '../context';
import { ProfileAPI } from '../API/UserAPI';

// Navigation prop types
interface NavigationProp {
  replace: (screenName: string) => void;
}

interface StartScreenProps {
  navigation: NavigationProp;
}

// User data type (adjust based on your actual user structure)
interface UserData {
  id: string | number;
  name?: string;
  email?: string;
  // Add other user properties as needed
}

// Context type (adjust based on your actual context structure)
interface StateContextType {
  setUser: (user: UserData) => void;
  // Add other context properties as needed
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const { setUser }: StateContextType = useStateContext();

  const boxAnimatedValue = useRef<Animated.Value>(new Animated.Value(100)).current;
  const checkmarkAnimatedValue = useRef<Animated.Value>(new Animated.Value(100)).current;

  const letterAnimations = useRef<Animated.Value[]>([
    new Animated.Value(0), // T opacity - starts hidden
    new Animated.Value(0), // a opacity - starts hidden
    new Animated.Value(0), // s opacity - starts hidden
    new Animated.Value(0), // k opacity - starts hidden
    new Animated.Value(0), // y opacity - starts hidden
  ]).current;

  const letterPositions = useRef<Animated.Value[]>([
    new Animated.Value(20), // T position
    new Animated.Value(20), // a position
    new Animated.Value(20), // s position
    new Animated.Value(20), // k position
    new Animated.Value(20), // y position
  ]).current;

  useEffect(() => {

    const Nav = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token === 'null' || token === null || token === undefined) {
          navigation.replace('Login')
      }else {   const res = await ProfileAPI();
          if (res === 200)
          {
            const user = await AsyncStorage.getItem('user');
            if (token === 'null' || token === null || token === undefined) {
              navigation.replace('Login');
            } else {
              navigation.replace('Home');
              if (user) {
                const userdata: UserData = JSON.parse(user);
                setUser(userdata);
              }
            }
          }
          else {
            navigation.replace('Login')
          }}} catch (error) {
        console.error('Error during navigation:', error);
        navigation.replace('Login');
      }
    };

    const timeoutId = setTimeout(() => {
      Nav().then(() => console.log('Navigation completed'));
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [navigation, setUser]);

  useEffect(() => {
    // Box animation
    Animated.sequence([
      Animated.timing(boxAnimatedValue, {
        toValue: -10,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(boxAnimatedValue, {
        toValue: 5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(boxAnimatedValue, {
        toValue: -2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(boxAnimatedValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Checkmark animation (slightly delayed)
    const checkmarkTimeout = setTimeout(() => {
      Animated.sequence([
        Animated.timing(checkmarkAnimatedValue, {
          toValue: -10,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkAnimatedValue, {
          toValue: 5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkAnimatedValue, {
          toValue: -2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkAnimatedValue, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    // Letter animations - appear one by one
    const letterDelays: number[] = [1900, 2100, 2400, 2700, 3000];
    const letterTimeouts: ReturnType<typeof setTimeout>[] = [];

    letterDelays.forEach((delay: number, index: number) => {
      const timeoutId = setTimeout(() => {
        // Fade in
        Animated.timing(letterAnimations[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Bounce animation
        Animated.sequence([
          Animated.timing(letterPositions[index], {
            toValue: -5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(letterPositions[index], {
            toValue: 2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(letterPositions[index], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);

      letterTimeouts.push(timeoutId);
    });

    // Cleanup function
    return () => {
      clearTimeout(checkmarkTimeout);
      letterTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [boxAnimatedValue, checkmarkAnimatedValue, letterAnimations, letterPositions]);

  const AnimatedRect = Animated.createAnimatedComponent(Rect);
  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      {/* Main content container - no extra margin/padding */}
      <View className={'justify-center items-center'}>
        <Svg
          width={250} // Reduced to fit content exactly
          height={100}  // Reduced to fit content exactly
          viewBox="0 0 250 60"
        >
          {/* Box with checkmark */}
          <AnimatedRect
            x="0"
            y="0"
            width="80"
            height="80"
            rx="20"
            ry="20"
            fill="#1E90FF"
            // @ts-ignore
            transform={[{ translateY: boxAnimatedValue }]}
          />

          <AnimatedPath
            d="M20 40 L35 55 L60 25"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            // @ts-ignore
            transform={[{ translateY: checkmarkAnimatedValue }]}
          />
          {/* Text letters - positioned right after the box */}
          <AnimatedSvgText
            x="100"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="bold"
            fill="#000"
            opacity={letterAnimations[0]}
            // @ts-ignore
            transform={[{ translateY: letterPositions[0] }]}
          >
            T
          </AnimatedSvgText>

          <AnimatedSvgText
            x="130"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="bold"
            fill="#000"
            opacity={letterAnimations[1]}
            // @ts-ignore
            transform={[{ translateY: letterPositions[1] }]}
          >
            a
          </AnimatedSvgText>

          <AnimatedSvgText
            x="160"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="bold"
            fill="#000"
            opacity={letterAnimations[2]}
            // @ts-ignore
            transform={[{ translateY: letterPositions[2] }]}
          >
            s
          </AnimatedSvgText>

          <AnimatedSvgText
            x="190"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="bold"
            fill="#000"
            opacity={letterAnimations[3]}
            // @ts-ignore
            transform={[{ translateY: letterPositions[3] }]}
          >
            k
          </AnimatedSvgText>

          <AnimatedSvgText
            x="220"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="bold"
            fill="#000"
            opacity={letterAnimations[4]}
            // @ts-ignore
            transform={[{ translateY: letterPositions[4] }]}
          >
            y
          </AnimatedSvgText>
        </Svg>
      </View>
      <View style={{
        position: 'absolute',
        bottom: 10,
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
        <Text className={'absolute bottom-[75px] right-[120px] text-black'}>
          Powered By
        </Text>
      </View>
    </View>
  );
};

export default StartScreen;