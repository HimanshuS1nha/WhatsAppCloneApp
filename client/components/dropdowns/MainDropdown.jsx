import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const MainDropdown = ({isVisible, setIsVisible, options, style}) => {
  return (
    <>
      {isVisible && (
        <View
          style={[
            tw`absolute right-0.5 bg-white w-56 rounded-lg px-3 py-4 top-12 gap-y-7 shadow-lg z-10`,
            style,
          ]}>
          {options?.map(option => {
            return (
              <TouchableOpacity
                key={option.title}
                onPress={() => {
                  setIsVisible(false);
                  option.action();
                }}
                style={tw`flex-1`}>
                <Text style={tw`text-black text-base`}>{option.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
};

export default MainDropdown;
