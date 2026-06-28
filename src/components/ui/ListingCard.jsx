import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize, Clock } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const ListingCard = ({ listing }) => {
  const { users } = useAuth();

  // Check VIP: prefer user subscription, fallback to listing.is_vip
  const isVip = useMemo(() => {
    if (listing.is_vip) return true;
    const landlord = users.find(u => u.id === listing.landlord_id);
    return landlord?.subscription?.status === 'active';
  }, [listing.is_vip, listing.landlord_id, users]);

  return (
    <Link to={`/listing/${listing.id}`} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '200px' }}>
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {listing.images?.length > 1 && (
          <div className="img-count-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            {listing.images.length} ảnh
          </div>
        )}
        {isVip && (
          <div style={{ position: 'absolute', top: 12, right: 12 }} className="badge badge-vip">
            VIP
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, left: 12 }} className="badge badge-success glass">
          {listing.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
        </div>
      </div>
      
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <h3 className="heading-3" style={{ fontSize: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </h3>
        
        <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {listing.price.toLocaleString()} VNĐ/tháng
        </div>
        
        <div className="text-muted flex items-center gap-2" style={{ fontSize: '0.9rem' }}>
          <MapPin size={16} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {listing.address}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-muted" style={{ fontSize: '0.9rem' }}>
          <div className="flex items-center gap-1">
            <Maximize size={16} /> {listing.area}m²
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} /> {new Date(listing.created_at).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
