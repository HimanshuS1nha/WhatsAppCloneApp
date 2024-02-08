import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import tw from 'twrnc';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from 'react-native-heroicons/solid';
import VideoPlayer from 'react-native-video';
import MainDropdown from '../components/dropdowns/MainDropdown';

const UpdateScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {update} = route.params;

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const changeProgress = useCallback(() => {
    if (progress >= 100) {
      navigation.goBack();
    } else {
      setProgress(prev => prev + 0.5);
    }
  }, [progress]);

  const options = [
    {
      title: 'Mute',
      action: () => {},
    },
    {
      title: 'Message',
      action: () => {},
    },
    {
      title: 'Voice call',
      action: () => {},
    },
    {
      title: 'Video call',
      action: () => {},
    },
    {
      title: 'View contact',
      action: () => {},
    },
    {
      title: 'Report',
      action: () => {},
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      changeProgress();
    }, 50);

    return () => clearInterval(interval);
  }, [changeProgress]);
  return (
    <View style={tw`flex-1 bg-black`}>
      <MainDropdown
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={options}
      />
      <View style={tw`flex-row`}>
        <View style={tw`border border-white w-[${progress}%]`} />
        <View style={tw`border border-gray-700 w-full`} />
      </View>
      <View style={tw`flex-row justify-between px-2 mt-2 items-center`}>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon color={'white'} size={25} />
          </TouchableOpacity>
          <View style={tw`border-2 border-white rounded-full`}>
            <Image
              source={{uri: update.image}}
              style={tw`w-8 h-8 rounded-full`}
            />
          </View>
          <View>
            <Text style={tw`text-white text-base`}>{update.name}</Text>
            <Text style={tw`text-white/85`}>Yesterday, 10:49 pm</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setIsVisible(prev => !prev)}>
          <EllipsisVerticalIcon color={'white'} size={28} />
        </TouchableOpacity>
      </View>

      {update.type === 'image' ? (
        <Image
          source={{uri: update.status}}
          style={tw`w-full h-[57%] mt-24`}
          resizeMode="stretch"
        />
      ) : (
        <VideoPlayer
          source={{uri: update.status}}
          style={tw`w-full h-[57%] mt-24`}
          resizeMode="stretch"
          autoplay
          onEnd={() => navigation.goBack()}
        />
      )}
    </View>
  );
};

export default UpdateScreen;
