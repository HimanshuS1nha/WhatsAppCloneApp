import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const FollowedChannel = ({channel}) => {
  return (
    <>
      <TouchableOpacity>
        <View style={tw`my-4 gap-y-1`}>
          <View style={tw`flex-row gap-x-3 items-center`}>
            <Image
              source={{uri: channel.image}}
              style={tw`w-8 h-8 rounded-full`}
            />
            <Text style={tw`text-lg font-medium text-black`}>
              {channel.name}
            </Text>
          </View>
          <Text style={tw`text-gray-500`}>{channel.message}</Text>
        </View>
        <Text style={tw`text-gray-500 text-xs`}>{channel.date}</Text>
      </TouchableOpacity>

      <View style={tw`border-[0.8px] border-gray-300 w-full mt-2`} />
    </>
  );
};

export default FollowedChannel;
