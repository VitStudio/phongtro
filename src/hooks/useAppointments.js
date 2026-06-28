import { useAuth } from '../context/AuthContext';

export const useAppointments = (landlordId) => {
  const { appointments, listings } = useAuth();

  const myListingIds = listings
    .filter(l => l.landlord_id === landlordId)
    .map(l => l.id);

  const myAppointments = appointments.filter(a => myListingIds.includes(a.listing_id));
  const pendingAppointments = myAppointments.filter(a => a.status === 'pending');
  const completedAppointments = myAppointments.filter(a => a.status === 'viewed');

  const getListingForAppointment = (appointment) =>
    listings.find(l => l.id === appointment.listing_id) || null;

  return {
    appointments: myAppointments,
    pending: pendingAppointments,
    completed: completedAppointments,
    getListingForAppointment,
  };
};
