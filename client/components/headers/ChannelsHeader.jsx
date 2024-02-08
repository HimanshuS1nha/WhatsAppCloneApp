import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import {
  ArrowSmallLeftIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/solid';

const ChannelsHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`bg-[#128C7E] h-[58px] justify-center`}>
      <View style={tw`flex-row px-1 justify-between items-center mt-1 px-2`}>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowSmallLeftIcon size={25} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold text-white`}>Channels</Text>
        </View>
        <TouchableOpacity style={tw`mr-2`}>
          <MagnifyingGlassIcon size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChannelsHeader;
