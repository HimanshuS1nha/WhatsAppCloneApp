import EncryptedStorage from 'react-native-encrypted-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

export const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeChoice, setActiveChoice] = useState('Chats');
  const [chat, setChat] = useState({});
  const [callType, setCallType] = useState('outgoing');
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await EncryptedStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({});
        }
      } catch (error) {
        Alert.alert('Error', 'Some error occured. Please try again later!');
      }
    };
    getUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        activeChoice,
        setActiveChoice,
        chat,
        setChat,
        callType,
        setCallType,
        currentRoute,
        setCurrentRoute,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
