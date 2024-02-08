import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {
  ArrowSmallLeftIcon,
  BellIcon,
  ChevronRightIcon,
  CurrencyRupeeIcon,
  EllipsisVerticalIcon,
  HandThumbDownIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  NoSymbolIcon,
  PhoneIcon,
  PhotoIcon,
  StarIcon,
  VideoCameraIcon,
} from 'react-native-heroicons/solid';
import {useAuthContext} from '../providers/AuthProvider';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import MainDropdown from '../components/dropdowns/MainDropdown';

const ChatProfileScreen = () => {
  const {chat} = useAuthContext();
  const navigation = useNavigation();
  const {status} = useRoute().params;

  const [isVisible, setIsVisible] = useState(false);

  const images = [
    'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702080000&semt=sph',
    'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
    'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702080000&semt=sph',
    'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
  ];

  const options = [
    {
      Icon: BellIcon,
      title: 'Mute notifications',
    },
    {
      Icon: MusicalNoteIcon,
      title: 'Custom notifications',
    },
    {
      Icon: PhotoIcon,
      title: 'Media visibility',
    },
    {
      Icon: StarIcon,
      title: 'Starred messages',
    },
  ];

  const dropdownOptions = [
    {
      title: 'Share',
      action: () => {},
    },
    {
      title: 'Edit',
      action: () => {},
    },
    {
      title: 'View in address book',
      action: () => {},
    },
    {
      title: 'Verify security code',
      action: () => {},
    },
  ];
  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <MainDropdown
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={dropdownOptions}
      />
      <View style={tw`flex-row items-center justify-between px-4 mt-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowSmallLeftIcon size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
          <EllipsisVerticalIcon size={29} color="black" />
        </TouchableOpacity>
      </View>

      <View style={tw`items-center gap-y-2 -mt-8`}>
        <Image source={{uri: chat?.image}} style={tw`w-36 h-36 rounded-full`} />
        <Text style={tw`text-black text-2xl font-medium`}>{chat?.name}</Text>
        <Text style={tw`bg-gray-100 py-1 px-4 rounded-full`}>{status}</Text>
      </View>

      <View style={tw`flex-row mt-5 justify-center gap-x-4`}>
        <TouchableOpacity
          style={tw`gap-y-2 items-center border-[0.8px] border-gray-300 w-20 py-2 rounded-lg`}>
          <PhoneIcon size={29} color="green" />
          <Text style={tw`text-black`}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`gap-y-2 items-center border-[0.8px] border-gray-300 w-20 py-2 rounded-lg`}>
          <VideoCameraIcon size={29} color="green" />
          <Text style={tw`text-black`}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`gap-y-2 items-center border-[0.8px] border-gray-300 w-20 py-2 rounded-lg`}>
          <CurrencyRupeeIcon size={29} color="green" />
          <Text style={tw`text-black`}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`gap-y-2 items-center border-[0.8px] border-gray-300 w-20 py-2 rounded-lg`}>
          <MagnifyingGlassIcon size={29} color="green" />
          <Text style={tw`text-black`}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`h-2 bg-gray-100 mt-4`} />

      <View style={tw`pt-6 px-4`}>
        <Text style={tw`text-black text-lg`}>
          Some secrets are better kept secret🤫
        </Text>
        <Text>February 27,2022</Text>
      </View>

      <View style={tw`h-2 bg-gray-100 mt-4`} />

      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`font-bold`}>Media, Links & Docs</Text>
          <TouchableOpacity style={tw`flex-row items-center`}>
            <Text>1,234</Text>
            <ChevronRightIcon size={20} color={'gray'} />
          </TouchableOpacity>
        </View>

        <View style={tw`mt-4 h-32`}>
          <FlashList
            data={images}
            keyExtractor={(_, i) => i}
            renderItem={({item}) => {
              return (
                <Image
                  source={{uri: item}}
                  style={tw`w-32 h-32 rounded-lg mr-2`}
                />
              );
            }}
            estimatedItemSize={40}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={tw`h-2 bg-gray-100`} />

      <View style={tw`px-7 pt-4 gap-y-7`}>
        {options.map(option => {
          return (
            <TouchableOpacity
              key={option.title}
              style={tw`flex-row gap-x-10 items-center`}>
              <option.Icon size={28} color={'gray'} />
              <Text style={tw`text-black text-base`}>{option.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={tw`h-2 bg-gray-100 mt-4`} />

      <View style={tw`px-7 py-4 gap-y-7`}>
        <TouchableOpacity style={tw`flex-row gap-x-10 items-center`}>
          <NoSymbolIcon size={28} color={'red'} />
          <Text style={tw`text-red-500 font-semibold`}>Block {chat?.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row gap-x-10 items-center`}>
          <HandThumbDownIcon size={28} color={'red'} />
          <Text style={tw`text-red-500 font-semibold`}>
            Report {chat?.name}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChatProfileScreen;
