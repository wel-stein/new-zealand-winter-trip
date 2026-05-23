export type WeatherType = 'sunny' | 'cloudy' | 'snowy' | 'rainy' | 'partly-cloudy';

export interface DayWeather {
  day: number;
  dayName: string;
  weather: WeatherType;
  month: '5月' | '6月';
  monthStart?: boolean; // true for the first day of a new month in the list
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  imageUri?: string;
  category: 'arrival' | 'activity' | 'dining' | 'accommodation' | 'departure';
}

export interface TripDay {
  date: string;
  dayNumber: number;
  location: string;
  items: ItineraryItem[];
}

export interface TipCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const TRIP_START = 'May 25';
export const TRIP_END = 'June 4';
export const TRIP_DAYS = 11;
export const TRIP_DESTINATIONS = 4;

export const DATE_PICKER_DAYS: DayWeather[] = [
  // May
  { day: 25, dayName: '周一', weather: 'sunny',        month: '5月' },
  { day: 26, dayName: '周二', weather: 'cloudy',       month: '5月' },
  { day: 27, dayName: '周三', weather: 'partly-cloudy',month: '5月' },
  { day: 28, dayName: '周四', weather: 'snowy',        month: '5月' },
  { day: 29, dayName: '周五', weather: 'rainy',        month: '5月' },
  { day: 30, dayName: '周六', weather: 'cloudy',       month: '5月' },
  { day: 31, dayName: '周日', weather: 'partly-cloudy',month: '5月' },
  // June
  { day: 1,  dayName: '周一', weather: 'sunny',        month: '6月', monthStart: true },
  { day: 2,  dayName: '周二', weather: 'snowy',        month: '6月' },
  { day: 3,  dayName: '周三', weather: 'cloudy',       month: '6月' },
  { day: 4,  dayName: '周四', weather: 'partly-cloudy',month: '6月' },
];

export const HERO_CHAPTER = {
  title: '南岛冬日序章',
  subtitle: '带领你走过之旅，感受11天天然探索',
  dateRange: '5月25日 - 6月4日',
};

export const DAY_25_ITINERARY: ItineraryItem[] = [
  {
    id: '1',
    time: '09:00 AM',
    title: '抵达奥克兰 (Auckland)',
    description: '入住市中心豪华酒店，体验壮观 Sky Tower 的360度旋转下午茶，享用悠闲的欢迎晚宴。',
    tag: '抵达',
    tagColor: '#2d6a4f',
    category: 'arrival',
  },
  {
    id: '2',
    time: '11:30 AM',
    title: '罗托鲁瓦地热奇观',
    description: '感受地热圣地，体验 Te Puia礼赠，感受新西兰最清楚的文化传统与冬日温泉疗愈。',
    tag: '地热探索',
    tagColor: '#006b78',
    category: 'activity',
  },
  {
    id: '3',
    time: '02:00 PM',
    title: '霍比特人村 (Hobbiton)',
    description: '走进《指环王》梦幻场景，在绿色庄园中漫步，感受新西兰最受欢迎的影视打卡胜地品茗休憩。',
    tag: '影视探索',
    tagColor: '#4d6553',
    category: 'activity',
  },
  {
    id: '4',
    time: '05:13 PM',
    title: '皇后镇开幕',
    description: '享用一份 Fergburger, 素宴推举的汉堡满足地探踏上壮丽的南阿尔卑斯山风景之旅。',
    tag: '餐饮',
    tagColor: '#5c3d1a',
    category: 'dining',
  },
];

export const WINTER_TIPS: TipCard[] = [
  {
    id: '1',
    icon: 'snow',
    title: '冬季装备',
    description: '南岛冬季气温可低至 -5°C，请备好保暖夹克、防水登山靴及手套。',
  },
  {
    id: '2',
    icon: 'shield-checkmark',
    title: '旅行安全',
    description: '山路冬季结冰，自驾时请使用雪链，关注天气预报及道路通告。',
  },
  {
    id: '3',
    icon: 'time',
    title: '最佳时间',
    description: '日落时间约17:00，请在此前1小时抵达观景点以获得最佳拍摄效果。',
  },
  {
    id: '4',
    icon: 'wallet',
    title: '预算参考',
    description: '每日预算约 NZD 200-350，含住宿、餐饮及主要景点门票费用。',
  },
];

export const DESTINATIONS = [
  { name: '奥克兰', nameEn: 'Auckland', days: '1-2' },
  { name: '罗托鲁瓦', nameEn: 'Rotorua', days: '3-4' },
  { name: '皇后镇', nameEn: 'Queenstown', days: '5-8' },
  { name: '米尔福德峡湾', nameEn: 'Milford Sound', days: '9-11' },
];

// ─── Hotel bookings (from Agoda) ─────────────────────────────────────────────

export interface HotelBooking {
  id: string;
  name: string;
  location: string;
  /** Day-of-month for check-in. Days 25-31 = May; 1-4 = June. */
  checkInDay: number;
  checkOutDay: number;
  checkInTime: string;
  checkOutTime: string;
  rooms: number;
  bookings: number;
  gradient: [string, string];
}

/**
 * Encodes a day number to a comparable integer.
 * May 25-31 → 525-531   |   June 1-4 → 601-604
 */
export function dayToNum(day: number): number {
  return day >= 25 ? 500 + day : 600 + day;
}

/** Returns the hotel whose stay covers the given night, or null. */
export function getHotelForDay(day: number): HotelBooking | null {
  const n = dayToNum(day);
  return (
    HOTEL_BOOKINGS.find(
      (h) => dayToNum(h.checkInDay) <= n && n < dayToNum(h.checkOutDay),
    ) ?? null
  );
}

/** Returns the next upcoming hotel after a given day (for empty-state preview). */
export function getNextHotel(day: number): HotelBooking | null {
  const n = dayToNum(day);
  return (
    HOTEL_BOOKINGS.find((h) => dayToNum(h.checkInDay) > n) ?? null
  );
}

export const HOTEL_BOOKINGS: HotelBooking[] = [
  {
    id: 'hotel-give',
    name: 'Hotel Give',
    location: 'Christchurch',
    checkInDay: 26, checkOutDay: 27,
    checkInTime: '15:00', checkOutTime: '10:00',
    rooms: 2, bookings: 2,
    gradient: ['#0a2a40', '#0d3a5e'],
  },
  {
    id: 'skyblue-tekapo',
    name: 'Skyblue Tekapo',
    location: 'Lake Tekapo',
    checkInDay: 27, checkOutDay: 28,
    checkInTime: '15:00', checkOutTime: '10:00',
    rooms: 2, bookings: 2,
    gradient: ['#0a3050', '#1a5a7a'],
  },
  {
    id: 'glentanner',
    name: 'Glentanner Park Centre',
    location: 'Mount Cook',
    checkInDay: 28, checkOutDay: 29,
    checkInTime: '14:01', checkOutTime: '10:00',
    rooms: 1, bookings: 1,
    gradient: ['#1a1f2a', '#2a3545'],
  },
  {
    id: 'alpine-motel',
    name: 'Alpine Motel',
    location: 'Wanaka',
    checkInDay: 29, checkOutDay: 30,
    checkInTime: '14:00', checkOutTime: '10:00',
    rooms: 1, bookings: 1,
    gradient: ['#0d2e1c', '#1a4a2e'],
  },
  {
    id: 'holiday-inn-queenstown',
    name: 'Holiday Inn Queenstown Frankton Road By IHG',
    location: 'Queenstown',
    checkInDay: 30, checkOutDay: 1, // May 30 → Jun 1
    checkInTime: '14:00', checkOutTime: '10:00',
    rooms: 2, bookings: 2,
    gradient: ['#2a1a0a', '#4a2a10'],
  },
  {
    id: 'aaa-thames',
    name: 'AAA Thames Court Motel',
    location: 'Oamaru',
    checkInDay: 1, checkOutDay: 2, // Jun 1 → Jun 2
    checkInTime: '14:00', checkOutTime: '10:00',
    rooms: 1, bookings: 1,
    gradient: ['#0a0f2a', '#1a2050'],
  },
  {
    id: 'sudima-chch',
    name: 'Sudima Christchurch Airport',
    location: 'Christchurch',
    checkInDay: 3, checkOutDay: 4, // Jun 3 → Jun 4
    checkInTime: '14:00', checkOutTime: '11:00',
    rooms: 1, bookings: 1,
    gradient: ['#1a0a2a', '#3a1a50'],
  },
];
