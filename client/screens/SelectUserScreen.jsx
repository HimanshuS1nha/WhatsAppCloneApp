import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import SelectContactHeader from '../components/headers/SelectUserHeader';
import {useRoute} from '@react-navigation/native';
import {
  QrCodeIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from 'react-native-heroicons/solid';
import {useAuthContext} from '../providers/AuthProvider';
import {FlashList} from '@shopify/flash-list';
import MainDropdown from '../components/dropdowns/MainDropdown';

const SelectContactScreen = () => {
  const route = useRoute();
  const {user} = useAuthContext();

  const {users} = route.params;

  const [isVisible, setIsVisible] = useState(false);

  const options = [
    {
      title: 'Invite a friend',
      action: () => {},
    },
    {
      title: 'Contacts',
      action: () => {},
    },
    {
      title: 'Refresh',
      action: () => {},
    },
    {
      title: 'Help',
      action: () => {},
    },
  ];
  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <SelectContactHeader users={users} setIsVisible={setIsVisible} />
      <MainDropdown
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={options}
      />

      <View style={tw`mt-4 gap-y-6 ml-4 mr-6`}>
        <TouchableOpacity style={tw`flex-row gap-x-4 items-center`}>
          <View style={tw`bg-[#128C7E] p-2 rounded-full`}>
            <UsersIcon color={'white'} size={22} />
          </View>
          <Text style={tw`text-black text-base font-medium`}>New group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row gap-x-4 items-center`}>
            <View style={tw`bg-[#128C7E] p-2 rounded-full`}>
              <UserPlusIcon color={'white'} size={22} />
            </View>
            <Text style={tw`text-black text-base font-medium`}>
              New contact
            </Text>
          </View>
          <QrCodeIcon color={'gray'} size={26} />
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row gap-x-4 items-center`}>
          <View style={tw`bg-[#128C7E] p-2 rounded-full`}>
            <UserGroupIcon color={'white'} size={22} />
          </View>
          <Text style={tw`text-black text-base font-medium`}>
            New community
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={tw`mt-4 ml-4 font-medium`}>Users on WhatsApp</Text>

      <View style={tw`gap-y-5 mt-4 h-full`}>
        <TouchableOpacity style={tw`mx-3 flex-row gap-x-4 items-center`}>
          <Image
            source={{uri: user?.image}}
            style={tw`w-10 h-10 rounded-full`}
          />
          <View>
            <Text style={tw`text-black text-base font-medium`}>
              {user?.name}
            </Text>
            <Text>Message yourself</Text>
          </View>
        </TouchableOpacity>

        <FlashList
          data={users}
          keyExtractor={(_, i) => i}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={tw`mx-3 flex-row gap-x-4 items-center mb-6`}>
                <Image
                  source={{uri: item?.image}}
                  style={tw`w-10 h-10 rounded-full`}
                />
                <View>
                  <Text style={tw`text-black text-base font-medium`}>
                    {item?.name}
                  </Text>
                  <Text>Hey there! I am using WhatsApp!</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          estimatedItemSize={50}
        />
      </View>
    </ScrollView>
  );
};

export default SelectContactScreen;
