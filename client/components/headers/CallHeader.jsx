import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {ChatBubbleLeftEllipsisIcon} from 'react-native-heroicons/solid';
import {
  ArrowSmallLeftIcon,
  EllipsisVerticalIcon,
} from 'react-native-heroicons/outline';

const CallHeader = ({setIsVisible}) => {
  const navigation = useNavigation();
  return (
    <View style={tw`bg-[#128C7E] h-[58px] justify-center`}>
      <View style={tw`flex-row px-1 justify-between items-center mt-1 px-2`}>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowSmallLeftIcon size={25} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold text-white`}>Call info</Text>
        </View>
        <View style={tw`flex-row gap-x-5 mr-2 items-center`}>
          <TouchableOpacity>
            <ChatBubbleLeftEllipsisIcon size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
            <EllipsisVerticalIcon size={29} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CallHeader;
