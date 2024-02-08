import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowSmallLeftIcon} from 'react-native-heroicons/outline';

const ImagePreviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const chat = route.params;
  return (
    <View style={tw`flex-1 bg-black items-center justify-center`}>
      <View style={tw`absolute top-4 left-2 gap-x-3 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowSmallLeftIcon size={25} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-gray-500 text-2xl`}>{chat.name}</Text>
      </View>
      <Image source={{uri: chat.image}} style={tw`w-full aspect-1`} />
    </View>
  );
};

export default ImagePreviewScreen;
