import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowSmallLeftIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import tw from 'twrnc';

const SelectContactHeader = ({users, setIsVisible}) => {
  const navigation = useNavigation();
  return (
    <View style={tw`bg-[#128C7E] h-[58px] justify-center`}>
      <View style={tw`flex-row px-1 justify-between items-center mt-1 px-2`}>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowSmallLeftIcon size={25} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={tw`text-base font-semibold text-white`}>
              Select User
            </Text>
            <Text style={tw`text-white`}>{users.length + 1} users</Text>
          </View>
        </View>
        <View style={tw`flex-row gap-x-5 mr-2 items-center`}>
          <TouchableOpacity>
            <MagnifyingGlassIcon size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
            <EllipsisVerticalIcon size={29} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectContactHeader;
