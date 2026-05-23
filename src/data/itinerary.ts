import { ImageSourcePropType } from 'react-native';
import IMAGES from './images';

export type WeatherType = 'sunny' | 'cloudy' | 'snowy' | 'rainy' | 'partly-cloudy';

export interface DayWeather {
  day: number;
  dayName: string;
  weather: WeatherType;
  month: '5月' | '6月';
  monthStart?: boolean;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  image?: ImageSourcePropType;
  category: 'arrival' | 'activity' | 'dining' | 'accommodation' | 'departure';
}

export interface TipCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const TRIP_DAYS = 11;
export const TRIP_DESTINATIONS = 7;

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

// ─── Per-day itinerary (from trip Excel) ─────────────────────────────────────

export interface DayItinerary {
  day: number;
  location: string;
  dayTitle: string;
  lat: number;
  lng: number;
  items: ItineraryItem[];
}

export function getItineraryForDay(day: number): DayItinerary {
  return ITINERARY_BY_DAY.find((d) => d.day === day) ?? ITINERARY_BY_DAY[0];
}

// Tag colour palette
const TAG = {
  flight:   '#1a3a5c',
  arrive:   '#2d6a4f',
  drive:    '#3d4a2d',
  activity: '#006b78',
  dining:   '#5c3d1a',
  hotel:    '#4d2060',
  stargazing: '#1a1a4a',
};

export const ITINERARY_BY_DAY: DayItinerary[] = [
  // ── May 25 ─────────────────────────────────────────────────────────────────
  {
    day: 25, location: '新加坡', dayTitle: '出发日', lat: 1.3521, lng: 103.8198,
    items: [
      { id: '25-1', time: '18:00', title: '抵达新加坡机场 T2', tag: '出发', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.sg_airport,
        description: '办好 SG Arrival Card，准备开通漫游（新加坡+新西兰），检查行李是否符合航空公司要求。' },
      { id: '25-2', time: '21:00', title: '起飞 → 墨尔本 (MEL)', tag: '飞行', tagColor: TAG.flight, category: 'departure',
        description: '飞行约 7 小时抵达墨尔本，在国际隔离区中转约 4 小时 50 分，行李直挂无需取件，无需澳洲签证。' },
      { id: '25-3', time: '次日', title: '墨尔本 → 基督城 (CHC)', tag: '飞行', tagColor: TAG.flight, category: 'departure',
        description: '再飞约 3 小时抵达新西兰基督城。时区提醒：新西兰比马来西亚快 5 小时，比墨尔本快 2 小时。' },
    ],
  },

  // ── May 26 ─────────────────────────────────────────────────────────────────
  {
    day: 26, location: '基督城 (Christchurch)', dayTitle: '抵达基督城', lat: -43.5321, lng: 172.6362,
    items: [
      { id: '26-1', time: '16:25', title: '抵达基督城国际机场', tag: '抵达', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.chch_city,
        description: '完成入境手续，注意新西兰检疫申报，所有食品和植物产品须申报，违者罚款高达 NZD 400。' },
      { id: '26-2', time: '18:00', title: '取租车（含儿童安全椅+雪链）', tag: '取车', tagColor: TAG.drive, category: 'activity',
        description: '确认安全椅及雪链已备妥。从机场到市区约 20 分钟车程，注意靠左行驶。' },
      { id: '26-3', time: '19:00', title: 'Riverside Market 晚餐', tag: '餐饮', tagColor: TAG.dining, category: 'dining', image: IMAGES.chch_city,
        description: '当地人强烈推荐的室内美食广场，各国美食应有尽有，环境轻松。营业至约 21:00。' },
      { id: '26-4', time: '20:30', title: 'COUNTDOWN 超市补给', tag: '购物', tagColor: TAG.activity, category: 'activity',
        description: '买 Bluebird 薯片、Whittaker\'s 巧克力（约 RM12）、Whittakers Lewis Road 鲜奶巧克力牛奶。Westfield Riccarton 6pm 关门，Moorhouse Ave 超市营业至 10pm。' },
    ],
  },

  // ── May 27 ─────────────────────────────────────────────────────────────────
  {
    day: 27, location: '蒂卡普湖 (Lake Tekapo)', dayTitle: '基督城 → 蒂卡普湖', lat: -44.0037, lng: 170.4772,
    items: [
      { id: '27-1', time: '09:00', title: '出发 → 杰拉尔丁（Geraldine）', tag: '驾车', tagColor: TAG.drive, category: 'activity',
        description: '车程约 1.5 小时，在 Barker\'s Food Store & Eatery 停留喝咖啡、免费试吃各种果酱。建议在基督城或杰拉尔丁加满油。' },
      { id: '27-2', time: '12:00', title: 'Fairlie Bakehouse — 必吃新西兰第一派', tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '被誉为南岛"绝对不能错过"的肉派店。三文鱼培根派、炖牛肉派口碑极佳，可带上车当午餐。' },
      { id: '27-3', time: '13:30', title: '抵达蒂卡普湖，放行李休息', tag: '抵达', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.tekapo_lake,
        description: '5 月湖边风大且冷，记得穿上防风保暖衣物。入住 Skyblue Tekapo。' },
      { id: '27-4', time: '14:30', title: '约翰山天文台 & Astro Café', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.tekapo_lake,
        description: '开车上山（需支付约 NZD 8–15 过路费）。Astro Café 被《孤独星球》誉为"地球上地理位置最好的咖啡馆之一"，营业至 16:30。' },
      { id: '27-5', time: '17:00', title: '好牧羊人教堂夕阳', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.tekapo_church,
        description: '5 月底日落约在 17:15，教堂窗户正对着湖泊雪山，是经典打卡点。旁边还有著名的牧羊犬铜像。开放时间 10:00–16:00，日落后可在外拍照。' },
      { id: '27-6', time: '18:30', title: 'Kohan Restaurant 三文鱼晚餐', tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '营业 17:30–20:00，提供当地高山冷水三文鱼刺身及三文鱼丼，人气很高，建议下午抵达时先去订位。' },
      { id: '27-7', time: '20:00', title: '国际暗天空保护区观星', tag: '星空', tagColor: TAG.stargazing, category: 'activity', image: IMAGES.tekapo_stars,
        description: '无需付费团，在酒店门口或教堂附近抬头即可看到壮丽银河。也可选择 Tekapo Springs 温泉（营业 11:00–19:00，成人 NZD 42，儿童 NZD 25）在泡汤中观星。' },
    ],
  },

  // ── May 28 ─────────────────────────────────────────────────────────────────
  {
    day: 28, location: '库克山国家公园 (Mt Cook)', dayTitle: '蒂卡普湖 → 库克山', lat: -43.7340, lng: 170.0960,
    items: [
      { id: '28-1', time: '09:30', title: '离开蒂卡普湖，途经普卡基湖', tag: '驾车', tagColor: TAG.drive, category: 'activity', image: IMAGES.pukaki,
        description: '车程约 1.5 小时。备齐物资：库克山村内物资有限且较贵，建议在蒂卡普湖补满油并买好零食和午餐。' },
      { id: '28-2', time: '10:30', title: 'Mt Cook Alpine Salmon 三文鱼店', tag: '餐饮', tagColor: TAG.dining, category: 'dining', image: IMAGES.pukaki,
        description: '位于普卡基湖畔，可买到新鲜三文鱼刺身，边看湛蓝湖景边享用。彼得观景点（Peter\'s Lookout）在这附近，是拍"通往雪山笔直公路"的最佳位置。' },
      { id: '28-3', time: '13:30', title: '塔斯曼冰川景观步道', tag: '徒步', tagColor: TAG.activity, category: 'activity', image: IMAGES.tasman,
        description: '往返约 1 小时，需爬一段台阶，终点可俯瞰塔斯曼冰川湖和蓝色浮冰，下午走比较暖和。' },
      { id: '28-4', time: '15:00', title: '胡克谷步道 — 走到第一座吊桥', tag: '徒步', tagColor: TAG.activity, category: 'activity', image: IMAGES.hooker,
        description: '【最推荐】全程来回 3–4 小时，但带小孩走到第一座吊桥即可（约 15–20 分钟），俯瞰穆勒湖冰川水，景色壮观。起点：White Horse Hill 停车场，中途有公共厕所。' },
      { id: '28-5', time: '18:00', title: '酒店晚餐 & 库克山观星', tag: '餐饮', tagColor: TAG.dining, category: 'dining', image: IMAGES.mt_cook,
        description: 'The Hermitage Hotel 落地窗正对库克山，视野极佳可享用晚餐。Old Mountaineers\' Café 更轻松，有披萨汉堡。库克山夜晚极静，是全球顶级观星胜地。' },
    ],
  },

  // ── May 29 ─────────────────────────────────────────────────────────────────
  {
    day: 29, location: '瓦纳卡 (Wanaka)', dayTitle: '库克山 → 瓦纳卡', lat: -44.6933, lng: 169.1321,
    items: [
      { id: '29-1', time: '08:30', title: '清晨塔斯曼冰川步道（可选）', tag: '徒步', tagColor: TAG.activity, category: 'activity', image: IMAGES.mt_cook,
        description: '清晨光线照在雪山上非常漂亮，往返仅需 1 小时。精力充沛可在出发前完成，清晨视野最佳。' },
      { id: '29-2', time: '10:00', title: 'High Country Salmon — 特威泽尔三文鱼', tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '位于特威泽尔（Twizel）附近的高山三文鱼农场，可亲手喂鱼并品尝新鲜刺身，是库克山→瓦纳卡途中的必停站。建议在此加满油。' },
      { id: '29-3', time: '11:30', title: '奥马拉马粘土悬崖 (Clay Cliffs)', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.clay_cliffs,
        description: '小众震撼景点（需支付约 NZD 5 入场费），巨大尖塔状粘土岩层仿佛置身异世界或火星表面，令人叹为观止。' },
      { id: '29-4', time: '12:30', title: '林迪斯山口顶峰观景台', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.lindis,
        description: '全程最高海拔点，山坡覆盖金黄色 Tussock 草丛，在山顶停车场拍照留念。注意：冬季弯道多、可能有黑冰，谨慎驾驶。Tarras 小镇可停下喝咖啡。' },
      { id: '29-5', time: '14:00', title: '抵达瓦纳卡 — 孤树打卡', tag: '景点', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.wanaka_tree,
        description: '瓦纳卡孤树（That Wanaka Tree）是新西兰被拍摄次数最多的树，建议傍晚日落前往，光线最美。入住 Alpine Motel。湖边有成熟步道，可租自行车绕湖骑行。' },
      { id: '29-6', time: '15:30', title: '迷宫世界 (Puzzling World)', tag: '亲子', tagColor: TAG.activity, category: 'activity', image: IMAGES.puzzling,
        description: '充满错觉艺术和大型木制迷宫，4 岁小孩也非常适合！大厅/咖啡厅免费，3D 大迷宫和幻想房间需购票。著名的倾斜塔和罗马风格错觉洗手间可免费拍照。' },
    ],
  },

  // ── May 30 ─────────────────────────────────────────────────────────────────
  {
    day: 30, location: '皇后镇 (Queenstown)', dayTitle: '瓦纳卡 → 皇后镇', lat: -45.0312, lng: 168.6626,
    items: [
      { id: '30-1', time: '09:30', title: '文胸围栏 & 卡德罗纳酒店', tag: '打卡', tagColor: TAG.activity, category: 'activity',
        description: '出发约 20 分钟到达 Cardrona Bra Fence，挂满数千个彩色内衣，支持乳腺癌研究。正对面的卡德罗纳历史酒店（建于 1863 年）后花园带篝火，适合喝咖啡。' },
      { id: '30-2', time: '11:00', title: '皇冠山脉顶峰观景台', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.crown_range,
        description: '可俯瞰之字形蜿蜒公路、箭镇和皇后镇盆地全景，视觉冲击极强。' },
      { id: '30-3', time: '11:45', title: '箭镇历史小镇午餐', tag: '餐饮', tagColor: TAG.dining, category: 'dining', image: IMAGES.arrowtown,
        description: '19 世纪淘金热英伦风情小镇。Arrowtown Bakery 著名肉派，Buckingham St 上的 The Remarkable Sweet Shop 糖果店孩子必去。华人淘金者定居点旧址环境清幽。' },
      { id: '30-4', time: '14:45', title: '卡瓦劳大桥 — 世界蹦极发源地', tag: '极限', tagColor: TAG.activity, category: 'activity', image: IMAGES.kawarau,
        description: '即使不敢跳，在看台观看别人纵身一跳也非常刺激！车程从箭镇约 15 分钟。' },
      { id: '30-5', time: '15:45', title: '抵达皇后镇，办理入住', tag: '抵达', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.queenstown_view,
        description: '今天是周六，Remarkables Market 仅周六举行，可顺道逛一圈。入住 Holiday Inn Queenstown Frankton Road。市中心停车贵，建议停酒店步行进城。' },
      { id: '30-6', time: '17:00', title: '天空缆车 + Luge 滑板车', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.queenstown_gondola,
        description: '俯瞰瓦卡蒂普湖和卓越山脉的最佳视角。家庭 3 次 Luge 套票（2 大 2 小）NZD 254。4 岁以下可成人带双人同乘，额外约 NZD 5。建议提前在官网或 Klook 购票。' },
      { id: '30-7', time: '19:00', title: 'Fergburger — 传说中的汉堡', tag: '餐饮', tagColor: TAG.dining, category: 'dining', image: IMAGES.fergburger,
        description: '比脸还大的汉堡，通常需要排队。也可尝试湖畔码头散步，或搭乘百年历史 TSS Earnslaw 蒸汽船游湖。' },
    ],
  },

  // ── May 31 ─────────────────────────────────────────────────────────────────
  {
    day: 31, location: '格林诺奇 / 皇后镇', dayTitle: '皇后镇 — 格林诺奇一日游', lat: -44.8482, lng: 168.3798,
    items: [
      { id: '31-1', time: '09:00', title: '驱车格林诺奇全景公路', tag: '驾车', tagColor: TAG.drive, category: 'activity', image: IMAGES.glenorchy_road,
        description: '这条 45 分钟的湖畔公路被评为"世界十大景观公路"之一，左手湛蓝湖水，右手巍峨雪山。建议在皇后镇加好油再出发。' },
      { id: '31-2', time: '09:45', title: 'Bennett\'s Bluff 最佳观景点', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.bennetts,
        description: '全程最著名的观景台，瓦卡蒂普湖呈"之"字形弯曲，背景雄伟雪山，视觉冲击力极强，必停拍照。' },
      { id: '31-3', time: '10:30', title: '格林诺奇红房子 & 湖畔栈道', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.glenorchy_wharf,
        description: '标志性红色湖畔小木屋 (Glenorchy Waterfront Shed) 是打卡地标。Glenorchy Boardwalk 木栈道非常平坦，4 岁小孩轻松散步，码头可看湖水清澈见底、远眺南阿尔卑斯山。注意防沙蝇（Sandfly），务必喷好防虫喷雾。' },
      { id: '31-4', time: '12:00', title: "Mrs Woolly's General Store 午餐", tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '格林诺奇镇上为数不多的餐厅之一，轻松温馨。可选继续深入 20 公里碎石路到达"Paradise"地方，寻访魔戒艾辛格取景地。' },
      { id: '31-5', time: '14:00', title: '返回皇后镇 & 湖畔漫步', tag: '返回', tagColor: TAG.arrive, category: 'activity', image: IMAGES.queenstown_view,
        description: '沿原路返回，傍晚在皇后镇湖畔码头散步，欣赏卓越山脉落日。' },
    ],
  },

  // ── Jun 1 ──────────────────────────────────────────────────────────────────
  {
    day: 1, location: '奥马鲁 (Oamaru)', dayTitle: '皇后镇 → 奥马鲁', lat: -45.0975, lng: 170.9708,
    items: [
      { id: '1-1', time: '08:30', title: '出发皇后镇 → 克伦威尔水果小镇', tag: '驾车', tagColor: TAG.drive, category: 'activity', image: IMAGES.cromwell,
        description: '尽早出发为后面留足时间。Jones Family Fruit Stall 是必停站，购买当地新鲜水果和纯手工水果冰淇淋（Real Fruit Ice Cream），著名的巨型水果地标小镇。' },
      { id: '1-2', time: '11:00', title: 'High Country Salmon 三文鱼午餐', tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '奥马拉马（Omarama）附近的高山三文鱼农场，可亲手喂鱼并品尝新鲜刺身。也可在此顺道参观粘土悬崖（Clay Cliffs）。' },
      { id: '1-3', time: '12:30', title: '象石群 (Elephant Rocks)', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.elephant,
        description: '沿怀塔基河旁的神奇巨石群，仿佛远古巨象矗立大地，是免费自然奇观，也是电影取景地。' },
      { id: '1-4', time: '15:30', title: '抵达奥马鲁 — 维多利亚历史区', tag: '抵达', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.oamaru_vic,
        description: '充满英伦复古风的沿海小镇。维多利亚遗迹区建筑如童话，蒸汽朋克总部（Steampunk HQ）门口喷火的铁皮龙孩子超爱，Whitestone Cheese 奶酪工厂可试吃。入住 AAA Thames Court Motel。' },
      { id: '1-5', time: '日落', title: '小蓝企鹅归巢 — 世界最小企鹅', tag: '野生动物', tagColor: TAG.activity, category: 'activity', image: IMAGES.oamaru_penguin,
        description: '世界上体型最小的蓝企鹅（身高约 30cm）每天日落后成群结队从海里上岸回巢，摇摇摆摆超可爱，孩子一生难忘。普通看台成人 NZD 47，儿童 NZD 29；VIP 看台成人 NZD 63，儿童 NZD 37.5。' },
    ],
  },

  // ── Jun 2 ──────────────────────────────────────────────────────────────────
  {
    day: 2, location: '基督城 (Christchurch)', dayTitle: '奥马鲁 → 基督城', lat: -43.5321, lng: 172.6362,
    items: [
      { id: '2-1', time: '09:00', title: '出发奥马鲁，途经 Waimate 壁画小镇', tag: '驾车', tagColor: TAG.drive, category: 'activity',
        description: '车程约 3 小时 15 分钟。Waimate 是安静的乡村历史小镇，镇上有巨大筒仓壁画（Silo Art），适合活动筋骨。' },
      { id: '2-2', time: '12:00', title: 'Timaru — Caroline Bay 午餐 & 游乐场', tag: '亲子', tagColor: TAG.activity, category: 'activity', image: IMAGES.caroline,
        description: '南岛最出名的免费海滨儿童游乐场，有秋千、大滑梯，4 岁小孩一定会玩疯。海边咖啡馆吃午饭，或买 Pie 到公园野餐。' },
      { id: '2-3', time: '15:00', title: 'Rakaia — 大三文鱼雕像打卡', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.rakaia,
        description: '新西兰"喷射艇之都"，标志性的大三文鱼雕像是孩子的好拍照对象，旁边 Rakaia Domain 有小型游乐设施，面包房可买三文鱼派和热饮。' },
      { id: '2-4', time: '16:30', title: '抵达基督城，入住 Golden Hotel', tag: '抵达', tagColor: TAG.arrive, category: 'arrival', image: IMAGES.chch_city,
        description: '顺利返回基督城，完成最后一段长途驾驶。办理入住 Golden Hotel，休整片刻。' },
      { id: '2-5', time: '19:00', title: 'Riverside Market 晚餐', tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '前往高颜值室内美食广场 Riverside Market，享用丰盛的世界各地美食晚餐，回味这段美好旅程。' },
    ],
  },

  // ── Jun 3 ──────────────────────────────────────────────────────────────────
  {
    day: 3, location: '基督城 (Christchurch)', dayTitle: '基督城城市探索', lat: -43.5321, lng: 172.6362,
    items: [
      { id: '3-1', time: '09:30', title: '基督城植物园 & 雅芳河泛舟', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.chch_botanic,
        description: '漫步百年历史的英式植物园，可选择乘坐平底船（Punting on the Avon）欣赏河岸景色，人力撑竿手穿着传统礼服，非常有特色。' },
      { id: '3-2', time: '11:30', title: '玛格丽特·马希游乐场 — 南半球最大', tag: '亲子', tagColor: TAG.activity, category: 'activity', image: IMAGES.playground_mahy,
        description: '南半球最大的户外游乐场！双人飞天滑索、巨大攀爬塔、喷水嬉水区、超级滑梯……旁边有咖啡馆和干净厕所，孩子绝对玩到不想走。' },
      { id: '3-3', time: '14:00', title: '纸教堂 & New Regent Street', tag: '景点', tagColor: TAG.activity, category: 'activity', image: IMAGES.chch_cardboard,
        description: '纸教堂（Cardboard Cathedral）是地震后用纸板建造的临时大教堂，充满创意。彩色西班牙风格的 New Regent Street 适合拍照和喝咖啡。Canterbury Museum 了解南岛历史。' },
      { id: '3-4', time: '18:00', title: '还车 & 入住 Sudima 机场酒店', tag: '住宿', tagColor: TAG.hotel, category: 'accommodation',
        description: '在规定时间前完成还车手续，Sudima Christchurch Airport 酒店步行即可到机场，为明早出发做好准备。' },
      { id: '3-5', time: '18:30', title: 'Spitfire Square 告别晚餐', tag: '餐饮', tagColor: TAG.dining, category: 'dining',
        description: '步行至 Spitfire Square 享用丰盛告别晚餐，之后可去 Woolworths 超市买些纪念品和零食，最后整理行李准备明早出发。' },
    ],
  },

  // ── Jun 4 ──────────────────────────────────────────────────────────────────
  {
    day: 4, location: '基督城 → 新加坡/马来西亚', dayTitle: '返程日', lat: -43.4894, lng: 172.5322,
    items: [
      { id: '4-1', time: '06:00', title: '抵达基督城机场，办理登机', tag: '出发', tagColor: TAG.arrive, category: 'departure',
        description: '提前 2.5 小时到达机场，完成 check-in 和安全检查。注意新西兰生物安全检查，未申报食品须在登机前丢弃。' },
      { id: '4-2', time: '08:40', title: '起飞 → 中转 → 返回新加坡', tag: '飞行', tagColor: TAG.flight, category: 'departure',
        description: '飞行约 4 小时中转，停留约 2 小时后，再飞约 8 小时返回新加坡（约 18:00 抵达）。可预购 Causeway Link 或自驾返回马来西亚。' },
    ],
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

/** Actual number of nights between two trip days (handles May→June boundary). */
export function nightsBetween(fromDay: number, toDay: number): number {
  const from = fromDay >= 25 ? fromDay - 25 : fromDay + 6;
  const to = toDay >= 25 ? toDay - 25 : toDay + 6;
  return to - from;
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
    id: 'golden-hotel',
    name: 'Golden Hotel',
    location: 'Christchurch',
    checkInDay: 2, checkOutDay: 3, // Jun 2 → Jun 3
    checkInTime: '14:00', checkOutTime: '10:00',
    rooms: 1, bookings: 1,
    gradient: ['#1a1400', '#3a2e00'],
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
