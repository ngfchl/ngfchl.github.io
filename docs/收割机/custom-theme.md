# 09. 自定义主题

收割机在 198 版本中增加了自定义配色方案功能，为了方便大家创作与分享，现在收割机添加了配色方案导入和分享功能。
> APP 主题配置界面增加了主题配色预览模块，点击各个元素就可以跳出颜色选择窗口，选择自己心仪的颜色，可以实时看到效果，满意之后关掉颜色窗口即可
![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/主题/img.png)

## 1. 支持项目

目前一共支持 33 个项目的自定义，30号是卡片底色，全局通用
![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/主题/img_1.png)
> 1. 小卡片卡片色与图标色同步，点击第一行文字编辑，选中的是图标颜色，卡片色为图标色浓度的70%
> 2. 点击第二行文字编辑卡片上的文字颜色
1. 站点名称
2. 新邮件
3. 新公告
4. 用户等级（记错了，此项不可自定义，根据NP站点默认配色自动适配）
5. 注册时间
6. 保号
7. 毕业
8. 邀请数
9. 加载中（loading）
10. H&R
11. 上传量卡片
12. 上传量文字
13. 下载量卡片
14. 下载量文字
15. 做种量卡片 （做种量文字忘记标注）
16. 做种数卡片
17. 做种数文字
18. 魔力值卡片
19. 魔力值数字
20. 做种积分卡片
21. 做种积分文字
22. 发种数卡片
23. 发种数文字
24. 正在下载卡片
25. 正在下载文字
26. 分享率卡片
27. 分享率文字
28. 时魔卡片
29. 时魔文字
30. 站点卡片
31. 背景图链接
32. 卡片透明度，全局
33. 背景图模糊

## 2. 配色方案
![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/主题/img_2.png)
```json
{
  "toSignColor": 2415149878,
  "signedColor": 4281896508,
  "siteCardColor": 4294967295,
  "siteNameColor": 4282532418,
  "mailColor": 4294198070,
  "noticeColor": 4294198070,
  "regTimeColor": 4283510184,
  "keepAccountColor": 4286695300,
  "graduationColor": 4294953512,
  "inviteColor": 4278278043,
  "loadingColor": 4278979081,
  "uploadIconColor": 4294538006,
  "uploadNumColor": 4294967295,
  "downloadIconColor": 4293870660,
  "downloadNumColor": 4294967295,
  "ratioIconColor": 4294538006,
  "ratioNumColor": 4294967295,
  "seedIconColor": 4278979081,
  "seedNumColor": 4278979081,
  "perBonusIconColor": 4278979081,
  "perBonusNumColor": 4294967295,
  "bonusIconColor": 4278979081,
  "bonusNumColor": 4294967295,
  "updatedAtColor": 4278979081,
  "hrColor": 4293870660,
  "uploadedColor": 4294967295,
  "uploadedIconColor": 4278209856,
  "downloadedColor": 4294967295,
  "downloadedIconColor": 4291176488,
  "publishedNumColor": 4294967295,
  "scoreNumColor": 4294967295,
  "seedVolumeIconColor": 4281236786,
  "seedVolumeNumColor": 4294111986,
  "scoreIconColor": 4290190364,
  "publishedIconColor": 4278430196
}
```

## 3. 全量主题

可能部分小伙伴会看到不一样的主题内容，这是因为，新版本增加了全量主题信息，包括在线背景图片，主题模式，透明度，模糊效果等配置，不必担心，单单配色方案照样可以导入使用

```json
{
  "isDark": false,
  "followSystem": false,
  "colorSchemeName": "green",
  "useBackground": true,
  "useImageProxy": false,
  "useLocalBackground": false,
  "backgroundImage": "https://pic4.zhimg.com/v2-12ed225c3144a726284fe048870f72d1_r.jpg",
  "backgroundBlur": 0.02587064101378226,
  "cardOpacity": 0.49088938643292684,
  "useImageCache": true,
  "color_config": {
    "toSignColor": 2415149878,
    "signedColor": 4281896508,
    "siteCardColor": 4294967295,
    "siteNameColor": 4282532418,
    "mailColor": 4294198070,
    "noticeColor": 4294198070,
    "regTimeColor": 4283510184,
    "keepAccountColor": 4286695300,
    "graduationColor": 4294953512,
    "inviteColor": 4278278043,
    "loadingColor": 4278979081,
    "uploadIconColor": 4294538006,
    "uploadNumColor": 4294967295,
    "downloadIconColor": 4293870660,
    "downloadNumColor": 4294967295,
    "ratioIconColor": 4294538006,
    "ratioNumColor": 4294967295,
    "seedIconColor": 4278979081,
    "seedNumColor": 4278979081,
    "perBonusIconColor": 4278979081,
    "perBonusNumColor": 4294967295,
    "bonusIconColor": 4278979081,
    "bonusNumColor": 4294967295,
    "updatedAtColor": 4278979081,
    "hrColor": 4293870660,
    "uploadedColor": 4294967295,
    "uploadedIconColor": 4278209856,
    "downloadedColor": 4294967295,
    "downloadedIconColor": 4291176488,
    "publishedNumColor": 4294967295,
    "scoreNumColor": 4294967295,
    "seedVolumeIconColor": 4281236786,
    "seedVolumeNumColor": 4294111986,
    "scoreIconColor": 4290190364,
    "publishedIconColor": 4278430196
  }
}
```