# 优选订阅生成器 WARP2sub

### 这个是一个通过 Cloudflare Workers 搭建，自动生成优选线路 Wireguard 节点订阅内容生成器

Telegram交流群：[@CMLiussss](https://t.me/CMLiussss)

# 免责声明

本免责声明适用于 GitHub 上的 “WARP2sub” 项目（以下简称“该项目”），项目链接为：https://github.com/cmliu/WARP2sub

### 用途
该项目被设计和开发仅供学习、研究和安全测试目的。它旨在为安全研究者、学术界人士和技术爱好者提供一个了解和实践网络通信技术的工具。

### 合法性
使用者在下载和使用该项目时，必须遵守当地法律和规定。使用者有责任确保他们的行为符合其所在地区的法律、规章以及其他适用的规定。

### 免责
1. 作为该项目的作者，我（以下简称“作者”）强调该项目应仅用于合法、道德和教育目的。
2. 作者不鼓励、不支持也不促进任何形式的非法使用该项目。如果发现该项目被用于非法或不道德的活动，作者将强烈谴责这种行为。
3. 作者对任何人或团体使用该项目进行的任何非法活动不承担责任。使用者使用该项目时产生的任何后果由使用者本人承担。
4. 作者不对使用该项目可能引起的任何直接或间接损害负责。
5. 通过使用该项目，使用者表示理解并同意本免责声明的所有条款。如果使用者不同意这些条款，应立即停止使用该项目。

作者保留随时更新本免责声明的权利，且不另行通知。最新的免责声明版本将会在该项目的 GitHub 页面上发布。

## 使用方法

### 1. 快速订阅

例如您的workers项目域名为：`WARP.fxxk.dedyn.io`；

- 添加 `TOKEN` 变量，快速订阅访问入口，默认值为: `auto` ，获取订阅器默认节点订阅地址即 `/auto` ，例如：
     ```url
     https://WARP.fxxk.dedyn.io/auto
     ```

### 2. 自定义订阅 

例如您的workers项目域名为：`WARP.fxxk.dedyn.io`；

 1. 生成指定优选IP:端口的订阅信息

  ```url
  https://[你的Workers域名]/sub?ip=[优选ip:端口]
  例如
  https://WARP.fxxk.dedyn.io/sub?ip=162.159.195.179:987
  ```

 2. 生成指定优选IP列表的订阅信息

  ```url
  https://[你的Workers域名]/sub?api=[优选IP.txt文件地址]
  例如
  https://WARP.fxxk.dedyn.io/sub?api=https://raw.githubusercontent.com/cmliu/WARP2sub/main/ip.txt
  ```

 3. 生成指定优选结果的订阅信息

  ```url
  https://[你的Workers域名]/sub??csv=[优选结果csv文件地址]
  例如
  https://WARP.fxxk.dedyn.io/sub?csv=https://raw.githubusercontent.com/cmliu/WARP2sub/main/result.csv
  ```

**注意: 默认延迟上限为180ms，高于这个延迟的结果不会生成订阅信息！**

## 变量说明
| 变量名 | 示例 | 备注 | 
|--------|---------|-----|
| TOKEN | auto | 快速订阅内置节点的订阅路径地址 /auto (支持多元素, 元素之间使用`,`作间隔)| 
| KEYURL | iNw48fdfcf4wrc9i7A21gyFG09a3E3NPydvb2ysTQGY= | 在线PrivateKey私钥库地址 | 
| ADD | 162.159.195.179:987#WARP优选 | 对应`addresses`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| ADDAPI | [https://raw.github.../ip.txt](https://raw.githubusercontent.com/cmliu/WARP2sub/main/ip.txt) | 对应`addressesapi`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| ADDCSV | [https://raw.github.../result.csv](https://raw.githubusercontent.com/cmliu/WARP2sub/main/result.csv) | 对应`addressescsv`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| DELAY | 180 |`addressescsv`测速结果延迟上限 | 
| TGTOKEN | 6894123456:XXXXXXXXXX0qExVsBPUhHDAbXXXXXqWXgBA | 发送TG通知的机器人token | 
| TGID | 6946912345 | 接收TG通知的账户数字ID | 
| SUBAPI | api.v1.mk | clash、singbox等 订阅转换后端 | 
| SUBCONFIG | [https://raw.github.../ACL4SSR_Online_Full_MultiMode.ini](https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) | clash、singbox等 订阅转换配置文件 | 
| SUBNAME | WARP2sub | 订阅生成器名称 | 
| PS | 【请勿测速】 | 节点名备注消息 | 
| URL302 | https://t.me/CMLiussss | 主页302跳转(支持多url, url之间使用`,`或 换行 作间隔, 小白别用) |
| URL | https://t.me/CMLiussss | 主页伪装(支持多url, url之间使用`,`或 换行 作间隔, 乱设容易触发反诈) |

## 已适配自适应订阅内容
   - [v2rayN](https://github.com/2dust/v2rayN)
   - 小火箭
   - clash.meta（[clash-verge-rev
](https://github.com/clash-verge-rev/clash-verge-rev)，[Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu)，~[clash-verge](https://github.com/zzzgydi/clash-verge/tree/main)~，ClashX Meta）
   - sing-box（SFI）

# 感谢
我自己的脑洞
