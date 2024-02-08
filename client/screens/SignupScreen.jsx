import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {useMutation} from '@tanstack/react-query';
import axios, {AxiosError} from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {mutate: handleSignup, isPending} = useMutation({
    mutationKey: ['signup'],
    mutationFn: async () => {
      if (!name || !username) {
        throw new Error('Please fill all the fields');
      }
      if (confirmPassword !== password) {
        throw new Error('Passwords do not match');
      }
      const {data} = await axios.post(`${API_URL}/api/signup`, {
        name,
        username,
        image,
        password,
      });
      return data;
    },
    onSuccess: data => {
      navigation.navigate('Login');
    },
    onError: error => {
      if (error instanceof AxiosError) {
        Alert.alert('Error', error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Error', 'Some error occured. Please try again later!');
      }
    },
  });

  return (
    <View style={tw`bg-white flex-1`} behavior="height">
      <View style={tw`h-36 bg-green-600 items-center`}>
        <View style={tw`items-center justify-center gap-y-3 absolute bottom-3`}>
          <Image source={require('../assets/logo.png')} style={tw`w-16 h-16`} />
          <Text style={tw`text-2xl text-white`}>WhatsApp</Text>
        </View>
      </View>

      <View style={tw`mt-2 gap-y-1`}>
        <Text style={tw`text-lg text-center font-bold text-green-600`}>
          Create an account
        </Text>
        <View style={tw`px-8`}>
          <Text style={tw`text-green-600`}>Name</Text>
          <TextInput
            style={tw`border-b border-b-green-600`}
            placeholder="Enter your name"
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={tw`px-8 mt-5`}>
          <Text style={tw`text-green-600`}>Username</Text>
          <TextInput
            style={tw`border-b border-b-green-600`}
            placeholder="Enter your username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>
        <View style={tw`px-8 mt-5`}>
          <Text style={tw`text-green-600`}>Profile Picture URL</Text>
          <TextInput
            style={tw`border-b border-b-green-600`}
            placeholder="Enter profile picture url"
            value={image}
            onChangeText={text => setImage(text)}
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
        <View style={tw`gap-y-2 px-8 mt-5`}>
          <Text style={tw`text-green-600`}>Confirm Password</Text>
          <TextInput
            style={tw`border-b border-b-green-600`}
            placeholder="Enter your password"
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={tw`w-[50%] ${
            isPending ? 'bg-green-300' : 'bg-green-600'
          } mx-auto justify-center items-center py-3 rounded-lg mt-5`}
          onPress={handleSignup}
          disabled={isPending}>
          <Text style={tw`text-white font-semibold`}>Signup</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row gap-x-2 mt-4 justify-center`}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={tw`text-green-600 underline`}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;
