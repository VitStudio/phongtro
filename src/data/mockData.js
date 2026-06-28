// Data version — bump this to force-reset stored IndexedDB data on next load
// ─── Price Constants ───────────────────────────────
export const VIP_MONTHLY_PRICE = 149000;
export const VIP_ANNUAL_PRICE = 1500000;
export const VIP_MONTHLY_DAYS = 30;
export const VIP_ANNUAL_DAYS = 365;

import { listingImages } from './listingImages';

export const DATA_VERSION = 'v3';

const now = new Date();
const thirtyDaysFromNow = new Date(now.getTime() + VIP_MONTHLY_DAYS * 24 * 60 * 60 * 1000).toISOString();

export const mockUsers = [
  {
    id: 'u1',
    role: 'student',
    name: 'Nguyễn Văn Sinh Viên',
    email: 'sinhvien@st.uel.edu.vn',
    phone: '0901234567',
    wallet_balance: 500000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SinhVien',
    subscription: null
  },
  {
    id: 'u2',
    role: 'landlord',
    name: 'Cô Lan Trọ',
    email: 'colancho@gmail.com',
    phone: '0912345678',
    wallet_balance: 980000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CoLan',
    subscription: {
      plan: 'vip',
      status: 'active',
      started_at: now.toISOString(),
      expires_at: thirtyDaysFromNow
    }
  },
  {
    id: 'u3',
    role: 'admin',
    name: 'Admin Hệ Thống',
    email: 'admin@phongtrogenz.vn',
    phone: '0987654321',
    wallet_balance: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    subscription: null
  }
];

export const mockListings = [
  {
    id: 'l1',
    landlord_id: 'u2',
    title: 'Phòng trọ cao cấp gần ĐH Bách Khoa, full nội thất',
    description: 'Phòng rộng rãi, thoáng mát, có điều hòa, máy nước nóng, tủ lạnh.\nGần siêu thị, trường học và bệnh viện.\nAn ninh 24/7, camera giám sát toàn bộ khuôn viên.\nPhí điện 3.500đ/kWh, nước 80.000đ/tháng/người.',
    price: 3500000,
    area: 28,
    address: '45 Lý Thường Kiệt, P.14, Q.10, TP.HCM',
    images: listingImages.l1,
    status: 'approved',
    is_vip: true,
    created_at: '2026-06-20T08:00:00.000Z'
  },
  {
    id: 'l2',
    landlord_id: 'u2',
    title: 'Phòng trọ sinh viên giá rẻ khu Làng Đại Học',
    description: 'Phòng mới xây, sạch sẽ, WC riêng, gác lửng tiện nghi.\nKhu vực yên tĩnh, cách Làng ĐH Thủ Đức 500m.\nĐiện nước theo giá nhà nước.\nCho phép nấu ăn, có bếp điện chung.',
    price: 1800000,
    area: 18,
    address: '12 Tô Vĩnh Diện, Khu Phố 6, TP Thủ Đức, TP.HCM',
    images: listingImages.l2,
    status: 'approved',
    is_vip: false,
    created_at: '2026-06-22T09:30:00.000Z'
  },
  {
    id: 'l3',
    landlord_id: 'u2',
    title: 'Studio mini đẹp, hiện đại gần Đại học Kinh Tế',
    description: 'Studio mới 100%, thiết kế hiện đại, có bếp riêng, ban công view đẹp.\nPhù hợp cặp đôi hoặc 1-2 sinh viên.\nCó máy giặt, tủ lạnh, điều hòa, nội thất đầy đủ.\nGần chợ Bến Thành, Vincom Center.',
    price: 4200000,
    area: 35,
    address: '88 Nguyễn Đình Chiểu, P.4, Q.3, TP.HCM',
    images: listingImages.l3,
    status: 'approved',
    is_vip: true,
    created_at: '2026-06-24T14:00:00.000Z'
  },
  {
    id: 'l4',
    landlord_id: 'u2',
    title: 'Phòng trọ rộng, yên tĩnh khu Bình Thạnh',
    description: 'Phòng 25m2 thoáng mát, cửa sổ lớn, có thể nấu ăn.\nGần chợ Bình Thạnh, siêu thị Co.op Mart và nhiều trường đại học.\nBao gồm wifi tốc độ cao, điện nước hợp lý.',
    price: 2800000,
    area: 25,
    address: '30 Phan Đăng Lưu, P.3, Q.Bình Thạnh, TP.HCM',
    images: listingImages.l4,
    status: 'pending',
    is_vip: false,
    created_at: '2026-06-26T10:00:00.000Z'
  }
];

export const mockAppointments = [
  {
    id: 'a1',
    student_id: 'u1',
    listing_id: 'l2',
    date: '2026-06-28',
    status: 'pending',
    deposit_amount: 200000
  }
];

export const mockRoommates = [
  {
    id: 'rm1',
    student_id: 'u1',
    title: 'Tìm 1 nữ ở ghép khu Làng Đại Học Thủ Đức',
    budget: 1500000,
    district: 'TP Thủ Đức',
    description: 'Mình là sinh viên năm 3 ĐH Bách Khoa, cần tìm 1 bạn nữ ở ghép. Mình sạch sẽ, ngăn nắp, giờ giấc đàng hoàng. Phòng đã có sẵn, chỉ cần thêm 1 người.\nƯu tiên sinh viên cùng trường hoặc khu vực lân cận.',
    created_at: '2026-06-25T08:00:00.000Z',
    status: 'active'
  },
  {
    id: 'rm2',
    student_id: 'u1',
    title: 'Tìm bạn ở ghép khu Q.3, gần ĐH Kinh Tế',
    budget: 2000000,
    district: 'Quận 3',
    description: 'Tìm 1-2 bạn (nam/nữ đều OK) chia sẻ căn hộ dịch vụ gần ĐH Kinh Tế. Phòng đầy đủ tiện nghi, điều hòa, nấu ăn được.\nYêu cầu: không hút thuốc, không thú cưng, sống văn minh có ý thức.',
    created_at: '2026-06-23T10:00:00.000Z',
    status: 'active'
  },
  {
    id: 'rm3',
    student_id: 'u1',
    title: 'Nam sinh viên tìm bạn ở ghép Bình Thạnh',
    budget: 1800000,
    district: 'Bình Thạnh',
    description: 'Mình 22t, sinh viên ĐH Giao Thông Vận Tải. Đang ở phòng 2 người, cần thêm 1 nam. Khu vực yên tĩnh, gần bến xe, siêu thị.\nGiá đã bao điện nước wifi. Ưu tiên ít về quê, thích nấu ăn tại nhà.',
    created_at: '2026-06-21T15:00:00.000Z',
    status: 'active'
  },
  {
    id: 'rm4',
    student_id: 'u1',
    title: 'Tìm bạn nữ ở ghép mini apartment Q.Phú Nhuận',
    budget: 2500000,
    district: 'Phú Nhuận',
    description: 'Mình đang ở một mình tại căn hộ mini 40m2 khu Phú Nhuận. Muốn tìm thêm 1 bạn nữ để chia tiền nhà. Nhà có đầy đủ nội thất, view đẹp, an ninh tốt.\nƯu tiên người đi làm hoặc sinh viên năm cuối, độc lập tài chính.',
    created_at: '2026-06-19T12:00:00.000Z',
    status: 'active'
  }
];
