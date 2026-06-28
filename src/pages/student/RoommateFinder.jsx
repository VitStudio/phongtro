import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Users, PlusCircle, MapPin, DollarSign } from 'lucide-react';
import GlassModal from '../../components/ui/GlassModal';

const RoommateFinder = () => {
  const { roommates, currentUser, addRoommatePost } = useAuth();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    district: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePost = () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập với tư cách sinh viên để đăng tin.');
      return;
    }
    if (!formData.title || !formData.budget || !formData.district) {
      toast.warning('Vui lòng điền đủ các thông tin bắt buộc.');
      return;
    }

    addRoommatePost({
      id: `rm${Date.now()}`,
      student_id: currentUser.id,
      title: formData.title,
      budget: parseInt(formData.budget),
      district: formData.district,
      description: formData.description,
      created_at: new Date().toISOString(),
      status: 'active'
    });

    setIsModalOpen(false);
    toast.success('Đăng tin tìm bạn ở ghép thành công!');
    setFormData({ title: '', budget: '', district: '', description: '' });
  };

  return (
    <div className="flex-col gap-8 mb-8 mt-4">
      <div className="flex flex-col md-flex-row justify-between items-start md-items-center gap-4 mb-6" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-1" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>Cộng Đồng Ở Ghép</h1>
          <p className="text-muted mt-2" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Tìm bạn chung phòng phù hợp lối sống, chia sẻ chi phí.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Đăng Tin Miễn Phí
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {roommates.map(post => (
          <div key={post.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="heading-3" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>{post.title}</h3>
            
            <div className="flex gap-4 mb-2">
              <div className="flex items-center gap-1 text-primary badge" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <DollarSign size={16} /> ~{post.budget.toLocaleString()}đ/tháng
              </div>
              <div className="flex items-center gap-1 text-secondary badge" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                <MapPin size={16} /> {post.district}
              </div>
            </div>
            
            <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1, whiteSpace: 'pre-line' }}>
              {post.description}
            </p>
            
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                Đăng ngày: {new Date(post.created_at).toLocaleDateString()}
              </div>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.875rem' }}>Liên hệ</button>
            </div>
          </div>
        ))}
      </div>

      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Đăng tin tìm ở ghép">
        <div className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Tiêu đề</label>
            <input name="title" value={formData.title} className="input-field" placeholder="VD: Tìm 1 nữ ở ghép khu vực Làng Đại Học" onChange={handleChange} />
          </div>
          
          <div className="flex-responsive gap-4">
            <div className="input-group w-full">
              <label className="input-label">Ngân sách (VNĐ/người)</label>
              <input name="budget" value={formData.budget} type="number" className="input-field" placeholder="1500000" onChange={handleChange} />
            </div>
            <div className="input-group w-full">
              <label className="input-label">Khu vực / Quận</label>
              <input name="district" value={formData.district} className="input-field" placeholder="Thủ Đức, Bình Thạnh..." onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Mô tả (Yêu cầu, giới tính, lối sống)</label>
            <textarea name="description" value={formData.description} className="input-field" rows="4" placeholder="Mình cần tìm bạn sạch sẽ, ít nhậu nhẹt..." onChange={handleChange}></textarea>
          </div>

          <button className="btn btn-primary w-full justify-center mt-4" onClick={handlePost}>
            Đăng Tin Ngay
          </button>
        </div>
      </GlassModal>
    </div>
  );
};

export default RoommateFinder;
