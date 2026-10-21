---
title: 多端客户端指南：电脑与手机如何选择 Clash、Clash Party 与小火箭
seoTitle: 多端客户端指南：Windows、macOS、安卓与苹果设备怎么选 Clash、Clash Party、小火箭｜灵动云
description: 在电脑和手机上使用同一个机场订阅，应该选什么客户端？本文介绍 Clash Party、Clash Meta for Android 与小火箭（Shadowrocket）的定位、官方获取渠道和多设备使用注意事项。
excerpt: 电脑用 Clash Party，安卓可选 Clash Meta for Android，苹果设备常用小火箭——先确认订阅格式，再按设备选客户端。
category: 多端指南
keywords: [多端客户端, Clash Party, 小火箭, Shadowrocket, Clash Meta for Android, clash节点]
order: 10
published: '2026-10-17'
updated: '2026-10-17'
related: [clashparty-airport, clash-nodes, safe-airport-guide]
sources:
  - title: Clash Party 项目主页（GitHub）
    url: https://github.com/mihomo-party-org/clash-party
  - title: Clash Party 官方发布页（Releases）
    url: https://github.com/mihomo-party-org/clash-party/releases
  - title: Clash Meta for Android 项目主页（GitHub）
    url: https://github.com/MetaCubeX/ClashMetaForAndroid
  - title: Shadowrocket（小火箭）App Store 页面
    url: https://apps.apple.com/app/shadowrocket/id932747118
  - title: Mihomo 项目主页（GitHub）
    url: https://github.com/MetaCubeX/mihomo
---

在多台设备上使用同一个机场服务，思路很简单：**先在后台确认订阅格式，再按设备系统选择对应的客户端，最后在每台设备上分别导入订阅**。常见的搭配是：电脑使用基于 Mihomo 内核的 Clash Party，安卓手机可以选择 Clash Meta for Android，苹果设备常用小火箭（Shadowrocket）。这些客户端都不自带节点，需要配合你自己购买的服务使用。

## 先弄清楚：客户端、内核与订阅格式

客户端是你看到的软件界面，真正负责连接的是它内置的“内核”。Clash Party 和 Clash Meta for Android 都使用 Mihomo（原名 Clash Meta）内核，可以读取 Clash（Mihomo）格式的配置；小火箭则是一款独立开发的苹果设备应用，有自己的配置方式，同时支持导入多种订阅格式。

因此，选客户端之前最重要的一步，是在服务后台查看提供了哪些订阅格式。即使服务支持某种协议，也不代表每种客户端都能直接使用，具体以后台说明和客户端的版本说明为准。

## 电脑端：Clash Party

Clash Party 是一款开源的 Mihomo 图形客户端，以 GPL-3.0 协议发布。根据项目说明，它内置 Mihomo 与 Smart 内核，支持无需服务模式的 TUN 模式、配置覆写、WebDAV 备份恢复，并集成了 Sub-Store 订阅管理。

获取方式：从项目 GitHub 的 Releases 发布页，或项目说明指向的官方网站下载与系统对应的安装包。详细的导入与维护步骤见[Clash Party 机场配置指南](/guides/clashparty-airport/)。

## 安卓手机：Clash Meta for Android

Clash Meta for Android 由 Mihomo 所在的 MetaCubeX 组织维护，同样以 GPL-3.0 协议开源。根据项目页面，它最低支持 Android 5.0，建议使用 Android 7.0 及以上版本，并提供 F-Droid 等发布渠道。它支持通过订阅链接导入配置，节点、代理组等概念与电脑端一致，所以学会一端，另一端也能很快上手。节点选择与排错可参考[Clash 节点使用指南](/guides/clash-nodes/)。

## 苹果设备：小火箭（Shadowrocket）

小火箭是苹果设备上常用的代理客户端，在 App Store 上为付费应用。根据其 App Store 页面，它支持 iPhone、iPad、Mac 等设备，提供基于域名、IP 段、GeoIP 等条件的规则，并且应用本身不提供任何服务器，需要用户自行配置服务。

使用小火箭时有两点特别要注意：

1. **认准正版**：App Store 中存在名称相近的仿冒应用，下载前核对开发者名称与应用页面信息；
2. **地区限制**：该应用并非在所有地区的 App Store 都能下载，请遵守所在地区的规定，不要购买来路不明的共享账号。

导入时，一般是在应用中添加订阅链接，再从节点列表中选择节点并开启连接。界面会随版本变化，请以当前版本为准。

## 多设备同时使用的注意事项

- **规则以后台为准**：同时在线的设备数等限制，请查看后台说明；
- **流量共享**：多台设备通常共用同一个套餐的流量，设备越多消耗越快，选档位时要算进去，可参考[灵动云套餐怎么选](/guides/plan-selection/)；
- **订阅链接保护**：每台设备导入的都是同一个带令牌的链接，不要为了方便发给别人，原因见[安全机场如何判断](/guides/safe-airport-guide/)；
- **分别更新**：服务调整节点后，每台设备都需要更新订阅。

## 要点总结

- 先确认后台提供的订阅格式，再按设备选客户端；
- 电脑可用 Clash Party，安卓可用 Clash Meta for Android，二者都基于 Mihomo 内核；
- 苹果设备常用小火箭，注意认准正版、遵守地区规定；
- 客户端都不自带节点，需要配合自己的服务使用；
- 多设备共用流量和订阅链接，注意设备规则与令牌保护。
