import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {useAuthContext} from '../providers/AuthProvider';
import axios, {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {API_URL} from '@env';

const LoginScreen = () => {
  const {setUser} = useAuthContext();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {mutate: handleLogin, isPending} = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      if (!username || !password) {
        throw new Error('Please enter some values');
      }
      const {data} = await axios.post(`${API_URL}/api/login`, {
        username,
        password,
      });
      return data;
    },
    onSuccess: async data => {
      setUser(data?.user);
      await EncryptedStorage.setItem('user', JSON.stringify(data?.user));
      navigation.replace('Home');
    },
    onError: error => {
      if (error instanceof AxiosError) {
        Alert.alert('Error', error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert('error', error);
      } else {
        Alert.alert('Error', 'Some error occured. Please try again later!');
      }
    },
  });

  return (
    <View style={tw`bg-white flex-1`}>
      <View style={tw`h-60 bg-green-600 items-center`}>
        <View style={tw`items-center justify-center gap-y-3 absolute bottom-9`}>
          <Image source={require('../assets/logo.png')} style={tw`w-16 h-16`} />
          <Text style={tw`text-2xl text-white`}>WhatsApp</Text>
        </View>
      </View>

      <View style={tw`mt-12 gap-y-5`}>
        <Text style={tw`text-lg text-center font-bold text-green-600`}>
          Login to your account
        </Text>
        <View style={tw`gap-y-2 px-8 mt-5`}>
          <Text style={tw`text-green-600`}>Username</Text>
          <TextInput
            style={tw`border-b border-b-green-600`}
            placeholder="Enter your username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>
        <View style={tw`gap-y-2 px-8 mt-5`}>
          <Text style={tw`text-green-600`}>Password</Text>
          <TextInput
            style={tw`border-b border-b-green-600`}
            placeholder="Enter your password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={tw`w-[50%] ${
            isPending ? 'bg-green-300' : 'bg-green-600'
          } mx-auto justify-center items-center py-3 rounded-lg mt-5`}
          disabled={isPending}
          onPress={handleLogin}>
          <Text style={tw`text-white font-semibold`}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row gap-x-2 mt-12 justify-center`}>
        <Text>Don&apos;t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={tw`text-green-600 underline`}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
