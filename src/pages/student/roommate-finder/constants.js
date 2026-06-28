// ─── Import Homate Profile Images from local assets ───────────────────────
import p1_1 from '../../../assets/img/homate/p1 (4).jpg';
import p1_2 from '../../../assets/img/homate/p1 (2).jpg';
import p1_3 from '../../../assets/img/homate/p1 (3).jpg';
import p1_4 from '../../../assets/img/homate/p1 (1).jpg';

import p2_1 from '../../../assets/img/homate/p2 (1).jpg';
import p2_2 from '../../../assets/img/homate/p2 (2).jpg';
import p2_3 from '../../../assets/img/homate/p2 (3).jpg';

import p3_1 from '../../../assets/img/homate/p3 (1).jpg';
import p3_2 from '../../../assets/img/homate/p3 (2).jpg';
import p3_3 from '../../../assets/img/homate/p3 (3).jpg';

import p4_1 from '../../../assets/img/homate/p4 (1).jpg';
import p4_2 from '../../../assets/img/homate/p4 (2).jpg';
import p4_3 from '../../../assets/img/homate/p4 (3).jpg';

import p5_1 from '../../../assets/img/homate/p5 (1).jpg';
import p5_2 from '../../../assets/img/homate/p5 (2).jpg';
import p5_3 from '../../../assets/img/homate/p5 (3).jpg';

import p6_1 from '../../../assets/img/homate/p6 (1).jpg';
import p6_2 from '../../../assets/img/homate/p6 (2).jpg';
import p6_3 from '../../../assets/img/homate/p6 (3).jpg';

export const INITIAL_CARDS = [
  {
    id: 'rm_p1',
    name: 'nf',
    age: 20,
    images: [p1_1, p1_2, p1_3, p1_4],
    bio: 'Mình là nf, iu chó, nhưng k có duyên nuôi, thích sống về đêm nhưng hoạt động ban ngày, bạn nào buổi tối cũng thích cú đêm thức khuya coi phim thì tụi mình hợp nhao lắm á, mình mới 20 tủi hoi nên tâm hồn còn trẻ lắm hehe. Mình cũng k gọn gàng mấy nma đừng ở dơ quá nha mấy cục dàng.',
    budget: 1500000,
    district: 'Thủ Đức',
    gender: 'female',
    interests: ['Cú đêm', 'Iu chó', 'Xem phim'],
    isMatchable: true
  },
  {
    id: 'rm_p2',
    name: 'Hưng',
    age: 18,
    images: [p2_1, p2_2, p2_3],
    bio: 'Mình là Hưng cutee 18 tuổi chập chững mới lên sài gòn tìm bạn nam ở chung chỉ cần gọn gàng và sạch sẽ mình dễ tính nên các bạn thoải mái.',
    budget: 1600000,
    district: 'Bình Thạnh',
    gender: 'male',
    interests: ['Sạch sẽ', 'Dễ tính', 'Học tập'],
    isMatchable: false
  },
  {
    id: 'rm_p3',
    name: 'Thuỳ',
    age: 21,
    images: [p3_1, p3_2, p3_3],
    bio: 'mình là thuỳ, mình rất đáng iu, mình hoạt động chủ íu về đêm, buổi sáng k đi học thì mình ngủ, sở thích của mình là ngủ và xem phim và hẹn hò, mình 2x tuổi (x tiểu học), hiện tại là sinh viên. Mình k quá gọn gàng và cầu toàn nhưng ý thức lắm nên có thể bảo ban nhau nè',
    budget: 1800000,
    district: 'Quận 10',
    gender: 'female',
    interests: ['Ngủ', 'Xem phim', 'Hẹn hò'],
    isMatchable: true
  },
  {
    id: 'rm_p4',
    name: 'Thắng',
    age: 19,
    images: [p4_1, p4_2, p4_3],
    bio: 'Hi, mình là Thắng, 19 tuổi, đang tuyển một người đồng hành gánh tiền nhà. Mình thích chơi thể thao, đi ăn, cà phê, lâu lâu bật nhạc rồi hát như đang concert dù hàng xóm không xin vé, và đặc biệt là ăn trứng như gà (1 ngày 5 quả là chuyện thường). Mình sống dễ tính, ít drama, không cắn người (trừ khi giành miếng gà cuối cùng ). Chỉ cần bạn ở sạch, đúng hạn tiền nhà và chịu được mấy câu nói nhảm thì mình nghĩ tụi mình sẽ thành roommate quốc dân.',
    budget: 2000000,
    district: 'Tân Bình',
    gender: 'male',
    interests: ['Thể thao', 'Singing', 'Ăn uống'],
    isMatchable: false
  },
  {
    id: 'rm_p5',
    name: 'Trí',
    age: 20,
    images: [p5_1, p5_2, p5_3],
    bio: 'Hellu, mình là Trí, 20tủi. Cần tìm bạn cùng phòng. Mình không quá kĩ tính nhưng mình cần tìm bạn gọn gàng sạch sẽ là được, tiền phòng các thứ share đều. Thi thoảng mình có đi làm đêm về muộn nên mong bạn có thể thông cảm hoặc có lối sống cú đêm giống mình hehe',
    budget: 1700000,
    district: 'Quận 7',
    gender: 'male',
    interests: ['Cú đêm', 'Đi làm', 'Sạch sẽ'],
    isMatchable: false
  },
  {
    id: 'rm_p6',
    name: 'Thành Vỹ',
    age: 21,
    images: [p6_1, p6_2, p6_3],
    bio: 'Mình là Thành Vỹ. Mình đẹp trai (theo lời mọi người nha 😌), tháo vác, học cũng khá ổn nên thường xuyên được học bổng. Hiện tại mình là sinh viên. Mình sống khá thoải mái, không quá cầu toàn nhưng có trách nhiệm, biết ý và sẵn sàng hỗ trợ nhau trong sinh hoạt. Sở thích của mình là xem phim, đi cà phê, khám phá đồ ăn ngon và lâu lâu chơi thể thao. Nếu ở chung thì cứ góp ý thẳng thắn với nhau, mình luôn sẵn sàng lắng nghe để cả hai có không gian sống thoải mái nhất.',
    budget: 2200000,
    district: 'Quận 3',
    gender: 'male',
    interests: ['Xem phim', 'Học bổng', 'Cà phê'],
    isMatchable: true
  }
];
