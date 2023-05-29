import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ipAddressComputer } from '../data/ipaddresses.data';

const SocketContextGroups = createContext();

export const useSocketGroups = () => {
  return useContext(SocketContextGroups);
};

export const SocketProviderGroups = ({ children, namespace }) => {
    const [socket, setSocket] = useState(null);
    const SOCKET_SERVER_URL = ipAddressComputer + namespace;
  
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, { 
            autoConnect: true,     
            reconnectionAttempts: 10,
            timeout: 10000 
        });
        
        setSocket(newSocket);
    
        // Add your listeners here
        newSocket.on('connect_error', (error) => {
            console.error('Connection error group scpcet:', error);
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
  
    return <SocketContextGroups.Provider value={socket}>{children}</SocketContextGroups.Provider>;
};