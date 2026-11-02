// 结构化数据片段。所有对组织的引用都使用同一个 @id：https://lingdongyun.site/#org
import { PLANS, SITE, planFullName, cycleText } from './site';

export type Node = Record<string, unknown>;

export const ORG_REF = { '@id': SITE.orgId } as const;
export const WEBSITE_REF = { '@id': SITE.websiteId } as const;

/** 全站共用：完整的 Organization 节点与本站 WebSite 节点 */
export const siteNodes = (): Node[] => [
  {
    '@type': 'Organization',
    '@id': SITE.orgId,
    name: SITE.brand,
    alternateName: [...SITE.aliases],
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/logo-512.png`, width: 512, height: 512 },
    description: SITE.orgDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://lingdongyun.sbs/',
      availableLanguage: ['zh-CN'],
    },
  },
  {
    '@type': 'WebSite',
    '@id': SITE.websiteId,
    name: SITE.name,
    url: `${SITE.url}/`,
    inLanguage: 'zh-CN',
    publisher: ORG_REF,
  },
];

/** 套餐目录：只用于页面上可见完整价格的页面（首页、套餐价格与服务说明） */
export const planCatalog = (pageUrl: string): Node => ({
  '@type': 'OfferCatalog',
  '@id': `${pageUrl}#plans`,
  name: '灵动云 9 档套餐',
  url: pageUrl,
  numberOfItems: PLANS.length,
  itemListElement: PLANS.map((p) => ({
    '@type': 'Offer',
    name: planFullName(p),
    category: p.categoryLabel,
    price: p.price.toFixed(2),
    priceCurrency: 'CNY',
    description: `${p.type}，${p.cycles ? cycleText(p) : p.priceText}，${p.traffic.replace(/ \/ /g, '/')}，${p.validity}`,
    offeredBy: ORG_REF,
    itemOffered: { '@type': 'Service', name: planFullName(p), provider: ORG_REF },
    ...(p.unit
      ? {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: p.price.toFixed(2),
            priceCurrency: 'CNY',
            referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: p.unit },
          },
        }
      : {}),
  })),
});

/** FAQPage：只用于页面上可见的问答 */
export const faqPage = (pageUrl: string, faqs: { q: string; a: string }[]): Node => ({
  '@type': 'FAQPage',
  '@id': `${pageUrl}#faq`,
  isPartOf: WEBSITE_REF,
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbs = (items: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE.url}${it.path}`,
  })),
});
