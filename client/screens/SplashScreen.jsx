import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import tw from 'twrnc';
import {useAuthContext} from '../providers/AuthProvider';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const {user} = useAuthContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      if (Object.keys(user).length === 0) {
        navigation.replace('Login');
      } else {
        navigation.replace('Home');
      }
    }
  }, [user, navigation]);
  return (
    <View style={tw`flex-1 justify-center items-center gap-y-28 bg-white`}>
      <Image
        source={require('../assets/splashlogo.png')}
        style={tw`w-32 h-32`}
      />
      <View style={tw`gap-y-2 items-center`}>
        <Text style={tw`text-base text-black`}>BY</Text>
        <Text style={tw`font-bold text-green-600 text-2xl`}>
          HIMANSHU SINHA
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
