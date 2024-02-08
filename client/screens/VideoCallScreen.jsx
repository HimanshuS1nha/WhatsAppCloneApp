import {useNavigation, useRoute} from '@react-navigation/native';
import {useRef, useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import socket from '../libs/socket';
import {useAuthContext} from '../providers/AuthProvider';
import tw from 'twrnc';
import {PhoneIcon} from 'react-native-heroicons/solid';
import KeepAwake from 'react-native-keep-awake';

const VideoCallScreen = () => {
  const {user, chat} = useAuthContext();
  const route = useRoute();
  const navigation = useNavigation();

  const [localStream, setlocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const peerRef = useRef();
  const socketRef = useRef(socket);
  const otherUser = useRef();
  const userStream = useRef();

  const {roomId} = route.params;

  useEffect(() => {
    mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
      setlocalStream(stream);
      userStream.current = stream;

      socketRef.current.emit('join-room', roomId);
      socketRef.current.emit('initiate-call', {
        id: user?.id,
        to: chat?._id,
        name: user?.name,
        image: user?.image,
        type: 'video',
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
      .forEach(track => peerRef.current.addTrack(track, userStream.current));
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
    peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    peer.onsignalingstatechange = handleSignalingStateChangeEvent;

    return peer;
  };

  const handleSignalingStateChangeEvent = () => {
    if (peerRef.current.signalingState === 'closed') {
      handleEndVideoCall();
    }
  };

  const handleICEConnectionStateChangeEvent = () => {
    if (
      peerRef.current.iceConnectionState === 'closed' ||
      peerRef.current.iceConnectionState === 'failed'
    ) {
      handleEndVideoCall();
    }
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
      peerRef.current.oniceconnectionstatechange = null;
      peerRef.current.onsignalingstatechange = null;

      peerRef.current.close();
      peerRef.current = null;
    }

    userStream.current.getTracks().forEach(track => track.stop());
    if (navigation.canGoBack) {
      navigation.goBack();
    } else {
      navigation.replace('Chats');
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <KeepAwake />
      <RTCView
        streamURL={remoteStream?.toURL()}
        style={tw`h-[50%]`}
        objectFit="cover"
        mirror
      />
      <RTCView
        streamURL={localStream?.toURL()}
        style={tw`h-[50%]`}
        objectFit="cover"
        mirror
      />

      <View style={tw`absolute bottom-4 w-full items-center`}>
        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded-full`}
          onPress={() => {
            socketRef.current.emit('end-call', {to: chat?._id});
            handleEndVideoCall();
          }}>
          <PhoneIcon
            size={30}
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

export default VideoCallScreen;
