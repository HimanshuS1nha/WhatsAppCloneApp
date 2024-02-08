import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useMutation} from '@tanstack/react-query';
import {API_URL} from '@env';
import axios, {AxiosError} from 'axios';
import {useAuthContext} from '../providers/AuthProvider';

const EditProfile = ({isVisible, setIsVisible, value, label}) => {
  const {setUser, user} = useAuthContext();

  const [newValue, setNewValue] = useState(value);

  const {mutate: handleEditProfile, isPending} = useMutation({
    mutationKey: ['edit-profile'],
    mutationFn: async () => {
      if (newValue === value) return null;
      const {data} = await axios.post(`${API_URL}/api/edit-profile`, {
        type: label,
        value: newValue,
        id: user?.id,
      });
      return data;
    },
    onSuccess: data => {
      setUser(data?.user);
      setIsVisible(false);
    },
    onError: error => {
      if (error instanceof AxiosError) {
        Alert.alert('error', error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert('error', error);
      } else {
        Alert.alert('error', 'Some error occured. Please try again later!');
      }
    },
  });

  useEffect(() => {
    setNewValue(value);
  }, [value]);
  return (
    <Modal visible={isVisible} transparent>
      <View style={tw`flex-1 bg-gray-200 bg-opacity-75`} />
      <View
        style={tw`bg-white w-full h-36 absolute bottom-0 px-12 py-4 gap-y-1 rounded-xl`}>
        <Text style={tw`text-black font-medium text-base`}>
          Enter your {label}
        </Text>
        <TextInput
          style={tw`border-b-2 border-green-600 py-1 text-black text-base`}
          value={newValue}
          onChangeText={text => setNewValue(text)}
          autoFocus
        />

        <View style={tw`justify-end mt-3 flex-row gap-x-9`}>
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            disabled={isPending}>
            <Text style={tw`text-green-600 font-semibold`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEditProfile} disabled={isPending}>
            <Text
              style={tw`font-semibold ${
                isPending ? 'text-green-300' : 'text-green-600'
              }`}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfile;
