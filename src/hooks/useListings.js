import { useAuth } from '../context/AuthContext';

export const useListings = (filters = {}) => {
  const { listings } = useAuth();
  const { status, landlordId, searchTerm, priceMin, priceMax } = filters;

  let filtered = [...listings];

  if (status) {
    filtered = filtered.filter(l => l.status === status);
  }

  if (landlordId) {
    filtered = filtered.filter(l => l.landlord_id === landlordId);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      l => l.title.toLowerCase().includes(term) || l.address.toLowerCase().includes(term)
    );
  }

  if (priceMin != null) {
    filtered = filtered.filter(l => l.price >= priceMin);
  }
  if (priceMax != null) {
    filtered = filtered.filter(l => l.price <= priceMax);
  }

  return filtered;
};

export const useListing = (id) => {
  const { listings } = useAuth();
  return listings.find(l => l.id === id) || null;
};
