import { useEffect, useRef } from 'react';
import { socketService } from '../utils/socket';

export const useSocket = () => {
  const socketRef = useRef(socketService.getSocket());

  useEffect(() => {
    const socket = socketService.connect();
    socketRef.current = socket;
    
    return () => {
      // Typically keep one global connection unless there's a reason to disconnect
    };
  }, []);

  return socketRef.current;
};
