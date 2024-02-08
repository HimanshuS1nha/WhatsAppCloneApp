import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';

import tw from 'twrnc';
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from 'react-native-heroicons/outline';
import {UserGroupIcon} from 'react-native-heroicons/solid';
import {useAuthContext} from '../../providers/AuthProvider';
import MainDropdown from '../dropdowns/MainDropdown';
import {useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

const MainHeader = () => {
  const {activeChoice, setActiveChoice, setUser} = useAuthContext();
  const navigation = useNavigation();

  const [isVisible, setIsVisible] = useState(false);

  const options = [
    {
      title: 'New group',
      action: () => {},
    },
    {
      title: 'New broadcast',
      action: () => {},
    },
    {
      title: 'Linked Devices',
      action: () => {},
    },
    {
      title: 'Starred messages',
      action: () => {},
    },
    {
      title: 'Settings',
      action: () => {
        navigation.navigate('Settings');
      },
    },
    {
      title: 'Logout',
      action: () => {
        Alert.alert('Logout', 'Do you really want to logout?', [
          {
            text: 'No',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await EncryptedStorage.removeItem('user');
                setUser({});
                navigation.replace('Login');
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Some error occured. Please try again later!',
                );
              }
            },
          },
        ]);
      },
    },
  ];

  const handlePress = value => {
    setActiveChoice(value);
    navigation.replace(value);
  };
  return (
    <View style={tw`bg-[#128C7E] h-[105px] z-20`}>
      <MainDropdown
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={options}
      />
      <View style={tw`flex-row px-4 justify-between items-center mt-4`}>
        <View>
          <Text style={tw`text-white text-2xl`}>WhatsApp</Text>
        </View>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <TouchableOpacity>
            <MagnifyingGlassIcon size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <EllipsisVerticalIcon
              size={29}
              color="white"
              onPress={() => setIsVisible(prev => !prev)}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`flex-row absolute bottom-3 items-center`}>
        <TouchableOpacity
          onPress={() => handlePress('Community')}
          style={tw`ml-4`}>
          <UserGroupIcon
            size={24}
            style={tw`px-3 ${
              activeChoice === 'Community' ? 'text-white' : 'text-gray-300'
            }`}
          />
          {activeChoice === 'Community' && (
            <View style={tw`border border-white absolute -bottom-3 w-full`} />
          )}
        </TouchableOpacity>
        <View style={tw`flex-row flex-1 justify-between px-5 mr-3`}>
          <TouchableOpacity
            onPress={() => handlePress('Chats')}
            style={tw`w-[25%] items-center`}>
            <Text
              style={tw`${
                activeChoice === 'Chats' ? 'text-white' : 'text-gray-300'
              } font-semibold`}>
              Chats
            </Text>
            {activeChoice === 'Chats' && (
              <View style={tw`border border-white absolute -bottom-3 w-full`} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('Updates')}
            style={tw`w-[25%] items-center`}>
            <Text
              style={tw`${
                activeChoice === 'Updates' ? 'text-white' : 'text-gray-300'
              } font-semibold`}>
              Updates
            </Text>
            {activeChoice === 'Updates' && (
              <View style={tw`border border-white absolute -bottom-3 w-full`} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('Calls')}
            style={tw`w-[25%] items-center`}>
            <Text
              style={tw`${
                activeChoice === 'Calls' ? 'text-white' : 'text-gray-300'
              } font-semibold`}>
              Calls
            </Text>
            {activeChoice === 'Calls' && (
              <View style={tw`border border-white absolute -bottom-3 w-full`} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MainHeader;
