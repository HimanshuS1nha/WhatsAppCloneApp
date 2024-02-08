import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {FlashList} from '@shopify/flash-list';
import CallPreview from '../components/CallPreview';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../providers/AuthProvider';
import {LinkIcon} from 'react-native-heroicons/outline';
import { calls } from '../constants/Calls';
import { PhoneIcon, PlusIcon } from 'react-native-heroicons/solid';

const CallsScreen = () => {
  const {setActiveChoice} = useAuthContext();
  const navigation = useNavigation();

  const handleSwipe = gestureName => {
    const {SWIPE_RIGHT} = swipeDirections;
    if (gestureName === SWIPE_RIGHT) {
      setActiveChoice('Updates');
      navigation.replace('Updates');
    }
  };
  return (
    <GestureRecognizer style={tw`bg-white p-4 flex-1`} onSwipe={handleSwipe}>
      <ScrollView>
        <TouchableOpacity style={tw`flex-row gap-x-3 items-center`}>
          <View
            style={tw`bg-[#128C7E] w-10 h-10 rounded-full justify-center items-center`}>
            <LinkIcon
              size={22}
              color="white"
              style={{
                transform: [{rotate: '45deg'}],
              }}
            />
          </View>
          <View>
            <Text style={tw`font-semibold text-lg text-black`}>
              Create call link
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              Share a link for your whatsapp call
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={tw`font-bold mt-6 text-base`}>Recent</Text>

        <View style={tw`w-full h-full`}>
          <FlashList
            data={calls}
            keyExtractor={(_, i) => i}
            renderItem={({item}) => {
              return <CallPreview call={item} />;
            }}
            estimatedItemSize={100}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={tw`absolute bottom-4 right-3 bg-[#128C7E] p-3 rounded-2xl`}>
        <PhoneIcon color={"white"} size={27}/>
        <PlusIcon color={"white"} size={13} style={tw`absolute top-3 right-3`} fontWeight={600}/>
      </TouchableOpacity>
    </GestureRecognizer>
  );
};

export default CallsScreen;
