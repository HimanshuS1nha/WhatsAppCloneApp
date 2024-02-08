import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {UserGroupIcon} from 'react-native-heroicons/solid';
import {PlusSmallIcon} from 'react-native-heroicons/outline';
import {FlashList} from '@shopify/flash-list';
import Community from '../components/Community';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useAuthContext} from '../providers/AuthProvider';
import {useNavigation} from '@react-navigation/native';

const CommunityScreen = () => {
  const {setActiveChoice} = useAuthContext();
  const navigation = useNavigation();

  const communities = [
    {
      title: 'Test Community',
      image:
        'https://w7.pngwing.com/pngs/117/752/png-transparent-computer-icons-user-icon-design-numerous-miscellaneous-logo-computer-wallpaper-thumbnail.png',
      groups: [
        {
          title: 'Test Group 1',
          image:
            'https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png',
          message: 'Test message',
          messageBy: 'ABC',
        },
        {
          title: 'Test Group 2',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWh3LZmFCsBuKADqmNrLaLojkA0YfpnkCeDA',
          message: 'Test message 2',
          messageBy: 'ABC2',
        },
      ],
    },
    {
      title: 'Test Community 2',
      image:
        'https://www.iconpacks.net/icons/1/free-user-group-icon-296-thumb.png',
      groups: [
        {
          title: 'Test Group 1',
          image:
            'https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png',
          message: 'Test message',
          messageBy: 'ABC',
        },
        {
          title: 'Test Group 2',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEpWWQrAJpIR6Xy7FhzhCT00vzSmT7xw9S2Q',
          message: 'Test message 2',
          messageBy: 'ABC2',
        },
      ],
    },
    {
      title: 'Test Community 2',
      image:
        'https://www.iconpacks.net/icons/1/free-user-group-icon-296-thumb.png',
      groups: [
        {
          title: 'Test Group 1',
          image:
            'https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png',
          message: 'Test message',
          messageBy: 'ABC',
        },
        {
          title: 'Test Group 2',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEpWWQrAJpIR6Xy7FhzhCT00vzSmT7xw9S2Q',
          message: 'Test message 2',
          messageBy: 'ABC2',
        },
      ],
    },
  ];

  const handleSwipe = gestureName => {
    const {SWIPE_LEFT} = swipeDirections;
    if (gestureName === SWIPE_LEFT) {
      setActiveChoice('Chats');
      navigation.replace('Chats');
    }
  };
  return (
    <GestureRecognizer onSwipe={handleSwipe} style={tw`flex-1 bg-white`}>
      <ScrollView>
        <TouchableOpacity style={tw`py-4 px-5 flex-row items-center gap-x-3`}>
          <View style={tw`bg-black/20 p-2 rounded-lg`}>
            <UserGroupIcon size={32} color={'white'} />
            <View
              style={tw`bg-green-500 rounded-full absolute -bottom-1 p-0.5 border-2 border-white -right-2`}>
              <PlusSmallIcon size={20} color={'white'} />
            </View>
          </View>
          <Text style={tw`text-black text-base font-semibold`}>
            New community
          </Text>
        </TouchableOpacity>

        <View style={tw`border-[0.4px] border-gray-300 w-full`} />

        <View style={tw`h-full`}>
          <FlashList
            data={communities}
            keyExtractor={(_, i) => i}
            renderItem={({item}) => {
              return <Community community={item} />;
            }}
            estimatedItemSize={60}
          />
        </View>
      </ScrollView>
    </GestureRecognizer>
  );
};

export default CommunityScreen;
