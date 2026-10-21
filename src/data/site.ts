// 全站共享的品牌信息与套餐数据。修改此处即可同步首页、FAQ、结构化数据与 llms.txt。

export const SITE = {
  name: '灵动云官网',
  brand: '灵动云',
  brandEn: 'LINGDONG CLOUD',
  // 品牌常见叫法（用于结构化数据 alternateName、llms.txt 等）
  aliases: ['LINGDONG CLOUD', 'Lingdongyun', '灵动云官网', '灵动云机场', '灵动云VPN'],
  url: 'https://lingdongyun.site',
  // 唯一注册入口：完整保留 #/?code=HHoxxHGa，不要修改或拼接
  registerUrl: 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa',
  description:
    '灵动云官网：介绍灵动云月付、年付与一次性流量包套餐，提供机场选购方法与 Clash、Clash Party 客户端使用指南。',
  ogImage: '/og-image.png',
  // 站点内容创建日期（真实日期，非构建时间）
  published: '2026-10-17',
  updated: '2026-10-17',
} as const;

export const NAV = [
  { label: '首页', href: '/' },
  { label: '套餐价格', href: '/#pricing' },
  { label: '教学指南', href: '/#guides' },
  { label: '服务优势', href: '/#features' },
  { label: '使用指南', href: '/guides/' },
  { label: '常见问题', href: '/#faq' },
] as const;

export type PlanCategory = 'monthly' | 'yearly' | 'onetime';

export interface Plan {
  name: string;
  price: number;
  billing: string;
  traffic: string;
  category: PlanCategory;
  categoryLabel: string;
  badge?: string;
}

// 严格按资料表填写，不自行添加有效期、设备数、并发数等信息
export const PLANS: Plan[] = [
  { name: '灵动·拂风', price: 20, billing: '/ 月起', traffic: '100GB / 月', category: 'monthly', categoryLabel: '月付套餐' },
  { name: '灵动·驭浪', price: 50, billing: '/ 月起', traffic: '300GB / 月', category: 'monthly', categoryLabel: '月付套餐', badge: '日常进阶' },
  { name: '灵动·破晓', price: 100, billing: '/ 月起', traffic: '700GB / 月', category: 'monthly', categoryLabel: '月付套餐' },
  { name: '灵动·凌霄', price: 180, billing: '/ 月起', traffic: '1.5TB / 月', category: 'monthly', categoryLabel: '月付套餐' },
  { name: '灵动·穿云', price: 99, billing: '/ 年', traffic: '70GB / 月', category: 'yearly', categoryLabel: '年付套餐' },
  { name: '灵动·闲云', price: 199, billing: '/ 一次性', traffic: '150GB 总流量', category: 'onetime', categoryLabel: '一次性流量包' },
  { name: '灵动·惊云', price: 499, billing: '/ 一次性', traffic: '400GB 总流量', category: 'onetime', categoryLabel: '一次性流量包' },
  { name: '灵动·飞云', price: 899, billing: '/ 一次性', traffic: '800GB 总流量', category: 'onetime', categoryLabel: '一次性流量包' },
];

export const PLAN_FILTERS = [
  { key: 'all', label: '全部套餐' },
  { key: 'monthly', label: '月付套餐' },
  { key: 'yearly', label: '年付套餐' },
  { key: 'onetime', label: '一次性流量' },
] as const;

export const PLAN_NOTE =
  '套餐信息以注册后台实际展示为准。年付套餐为每月 70GB；一次性流量包为总流量。';

export const FRIEND_LINKS = [
  { href: 'https://jichangreview.net/', label: '机场测评' },
  { href: 'https://jichangguide.net/', label: '机场教程' },
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: '灵动云官网是哪个？灵动云机场、灵动云VPN 是同一个吗？',
    a: '灵动云官网的网址是 lingdongyun.site。灵动云（LINGDONG CLOUD，拼音 lingdongyun）是一个机场服务品牌，“灵动云机场”“灵动云VPN”“灵动云官网”都是用户对同一品牌的不同叫法。注册与订阅管理请通过官网按钮进入官方账户平台，并注意辨别名称相似的仿冒网站。',
  },
  {
    q: '灵动云有哪些套餐，最低多少钱？',
    a: '灵动云目前展示 8 档套餐：4 档月付（¥20 起，每月 100GB 至 1.5TB）、1 档年付（灵动·穿云，全年 ¥99，每月 70GB）、3 档一次性流量包（¥199 / 150GB、¥499 / 400GB、¥899 / 800GB 总流量）。页面上标价最低的是月付套餐灵动·拂风，¥20 / 月起。具体以注册后台实际展示为准。',
  },
  {
    q: '月付、年付和一次性流量包有什么区别？',
    a: '月付套餐按月计费，每月获得对应流量；年付套餐灵动·穿云一次支付全年费用 ¥99，每月 70GB 流量；一次性流量包一次支付，获得的是一笔总流量（如 150GB），不是每月流量。本站未列出的有效期、设备数等规则，请以注册后台说明为准。',
  },
  {
    q: '如何注册灵动云？',
    a: '点击本站任意“注册 / 登录”“立即注册”或“选择此套餐”按钮，会进入灵动云指定的账户平台，在那里完成注册、选购和订阅管理。本站本身不处理注册、支付或账户数据。',
  },
  {
    q: '支持 Clash 和 Clash Party 吗？',
    a: '能否使用取决于后台提供的订阅格式与你的客户端版本。Clash Party 是基于 Mihomo 内核的图形客户端，一般可导入 Mihomo（Clash Meta）兼容的订阅。即使服务支持 Shadowsocks 等协议，也不代表一定提供完整的 Clash 配置文件，请先在后台确认订阅格式，再选择客户端。',
  },
  {
    q: '如何判断节点是否稳定？',
    a: '单次测速只能反映当时的状态，不能证明长期稳定。建议在不同时段（尤其是晚高峰）连续观察几天，关注延迟波动、连接成功率和实际使用是否顺畅，再决定是否长期使用或升级套餐。',
  },
  {
    q: '订阅链接可以分享给别人吗？',
    a: '不建议。订阅链接通常包含与你账户绑定的访问令牌，别人拿到后可能消耗你的流量。不要把订阅链接发到群聊、截图或公开网页；如怀疑已泄露，请在后台查看是否提供重置订阅的功能。',
  },
  {
    q: '是否提供免费试用、优惠码或退款？',
    a: '本站目前没有获得关于试用、优惠码或退款的资料，因此不做任何承诺。是否有相关活动和规则，请以注册后台的实际活动页面与服务条款为准。',
  },
];

/** 按正文汉字数估算阅读时间（约每分钟 300 字），至少 1 分钟 */
export const readMinutes = (body = '') => Math.max(1, Math.round((body.match(/[\u4e00-\u9fff]/g) || []).length / 300));
