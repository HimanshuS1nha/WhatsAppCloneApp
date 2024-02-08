import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useAuthContext} from '../providers/AuthProvider';
import {useNavigation} from '@react-navigation/native';

const ChatPreview = ({chat}) => {
  const {setChat, users, setUsers} = useAuthContext();
  const navigation = useNavigation();

  const handlePress = () => {
    const newUsers = users.map(user => {
      if (user._id === chat?._id) {
        user.isMessageUnseen = false;
      }
      return user;
    });
    setUsers(newUsers);
    setChat(chat);
    navigation.navigate('Chat');
  };
  return (
    <TouchableOpacity
      style={tw`flex-row p-4 gap-x-5 items-center`}
      onPress={handlePress}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('ImagePreview', {name: chat?.name, image: chat?.image});
        }}>
        <Image source={{uri: chat?.image}} style={tw`h-12 w-12 rounded-full`} />
      </TouchableOpacity>
      <View style={tw`flex-row flex-1 justify-between`}>
        <View>
          <Text style={tw`font-semibold text-lg text-black`}>{chat?.name}</Text>
          <Text style={tw`text-gray-500`}>
            {chat?.message || `Say hi to ${chat?.name}`}
          </Text>
        </View>
        <Text style={tw`text-gray-500 mt-1 text-xs w-10`}>{chat?.sentAt}</Text>
      </View>

      {chat?.isMessageUnseen && (
        <View
          style={tw`bg-green-500 rounded-full w-6 h-6 items-center justify-center`}>
          <Text style={tw`text-white font-medium`}>1</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatPreview;
