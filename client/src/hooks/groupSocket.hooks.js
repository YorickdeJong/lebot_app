import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSocketGroups } from '../store/group-socket-context';
import { GroupTeacherContext } from '../store/group-teacher-context';


export const useFetchGroupsDataSocket = (shouldConnect, user_id, classroom_id, school_id) => {
    const [data, setData] = useState([]);
    const socket = useSocketGroups();
    const groupTeacherCtx = useContext(GroupTeacherContext)

    const initialize = useCallback(() => {
      if (socket) {
        console.log('user_id: ' + user_id, 'classroom_id ' + classroom_id, 'school_id ' + school_id);
        socket.emit('initialize', {
          user_id,
          classroom_id,
          school_id,
        });
        console.log('Connected to socket');
      }
      console.log('Initialize called for groups');
    }, [user_id, classroom_id, school_id, socket]);
  
    useEffect(() => {
      if (!shouldConnect || !socket) {
        return;
      }
  
      socket.on('connect', initialize);
  
      socket.on('connect_error', (error) => {
        //console.log('Connection error:', error);
      });
  
      socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });
  
      socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
      });
  
      socket.on('reconnect_failed', () => {
        console.error('Reconnection failed');
      });
  
      socket.on('fetch-data-update', async (fetchedData) => {
        groupTeacherCtx.addGroupArrayHandler(fetchedData);
        setData(fetchedData);
      });
  
      return () => {
        // Do not disconnect the socket here, as it is managed by the context
        console.log('Socket cleanup');
      };
    }, [shouldConnect, initialize, socket]);
  
    return [data, initialize];
  };