---
title: 08. 自行适配
description:
published: true
date: 2025-12-01T04:40:48.220Z
tags: [ ]
editor: markdown
dateCreated: 2025-04-14T08:59:18.445Z
---

# 自行适配站点

> PT站点众多，一个人难以完全收集，全部适配就成了难题，现在开放自定义配置文件功能，各位大佬可以去哔哩哔哩大学简单学习一下Xpath，就可以参照已经有的配置文件自行适配站点了

> ##### 2025.12.15
> <font color=orange>更新了搜索时多搜索路径的支持，自定义配置文件时需要配置多个地址</font>
> ```
> page_search = [
>   "torrents.php?search={}", # NP站点基本都支持
>   "search.php?search={}",   # 新站基本都支持
>   "special.php?search={}",  # 站点自定义的特殊页面
>   "live.php?search={}",     # 站点自定义的特殊页面
> ] # 种子搜索页面，大括号同上
> ```

## 适配教程

1. 观察站点，注意界面风格与显示效果

2. 找一个风格基本一致的站点作为基础模板来适配新站点

3. 开始适配

4. 适配完成后将配置文件放入 sites 文件夹

   > <font color="orange">1. sites 文件夹中的配置文件优先级高于内置配置</font>
   > 新功能，可以通过长按站点数据页面的添加按钮打开配置文件上传窗口上传配置文件，且会自动刷新缓存，无需再处理缓存问题，直接点刷新按钮即可  
   > 
   ![img_5.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E8%87%AA%E5%AE%9A%E4%B9%89/img_5.png)

5. 清除站点配置缓存或者重启容器

6. 加入收割机助手插件

   1. 将下载的插件解压缩，在根目录找到` manifest.json `，用文本编辑器（推荐：`vscode`,`sublime`,`MarsCode`等）打开，

      ​	<img src="https://img.ptools.fun/blog/image-20250903172051280.png"/>	

   2. 找到文件中的两个 matches ，随便找一个域名，复制，并将网址改成你适配的站点的网址，保存后重新加载插件即可

      > <font color=orange>如果不好找，可以使用格式化功能对文件进行格式化</font>

      ![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E8%87%AA%E5%AE%9A%E4%B9%89/img.png)

      ![img_1.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E8%87%AA%E5%AE%9A%E4%B9%89/img_1.png)

### 前置教程

导出内置站点配置文件

1. 进入 NAS 终端

2. 输入命令：

   ```bash
   # 格式
   # OPTIONS 表示参数，一般不需要
   # CONTAINER 表示容器名或者容器 Id
   # SRC_PATH 表示源路径
   # DEST_PATH 表示目标路径
   # 从主机复制到docker
   # docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH
   # 从docker复制到主机
   # docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
   # 示例如下 表示从容器的/app/internal下复制所有文件到本地的用户主目录下的 APP 文件夹内，*可以替换为配置文件名称，比如：1pt.toml
   docker cp harvest:/app/internal/* ~/app/ 
   docker cp harvest:/app/internal/1pt.toml ~/app/ 
   ```

   

### 使用教程

1. 修改文件与name字段，两者保持一致，比如文件名是：`收割机`，那么name字段也要是`收割机`
   ![img_2.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E8%87%AA%E5%AE%9A%E4%B9%89/img_2.png)

   ```
   name = "收割机"
   ```

2. 修改域名：删除原有的域名，按照相同的格式填上域名，不要忘记域名后面的`/`

   ```toml
   url = ["https://shougeji.zip/", ] # 站点域名，多个域名用`,`隔开
   ```

3. iyuu字段：如果是IYUU支持的站点，填写本站在IYUU中的站点ID，如果不支持，请填0

   ```toml
   iyuu = 0
   ```

4. 检查站点功能开关：

   ```
   sign_in = true # 签到开关，无需签到的站点或者无法签到的站点请设置为false
   get_info = true # 抓取站点信息
   repeat_torrents = true # 辅种，不支持IYUU和PiecesHash辅种的请设置为False
   brush_free = true # 免费刷流，未启用，忽略
   brush_rss = true # RSS刷流，未启用，忽略
   hr_discern = false # 是否开启HR种子下载，未启用功能，忽略
   search_torrents = true # 是否支持种子搜索，未启用，忽略
   pieces_repeat = true # 是否支持pieces-hash辅种
   proxy = true # 站点是否使用代理，为false是自动屏蔽代理
   alive = true # 站点存活与否
   ```

5. 检查各个访问链接是否正确：

   ```
   page_index = "index.php" # 主页
   page_torrents = "torrents.php?incldead=1" # 种子列表也
   page_sign_in = "attendance.php" # 签到页
   page_control_panel = "usercp.php" # 控制面板页
   page_detail = "details.php?id={}" # 个人主页，大括号不要改，这里会自动填入站点UID
   page_download = "download.php?id={}&passkey={}" # 种子下载链接，同上
   page_user = "userdetails.php?id={}" # 个人详情页，同上
   page_search = [
    "torrents.php?search={}", # NP站点基本都支持
    "search.php?search={}",   # 新站基本都支持
    "special.php?search={}",  # 站点自定义的特殊页面
    "live.php?search={}",     # 站点自定义的特殊页面
   ] # 种子搜索页面，大括号同上
   page_message = "messages.php" # 短消息页面
   page_hr = "myhr.php?hrtype=1&userid={}" # HR页面
   page_leeching = "getusertorrentlistajax.php?userid={}&type=leeching" # 吸血中，下载中的种子，未启用
   page_uploaded = "getusertorrentlistajax.php?userid={}&type=uploaded" # 上传中的种子 未启用
   page_seeding = "getusertorrentlistajax.php?userid={}&type=seeding" # 做种的种子列表
   page_completed = "getusertorrentlistajax.php?userid={}&type=completed"  # 已完成的种子列表 未启用
   page_mybonus = "mybonus.php" # 魔力详情页
   page_viewfilelist = "viewfilelist.php?id={}" # 种子文件列表页，暂未启用
   imdb_search = "torrents.php?search_area=4&search={}" # 通过IMDB ID搜索入口
   page_pieces_hash_api = "api/pieces-hash" # pieces-hash辅种接口
   ```

6. 站点信息相关

   ```toml
   my_invitation_rule = "//span/a[contains(@href,'invite.php?id=')]/following-sibling::text()[1]" # 邀请数量
   my_time_join_rule = "//td[contains(text(),'加入')]/following-sibling::td/span/@title" # 注册时间
   my_latest_active_rule = "//td[contains(text(),'最近动向')]/following-sibling::td/span/@title" # 最近访问时间
   my_uploaded_rule = "//font[@class='color_uploaded']/following-sibling::text()[1]" # 上传量
   my_downloaded_rule = "//font[@class='color_downloaded']/following-sibling::text()[1]" # 下载量
   my_ratio_rule = "//font[@class='color_ratio'][1]/following-sibling::text()[1]" # 分享率
   my_bonus_rule = "//a[@href='mybonus.php']/following-sibling::text()[1]" # 魔力值
   my_per_hour_bonus_rule = "//h1[contains(text(),'每小时获得的合计')]/following::table[1]//tr[2]/td[last()]/text()" # 时魔，在魔力页面测试
   my_score_rule = "//td[contains(text(),'分')]/following-sibling::td/text()[1]" # 做种积分
   my_level_rule = "//table[@id='info_block']//span/a[contains(@class,'_Name') and contains(@href,'userdetails.php?id=')]/@class" # 用户等级信息
   my_passkey_rule = "//td[contains(text(),'密钥')]/following-sibling::td[1]/text()" # Passkey密钥，控制面板页面
   my_uid_rule = "//table[@id='info_block']//span/a[contains(@class,'_Name') and contains(@href,'userdetails.php?id=')]/@href" # UID，所有页面
   my_email_rule = "//td[contains(text(),'邮箱')]/following-sibling::td[1]//text()" # 20250505 新增项目，注册邮件地址，一般在控制面板使用，
   my_username_rule = "//table[@id='info_block']//span/a[contains(@class,'_Name') and contains(@href,'userdetails.php?id=')]/b/text()" # 20250505 新增项目，用户名，所有页面
   my_hr_rule = "//a[@href='myhr.php']//text()" # H&R
   my_leech_rule = "//img[@class='arrowdown']/following-sibling::text()[1]" # 下载中，吸血中
   my_publish_rule = "//p/preceding-sibling::b/text()[1]" # 已发布，未启用
   my_seed_rule = "//img[@class='arrowup']/following-sibling::text()[1]" # 做种中
   my_seed_vol_rule = "//p/preceding-sibling::div/div/text()[1]" # 做种体积，在做种列表页面，部分站点在个人主页
   my_mailbox_rule = "//a[@href='messages.php']/font[contains(text(),'条')]/text()[1]" # 邮件提示信息
   my_message_title = "//img[@alt='Unread']/parent::td/following-sibling::td/a[1]//text()" # 短消息标题
   my_notice_rule = "//a[@href='index.php']/font[contains(text(),'条')]/text()[1]" # 公告提示消息
   my_notice_title = "//td[@class='text']/div/a//text()" # 公告标题
   my_notice_content = "//td[@class='text']/div/a/following-sibling::div" # 公告内容
   
   ```

7. 种子列表相关

   ```toml
   torrents_rule = "//table[@class='torrents']/tr" # 种子列表，测试时看到的数字应该与当前页面的种子数量一致
   torrent_title_rule = ".//td[@class='embedded']/a/b/text()" # 种子标题
   torrent_subtitle_rule = ".//a[contains(@href,'detail')]/parent::td/text()[last()]" # 副标题
   torrent_detail_url_rule = ".//td[@class='embedded']/a[contains(@href,'detail')]/@href" # 详情链接
   torrent_category_rule = ".//td[@class='rowfollow nowrap'][1]/a[1]/img/@title" # 种子分类
   torrent_poster_rule = ".//table/tr/td[1]/img/@src" # 海报
   torrent_magnet_url_rule = ".//td/a[contains(@href,'download.php?id=')]/@href" # 下载链接
   torrent_size_rule = ".//td[5]/text()" # 种子大小
   torrent_progress_rule = ".//div[contains(@title,'ing')]/@title" # 下载进度
   torrent_hr_rule = ".//table/tr/td/img[@class='hitandrun']/@title" # HR
   torrent_sale_rule = ".//img[contains(@class,'free')]/@alt" # 免费促销信息
   torrent_sale_expire_rule = ".//img[contains(@class,'free')]/following-sibling::font/span/@title" # 促销到期时间
   torrent_release_rule = ".//td[4]/span/@title" # 发布时间
   torrent_seeders_rule = ".//a[contains(@href,'#seeders')]/text()" # 做种人数
   torrent_leechers_rule = ".//a[contains(@href,'#leechers')]/text()" # 下载人数
   torrent_completers_rule = ".//a[contains(@href,'viewsnatches')]//text()" # 完成人数
   torrent_tags_rule = ".//a[contains(@href,'detail')]/../span[contains(@class,'tags')]/text()" # 种子标签
   ```

8. 种子详情页相关

   ```toml
   detail_title_rule = "//h1/text()[1]" # 种子标签
   detail_subtitle_rule = "//td[contains(text(),'副标题')]/following-sibling::td/text()[1]" # 副标题
   detail_download_url_rule = "//td[contains(text(),'种子链接')]/following-sibling::td/a/@href[1]" # 下载链接
   detail_size_rule = "//td//b[contains(text(),'大小')]/following::text()[1]"  # 种子大小
   detail_category_rule = "//td/b[contains(text(),'类型')]/following-sibling::text()[1]" # 种子分类
   detail_count_files_rule = "//td/b[contains(text(),'文件数')]/following-sibling::text()[1]" # 资源文件数目
   detail_hash_rule = "//td/b[contains(text(),'Hash')]/following-sibling::text()[1]" # 种子 hash
   detail_free_rule = "//h1/b/font/@class" # 促销
   detail_free_expire_rule = "//h1/b/span/@title" # 促销到期时间
   detail_douban_rule = "//td/a[starts-with(@href,'https://movie.douban.com/subject/')][1]" # 豆瓣链接
   detail_imdb_rule = "//a[@class='faqlink' and starts-with(@href,'https://www.imdb.com/title/')]/@href" # imdb链接
   detail_poster_rule = "//td/a/span[contains(text(),'简介')]/../../following-sibling::td//img[1]/@src" # 海报
   detail_tags_rule = "//td[contains(text(),'标签')]/following-sibling::td//text()" # 标签
   detail_hr_rule = "//h1/img[@class='hitandrun']/@title" # HR
   ```

9. 用户等级信息

   ```
   [level.User] # 固定格式 level.用户等级
   level_id = 1 # 用户等级ID，从1开始逐级+1
   level = "User" # 等级名称，与level.后面保持一致
   days = 0 # 升级所需周数
   uploaded = "0" # 升级所需上传量，格式：120GB，1024GB，3TB
   downloaded = "0" # 升级所需下载量，格式同上
   bonus = 0.0 # 升级所需魔力，整数的后面加上.0
   score = 0 # 升级所需做种积分
   ratio = 0.0 # 升级所需分享率
   torrents = 0 # 发种数目
   leeches = 0 # 做中暑
   seeding_delta = 0.0 # 做种
   keep_account = false # 是否达到保留账号等级
   graduation = false # 是否毕业
   rights = "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。" # 当前等级的权益
   
   [level.VIP] # VIP等级基本可以保持不动，按照站点信息修改等级权益即可
   level_id = 0
   level = "VIP"
   days = 0
   uploaded = "0"
   downloaded = "0"
   bonus = 0.0
   score = 0
   ratio = 0.0
   torrents = 0
   leeches = 0
   seeding_delta = 0.0
   keep_account = true
   graduation = true
   rights = "1.VIP贵宾会员期限内不受系统分享率限制，可以在贵宾期限内无限制下载。可以在贵宾期限内无视H&R规则，畅快下载；2.VIP贵宾会员期限内不会因分享率过低而被系统封禁，免除自动降级，贵宾期限内不计算下行流量；3.VIP贵宾会员期限内开启排行榜查看权限；4.VIP贵宾会员期限内无视每年的年终考核和年中考核；5.拥有捐赠者黄星标识的会员，每小时做种获取魔力值双倍的奖励。"
   
   ```

## xpath调试教程

1. F12打开开发者工具，选择元素选项，在内容上点一下

   ![img_3.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E8%87%AA%E5%AE%9A%E4%B9%89/img_3.png)

2. ctrl+F或者command+F打开查找框

   ![img_4.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E8%87%AA%E5%AE%9A%E4%B9%89/img_4.png)

3. 把XPATH规则填入进去按回车，后面会显示当前找到了几条元素，如果是1/1，恭喜，规则可以用，如果是0就是没找到，有很多条就是有很多规则相同的元素，需要自行分析一下修改规则，上面示例中就是在种子详情页获取种子下载链接的Xpath（获取页面中的a链接的网址，指定a链接的网址中包含download.php和passkey字段）

> tips：

> <font color=red>xpath查找时，浏览器要识别tbody，代码中需要将tbody去掉</font>

> <font color="orange">`/`表示从根节点开始</font>
>
> <font color="orange">`//`开始表示全文查找</font>
>
> <font color="orange">`./`代表当前节点开始找</font>
>
> <font color="orange">上一个是 `preceding-sibling::`</font>
>
> <font color="orange">下一个是 `following-sibling::`</font>
>
> 

## 自行测试

1. 修改容器日志等级为DEBUG，参考开启调试后台：[开启调试后台](/收割机/common.html#进入调试后台)
2. 将配置文件放入映射的sites文件夹中
3. 清理站点配置缓存
4. 添加站点
5. 签到，更新数据来一套，同时注意观察docker实时日志，找到出错的字段，然后修改