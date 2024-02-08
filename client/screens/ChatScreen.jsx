import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
  Text,
} from 'react-native';
import tw from 'twrnc';
import Message from '../components/Message';
import ChatHeader from '../components/headers/ChatHeader';
import EmojiPicker from 'rn-emoji-keyboard';
import {FaceSmileIcon} from 'react-native-heroicons/outline';
import {PaperAirplaneIcon, XMarkIcon} from 'react-native-heroicons/solid';
import {useAuthContext} from '../providers/AuthProvider';
import socket from '../libs/socket';
import {useQuery} from '@tanstack/react-query';
import {API_URL} from '@env';
import axios from 'axios';
import MainDropdown from '../components/dropdowns/MainDropdown';
import {useNavigation} from '@react-navigation/native';

const ChatScreen = () => {
  const {chat, user, users, setUsers} = useAuthContext();
  const navigation = useNavigation();
  const messageRef = useRef();

  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [chats, setChats] = useState([]);

  const {data, refetch: getChats} = useQuery({
    queryKey: ['get-all-chats'],
    queryFn: async () => {
      const {data} = await axios.post(`${API_URL}/api/get-all-chats`, {
        id: user?.id,
        chatId: chat?._id,
      });
      return data;
    },
  });

  const handleChange = text => {
    socket.emit('set-status', {to: chat?._id, status: 'typing...'});
    setMessage(text);
  };

  const handleTypingDone = () => {
    messageRef.current.blur();
    socket.emit('set-status', {to: chat?._id, status: 'online'});
  };

  const handleSendMessage = () => {
    if (message === '') {
      return;
    }
    let requiredUser;
    const filteredUsers = users.filter(user => {
      if (user._id === chat?._id) {
        user.message = message;
        requiredUser = user;
      } else {
        return user;
      }
    });
    const newUsers = [requiredUser, ...filteredUsers];
    setUsers(newUsers);
    const sentAt = Date.now();
    const newChats = [
      {
        message,
        sentBy: user?.id,
        sentTo: chat?._id,
        sentAt: sentAt,
        replyingTo: {
          name: replyingTo?.sentBy === user?.id ? user?.name : chat?.name,
          message: replyingTo?.message,
        },
      },
    ].concat(chats);
    setChats(newChats);
    socket.emit('send-message', {chats: newChats[0], id: chat?._id});
    socket.emit('set-status', {to: chat?._id, status: 'online'});
    setMessage('');
    setReplyingTo(null);
  };

  const handleReceiveMessage = useCallback(message => {
    socket.emit('messages-seen', {id: user.id, to: chat._id});
    setChats(prev => [message, ...prev]);
  }, []);

  const handleReplyingToMessage = message => {
    setReplyingTo(message);
    messageRef.current.focus();
  };

  const handleMessagesSeen = () => {
    const newChats = chats.map(chat => {
      if (!chat.isSeen) {
        chat.isSeen = true;
      }
      return chat;
    });
    setChats(newChats);
  };
  useEffect(() => {
    socket.on('receive-message', handleReceiveMessage);
    socket.on('messages-seen', handleMessagesSeen);
    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('messages-seen', handleMessagesSeen);
    };
  }, [socket, handleReceiveMessage, handleMessagesSeen]);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleTypingDone,
    );

    return () => keyboardHideListener.remove();
  }, [handleTypingDone]);

  useEffect(() => {
    if (data) {
      setChats(data?.messages);
    }
  }, [data]);

  useEffect(() => {
    socket.emit('messages-seen', {id: user.id, to: chat._id});
    return () => socket.removeListener('messages-seen');
  }, [socket]);

  const options = [
    {
      title: 'View contact',
      action: () => {
        navigation.navigate('ChatProfile');
      },
    },
    {
      title: 'Media, links, and docs',
      action: () => {},
    },
    {
      title: 'Search',
      action: () => {},
    },
    {
      title: 'Mute notifications',
      action: () => {},
    },
    {
      title: 'Disappearing messages',
      action: () => {},
    },
    {
      title: 'Wallpaper',
      action: () => {},
    },
    {
      title: 'More',
      action: () => {},
    },
  ];
  return (
    <>
      <ChatHeader
        setIsVisible={setIsVisible}
        selectedMessages={selectedMessages}
        setSelectedMessages={setSelectedMessages}
        getChats={getChats}
        handleReplyingToMessage={handleReplyingToMessage}
      />
      <MainDropdown
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={options}
      />
      <View style={tw`bg-[#EBE5DE] flex-1 pb-20`}>
        {data ? (
          <View
            style={tw`flex-row absolute bottom-2 px-2 gap-x-2 w-full items-center`}>
            <EmojiPicker
              onEmojiSelected={emojiObject => {
                setMessage(prev => prev + emojiObject.emoji);
              }}
              open={isOpen}
              onClose={() => setIsOpen(false)}
            />
            <TouchableOpacity
              style={tw`absolute z-20 left-5 justify-center`}
              onPress={() => setIsOpen(true)}>
              <FaceSmileIcon size={24} color="gray" />
            </TouchableOpacity>

            {replyingTo && (
              <View
                style={tw`bg-white absolute bottom-10 mx-2 z-20 w-[86%] rounded-tr-lg rounded-tl-lg py-3`}>
                <View
                  style={tw`bg-gray-200 py-1 mx-2 px-4 border-l-4 border-l-purple-700 rounded-md`}>
                  <Text style={tw`text-purple-700 font-bold`}>
                    {replyingTo.sentBy === user?.id ? user?.name : chat?.name}
                  </Text>
                  <Text style={tw``}>
                    {replyingTo.message.length >= 80
                      ? replyingTo.message.substring(0, 80) + '...'
                      : replyingTo.message}
                  </Text>
                  <TouchableOpacity
                    style={tw`absolute right-1 top-1`}
                    onPress={() => setReplyingTo(null)}>
                    <XMarkIcon color={'black'} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TextInput
              style={tw`w-[86%] max-h-28 ${
                replyingTo ? 'rounded-bl-xl rounded-br-xl' : 'rounded-full'
              } px-12 py-2 bg-white text-black text-base z-10`}
              value={message}
              onChangeText={handleChange}
              placeholder={'Type a message'}
              onEndEditing={handleTypingDone}
              multiline
              ref={messageRef}
            />
            <TouchableOpacity
              style={tw`bg-[#128C7E] px-3 py-3 items-center justify-center rounded-full`}
              onPress={handleSendMessage}>
              <PaperAirplaneIcon size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <ActivityIndicator size={30} style={tw`mt-5`} />
        )}

        <View style={tw`h-full`}>
          <FlashList
            data={chats}
            extraData={{chats, selectedMessages}}
            keyExtractor={(_, i) => i}
            renderItem={({item}) => {
              return (
                <Message
                  message={item}
                  handleReplyingToMessage={handleReplyingToMessage}
                  selectedMessages={selectedMessages}
                  setSelectedMessages={setSelectedMessages}
                />
              );
            }}
            estimatedItemSize={100}
            inverted
          />
        </View>
      </View>
    </>
  );
};

export default ChatScreen;
