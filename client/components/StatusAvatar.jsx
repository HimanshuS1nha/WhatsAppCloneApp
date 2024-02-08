import {Image, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';

const StatusAvatar = ({status}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={tw`gap-y-1`}
      onPress={() => navigation.navigate('Update', {update: status})}>
      <Image
        source={{uri: status.image}}
        style={tw`w-16 h-16 rounded-full border-2 border-${
          status.active ? 'green' : 'gray'
        }-500 mr-5`}
      />
      <Text style={tw`ml-3.5 text-black`}>{status.name}</Text>
    </TouchableOpacity>
  );
};

export default StatusAvatar;
