export type WeatherType = 'sunny' | 'cloudy' | 'snowy' | 'rainy' | 'partly-cloudy';

export interface DayWeather {
  day: number;
  dayName: string;
  weather: WeatherType;
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
  { day: 25, dayName: '周一', weather: 'sunny' },
  { day: 26, dayName: '周二', weather: 'cloudy' },
  { day: 27, dayName: '周三', weather: 'partly-cloudy' },
  { day: 28, dayName: '周四', weather: 'snowy' },
  { day: 29, dayName: '周五', weather: 'rainy' },
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
