// 全站共享的品牌信息、官方站点、套餐数据与 FAQ。
// 修改此处即可同步首页、套餐价格与服务说明、结构化数据与 llms.txt。
// 套餐与服务事实只来自运营面板（2026-11-01），不要自行补充周期价格、速度或时效承诺。

export const SITE = {
  name: '灵动云官网',
  brand: '灵动云',
  brandEn: 'LINGDONG CLOUD',
  aliases: ['LINGDONG CLOUD', 'Lingdongyun'],
  url: 'https://lingdongyun.site',
  // 唯一注册入口：完整保留 #/?code=HHoxxHGa，不要修改或拼接
  registerUrl: 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa',
  officialPath: '/guides/lingdongyun-official/',
  orgId: 'https://lingdongyun.site/#org',
  websiteId: 'https://lingdongyun.site/#website',
  description:
    '灵动云（Lingdongyun）官方网站：9 档套餐，月付 ¥20 起、年付 ¥99、一次性流量包 ¥199 起，另有至尊私人定制；不限速、不限设备，IEPL/IPLC 优化线路。提供注册入口、常见问题与官方站点说明。',
  orgDescription:
    '灵动云是提供代理节点订阅的网络服务品牌，设有月付、年付、一次性流量包与至尊私人定制共 9 档套餐。',
  ogImage: '/og-image.png',
  // 站点内容日期（真实日期，非构建时间）
  published: '2026-10-17',
  updated: '2026-11-01',
} as const;

/** 五个官方站点，顺序固定（官网、使用指南、套餐选择、帮助中心、新手入门） */
export const OFFICIAL_SITES = [
  { key: 'site', name: '灵动云官网', role: '官网', domain: 'lingdongyun.site', url: 'https://lingdongyun.site/', desc: '品牌介绍、9 档套餐与注册入口', icon: 'globe' },
  { key: 'website', name: '灵动云使用指南', role: '使用指南', domain: 'lingdongyun.website', url: 'https://lingdongyun.website/', desc: '按设备整理的客户端与订阅导入教程', icon: 'book' },
  { key: 'best', name: '灵动云套餐选择', role: '套餐选择', domain: 'lingdongyun.best', url: 'https://lingdongyun.best/', desc: '9 档套餐对比与每月流量估算', icon: 'layers' },
  { key: 'sbs', name: '灵动云帮助中心', role: '帮助中心', domain: 'lingdongyun.sbs', url: 'https://lingdongyun.sbs/', desc: '连接问题排查、网络知识与在线客服', icon: 'chat' },
  { key: 'lol', name: '灵动云新手入门', role: '新手入门', domain: 'lingdongyun.lol', url: 'https://lingdongyun.lol/', desc: '注册、选套餐、导入订阅、连接，4 步上手', icon: 'compass' },
] as const;

/** 站外链接只使用官方站点清单中的最终地址 */
export const LINKS = {
  bestHome: 'https://lingdongyun.best/',
  bestChoosePlan: 'https://lingdongyun.best/guides/choose-plan',
  bestEstimate: 'https://lingdongyun.best/guides/estimate-traffic',
  websiteHome: 'https://lingdongyun.website/',
  websiteChooseClient: 'https://lingdongyun.website/guides/choose-client/',
  sbsHome: 'https://lingdongyun.sbs/',
  sbsTroubleshooting: 'https://lingdongyun.sbs/guides/troubleshooting/',
  lolHome: 'https://lingdongyun.lol/',
} as const;

// 官网导航：站内页面 + 使用指南、帮助中心两个官方站点
export const NAV = [
  { label: '首页', href: '/' },
  { label: '套餐价格', href: '/#pricing' },
  { label: '官网资料', href: '/guides/' },
  { label: '官方站点', href: '/guides/lingdongyun-official/' },
  { label: '常见问题', href: '/#faq' },
  { label: '使用指南', href: LINKS.websiteHome },
  { label: '帮助中心', href: LINKS.sbsHome },
] as const;

export type PlanCategory = 'monthly' | 'yearly' | 'onetime' | 'custom';

export interface Plan {
  /** 套餐名称（卡片标题） */
  name: string;
  /** 面板上的副名称，如“小流量包” */
  sub?: string;
  price: number;
  /** 卡片价格后缀 */
  billing: string;
  /** 表格与文字中使用的完整价格写法 */
  priceText: string;
  /** 流量 */
  traffic: string;
  /** 价格表中的完整流量写法（缺省同 traffic） */
  trafficFull?: string;
  /** 有效期 / 重置规则 */
  validity: string;
  category: PlanCategory;
  categoryLabel: string;
  /** 类型（表格“类型”列） */
  type: string;
  /** 首页卡片上的一句话说明 */
  hint: string;
  badge?: string;
  /** 结构化数据价格单位：MON 每月，ANN 每年 */
  unit?: 'MON' | 'ANN';
  /** 月付套餐的 4 个付款周期（面板「4 个周期可选」里的价格） */
  cycles?: Cycle[];
}

export interface Cycle {
  label: '月付' | '季付' | '半年付' | '年付';
  months: number;
  /** 该周期一次付款的金额（元） */
  price: number;
  /** 相对按月付的折扣 */
  off?: string;
}

/** 月付 / 季付 / 半年付 / 年付的价格，来自运营面板（2026-11-01 截图）：季付 95 折、半年付 9 折、年付 85 折 */
const cycles = (m: number, q: number, h: number, y: number): Cycle[] => [
  { label: '月付', months: 1, price: m },
  { label: '季付', months: 3, price: q, off: '95 折' },
  { label: '半年付', months: 6, price: h, off: '9 折' },
  { label: '年付', months: 12, price: y, off: '85 折' },
];

/** 金额写法：整数不带小数（20），否则保留必要的小数（142.5、8.25） */
export const yuan = (n: number) => (Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2))));
/** 折合每月 */
export const perMonth = (c: Cycle) => c.price / c.months;
/** 与按月付同样时长相比省下的金额 */
export const saving = (p: Plan, c: Cycle) => p.price * c.months - c.price;
/** 「月付 ¥20、季付 ¥57、半年付 ¥108、年付 ¥204」 */
export const cycleText = (p: Plan) => (p.cycles ?? []).map((c) => `${c.label} ¥${yuan(c.price)}`).join('、');

// 严格按运营面板填写（含月付套餐 4 个周期的价格）
export const PLANS: Plan[] = [
  { name: '灵动·拂风', price: 20, billing: '/ 月', priceText: '¥20/月', traffic: '100GB / 月', validity: '按所选周期', category: 'monthly', categoryLabel: '月付套餐', type: '月付（4 个周期）', hint: '可选月付、季付、半年付、年付', badge: '主推', unit: 'MON', cycles: cycles(20, 57, 108, 204) },
  { name: '灵动·驭浪', price: 50, billing: '/ 月', priceText: '¥50/月', traffic: '300GB / 月', validity: '按所选周期', category: 'monthly', categoryLabel: '月付套餐', type: '月付（4 个周期）', hint: '可选月付、季付、半年付、年付', unit: 'MON', cycles: cycles(50, 142.5, 270, 510) },
  { name: '灵动·破晓', price: 100, billing: '/ 月', priceText: '¥100/月', traffic: '700GB / 月', validity: '按所选周期', category: 'monthly', categoryLabel: '月付套餐', type: '月付（4 个周期）', hint: '可选月付、季付、半年付、年付', unit: 'MON', cycles: cycles(100, 285, 540, 1020) },
  { name: '灵动·凌霄', price: 180, billing: '/ 月', priceText: '¥180/月', traffic: '1.5TB / 月', trafficFull: '1.5TB / 月（1500GB）', validity: '按所选周期', category: 'monthly', categoryLabel: '月付套餐', type: '月付（4 个周期）', hint: '每月 1500GB，可选 4 个付款周期', unit: 'MON', cycles: cycles(180, 513, 972, 1836) },
  { name: '灵动·穿云', price: 99, billing: '/ 年', priceText: '¥99/年', traffic: '每月 70GB', validity: '1 年，每 30 天自动重置', category: 'yearly', categoryLabel: '年付套餐', type: '年付', hint: '全年一次付清，折合每月约 ¥8.25；每 30 天重置流量', unit: 'ANN' },
  { name: '灵动·闲云', sub: '小流量包', price: 199, billing: '/ 一次性', priceText: '¥199', traffic: '150GB', validity: '永久有效，用完为止，不按月清零', category: 'onetime', categoryLabel: '一次性流量包', type: '一次性', hint: '永久有效，用完为止，不按月清零' },
  { name: '灵动·惊云', sub: '标准流量包', price: 499, billing: '/ 一次性', priceText: '¥499', traffic: '400GB', validity: '永久有效，用完为止', category: 'onetime', categoryLabel: '一次性流量包', type: '一次性', hint: '永久有效，用完为止' },
  { name: '灵动·飞云', sub: '精英流量包', price: 899, billing: '/ 一次性', priceText: '¥899', traffic: '800GB', validity: '永久有效，用完为止', category: 'onetime', categoryLabel: '一次性流量包', type: '一次性', hint: '永久有效，用完为止' },
  { name: '灵动云·至尊私人定制', price: 680, billing: '/ 月', priceText: '¥680/月', traffic: '500GB / 月（专线独享）', validity: '按月', category: 'custom', categoryLabel: '私人定制', type: '月付定制', hint: '独立带宽、专属公网 IP，确认需求后约 2–3 个工作日交付', unit: 'MON' },
];

/** 带副名称的完整套餐名，如“灵动·闲云（小流量包）” */
export const planFullName = (p: Plan) => (p.sub ? `${p.name}（${p.sub}）` : p.name);

export const PLAN_FILTERS = [
  { key: 'all', label: '全部 9 档' },
  { key: 'monthly', label: '月付' },
  { key: 'yearly', label: '年付' },
  { key: 'onetime', label: '流量包' },
  { key: 'custom', label: '私人定制' },
] as const;

export const PLAN_NOTE =
  '价格以用户中心实时显示为准。四档月付套餐可选月付、季付、半年付、年付：季付 95 折、半年付 9 折、年付 85 折，「折合每月」按总价除以月数计算。';

/** 9 档套餐共用的服务规则（面板原文整理） */
export const COMMON_FACTS = [
  { label: '速度', value: '不限速' },
  { label: '计费', value: '1.0 倍率，用多少计多少' },
  { label: '设备', value: '不限设备数量' },
  { label: '协议', value: 'SS（Shadowsocks）' },
  { label: '线路', value: 'IEPL / IPLC 优化线路' },
  { label: '节点地区', value: '香港、台湾、日本、新加坡、美国等' },
  { label: '流媒体', value: 'Netflix、Disney+、YouTube 等' },
  { label: 'AI 工具', value: '适配 ChatGPT、Claude 等' },
  { label: '售后', value: '在线客服、用户中心工单' },
] as const;

export interface Faq {
  q: string;
  a: string;
  link?: { href: string; text: string; external?: boolean };
}

// 首页 FAQ：品牌层面的问题，具体操作指向对应的官方站点
export const FAQS: Faq[] = [
  {
    q: '灵动云官网是哪个网站？',
    a: '灵动云官网是 lingdongyun.site，也是五个官方站点中唯一的官网。另外四个官方站点分别负责使用指南、套餐选择、帮助中心和新手入门，完整清单与辨认方法写在官方站点说明里。',
    link: { href: '/guides/lingdongyun-official/', text: '查看官方站点说明' },
  },
  {
    q: '怎么注册灵动云账号？',
    a: '点击本站任一「注册 / 登录」或「选择此套餐」按钮，会在新标签页打开灵动云用户中心，注册账号和购买套餐都在那里完成，五个官方站点上的注册按钮打开的是同一个用户中心。买好套餐后，订阅链接向帮助中心的在线客服领取，说明设备和客户端即可。',
    link: { href: SITE.registerUrl, text: '前往用户中心注册', external: true },
  },
  {
    q: '套餐价格以哪里为准？',
    a: '本站价格整理自用户中心面板：月付 4 档 ¥20–¥180/月（季付、半年付、年付分别 95 折、9 折、85 折），年付 ¥99/年，流量包 ¥199–¥899，至尊私人定制 ¥680/月。如有调整，以用户中心实时显示为准；每一档的计费规则单独写在价格说明页。',
    link: { href: '/guides/plan-selection/', text: '阅读套餐价格与服务说明' },
  },
  {
    q: '支持哪些设备和客户端？',
    a: '设备数量不限，Windows、macOS、Android、iPhone 和 iPad 都能使用。订阅采用 SS（Shadowsocks）协议，Clash 系列、小火箭（Shadowrocket）、v2rayN / v2rayNG 等常见客户端都可以导入；每种设备该装哪个客户端，使用指南站有逐一对照。',
    link: { href: LINKS.websiteChooseClient, text: '按设备选择客户端' },
  },
  {
    q: '第一次使用，应该从哪里开始？',
    a: '按「注册账号 → 选择套餐 → 在客户端导入订阅 → 连接并测试」的顺序来。新手入门站把这四步放在同一页，每一步都附有对应的详细教程。',
    link: { href: LINKS.lolHome, text: '打开新手入门' },
  },
  {
    q: '连不上或速度变慢怎么办？',
    a: '先确认套餐没有到期、流量没有用完，再在客户端里更新订阅、换一个节点重试。仍然不行时，帮助中心按订阅更新失败、节点超时、速度慢等症状整理了排查步骤。',
    link: { href: LINKS.sbsTroubleshooting, text: '查看连接问题排查' },
  },
  {
    q: '怎么联系客服？',
    a: '售后有两个渠道：帮助中心 lingdongyun.sbs 的在线客服，以及用户中心工单。描述问题时写明设备、客户端和出现问题的时间，截图前遮住订阅链接。',
    link: { href: LINKS.sbsHome, text: '前往帮助中心' },
  },
];

/** 按正文汉字数估算阅读时间（约每分钟 300 字），至少 1 分钟 */
export const readMinutes = (body = '') => Math.max(1, Math.round((body.match(/[一-鿿]/g) || []).length / 300));
