export const getBookingStatusInfo = (dbStatus: string) => {
  switch (dbStatus) {
    case 'requested': 
      return { text: 'Pending', icon: 'schedule', color: 'bg-orange-100 text-orange-700', group: 'Active', hexColor: '#c2410c', hexBg: '#ffedd5' };
    case 'accepted': 
      return { text: 'Accepted', icon: 'check-circle', color: 'bg-green-100 text-green-700', group: 'Active', hexColor: '#15803d', hexBg: '#dcfce7' };
    case 'on_the_way': 
      return { text: 'On The Way', icon: 'local-shipping', color: 'bg-green-100 text-green-700', group: 'Active', hexColor: '#15803d', hexBg: '#dcfce7' };
    case 'arrived': 
      return { text: 'Arrived', icon: 'place', color: 'bg-green-100 text-green-700', group: 'Active', hexColor: '#15803d', hexBg: '#dcfce7' };
    case 'in_progress': 
      return { text: 'In Progress', icon: 'pending', color: 'bg-blue-100 text-blue-700', group: 'Active', hexColor: '#1d4ed8', hexBg: '#dbeafe' };
    case 'completed': 
      return { text: 'Completed', icon: 'done-all', color: 'bg-green-100 text-green-700', group: 'Completed', hexColor: '#15803d', hexBg: '#dcfce7' };
    case 'cancelled': 
      return { text: 'Cancelled', icon: 'cancel', color: 'bg-red-100 text-red-700', group: 'Cancelled', hexColor: '#b91c1c', hexBg: '#fee2e2' };
    default: 
      return { text: 'Pending', icon: 'schedule', color: 'bg-orange-100 text-orange-700', group: 'Active', hexColor: '#c2410c', hexBg: '#ffedd5' };
  }
};
