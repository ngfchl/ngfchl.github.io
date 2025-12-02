---
title: 03. 站点导入
description: 
published: true
date: 2025-12-01T04:40:56.646Z
tags: 
editor: markdown
dateCreated: 2024-09-29T14:34:14.534Z
---

1. # 站点导入

目前 harvest 支持多种导入方式，分别是：

[浏览器插件导入](?#浏览器插件导入)

[PTPP导入](?#PTPP备份文件导入)

[CookieCloud导入](?#CookieCloud导入)

PTPP 导入与 CookieCloud 导入操作按钮均在 APP 右上角按钮，任务执行完毕均会有通知，请提前在 APP 填写你喜欢使用的通知参数。


## 浏览器插件导入 - 收割机助手

  由于浏览器权限收紧，部分站点 Cookie 已无法使用 js 脚本获取，特此更换技术栈，使用浏览器插件来获取站点 Cookie 并同步至收割机服务器。
       

  ### 插件安装

#### 商店安装

  > <font color=orange>目前插件已在Firefox插件商店、EDGE插件商店上线，在商店搜索<font color=red>`收割机助手`</font>即可，Firefox审核较快，基本上提交就审核，EDGE很慢审核需要一周左右，Chrome商店我手里的账号无法上架，必须要使用Chrome浏览器的，请选择压缩包安装</font>

  [EDGE 商店](https://microsoftedge.microsoft.com/addons/detail/%E6%94%B6%E5%89%B2%E6%9C%BA%E5%8A%A9%E6%89%8B/mmcdpibkihoeamigemkblfbpccadbdkj)

  [Firefox 商店](https://addons.mozilla.org/zh-CN/firefox/addon/%E6%94%B6%E5%89%B2%E6%9C%BA%E5%8A%A9%E6%89%8B/)

#### 压缩包安装

1. 首先在微信群或者群组下载对应浏览器的插件压缩包

   chrome系的浏览器，包括EDGE，Chrome、360等均使用Chrome的zip包，

   firfox系的浏览器，使用firfox的zip包

2. 打开浏览器插件管理页面

   ![](https://img.ptools.fun/blog/image-20240927182635375.png)	

3. 打开开发者模式

   ![image-20240927182130517](https://img.ptools.fun/blog/image-20240927182130517.png)	

4. 将下载的插件压缩包拖至插件管理页面，安装完成

### 配置服务器信息

1. 点击插件图标，弹出配置窗口

   ![image-20250626224215716](https://img.ptools.fun/blog/image-20250626224215716.png)	

2. 填写相关字段

   1. 收割机服务器地址

   2. 安全 Token：原油猴 Token

      在 APP 中打开系统设置，并添加油猴 Token，后期会改为安全Token，可以自定义，也可以使用随机按钮生成 Token，没有此选项的请点击右下角➕添加
       <img src="https://img.ptools.fun/blog/image-20241020085907647.png" style="zoom: 33%;" />		

   3. 插件浮窗显示的图片地址，可以随意修改可以正常打开的图片地址就可以，默认是原油猴使用的图片地址

    ![美少女](https://img.ptools.fun/blog/image-20250617195010607.png)	

3. 填写完成后，点击登录鉴权按钮，如果配置正确，会自动保存服务器信息，提示错误的请检查地址和 Token 是否填写正确

   ![连接失败](https://img.ptools.fun/blog/image-20250617194753328.png)	

### Popup 界面

1. 点击插件图标会弹出窗口如下，填写相关信息登录即可

>   ### <font color=orange> 一键添加和清理缓存都必须有这个标签页存在才能正常执行</font>

![](https://img.ptools.fun/blog/image-20250626224307698.png)	

1. 使用

  2. **更新缓存**：插件登录后会自动从服务器拉取站点配置信息、已添加站点信息以及下载器列表，用于本地快速反应，避免与服务器频繁交互，降低 NAS 压力，点击此按钮会强制更新缓存信息。

     ![](https://img.ptools.fun/blog/image-20250617195703174.png)	

  3. **显示站点**：显示站点列表，可以进行一些快速操作，比如，将站点 Cookie 写入浏览器，更新站点数据，签到等等

     ![](https://img.ptools.fun/blog/image-20250626224650691.png)	

     ![](https://img.ptools.fun/blog/image-20250626224719169.png)	

  4. **一键同步**：一键同步已添加站点的 Cookie 信息，此功能仅同步 Cookie 和 UserAgent

     ![](https://img.ptools.fun/blog/image-20250617195726423.png)	

  5. **一键写入**：将收割机保存的站点 Cookie 写入到浏览器，可以用于新电脑或者新安装浏览器。恭喜你，再也不需要所有的站点都重新登录一遍啦！ 

     ![](https://img.ptools.fun/blog/image-20250626224443125.png)	

  6. **导入模式开关**：

     ![](https://img.ptools.fun/blog/image-20250617195821268.png)	

     打开导入模式时，会显示一键添加按钮，此时可以一键导入未添加的站点

     站点添加成功后会关掉当前页面，未关掉的站点就是添加失败的，可以手动点击同步数据按钮

     如果你发现你的个人中心或者控制面板打开后页面自动关闭，请关闭导入模式！

  7. **一键添加**：导入模式打开后此按钮才回显示，点击按钮会筛选未添加的站点列表，同时在本地的 Cookie 信息中筛选访问过的站点，访问站点配置文件中设定的控制面板地址，打开页面后会触发站点信息同步功能，成功同步后会关闭当前页面，页面未关闭的表示同步失败，可以选择手动操作，

     >  <font color=orange>PS: 一键添加结束之后，请记得关闭导入模式，否则，你发现你访问站点的个人中心或者控制面板打开后页面自动关闭   </font>

     ![](https://img.ptools.fun/blog/image-20250617195803468.png)	

  8. **清理缓存**：

     这个清理缓存会逐一打开所有站点的每个域名，并清理收割机写入本地存储的信息，以达到清理运行环境的目的，如果插件与服务器交互正常，请勿随意操作，耗时比较久。

     ![](https://img.ptools.fun/blog/image-20250618150101982.png)	

  ### 错误处理

    1. 遇到错误的，请按 F12 到控制台(或Console)查看报错信息

  ![image-20230630100916831](https://img.ptools.fun/blog/image-20230630100916831.png)  

  ### 使用

  插件的使用逻辑与油猴脚本基本保持一致，但是也新增了一些功能

  #### 站点信息同步：

  访问个人信息面或者控制面板页面时会自动同步数据，点击同步数据会跳转至控制面板页面后自动同步

  ![](https://img.ptools.fun/blog/image-20230906035538885.png)

  #### 下载种子

  1. 在种子列表页面会跳出下载全部和下载免费两个按钮，点击后会弹出下载器选择界面，QB下载器显示分类，TR下载器显示常用文件夹内，点击即可开始下载！根据需要选择自己的下载位置即可

  ![](https://img.ptools.fun/blog/image-20230906035414077.png)	

  2. 在种子详情页会跳出：`下载到`按钮：下载到与上一条功能一致，区别是这个只下载本条种子信息

     ![](https://img.ptools.fun/blog/image-20230906035419401.png)	

  #### 辅种助手

  辅种助手仅支持 IYUU 支持的站点，助手会从 IYUU 读取本种子已经发布的站点信息，同时也可以显示可以发布的站点，因数据来源不齐全，可能会有错漏的情况

  ![](https://img.ptools.fun/blog/image-20250618151459278.png)	

 ## PTPP备份文件导入

1. 备份之前请先授权允许 PTPP 操作Cookie  

> ![](https://img.ptools.fun/blog/2024-05-07_234629_7128820.02828812252440116.png)

2. 备份前请现在设置中勾选备份时备份 Cookie 选项  

> ![](https://img.ptools.fun/blog/2024-05-07_234606_9201980.667088461822774.png)

3.  在 PTPP 中刷新一次全量数据

> ![image-20250222235837847](https://img.ptools.fun/blog/image-20250222235837847.png)

4. 备份 PTPP

> ![image-20250222235854128](https://img.ptools.fun/blog/image-20250222235854128.png)

5. 执行 PTPP 导入

> ![](https://img.ptools.fun/blog/2024-05-07_234007_5925790.28505383149265584.png)
> ![](https://img.ptools.fun/blog/image-20250414154657036.png)	
>
> ![](https://img.ptools.fun/blog/image-20250414154751131.png)	
>
> ![	](https://img.ptools.fun/blog/image-20250414155044630.png)	

> APP 有如上提示时，表示已经在进行导入，如果已经添加了通知，在导入任务执行完毕后会接收到任务执行结果






## CookieCloud导入

1. 需在配置项（系统设置）中配置 CookieCloud相关参数
2. PT 站点 Cookie 只有极少站点会经常过期，经常同步活出现一些莫名其妙的问题，因此取消 自动CC 任务改为手动执行
3. CC 任务出了第一次添加站点要获取 UID 和 passkey ，会较慢，之后基本秒级完成，无需担心效率
4. CC 任务同步获取的 UID 和 passkey 有可能有误，在抓取信息以及搜索等操作时出现问题的，记得检查 UID 是否准确，如果有误，请手动修改，并通知作者。  

### 使用

1. CC参数配置  

>    ![](https://img.ptools.fun/blog/2024-05-07_234048_8411220.023741296163010794.png)	

2. 执行 CC 同步  

>    ![](https://img.ptools.fun/blog/2024-05-07_233948_0044740.23990866545405554.png)	






  ## 特殊站点处理

  > 大多数站点都使用 Cookie 来进行访问，但是个别站点需要特殊设置

### 找不到某些站点

工具只内置了一部分常规站点，其余站点可以自行适配或者找大佬索要站点配置文件，然后讲配置文件丢到 sites 文件夹中即可

1. 到 TG 频道下载最新的 sites
2. 在微信群中下载
3. 找大佬要
4. 自制配置文件

  ### 馒头

  馒头官方要求第三方软件不得使用 cookie 访问网站，必须使用令牌，否则有BAN 号风险。 

  > 令牌获取：控制台=>实验室=>令牌  
  >
  > ![](/Users/ngf/Library/Application Support/typora-user-images/image-20250626223132667.png)

  > 令牌使用：mteam=>编辑=>AuthKey
  >
  > ![](https://img.ptools.fun/blog/image-20250626223239342.png)	

  近日馒头域名有更换，请在 APP 上清除缓存后，下拉刷新数据，找到馒头=>编辑，重新选择站点域名即可  

  ## 部分站点 uid 不为数字为用户名，手动填写是需要注意，列表如下：

    1. 莫妮卡
    2. 普斯特
    3. iptorrent
    4. torrentleech
    5. AZ家族
    6. 待补充

 ## ~~油猴导入功能，已淘汰~~

 ### 安装油猴插件

 > ### <font color="red">请使用红色油猴安装本脚本</font>
 >
 > ### <font color="red">请使用红色油猴安装本脚本</font>
 >
 > ### <font color="red">请使用红色油猴安装本脚本</font>
 >
 > ### <font color="orange">油猴脚本不仅仅支持同步Cookie，也支持添加站点</font>

 红色油猴脚本即油猴测试版，Beta版，

 ![image-20230630100049242](https://img.ptools.fun/blog/image-20230630100049242.png)	

 ![image-20230630100212785](https://img.ptools.fun/blog/image-20230630100212785.png)	

 油猴测试版下载地址：

 [EDGE浏览器](https://microsoftedge.microsoft.com/addons/detail/fcmfnpggmnlmfebfghbfnillijihnkoh) [CHROME](https://chrome.google.com/webstore/detail/gcalenpjmijncebpfijmoaglllgpjagf)

 ### 安装油猴脚本

 PtToPTools脚本下载地址

 [点击访问](https://greasyfork.org/zh-CN/scripts/458791-harvest-dev) [镜像地址](https://soujiaoben.org/#/pages/list/detail?id=458791&host=greasyfork)