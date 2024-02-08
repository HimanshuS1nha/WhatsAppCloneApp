import React, {useEffect} from 'react';
import ChatPreview from '../components/ChatPreview';
import tw from 'twrnc';
import {FlashList} from '@shopify/flash-list';
import {View, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import {useAuthContext} from '../providers/AuthProvider';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useQuery} from '@tanstack/react-query';
import axios, {AxiosError} from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import {ChatBubbleBottomCenterTextIcon} from 'react-native-heroicons/solid';
import socket from '../libs/socket';

const ChatsScreen = () => {
  const {setActiveChoice, user, users, setUsers} = useAuthContext();
  const navigation = useNavigation();

  const {data, isLoading, error} = useQuery({
    queryKey: ['get-all-users'],
    queryFn: async () => {
      const {data} = await axios.post(`${API_URL}/api/get-all-users`, {
        id: user?.id,
      });
      return data;
    },
  });
  if (error) {
    if (error instanceof AxiosError) {
      Alert.alert('Error', error.response?.data.error);
    } else if (error instanceof Error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Error', 'Some error occured. Please try again later!');
    }
  }

  const handleSwipe = gestureName => {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if (gestureName === SWIPE_LEFT) {
      setActiveChoice('Updates');
      navigation.replace('Updates');
    } else if (gestureName === SWIPE_RIGHT) {
      setActiveChoice('Community');
      navigation.replace('Community');
    }
  };

  const handleReceiveMessage = message => {
    let requiredUser;
    const filteredUsers = users.filter(user => {
      if (user._id === message.sentBy) {
        if (navigation.isFocused()) {
          user.isMessageUnseen = true;
        }
        user.message = message.message;
        requiredUser = user;
      } else {
        return user;
      }
    });
    const newUsers = [requiredUser, ...filteredUsers];
    setUsers(newUsers);
  };

  useEffect(() => {
    if (data) {
      const newUsers = data?.users.map(user => {
        user.isMessageUnseen = false;
        return user;
      });
      setUsers(newUsers);
    }
  }, [data]);

  useEffect(() => {
    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket, handleReceiveMessage]);
  return (
    <GestureRecognizer onSwipe={handleSwipe} style={tw`flex-1 bg-white`}>
      {isLoading && (
        <ActivityIndicator size={30} style={tw`mt-5 items-center`} />
      )}
      <View style={tw`w-full h-full`}>
        <FlashList
          data={users}
          keyExtractor={(_, i) => i}
          renderItem={({item}) => {
            return <ChatPreview chat={item} />;
          }}
          estimatedItemSize={30}
        />
      </View>

      <TouchableOpacity
        style={tw`absolute bg-[#128C7E] bottom-7 right-5 p-3 rounded-lg`}
        onPress={() => navigation.navigate('SelectUser', {users: data?.users})}>
        <ChatBubbleBottomCenterTextIcon size={28} color={'white'} />
      </TouchableOpacity>
    </GestureRecognizer>
  );
};

export default ChatsScreen;
