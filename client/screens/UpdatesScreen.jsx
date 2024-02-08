import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {FlashList} from '@shopify/flash-list';
import StatusAvatar from '../components/StatusAvatar';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import FollowedChannel from '../components/FollowedChannel';
import Channel from '../components/Channel';
import {useAuthContext} from '../providers/AuthProvider';
import {
  ChevronRightIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import MainDropdown from '../components/dropdowns/MainDropdown';
import {updates} from '../constants/Updates';
import {findChannels, followedChannels} from '../constants/Channels';
import {CameraIcon, PencilIcon} from 'react-native-heroicons/solid';

const UpdatesScreen = () => {
  const {setActiveChoice, user} = useAuthContext();
  const navigation = useNavigation();

  const [isVisible, setIsVisible] = useState(false);
  const [channelDropDownVisible, setChannelDropDownVisible] = useState(false);

  const handleSwipe = gestureName => {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if (gestureName === SWIPE_LEFT) {
      setActiveChoice('Calls');
      navigation.replace('Calls');
    } else if (gestureName === SWIPE_RIGHT) {
      setActiveChoice('Chats');
      navigation.replace('Chats');
    }
  };

  const options = [
    {
      title: 'Status Privacy',
      action: () => {},
    },
  ];

  const channelDropDOwnOptions = [
    {
      title: 'Create channel',
      action: () => {},
    },
    {
      title: 'Find channels',
      action: () => {},
    },
  ];
  return (
    <>
      <ScrollView style={tw`bg-white flex-1 pb-20`}>
        <MainDropdown
          options={options}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
        <View style={tw`p-5`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-semibold text-lg text-black`}>Status</Text>
            <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
              <EllipsisVerticalIcon size={25} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={tw`flex-row items-center`}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={tw`gap-y-1 mt-4`}>
              <Image
                source={{uri: user?.image}}
                style={tw`w-16 h-16 rounded-full mr-5`}
              />
              <Text style={tw`ml-3.5 text-black`}>
                {user?.name.length > 7
                  ? user?.name.substring(0, 6) + '...'
                  : user?.name}
              </Text>
              <TouchableOpacity
                style={tw`absolute bg-green-500 p-0.5 border border-white bottom-5 rounded-full right-3`}>
                <PlusIcon color={'white'} />
              </TouchableOpacity>
            </TouchableOpacity>
            <FlashList
              data={updates}
              keyExtractor={(_, i) => i}
              renderItem={({item}) => {
                return <StatusAvatar status={item} />;
              }}
              estimatedItemSize={20}
              horizontal
              scrollEnabled={false}
              contentContainerStyle={tw`pt-4`}
            />
          </ScrollView>
        </View>
        <GestureRecognizer onSwipe={handleSwipe}>
          <View style={tw`border-[0.8px] border-gray-300 w-full`} />

          <View style={tw`px-5 min-h-40`}>
            <MainDropdown
              isVisible={channelDropDownVisible}
              setIsVisible={setChannelDropDownVisible}
              options={channelDropDOwnOptions}
              style={tw`top-[59px]`}
            />
            <View style={tw`flex-row justify-between items-center mt-8`}>
              <Text style={tw`font-semibold text-lg text-black`}>Channels</Text>
              <TouchableOpacity
                onPress={() => setChannelDropDownVisible(prev => !prev)}>
                <PlusIcon size={28} color="black" fontWeight={800} />
              </TouchableOpacity>
            </View>

            <FlashList
              data={followedChannels}
              keyExtractor={(_, i) => i}
              renderItem={({item}) => {
                return <FollowedChannel channel={item} />;
              }}
              estimatedItemSize={20}
              contentContainerStyle={tw`pt-4`}
            />
          </View>
        </GestureRecognizer>
        <View style={tw`px-5 pb-12`}>
          <View style={tw`flex-row justify-between items-center mt-8`}>
            <Text style={tw`font-semibold text-lg text-black`}>
              Find Channels
            </Text>
            <TouchableOpacity style={tw`flex-row items-center`} onPress={()=>navigation.navigate("Channels")}>
              <Text style={tw`text-green-600 font-bold`}>See all</Text>
              <ChevronRightIcon size={18} style={tw`text-green-600`} />
            </TouchableOpacity>
          </View>

          <FlashList
            data={findChannels}
            keyExtractor={(_, i) => i}
            renderItem={({item}) => {
              return <Channel channel={item} />;
            }}
            estimatedItemSize={20}
            contentContainerStyle={tw`pt-4`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={tw`absolute bg-green-200 p-2 rounded-lg bottom-24 right-[22px]`}>
        <PencilIcon color={'green'} size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`absolute bg-[#128C7E] p-3 rounded-2xl bottom-4 right-3`}>
        <CameraIcon color={'white'} size={30} />
      </TouchableOpacity>
    </>
  );
};

export default UpdatesScreen;
