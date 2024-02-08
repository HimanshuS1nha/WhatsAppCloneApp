import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {PlusIcon} from 'react-native-heroicons/outline';
import tw from 'twrnc';

const ChannelPreview = ({channel}) => {
  const followers = (1 + 14 * Math.random()).toFixed(2);
  return (
    <View style={tw`px-2 flex-row justify-between mb-6 items-center`}>
      <View style={tw`flex-row gap-x-4 items-center`}>
        <Image
          source={{uri: channel.image}}
          style={tw`w-10 h-10 rounded-full`}
        />
        <View>
          <Text style={tw`font-semibold text-base text-black`}>
            {channel.name}
          </Text>
          <Text>{followers}M followers</Text>
        </View>
      </View>

      <TouchableOpacity>
        <PlusIcon size={24} color={'green'} fontWeight={900} />
      </TouchableOpacity>
    </View>
  );
};

export default ChannelPreview;
