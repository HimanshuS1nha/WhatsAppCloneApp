import {io} from 'socket.io-client';
import {API_URL} from '@env';

const socket = io(API_URL, {
  autoConnect: false,
});

export default socket;
