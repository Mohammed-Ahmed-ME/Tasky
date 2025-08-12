/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Navigation from "./App/Navigation.tsx";
import { ContextProvider } from './App/context';

function App() {
    useColorScheme() === 'dark';
    return (
      <SafeAreaView style={styles.container}>
          <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent={Platform.OS === 'android'}
          />
          <ContextProvider>
              <Navigation />
          </ContextProvider>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
