import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import EditProfileHeader from '../components/headers/EditProfileHeader';
import {useAuthContext} from '../providers/AuthProvider';
import tw from 'twrnc';
import {
  AtSymbolIcon,
  CameraIcon,
  InformationCircleIcon,
  PencilIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
import EditProfile from '../components/EditProfile';

const EditProfileScreen = () => {
  const {user} = useAuthContext();

  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');

  const handleEditProfile = (label, value) => {
    setLabel(label);
    setValue(value);
    setIsVisible(true);
  };
  return (
    <View style={tw`flex-1 bg-white`}>
      <EditProfileHeader />
      <EditProfile
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        label={label}
        value={value}
      />
      <View style={tw`items-center mt-6`}>
        <Image source={{uri: user?.image}} style={tw`w-40 h-40 rounded-full`} />
        <TouchableOpacity
          style={tw`absolute bg-[#128C7E] p-3 rounded-full bottom-0 left-[54&]`}>
          <CameraIcon size={28} color={'white'} />
        </TouchableOpacity>
      </View>

      <View style={tw`mt-12 px-7 gap-y-4`}>
        <View style={tw`flex-row gap-x-7`}>
          <UserIcon size={27} color={'green'} style={tw`mt-3`} />
          <View style={tw`gap-y-4`}>
            <View>
              <Text>Name</Text>
              <View style={tw`flex-row justify-between w-[90%] items-center`}>
                <Text style={tw`text-lg text-black`}>{user?.name}</Text>
                <TouchableOpacity
                  onPress={() => handleEditProfile('name', user?.name)}>
                  <PencilIcon size={20} color={'green'} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={tw`w-60`}>
              This is not your username or pin. This name will be visible to
              your whatsapp contacts
            </Text>

            <View style={tw`border-[0.8px] border-gray-300`} />
          </View>
        </View>
        <View style={tw`flex-row gap-x-7`}>
          <AtSymbolIcon size={27} color={'green'} style={tw`mt-3`} />
          <View>
            <Text>Username</Text>
            <View style={tw`flex-row justify-between w-[90%] items-center`}>
              <Text style={tw`text-lg text-black`}>{user?.username}</Text>
              <TouchableOpacity
                onPress={() => handleEditProfile('username', user?.username)}>
                <PencilIcon size={20} color={'green'} />
              </TouchableOpacity>
            </View>

            <View style={tw`border-[0.8px] border-gray-300 mt-4`} />
          </View>
        </View>
        <View style={tw`flex-row gap-x-7`}>
          <InformationCircleIcon size={27} color={'green'} style={tw`mt-3`} />
          <View>
            <Text>About</Text>
            <View style={tw`flex-row justify-between w-[90%] items-center`}>
              <Text style={tw`text-lg text-black`}>
                {'Some secrets are better kept secret'.substring(0, 24) + '...'}
              </Text>
              <TouchableOpacity>
                <PencilIcon size={20} color={'green'} />
              </TouchableOpacity>
            </View>

            <View style={tw`border-[0.8px] border-gray-300 mt-4`} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditProfileScreen;
