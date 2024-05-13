
// 部署完成后在网址后面加上这个，获取订阅器默认节点，/auto

let mytoken= ['auto'];//快速订阅访问入口, 留空则不启动快速订阅

// 设置优选地址，不带端口号默认987
let addresses = [
	//'engage.cloudflareclient.com:2408#WAPR官方直连',
	//'162.159.195.128:987#WARP',
];

// 设置优选地址api接口
let addressesapi = [
	//'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt', //可参考内容格式 自行搭建。
];

let DELAY = 180;//延迟上限
let addressescsv = [
	'https://raw.githubusercontent.com/cmliu/WARP2sub/main/result.csv', //warp-yxip测速结果文件。
];

let subconverter = "apiurl.v1.mk"; //在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry_WARP.ini"; //订阅转换配置文件
let BotToken ='';
let ChatID =''; 
let FileName = 'WARP2sub';
let SUBUpdateTime = 6;
let total = 99;//PB
let timestamp = 4102329600000;//2099-12-31
let WarpKeys = [//本地WARP密钥池
	//'iNw48fdfcf4wrc9i7A21gyFG09a3E3NPydvb2ysTQGY=',
];
let WarpKeyURL = 'https://raw.githubusercontent.com/cmliu/WARP2sub/main/WarpKey';//在线WARP密钥池URL
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
let EndPS = '';//节点名备注内容

async function sendMessage(type, ip, add_data = "") {
	if ( BotToken !== '' && ChatID !== ''){
		let msg = "";
		const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
		if (response.status == 200) {
			const ipInfo = await response.json();
			msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
		} else {
			msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
		}
	
		let url = "https://api.telegram.org/bot"+ BotToken +"/sendMessage?chat_id=" + ChatID + "&parse_mode=HTML&text=" + encodeURIComponent(msg);
		return fetch(url, {
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'Accept-Encoding': 'gzip, deflate, br',
				'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
			}
		});
	}
}

async function getADDAPI(api) {
	if (!api || api.length === 0) {
		return [];
	}

	let newapi = "";

	// 创建一个AbortController对象，用于控制fetch请求的取消
	const controller = new AbortController();

	const timeout = setTimeout(() => {
		controller.abort(); // 取消所有请求
	}, 2000); // 2秒后触发

	try {
		// 使用Promise.allSettled等待所有API请求完成，无论成功或失败
		// 对api数组进行遍历，对每个API地址发起fetch请求
		const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
			method: 'get', 
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': 'cmliu/WARP2sub'
			},
			signal: controller.signal // 将AbortController的信号量添加到fetch请求中，以便于需要时可以取消请求
		}).then(response => response.ok ? response.text() : Promise.reject())));

		// 遍历所有响应
		for (const response of responses) {
			// 检查响应状态是否为'fulfilled'，即请求成功完成
			if (response.status === 'fulfilled') {
				// 获取响应的内容
				const content = await response.value;
				newapi += content + '\n';
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		// 无论成功或失败，最后都清除设置的超时定时器
		clearTimeout(timeout);
	}

	const newAddressesapi = await ADD(newapi);

	// 返回处理后的结果
	return newAddressesapi;
}

async function getADDCSV() {
	if (!addressescsv || addressescsv.length === 0) {
		return [];
	}
	
	let newAddressescsv = [];
	
	for (const csvUrl of addressescsv) {
		try {
			const response = await fetch(csvUrl);
		
			if (!response.ok) {
				console.error('获取CSV地址时出错:', response.status, response.statusText);
				continue;
			}
		
			const text = await response.text();// 使用正确的字符编码解析文本内容
			let lines;
			if (text.includes('\r\n')){
				lines = text.split('\r\n');
			} else {
				lines = text.split('\n');
			}
		
			// 从第二行开始遍历CSV行
			for (let i = 1; i < lines.length; i++) {
				const columns = lines[i].split(',');
				const loss = columns[1];
				const delay = columns[2];
				//console.log("test",loss,delay);
				// 检测延迟
				if (parseFloat(loss) == 0 && parseFloat(delay) < DELAY) {
					const ip = (columns[0].split(':'))[0];
					const port = (columns[0].split(':'))[1];
			
					const formattedAddress = `${ip}:${port}#WARP优选IP`;
					newAddressescsv.push(formattedAddress);
				}
			}
		} catch (error) {
			console.error('获取CSV地址时出错:', error);
			continue;
		}
	}
	//console.log(newAddressescsv);
	return newAddressescsv;
}

async function nginx() {
	const text = `
	<!DOCTYPE html>
	<html>
	<head>
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>
	
	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
	return text ;
}

async function ADD(envadd) {
	var addtext = envadd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');	// 将空格、双引号、单引号和换行符替换为逗号
	//console.log(addtext);
	if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	if (addtext.charAt(addtext.length -1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	const add = addtext.split(',');
	//console.log(add);
	return add ;
}

let DNS = "1.1.1.1";
let PrivateKey = "AOyELXS8h+FmTpokaMobeIP/nVftDPu2qHuBAGb93ns=";
let ipv4 = "172.16.0.2/32";
let ipv6 ;
let MTU = "1280";
let PublicKey = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=";

export default {
	async fetch (request, env) {
		if (env.TOKEN) mytoken = await ADD(env.TOKEN);
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID; 
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;
		FileName = env.SUBNAME || FileName;
		EndPS = env.PS || EndPS;
		WarpKeyURL = env.KEYURL || WarpKeyURL
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);

		if (env.ADD) addresses = await ADD(env.ADD);
		if (env.ADDAPI) addressesapi = await ADD(env.ADDAPI);
		if (env.ADDCSV) addressescsv = await ADD(env.ADDCSV);
		DELAY = env.DELAY || DELAY;

		let UD = Math.floor(((timestamp - Date.now())/timestamp * 99 * 1099511627776 * 1024)/2);
		total = total * 1099511627776 * 1024;
		let expire= Math.floor(timestamp / 1000) ;
		if (mytoken.length > 0 && mytoken.some(token => url.pathname.includes(token))) {
			if (!userAgent.includes('subconverter')) await sendMessage("#WARP订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgentHeader}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
			if (WarpKeys.length == 0 && WarpKeyURL){
				try {
					const response = await fetch(WarpKeyURL); 
				
					if (!response.ok) {
						console.error('获取地址时出错:', response.status, response.statusText);
						return; // 如果有错误，直接返回
					}
				
					const text = await response.text();
					let lines;
					if (text.includes('\r\n')){
						lines = text.split('\r\n');
					} else {
						lines = text.split('\n');
					}
					// 过滤掉空行或只包含空白字符的行
					const nonEmptyLines = lines.filter(line => line.trim() !== '');
				
					WarpKeys = WarpKeys.concat(nonEmptyLines);
				} catch (error) {
					console.error('获取地址时出错:', error);
				}
			}

			if (WarpKeys.length == 0)WarpKeys = [`${PrivateKey},${PublicKey},${MTU},${ipv4},${ipv6}`];
/*
			console.log(`
			WarpKey: ${WarpKey}
			私钥: ${PrivateKey}
			公钥: ${PublicKey}
			MTU: ${MTU}
			ip4: ${ipv4}
			ip6: ${ipv6}
			`);
*/
		} else if (!url.pathname.includes("/sub")){
			const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
			if (envKey) {
				const URLs = await ADD(env[envKey]);
				const URL = URLs[Math.floor(Math.random() * URLs.length)];
				return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
			}
			//首页改成一个nginx伪装页
			return new Response(await nginx(), {
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				},
			});
		} else {
			PrivateKey = url.searchParams.get('key') || url.searchParams.get('privatekey') || PrivateKey;//私钥
			ipv4 = url.searchParams.get('ipv4') || ipv4;
			ipv6 = url.searchParams.get('ipv6') || ipv6;
			DNS = url.searchParams.get('dns') || DNS;
			MTU = url.searchParams.get('mtu') || MTU;
			PublicKey = url.searchParams.get('publicKey') || PublicKey;
			WarpKeys = [`${PrivateKey},${PublicKey},${MTU},${ipv4},${ipv6}`];
		}
		//console.log(WarpKeys);
		if (url.searchParams.has('ip')){
			addresses = [url.searchParams.get('ip')];
			//console.log(addresses);
		} else if (url.searchParams.has('api')){
			addressesapi = [url.searchParams.get('api')];
			addresses = await getADDAPI(addressesapi);
		} else if (url.searchParams.has('csv')){
			addressescsv = [url.searchParams.get('csv')];
			addresses = await getADDCSV();
		} else {
			const newAddressesapi = await getADDAPI(addressesapi);
			const newAddressescsv = await getADDCSV();
			addresses = addresses.concat(newAddressesapi);
			addresses = addresses.concat(newAddressescsv);
		}
		console.log(addresses);
		// 使用Set对象去重
		const uniqueAddresses = [...new Set(addresses)];
		//console.log(uniqueAddresses);
		
		let 汇总 = await v2rayN(uniqueAddresses,PrivateKey,PublicKey,MTU,ipv4,ipv6);
		汇总 += '\n' + await 小火箭(uniqueAddresses,PrivateKey,PublicKey,MTU,ipv4,ipv6);
		let 输出结果 = btoa(汇总);

		if (userAgent.includes(('CF-Workers-SUB').toLowerCase())){
			if (userAgent.includes('clash') || userAgent.includes('singbox') || userAgent.includes('sing-box')){
				汇总 = await clash(uniqueAddresses,PrivateKey,PublicKey,MTU,ipv4,ipv6);
				输出结果 = 汇总;
				return new Response(`${输出结果}`, {
					headers: { 
						//"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
						"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
					},
				});
			}
		} else if (url.searchParams.has('warp2clash')){
			const 输出结果 = await wgLink(uniqueAddresses,PrivateKey,PublicKey,MTU,ipv4,ipv6);
			return new Response(`${输出结果}`);
		}

		if (userAgent.includes('subconverter')){
			汇总 = await clash(uniqueAddresses,PrivateKey,PublicKey,MTU,ipv4,ipv6);
			输出结果 = 汇总;
		} else if (userAgent.includes('clash') || url.searchParams.has('clash')){
			const 输出结果 = await SUBAPI('clash',request);
			return new Response(`${输出结果}`, {
				headers: { 
					"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
					"content-type": "text/plain; charset=utf-8",
					"Profile-Update-Interval": `${SUBUpdateTime}`,
					"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
				},
			});
		} else if (userAgent.includes('singbox') || userAgent.includes('sing-box') || userAgentHeader == 'v2rayng' || url.searchParams.has('singbox') || url.searchParams.has('sb')){
			const 输出结果 = await SUBAPI('singbox',request);
			return new Response(`${输出结果}`, {
				headers: { 
					"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
					"content-type": "text/plain; charset=utf-8",
					"Profile-Update-Interval": `${SUBUpdateTime}`,
					"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
				},
			});
		}
		
		//console.log(汇总);
		return new Response(`${输出结果}`, {
			headers: { 
				//"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
				"content-type": "text/plain; charset=utf-8",
				"Profile-Update-Interval": `${SUBUpdateTime}`,
				"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
			},
		});
	}

}

async function v2rayN(优选IP数组,私钥,公钥,MTU,ipv4,ipv6) {
	const responseBody = 优选IP数组.map(ip => {
		const WarpKey = WarpKeys[Math.floor(Math.random() * WarpKeys.length)];
		//console.log(WarpKey);
		私钥 = WarpKey.split(',')[0] || 私钥;
		ipv4 = WarpKey.split(',')[3] || ipv4;
		ipv6 = WarpKey.split(',')[4] || ipv6;
		MTU = WarpKey.split(',')[2] || MTU;
		公钥 = WarpKey.split(',')[1] || 公钥;
		let port = "987";
		let id = 'WARP';
	
		const match = ip.match(regex);
		if (!match) {
			if (ip.includes(':') && ip.includes('#')) {
				const parts = ip.split(':');
				ip = parts[0];
				const subParts = parts[1].split('#');
				port = subParts[0];
				id = subParts[1];
			} else if (ip.includes(':')) {
				const parts = ip.split(':');
				ip = parts[0];
				port = parts[1];
			} else if (ip.includes('#')) {
				const parts = ip.split('#');
				ip = parts[0];
				id = parts[1];
			}
		
			if (id.includes(':')) {
				id = id.split(':')[0];
			}
		} else {
			ip = match[1];
			port = match[2] || port;
			id = match[3] || id;
		}

		let address = ipv4;
		if (ipv6 && ipv6!= "undefined") address += `,${ipv6}`;
		//console.log(address);
		const wireguardLink = `wireguard://${encodeURIComponent(私钥)}@${ip}:${port}/?publickey=${encodeURIComponent(公钥)}&address=${address}&mtu=${MTU}#${encodeURIComponent(id + EndPS)}`;
		return wireguardLink;
	}).join('\n');

	return responseBody;
}

async function 小火箭(优选IP数组,私钥,公钥,MTU,ipv4,ipv6) {
	const responseBody = 优选IP数组.map(ip => {
		const WarpKey = WarpKeys[Math.floor(Math.random() * WarpKeys.length)];
		//console.log(WarpKey);
		私钥 = WarpKey.split(',')[0] || 私钥;
		ipv4 = WarpKey.split(',')[3] || ipv4;
		ipv6 = WarpKey.split(',')[4] || ipv6;
		MTU = WarpKey.split(',')[2] || MTU;
		公钥 = WarpKey.split(',')[1] || 公钥;
		let port = "987";
		let id = 'WARP';
	
		const match = ip.match(regex);
		if (!match) {
			if (ip.includes(':') && ip.includes('#')) {
				const parts = ip.split(':');
				ip = parts[0];
				const subParts = parts[1].split('#');
				port = subParts[0];
				id = subParts[1];
			} else if (ip.includes(':')) {
				const parts = ip.split(':');
				ip = parts[0];
				port = parts[1];
			} else if (ip.includes('#')) {
				const parts = ip.split('#');
				ip = parts[0];
				id = parts[1];
			}
		
			if (id.includes(':')) {
				id = id.split(':')[0];
			}
		} else {
			ip = match[1];
			port = match[2] || port;
			id = match[3] || id;
		}

		let address = ipv4;
		if (ipv6 && ipv6!= "undefined") address += `,${ipv6}`;
		const wireguardLink = `wg://${ip}:${port}?publicKey=${公钥}&privateKey=${私钥}&ip=${address}&mtu=${MTU}&udp=1&reserved=0,0,0&flag=CDN#${encodeURIComponent(id + EndPS)}`;
		return wireguardLink;
	}).join('\n');

	return responseBody;
}

async function clash(优选IP数组,私钥,公钥,MTU,ipv4,ipv6) {
	const responseBody = 优选IP数组.map(ip => {
		const WarpKey = WarpKeys[Math.floor(Math.random() * WarpKeys.length)];
		//console.log(WarpKey);
		私钥 = WarpKey.split(',')[0] || 私钥;
		ipv4 = WarpKey.split(',')[3] || ipv4;
		ipv6 = WarpKey.split(',')[4] || ipv6;
		MTU = WarpKey.split(',')[2] || MTU;
		公钥 = WarpKey.split(',')[1] || 公钥;
		let port = "987";
		let id = 'WARP';
	
		const match = ip.match(regex);
		if (!match) {
			if (ip.includes(':') && ip.includes('#')) {
				const parts = ip.split(':');
				ip = parts[0];
				const subParts = parts[1].split('#');
				port = subParts[0];
				id = subParts[1];
			} else if (ip.includes(':')) {
				const parts = ip.split(':');
				ip = parts[0];
				port = parts[1];
			} else if (ip.includes('#')) {
				const parts = ip.split('#');
				ip = parts[0];
				id = parts[1];
			}
		
			if (id.includes(':')) {
				id = id.split(':')[0];
			}
		} else {
			ip = match[1];
			port = match[2] || port;
			id = match[3] || id;
		}

		const wireguardLink = `
- ip: ${ipv4.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0]}
  mtu: ${MTU}
  name: ${id}${EndPS}
  port: ${port}
  private-key: ${私钥}
  public-key: ${公钥}
  remote-dns-resolve: true
  dns: [ ${DNS} ]
  server: ${ip}
  type: wireguard
  udp: true`;
		return wireguardLink;
	}).join('\n');

	const yaml = `mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: '127.0.0.1:9090'
dns:${DNS}
proxies:${responseBody}
proxy-groups:
rules:`;

	return yaml;
}

async function SUBAPI(target,request) {
	const subconverterUrl = `https://${subconverter}/sub?target=${target}&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
	let subconverterContent = "";
	try {
		const subconverterResponse = await fetch(subconverterUrl);
		
		if (!subconverterResponse.ok) {
			throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
		}
		
		subconverterContent = await subconverterResponse.text();

	} catch (error) {
		return new Response(`Error: ${error.message}`, {
			status: 500,
			headers: { 'content-type': 'text/plain; charset=utf-8' },
		});
	}

	return subconverterContent;
}

async function wgLink(优选IP数组,私钥,公钥,MTU,ipv4,ipv6) {
	let WARP前置ID = "🌐 WARP前置代理";
	let 起始数值 = 0;
	const responseBody = 优选IP数组.map(ip => {
		const WarpKey = WarpKeys[Math.floor(Math.random() * WarpKeys.length)];
		//console.log(WarpKey);
		私钥 = WarpKey.split(',')[0] || 私钥;
		ipv4 = WarpKey.split(',')[3] || ipv4;
		ipv6 = WarpKey.split(',')[4] || ipv6;
		MTU = WarpKey.split(',')[2] || MTU;
		公钥 = WarpKey.split(',')[1] || 公钥;
		let port = "987";
		let id = 'WARP';

		const match = ip.match(regex);
		if (!match) {
			if (ip.includes(':') && ip.includes('#')) {
				const parts = ip.split(':');
				ip = parts[0];
				const subParts = parts[1].split('#');
				port = subParts[0];
				id = subParts[1];
			} else if (ip.includes(':')) {
				const parts = ip.split(':');
				ip = parts[0];
				port = parts[1];
			} else if (ip.includes('#')) {
				const parts = ip.split('#');
				ip = parts[0];
				id = parts[1];
			}

			if (id.includes(':')) {
				id = id.split(':')[0];
			}
		} else {
			ip = match[1];
			port = match[2] || port;
			id = match[3] || id;
		}
		起始数值 += 1;
		const 节点ID = `${id} ${起始数值}${EndPS}`;
		const wireguardLink = `  - {name: ${节点ID} , server: ${ip}, port: ${port}, reality-opts: {public-key: ${公钥}}, client-fingerprint: chrome, type: wireguard, public-key: ${公钥}, private-key: ${私钥}, ip: ${ipv4.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0]}, dns: [1.1.1.1],remote-dns-resolve: true, mtu: 1280, udp: true, dialer-proxy: "${WARP前置ID}"}`;

		return wireguardLink;
	}).join('\n');

	起始数值 = 0;
	const proxies = 优选IP数组.map(ip => {
		const WarpKey = WarpKeys[Math.floor(Math.random() * WarpKeys.length)];
		//console.log(WarpKey);
		私钥 = WarpKey.split(',')[0] || 私钥;
		ipv4 = WarpKey.split(',')[3] || ipv4;
		ipv6 = WarpKey.split(',')[4] || ipv6;
		MTU = WarpKey.split(',')[2] || MTU;
		公钥 = WarpKey.split(',')[1] || 公钥;
		let port = "987";
		let id = 'WARP';

		const match = ip.match(regex);
		if (!match) {
			if (ip.includes(':') && ip.includes('#')) {
				const parts = ip.split(':');
				ip = parts[0];
				const subParts = parts[1].split('#');
				port = subParts[0];
				id = subParts[1];
			} else if (ip.includes(':')) {
				const parts = ip.split(':');
				ip = parts[0];
				port = parts[1];
			} else if (ip.includes('#')) {
				const parts = ip.split('#');
				ip = parts[0];
				id = parts[1];
			}

			if (id.includes(':')) {
				id = id.split(':')[0];
			}
		} else {
			ip = match[1];
			port = match[2] || port;
			id = match[3] || id;
		}
		起始数值 += 1;
		const 节点ID = `${id} ${起始数值}${EndPS}`;
		const wireguardLink = `      - ${节点ID}`;

		return wireguardLink;
	}).join('\n');

	return `${WARP前置ID}\n\ncmliu/WARP2sub\n\n${proxies}\n\ncmliu/WARP2sub\n\n${responseBody}`;
}
