import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ipAddressComputer } from '../data/ipaddresses.data';

const SocketContextUserprofile = createContext();

export const useSocketUser= () => {
  return useContext(SocketContextUserprofile);
};

export const SocketProviderUser = ({ children, namespace }) => {
    const [socket, setSocket] = useState(null);
    const SOCKET_SERVER_URL = ipAddressComputer + namespace;
  
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, { autoConnect: true });
        setSocket(newSocket);
    
        // Add your listeners here
        newSocket.on('connect_error', (error) => {
            console.error('Connection error userProfile:', error);
        });
    
        newSocket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
            if (reason === 'io server disconnect') {
                newSocket.connect();
            }
        });
    
        newSocket.on('reconnect', (attemptNumber) => {
            console.log('Reconnected after', attemptNumber, 'attempts');
        });
    
        newSocket.on('reconnect_failed', () => {
            console.error('Reconnection failed');
        });
    
        return () => {
            newSocket.close();
        };
    }, []);
  
    return <SocketContextUserprofile.Provider value={socket}>{children}</SocketContextUserprofile.Provider>;
};