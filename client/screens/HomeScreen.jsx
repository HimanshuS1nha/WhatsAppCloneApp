import React, {useCallback, useEffect} from 'react';
import {useAuthContext} from '../providers/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainHeader from '../components/headers/MainHeader';
import ChatsScreen from './ChatsScreen';
import UpdatesScreen from './UpdatesScreen';
import CommunityScreen from './CommunityScreen';
import CallsScreen from './CallsScreen';
import socket from '../libs/socket';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();
  const {user, chat, setChat} = useAuthContext();

  const handleIncomingCall = useCallback(async ({id, name, image, type}) => {
    setChat({_id: id, name, image});
    if (type === 'audio') {
      navigation.navigate('AudioCall', {roomId: id});
    } else if (type === 'video') {
      navigation.navigate('VideoCall', {roomId: id});
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    socket.emit('set-status', {status: 'offline', to: chat?._id});
  }, [socket]);

  useEffect(() => {
    if (user) {
      socket.auth = {id: user.id};
      socket.connect();
      socket.on('incoming-call', handleIncomingCall);
      socket.on('disconnect', handleDisconnect);
    }

    return () => {
      socket.disconnect();
      socket.off('incoming-call', handleIncomingCall);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, user]);
  return (
    <>
      <MainHeader />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="Updates" component={UpdatesScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="Calls" component={CallsScreen} />
      </Stack.Navigator>
    </>
  );
};

export default HomeScreen;
