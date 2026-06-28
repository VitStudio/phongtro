import React from 'react';
import GlassModal from '../../../components/ui/GlassModal';

const CreatePostModal = ({ isOpen, formData, onClose, onChange, onPost }) => (
  <GlassModal isOpen={isOpen} onClose={onClose} title="Đăng tin tìm ở ghép">
    <div className="flex-col gap-4">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }} className="grid-3col-responsive">
        <div className="input-group">
          <label className="input-label" htmlFor="rm-name">Tên hiển thị</label>
          <input id="rm-name" name="name" value={formData.name} className="input-field" placeholder="Tên của bạn" onChange={onChange} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="rm-age">Tuổi</label>
          <input id="rm-age" name="age" type="number" value={formData.age} className="input-field" placeholder="20" onChange={onChange} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="rm-gender">Giới tính</label>
          <select id="rm-gender" name="gender" value={formData.gender} className="input-field" onChange={onChange} style={{ height: '42px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0 12px' }}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-2col-responsive">
        <div className="input-group">
          <label className="input-label" htmlFor="rm-budget">Ngân sách (VNĐ/tháng)</label>
          <input id="rm-budget" name="budget" value={formData.budget} type="number" className="input-field" placeholder="1500000" onChange={onChange} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="rm-district">Khu vực / Quận</label>
          <input id="rm-district" name="district" value={formData.district} className="input-field" placeholder="Thủ Đức, Bình Thạnh..." onChange={onChange} />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="rm-interests">Sở thích (Cách nhau bằng dấu phẩy)</label>
        <input id="rm-interests" name="interests" value={formData.interests} className="input-field" placeholder="VD: Nấu ăn, Xem phim, Đọc sách" onChange={onChange} />
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="rm-desc">Giới thiệu bản thân & Lối sống</label>
        <textarea id="rm-desc" name="description" value={formData.description} className="input-field" rows="3" placeholder="Ví dụ: Mình là sinh viên năm 2 sạch sẽ, mong muốn tìm bạn cùng phòng không hút thuốc..." onChange={onChange}></textarea>
      </div>

      <button type="button" className="btn btn-primary w-full justify-center mt-2" onClick={onPost}>
        Đăng Tin Ngay
      </button>
    </div>
  </GlassModal>
);

export default CreatePostModal;
