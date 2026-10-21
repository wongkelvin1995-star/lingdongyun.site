// 用户评价数据。
// 只填写获得用户授权的真实评价，不要编造姓名、星级或内容。
// 列表为空时，首页显示“评价整理中”的空状态；填入后自动显示评价卡片。
//
// 示例格式（取消注释并替换为真实内容）：
// { name: '用户昵称（经本人同意）', rating: 5, content: '真实评价原文', date: '2026-10-20', plan: '灵动·驭浪' },

export interface Review {
  /** 展示名称：需经用户本人同意，可用昵称或部分隐藏，如“王**” */
  name: string;
  /** 1–5 星，按用户实际给出的评分填写 */
  rating: 1 | 2 | 3 | 4 | 5;
  /** 评价原文 */
  content: string;
  /** 评价日期 YYYY-MM-DD */
  date: string;
  /** 可选：用户使用的套餐名称 */
  plan?: string;
}

export const REVIEWS: Review[] = [];
