import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useQueryClient } from '@tanstack/react-query';

export const useBookingSocket = (bookingId?: number) => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // Join personal room if needed, or specific booking
    if (bookingId) {
      socket.emit('join_booking', bookingId.toString());
    }

    // Refresh all bookings when broad refresh is emitted
    const handleRefresh = () => {
      console.log('Refreshing bookings due to socket alert');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    };

    // Update specific booking
    const handleBookingUpdate = (data: any) => {
      console.log('Booking updated via socket:', data);
      if (bookingId) {
        queryClient.invalidateQueries({ queryKey: ['booking', bookingId.toString()] });
        // Also refresh tracking
        queryClient.invalidateQueries({ queryKey: ['tracking', bookingId.toString()] });
      }
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    };

    socket.on('bookings_refresh', handleRefresh);
    socket.on('booking_updated', handleBookingUpdate);

    return () => {
      socket.off('bookings_refresh', handleRefresh);
      socket.off('booking_updated', handleBookingUpdate);
    };
  }, [socket, bookingId, queryClient]);

  return socket;
};
