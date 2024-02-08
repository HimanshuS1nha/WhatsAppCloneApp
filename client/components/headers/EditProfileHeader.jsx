import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {ArrowSmallLeftIcon} from 'react-native-heroicons/outline';

const EditProfileHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`bg-[#128C7E] h-[58px] justify-center`}>
      <View style={tw`flex-row px-1 gap-x-3 items-center mt-1 px-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowSmallLeftIcon size={25} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-white`}>Profile</Text>
      </View>
    </View>
  );
};

export default EditProfileHeader;
