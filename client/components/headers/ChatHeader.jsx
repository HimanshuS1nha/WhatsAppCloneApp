import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import tw from 'twrnc';
import {useAuthContext} from '../../providers/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowSmallLeftIcon,
  EllipsisVerticalIcon,
} from 'react-native-heroicons/outline';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PhoneIcon,
  StarIcon,
  TrashIcon,
  VideoCameraIcon,
} from 'react-native-heroicons/solid';
import MarqueeView from 'react-native-marquee-view';
import socket from '../../libs/socket';
import {useMutation} from '@tanstack/react-query';
import axios, {AxiosError} from 'axios';
import {API_URL} from '@env';

const ChatHeader = ({
  setIsVisible,
  selectedMessages,
  setSelectedMessages,
  getChats,
  handleReplyingToMessage,
}) => {
  const {chat, user} = useAuthContext();
  const navigation = useNavigation();

  const [status, setStatus] = useState('offline');

  const handleGetStatus = ({status}) => {
    setStatus(status);
  };

  const {mutate: handleDelete, isPending} = useMutation({
    mutationKey: ['delete-chat'],
    mutationFn: async () => {
      const {data} = await axios.post(`${API_URL}/api/delete-chats`, {
        id: user.id,
        messages: selectedMessages,
      });
      return data;
    },
    onSuccess: () => {
      socket.emit('chat-delete', {to: chat?._id});
      getChats();
      setSelectedMessages([]);
    },
    onError: error => {
      if (error instanceof AxiosError) {
        Alert.alert('error', error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert('error', error);
      } else {
        Alert.alert('error', 'Some error occured. Please try again later!');
      }
    },
  });

  useEffect(() => {
    socket.emit('get-status', {id: chat?._id});
    socket.on('get-status', handleGetStatus);
    socket.on('chat-delete', getChats);

    return () => {
      socket.removeListener('get-status');
      socket.off('get-status', handleGetStatus);
      socket.off('chat-delete', getChats);
    };
  }, [socket]);
  return (
    <View style={tw`bg-[#128C7E] h-[68px]`}>
      {selectedMessages.length > 0 ? (
        <View style={tw`flex-row px-1 justify-between items-center mt-3`}>
          <View style={tw`flex-row gap-x-5 items-center`}>
            <TouchableOpacity
              onPress={() => setSelectedMessages([])}
              style={tw`flex-row gap-x-1 items-center`}>
              <ArrowSmallLeftIcon size={25} color="white" />
              <Image
                source={{
                  uri: chat?.image,
                }}
                style={tw`h-10 w-10 rounded-full`}
              />
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row gap-x-5 items-center`}>
            <TouchableOpacity
              onPress={() => {
                handleReplyingToMessage(selectedMessages[0]);
                setSelectedMessages([]);
              }}>
              <ArrowUturnLeftIcon size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMessages([])}>
              <StarIcon size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Confirm',
                  'Do you want to delete these messages? (You can only delete messages that you sent)',
                  [
                    {
                      text: 'No',
                      onPress: () => setSelectedMessages([]),
                    },
                    {
                      text: 'Yes',
                      onPress: () => handleDelete(),
                    },
                  ],
                );
              }}
              disabled={isPending}>
              <TrashIcon size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMessages([])}>
              <ArrowUturnRightIcon size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
              <EllipsisVerticalIcon size={29} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={tw`flex-row px-1 justify-between items-center mt-3`}>
          <View style={tw`flex-row gap-x-3 items-center`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`flex-row gap-x-1 items-center`}>
              <ArrowSmallLeftIcon size={25} color="white" />
              <Image
                source={{
                  uri: chat?.image,
                }}
                style={tw`h-10 w-10 rounded-full`}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatProfile', {status})}>
              {chat?.name.length > 15 ? (
                <MarqueeView style={tw`w-36`}>
                  <Text style={tw`text-lg font-semibold text-white`}>
                    {chat?.name}
                  </Text>
                </MarqueeView>
              ) : (
                <Text style={tw`text-lg font-semibold text-white`}>
                  {chat?.name}
                </Text>
              )}
              <Text style={tw`text-gray-700 text-xs text-white`}>{status}</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row gap-x-5 mr-2 items-center`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VideoCall', {roomId: user?.id})
              }>
              <VideoCameraIcon size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AudioCall', {roomId: user?.id})
              }>
              <PhoneIcon size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
              <EllipsisVerticalIcon size={29} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatHeader;
