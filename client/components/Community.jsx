import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {MegaphoneIcon} from 'react-native-heroicons/solid';
import {ChevronRightIcon} from 'react-native-heroicons/outline';

const Community = ({community}) => {
  return (
    <View style={tw`py-2`}>
      <View style={tw`flex-row items-center gap-x-3 mb-3 px-5`}>
        <Image
          source={{uri: community.image}}
          style={tw`w-10 h-12 rounded-md`}
        />
        <Text style={tw`text-black text-base font-semibold`}>
          {community.title}
        </Text>
      </View>

      <View style={tw`border-[0.4px] border-gray-300 w-full`} />

      <View style={tw`gap-y-8`}>
        <View style={tw`flex-row items-center gap-x-3 mx-2 px-5 mt-4`}>
          <View style={tw`bg-green-300 rounded-lg p-2`}>
            <MegaphoneIcon size={20} color={'green'} />
          </View>
          <Text style={tw`text-black font-semibold text-base`}>
            Announcements
          </Text>
        </View>

        <View style={tw`gap-y-8`}>
          {community.groups.map((group, i) => {
            return (
              <View style={tw`flex-row items-center gap-x-3 mx-2 px-5`} key={i}>
                <Image
                  source={{uri: group.image}}
                  style={tw`w-10 h-12 rounded-md`}
                />
                <View>
                  <Text style={tw`text-black font-semibold text-base`}>
                    {group.title}
                  </Text>

                  <View style={tw`flex-row`}>
                    <Text style={tw``}>{group.messageBy}:</Text>
                    <Text style={tw``}>{group.message}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={tw`flex-row gap-x-6 mx-3 px-5 items-center`}>
          <ChevronRightIcon size={23} color={'gray'} />
          <Text>View all</Text>
        </TouchableOpacity>

        <View style={tw`border-[0.4px] border-gray-300 w-full`} />
      </View>
    </View>
  );
};

export default Community;
