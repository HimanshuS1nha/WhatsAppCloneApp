import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Channel = ({channel}) => {
  return (
    <View
      style={tw`bg-white rounded-lg w-36 h-36 justify-center items-center shadow-xl border border-gray-400 mr-4 gap-y-3`}>
      <Image source={{uri: channel.image}} style={tw`w-10 h-10 rounded-lg`} />
      <Text style={tw`font-bold text-black`}>{channel.name}</Text>
      <TouchableOpacity
        style={tw`w-[80%] bg-green-200 items-center justify-center py-2 rounded-full`}>
        <Text style={tw` text-green-600 font-bold`}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Channel;
