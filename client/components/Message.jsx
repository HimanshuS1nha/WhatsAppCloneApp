import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useAuthContext} from '../providers/AuthProvider';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {CheckIcon} from 'react-native-heroicons/solid';

const Message = ({
  message,
  handleReplyingToMessage,
  selectedMessages,
  setSelectedMessages,
}) => {
  const {user} = useAuthContext();
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleSwipe = gestureName => {
    const {SWIPE_RIGHT} = swipeDirections;
    if (gestureName === SWIPE_RIGHT) {
      handleReplyingToMessage(message);
    }
  };
  const sentAt = new Date(message?.sentAt);

  const addZero = value => {
    return value.toString().length > 1 ? value : '0' + value;
  };

  const handleLongPress = () => {
    if (!selectedMessages.includes(message)) {
      // if (message.sentBy === user.id) {
      const newSelectedMessge = [message, ...selectedMessages];
      setSelectedMessages(newSelectedMessge);
      // }
    }
  };

  const handlePress = () => {
    if (selectedMessages.length > 0) {
      if (!selectedMessages.includes(message)) {
        // if (message.sentBy === user.id) {
        const newSelectedMessges = [message, ...selectedMessages];
        setSelectedMessages(newSelectedMessges);
        // }
      } else {
        const newSelectedMessges = selectedMessages.filter(
          selectedMessage => selectedMessage._id !== message._id,
        );
        setSelectedMessages(newSelectedMessges);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsMessageSent(true);
    }, 1000);
  }, []);
  return (
    <GestureRecognizer onSwipe={handleSwipe}>
      <TouchableOpacity
        style={tw`px-3 ${
          user?.id === message?.sentBy ? 'items-end' : 'items-start'
        } ${selectedMessages.includes(message) ? 'bg-blue-200' : ''}`}
        onLongPress={handleLongPress}
        onPress={handlePress}>
        <View
          style={tw`w-[70%] pt-3 pb-4 px-2 my-1 rounded-xl ${
            user?.id === message?.sentBy
              ? 'bg-[#DCF8C6] rounded-tr-sm'
              : 'bg-white rounded-tl-sm'
          } ${selectedMessages === message ? 'opacity-50' : ''}`}>
          {message?.replyingTo?.message && (
            <View
              style={tw`p-1 border-l-4 border-l-purple-700 mb-2 bg-black/10 rounded-md`}>
              <View style={tw`px-1`}>
                <Text style={tw`text-purple-700 font-bold`}>
                  {message?.replyingTo?.name}
                </Text>
                <Text style={tw``}>
                  {message?.replyingTo?.message?.length >= 40
                    ? message?.replyingTo?.message.substring(0, 40) + '...'
                    : message?.replyingTo?.message}
                </Text>
              </View>
            </View>
          )}
          <Text style={tw`text-black text-base`}>{message?.message}</Text>
          <View
            style={tw`absolute bottom-1 right-2 flex-row gap-x-2 items-center`}>
            <Text style={tw`text-[10px] text-gray-500`}>
              {addZero(sentAt?.getHours())} {':'}{' '}
              {addZero(sentAt?.getMinutes())}
            </Text>
            {user?.id === message?.sentBy && (
              <View>
                {(message?.isSeen || isMessageSent) && (
                  <CheckIcon
                    size={13}
                    color={message?.isSeen ? 'blue' : 'gray'}
                    style={tw`absolute right-[4.5px]`}
                  />
                )}
                <CheckIcon
                  size={13}
                  color={message?.isSeen ? 'blue' : 'gray'}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </GestureRecognizer>
  );
};

export default Message;
