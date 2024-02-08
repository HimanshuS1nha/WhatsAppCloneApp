import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {ArrowSmallUpIcon} from 'react-native-heroicons/outline';
import {PhoneIcon, VideoCameraIcon} from 'react-native-heroicons/solid';

const CallPreview = ({call}) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(`Call`, {call});
  };
  return (
    <TouchableOpacity
      style={tw`flex-row py-4 gap-x-5 items-center`}
      onPress={handlePress}>
      <Image source={{uri: call.image}} style={tw`h-12 w-12 rounded-full`} />
      <View style={tw`flex-row flex-1 justify-between items-center`}>
        <View>
          <Text style={tw`font-semibold text-lg text-black`}>{call.name}</Text>
          <View style={tw`flex-row items-center gap-x-0.5`}>
            <ArrowSmallUpIcon
              size={20}
              color={call.missed ? 'red' : 'green'}
              style={{
                transform: [
                  {rotate: call.type === 'incoming' ? '-135deg' : '45deg'},
                ],
              }}
            />
            <Text style={tw`text-gray-500`}>{call.time}</Text>
          </View>
        </View>
        <TouchableOpacity>
          {call?.callType === 'audio' ? (
            <PhoneIcon size={24} color="green" style={tw`mr-2`} />
          ) : (
            <VideoCameraIcon size={24} color="green" style={tw`mr-2`} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CallPreview;
