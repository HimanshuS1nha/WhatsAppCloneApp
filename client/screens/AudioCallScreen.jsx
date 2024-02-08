import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import tw from 'twrnc';
import {
  ChevronLeftIcon,
  LockClosedIcon,
  PhoneIcon,
  UserPlusIcon,
} from 'react-native-heroicons/solid';
import {useAuthContext} from '../providers/AuthProvider';
import {useNavigation, useRoute} from '@react-navigation/native';
import socket from '../libs/socket';
import {
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import KeepAwake from 'react-native-keep-awake';

const AudioCallScreen = () => {
  const {user, chat} = useAuthContext();
  const route = useRoute();
  const navigation = useNavigation();

  const [localStream, setlocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const peerRef = useRef();
  const socketRef = useRef(socket);
  const otherUser = useRef();
  const userStream = useRef();
  const senders = useRef([]);

  const {roomId} = route.params;

  const addZero = value => {
    return value.toString().length > 1 ? value : '0' + value;
  };

  const updateTime = useCallback(() => {
    if (seconds === 59 && minutes < 60) {
      setSeconds(0);
      setMinutes(prev => prev + 1);
    } else if (seconds < 60 && minutes < 60) {
      setSeconds(prev => prev + 1);
    } else if (seconds === 59 && minutes === 59) {
      setHours(prev => prev + 1);
      setMinutes(0);
      setSeconds(0);
    }
  }, [seconds, minutes, hours]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateTime]);

  useEffect(() => {
    mediaDevices.getUserMedia({audio: true}).then(stream => {
      setlocalStream(stream);
      userStream.current = stream;

      socketRef.current.emit('join-room', roomId);
      socketRef.current.emit('initiate-call', {
        id: user?.id,
        to: chat?._id,
        name: user?.name,
        image: user?.image,
        type: 'audio',
      });

      socketRef.current.on('other-user', userID => {
        callUser(userID);
        otherUser.current = userID;
      });

      socketRef.current.on('user-joined', userID => {
        otherUser.current = userID;
      });

      socketRef.current.on('offer', handleReceiveCall);

      socketRef.current.on('answer', handleAnswer);

      socketRef.current.on('ice-candidate', handleNewICECandidateMsg);

      socketRef.current.on('end-call', handleEndVideoCall);
    });
  }, []);

  const callUser = userID => {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach(track =>
        senders.current.push(
          peerRef.current.addTrack(track, userStream.current),
        ),
      );
  };

  const createPeer = userID => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.stunprotocol.org',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  };

  const handleNegotiationNeededEvent = userID => {
    peerRef.current
      .createOffer()
      .then(offer => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit('offer', payload);
      })
      .catch(e => {
        Alert.alert('Error', 'Some error occured. Please try again later!');
        if (navigation.canGoBack) {
          navigation.goBack();
        } else {
          navigation.replace('Chats');
        }
      });
  };

  const handleReceiveCall = incoming => {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach(track =>
            peerRef.current.addTrack(track, userStream.current),
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then(answer => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit('answer', payload);
      });
  };

  const handleAnswer = message => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch(e => {
      Alert.alert('Error', 'Some error occured. Please try again later!');
      if (navigation.canGoBack) {
        navigation.goBack();
      } else {
        navigation.replace('Chats');
      }
    });
  };

  const handleICECandidateEvent = e => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit('ice-candidate', payload);
    }
  };

  const handleNewICECandidateMsg = incoming => {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch(e => {
      Alert.alert('Error', 'Some error occured. Please try again later!');
      if (navigation.canGoBack) {
        navigation.goBack();
      } else {
        navigation.replace('Chats');
      }
    });
  };

  const handleTrackEvent = e => {
    setRemoteStream(e.streams[0]);
  };

  const handleEndVideoCall = () => {
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.onnegotiationneeded = null;

      peerRef.current.close();
      senders.current = [];
      peerRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    if (navigation.canGoBack) {
      navigation.goBack();
    } else {
      navigation.replace('Chats');
    }
  };
  return (
    <View style={tw`bg-black flex-1`}>
      <KeepAwake />
      <View style={tw`mt-5 px-2 flex-row justify-between items-center`}>
        <TouchableOpacity
          onPress={() => {
            socketRef.current.emit('end-call', {to: chat?._id});
            handleEndVideoCall();
          }}>
          <ChevronLeftIcon color={'white'} size={27} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center gap-x-2`}>
          <LockClosedIcon color={'gray'} size={17} />
          <Text style={tw`text-gray-400 font-medium`}>
            End to End Encrypted
          </Text>
        </View>
        <TouchableOpacity>
          <UserPlusIcon color={'white'} size={27} />
        </TouchableOpacity>
      </View>

      <View style={tw`items-center mt-12 gap-y-3`}>
        <Text style={tw`text-white text-2xl font-bold`}>{chat?.name}</Text>
        <Text style={tw`text-gray-400 text-lg font-medium`}>
          {hours > 0 && addZero(hours) + ':'}
          {addZero(minutes)}:{addZero(seconds)}
        </Text>
      </View>

      <View style={tw`items-center mt-20`}>
        <Image source={{uri: chat?.image}} style={tw`w-40 h-40 rounded-full`} />
      </View>

      <View style={tw`absolute w-full bottom-6 items-center`}>
        <TouchableOpacity
          style={tw`bg-red-500 p-4 rounded-full`}
          onPress={() => {
            socketRef.current.emit('end-call', {to: chat?._id});
            handleEndVideoCall();
          }}>
          <PhoneIcon
            size={27}
            color={'white'}
            style={{
              transform: [
                {
                  rotate: '137deg',
                },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioCallScreen;
