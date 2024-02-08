import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import CallHeader from '../components/headers/CallHeader';
import tw from 'twrnc';
import {useRoute} from '@react-navigation/native';
import {
  ArrowSmallUpIcon,
  PhoneIcon,
  VideoCameraIcon,
} from 'react-native-heroicons/solid';
import MainDropdown from '../components/dropdowns/MainDropdown';

const CallScreen = () => {
  const route = useRoute();
  const {call} = route.params;

  const [isVisible, setIsVisible] = useState(false);

  const options = [
    {
      title: 'Remove from call log',
      action: () => {},
    },
    {
      title: 'Block',
      action: () => {},
    },
  ];
  return (
    <View style={tw`flex-1 bg-white`}>
      <CallHeader setIsVisible={setIsVisible} />
      <MainDropdown
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={options}
      />
      <View style={tw`flex-row pt-4 pl-3 justify-between`}>
        <View style={tw`flex-row gap-x-4 items-center`}>
          <Image
            source={{uri: call.image}}
            style={tw`w-10 h-10 rounded-full`}
          />

          <View>
            <Text style={tw`text-black font-semibold text-base`}>
              {call.name}
            </Text>
            <Text>Hey there! I am using whatsapp</Text>
          </View>
        </View>

        <View style={tw`flex-row mr-2 gap-x-6 items-center`}>
          <TouchableOpacity>
            <PhoneIcon color={'green'} size={25} />
          </TouchableOpacity>
          <TouchableOpacity>
            <VideoCameraIcon color={'green'} size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`border-[0.6px] border-gray-300 ml-16 mt-3`} />

      <Text style={tw`ml-16 mt-2`}>{call.time.split(',')[0].trim()}</Text>

      <View style={tw`flex-row mt-3 pl-4 pr-2 gap-x-4 items-center`}>
        <ArrowSmallUpIcon
          size={30}
          color={call.missed ? 'red' : 'green'}
          style={{
            transform: [
              {rotate: call.type === 'incoming' ? '-135deg' : '45deg'},
            ],
          }}
        />
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`w-[76%]`}>
            <Text style={tw`text-black capitalize text-base`}>{call.type}</Text>
            <View style={tw`flex-row items-center gap-x-2`}>
              <PhoneIcon color={'gray'} size={14} />
              <Text>{call.time.split(',')[1].trim()}</Text>
            </View>
          </View>

          <View style={tw`items-end`}>
            <Text>3:30</Text>
            <Text>1.0 MB</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CallScreen;
