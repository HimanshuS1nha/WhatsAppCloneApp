import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import SettingsHeader from '../components/headers/SettingsHeader';
import tw from 'twrnc';
import {useAuthContext} from '../providers/AuthProvider';
import {
  KeyIcon,
  BellIcon,
  ChatBubbleBottomCenterIcon,
  WalletIcon,
  UserGroupIcon,
} from 'react-native-heroicons/solid';
import {
  CircleStackIcon,
  QuestionMarkCircleIcon,
} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const {user} = useAuthContext();
  const navigation = useNavigation();

  const options = [
    {
      Icon: KeyIcon,
      heading: 'Account',
      subHeading: ['Privacy', 'security', 'edit details'],
    },
    {
      Icon: ChatBubbleBottomCenterIcon,
      heading: 'Chats',
      subHeading: ['Theme', 'wallpaper', 'chat history'],
    },
    {
      Icon: BellIcon,
      heading: 'Notifications',
      subHeading: ['Message', 'group & call tones'],
    },
    {
      Icon: WalletIcon,
      heading: 'Payments',
      subHeading: ['History', 'bank accounts'],
    },
    {
      Icon: CircleStackIcon,
      heading: 'Data and storage usage',
      subHeading: ['Network usage', 'auto-download'],
    },
    {
      Icon: QuestionMarkCircleIcon,
      heading: 'Help',
      subHeading: ['FAQ', 'contact us', 'privacy policy'],
    },
    {
      Icon: UserGroupIcon,
      heading: 'Invite a friend',
      subHeading: ['FAQ', 'contact us', 'privacy policy'],
    },
  ];
  return (
    <>
      <SettingsHeader />

      <View style={tw`bg-white flex-1 p-5`}>
        <TouchableOpacity
          style={tw`flex-row gap-x-4 items-center`}
          onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={{uri: user?.image}}
            style={tw`w-16 h-16 rounded-full`}
          />
          <View style={tw`gap-y-1`}>
            <View style={tw`flex-row items-center gap-x-3`}>
              <Text style={tw`font-bold text-base text-black`}>{user?.name}</Text>
              <Text style={tw`text-gray-500 text-sm`}>@{user?.username}</Text>
            </View>
            <Text style={tw`text-gray-500 text-sm`}>
              Hey there, I am using whatsapp.
            </Text>
          </View>
        </TouchableOpacity>

        <View style={tw`mt-12 gap-y-8 px-2`}>
          {options?.map(option => {
            return (
              <TouchableOpacity
                key={option.heading}
                style={tw`flex-row gap-x-5 items-center`}>
                <option.Icon size={26} style={tw`text-green-500`} />
                <View>
                  <Text style={tw`text-base text-black`}>{option.heading}</Text>
                  <Text style={tw`text-gray-500`}>
                    {option.subHeading.join(', ')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;
