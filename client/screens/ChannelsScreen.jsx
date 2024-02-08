import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {FlashList} from '@shopify/flash-list';
import ChannelsHeader from '../components/headers/ChannelsHeader';
import {findChannels} from '../constants/Channels';
import ChannelPreview from '../components/ChannelPreview';

const ChannelsScreen = () => {
  const [selectedChannelType, setSelectedChannelType] = useState('explore');

  const types = ['Explore', 'Most active', 'Popular', 'New', 'Most Followed'];
  return (
    <View style={tw`flex-1 bg-white`}>
      <ChannelsHeader />
      <View style={tw`mt-3 ml-2 mb-3`}>
        <FlashList
          data={types}
          keyExtractor={item => item}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={tw`mx-2 ${
                  selectedChannelType === item.toLowerCase()
                    ? 'bg-green-200'
                    : 'bg-gray-200'
                } px-3 py-1 rounded-full bg-opacity-80`}
                onPress={() => setSelectedChannelType(item.toLowerCase())}>
                <Text
                  style={tw`font-semibold ${
                    selectedChannelType === item.toLowerCase()
                      ? 'text-green-700'
                      : ''
                  }`}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={10}
        />

        <View style={tw`border-[0.5px] border-gray-300 mt-3 w-full -ml-2`} />
      </View>

      <FlashList
        data={findChannels}
        keyExtractor={(_, i) => i}
        renderItem={({item}) => {
          return <ChannelPreview channel={item} />;
        }}
        estimatedItemSize={50}
      />
    </View>
  );
};

export default ChannelsScreen;
