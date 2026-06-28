import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ListingCard from '../../components/ui/ListingCard';
import { Search, Filter, MapPin, DollarSign } from 'lucide-react';

const Home = () => {
  const { listings } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const approvedListings = listings.filter(l => l.status === 'approved');
  
  const filteredListings = approvedListings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || l.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchPrice = true;
    if (priceFilter === 'under2') matchPrice = l.price < 2000000;
    if (priceFilter === '2to4') matchPrice = l.price >= 2000000 && l.price <= 4000000;
    if (priceFilter === 'above4') matchPrice = l.price > 4000000;
    
    return matchSearch && matchPrice;
  });

  return (
    <div className="flex-col gap-8 mb-8">
      <div className="glass" style={{ padding: 'clamp(20px, 6vw, 40px) 16px', textAlign: 'center', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.3 }}></div>
        <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, background: 'var(--secondary)', filter: 'blur(100px)', opacity: 0.3 }}></div>
        
        <h1 className="heading-1 mb-4" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>Tìm phòng trọ GenZ siêu tốc</h1>
        <p className="text-muted mb-8" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.125rem)' }}>Phòng đẹp, giá tốt, cọc giữ chỗ 100% an toàn.</p>
        
        <div className="flex justify-center">
          <div className="glass flex items-center" style={{ padding: '6px clamp(8px, 3vw, 16px)', width: '100%', maxWidth: '600px', borderRadius: '9999px' }}>
            <Search className="text-muted" size={20} style={{ marginRight: 8, flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Khu vực, tên đường (VD: Làng đại học...)" 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: '10px 0', fontSize: '0.95rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" style={{ marginLeft: 8, padding: '8px 16px', fontSize: '0.9rem', flexShrink: 0 }}>Tìm</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md-flex-row justify-between items-start md-items-center gap-4 mt-8 mb-6" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="heading-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Phòng trọ nổi bật</h2>
        
        <div className="flex gap-2 flex-wrap">
          <select 
            className="input-field" 
            style={{ padding: '8px 12px', background: 'white', fontSize: '0.9rem' }}
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">Tất cả mức giá</option>
            <option value="under2">Dưới 2 triệu</option>
            <option value="2to4">2 triệu - 4 triệu</option>
            <option value="above4">Trên 4 triệu</option>
          </select>
          <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
            <Filter size={16} /> Lọc thêm
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            Không tìm thấy phòng trọ nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
