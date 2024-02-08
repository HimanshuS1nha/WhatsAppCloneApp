import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthProvider from './providers/AuthProvider';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ChatScreen from './screens/ChatScreen';
import SignupScreen from './screens/SignupScreen';
import ImagePreviewScreen from './screens/ImagePreviewScreen';
import SettingsScreen from './screens/SettingsScreen';
import AudioCallScreen from './screens/AudioCallScreen';
import ChatProfileScreen from './screens/ChatProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CallScreen from './screens/CallScreen';
import VideoCallScreen from './screens/VideoCallScreen';
import UpdateScreen from './screens/UpdateScreen';
import SplashScreen from './screens/SplashScreen';
import ChannelsScreen from './screens/ChannelsScreen';
import SelectUserScreen from './screens/SelectUserScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar backgroundColor={'#128C7E'} />
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Channels" component={ChannelsScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
            <Stack.Screen name="AudioCall" component={AudioCallScreen} />
            <Stack.Screen name="ImagePreview" component={ImagePreviewScreen} />
            <Stack.Screen name="ChatProfile" component={ChatProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Call" component={CallScreen} />
            <Stack.Screen name="Update" component={UpdateScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="SelectUser" component={SelectUserScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
