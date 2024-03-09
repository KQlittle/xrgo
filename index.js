const FILE_PATH = process.env.FILE_PATH || './temp'; // 运行文件夹，节点文件存放目录
const projectPageURL = process.env.URL || '';        // 填写项目域名可开启自动访问保活，非标端口的前缀是http://
const intervalInseconds = process.env.TIME || 120;   // 自动访问间隔时间（120秒）
const UUID = process.env.UUID || '89c13786-25aa-4520-b2e7-12cd60fb5202';
const NEZHA_SERVER = process.env.NEZHA_SERVER || 'nz.abc.cn';      // 哪吒3个变量不全不运行
const NEZHA_PORT = process.env.NEZHA_PORT || '5555';              // 哪吒端口为{443,8443,2096,2087,2083,2053}其中之一时开启tls
const NEZHA_KEY = process.env.NEZHA_KEY || '';                   // 哪吒客户端密钥
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || '';              // 固定隧道域名，留空即启用临时隧道
const ARGO_AUTH = process.env.ARGO_AUTH || '';                 // 固定隧道json或token，留空即启用临时隧道
const CFIP = process.env.CFIP || 'government.se';             // 优选域名或优选ip
const CFPORT = process.env.CFPORT || 443;                    // 节点端口
const NAME = process.env.NAME || 'Vls';                     // 节点名称
const ARGO_PORT = process.env.ARGO_PORT || 8080;           // Argo端口，使用固定隧道token需和cf后台设置的端口对应
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000; // 节点订阅端口，若无法订阅请手动改为分配的端口

const express = require('express');
const app = express();
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const {execSync} = require('child_process');
!fs.existsSync(FILE_PATH) ? (fs.mkdirSync(FILE_PATH), console.log(FILE_PATH + ' is created')) : console.log(FILE_PATH + ' already exists');
function cleanupOldFiles() {
    pathsToDelete.forEach(_0x2f7eef => {
        const _0x559ccb = path.join(FILE_PATH, _0x2f7eef);
        fs.unlink(_0x559ccb, _0x1cd818 => {
            _0x1cd818 ? console.error('Skip Delete ' + _0x559ccb) : console.log(_0x559ccb + ' deleted');
        });
    });
}
cleanupOldFiles();
app.get('/', function (_0x996038, _0xcc51f5) {
    _0xcc51f5.send('Hello world!');
});
function generateConfig() {
    const _0x328f09 = {
        'log': {
            'access': '/dev/null',
            'error': '/dev/null',
            'loglevel': 'none'
        },
        'inbounds': [
            {
                'port': ARGO_PORT,
                'protocol': 'vless',
                'settings': {
                    'clients': [{
                            'id': UUID,
                            'flow': 'xtls-rprx-vision'
                        }],
                    'decryption': 'none',
                    'fallbacks': [
                        { 'dest': 3001 },
                        {
                            'path': '/vless',
                            'dest': 3002
                        },
                        {
                            'path': '/vmess',
                            'dest': 3003
                        },
                        {
                            'path': '/trojan',
                            'dest': 3004
                        }
                    ]
                },
                'streamSettings': { 'network': 'tcp' }
            },
            {
                'port': 3001,
                'listen': '127.0.0.1',
                'protocol': 'vless',
                'settings': {
                    'clients': [{ 'id': UUID }],
                    'decryption': 'none'
                },
                'streamSettings': {
                    'network': 'ws',
                    'security': 'none'
                }
            },
            {
                'port': 3002,
                'listen': '127.0.0.1',
                'protocol': 'vless',
                'settings': {
                    'clients': [{
                            'id': UUID,
                            'level': 0
                        }],
                    'decryption': 'none'
                },
                'streamSettings': {
                    'network': 'ws',
                    'security': 'none',
                    'wsSettings': { 'path': '/vless' }
                },
                'sniffing': {
                    'enabled': true,
                    'destOverride': [
                        'http',
                        'tls',
                        'quic'
                    ],
                    'metadataOnly': false
                }
            },
            {
                'port': 3003,
                'listen': '127.0.0.1',
                'protocol': 'vmess',
                'settings': {
                    'clients': [{
                            'id': UUID,
                            'alterId': 0
                        }]
                },
                'streamSettings': {
                    'network': 'ws',
                    'wsSettings': { 'path': '/vmess' }
                },
                'sniffing': {
                    'enabled': true,
                    'destOverride': [
                        'http',
                        'tls',
                        'quic'
                    ],
                    'metadataOnly': false
                }
            },
            {
                'port': 3004,
                'listen': '127.0.0.1',
                'protocol': 'trojan',
                'settings': { 'clients': [{ 'password': UUID }] },
                'streamSettings': {
                    'network': 'ws',
                    'security': 'none',
                    'wsSettings': { 'path': '/trojan' }
                },
                'sniffing': {
                    'enabled': true,
                    'destOverride': [
                        'http',
                        'tls',
                        'quic'
                    ],
                    'metadataOnly': false
                }
            }
        ],
        'dns': { 'servers': ['https+local://8.8.8.8/dns-query'] },
        'outbounds': [
            { 'protocol': 'freedom' },
            {
                'tag': 'WARP',
                'protocol': 'wireguard',
                'settings': {
                    'secretKey': 'YFYOAdbw1bKTHlNNi+aEjBM3BO7unuFC5rOkMRAz9XY=',
                    'address': [
                        '172.16.0.2/32',
                        '2606:4700:110:8a36:df92:102a:9602:fa18/128'
                    ],
                    'peers': [{
                            'publicKey': 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
                            'allowedIPs': [
                                '0.0.0.0/0',
                                '::/0'
                            ],
                            'endpoint': '162.159.193.10:2408'
                        }],
                    'reserved': [
                        78,
                        135,
                        76
                    ],
                    'mtu': 1280
                }
            }
        ],
        'routing': {
            'domainStrategy': 'AsIs',
            'rules': [{
                    'type': 'field',
                    'domain': [
                        'domain:openai.com',
                        'domain:ai.com'
                    ],
                    'outboundTag': 'WARP'
                }]
        }
    };
    fs.writeFileSync(path.join(FILE_PATH, 'config.json'), JSON.stringify(_0x328f09, null, 2));
}
generateConfig();
function getSystemArchitecture() {
    const _0x3a8f5f = os.arch();
    return _0x3a8f5f === 'arm' || _0x3a8f5f === 'arm64' || _0x3a8f5f === 'aarch64' ? 'arm' : 'amd';
}
function downloadFile(_0x5d939f, _0x2ef71d, _0x4319c8) {
    const _0x25cb31 = path.join(FILE_PATH, _0x5d939f);
    const _0x5ea2ef = fs.createWriteStream(_0x25cb31);
    axios({
        'method': 'get',
        'url': _0x2ef71d,
        'responseType': 'stream'
    }).then(_0x70ebcc => {
        _0x70ebcc.data.pipe(_0x5ea2ef);
        _0x5ea2ef.on('finish', () => {
            _0x5ea2ef.close();
            console.log('Download ' + _0x5d939f + ' successfully');
            _0x4319c8(null, _0x5d939f);
        });
        _0x5ea2ef.on('error', _0x8b8668 => {
            fs.unlink(_0x25cb31, () => {
            });
            const _0x497d41 = 'Download ' + _0x5d939f + ' failed: ' + _0x8b8668.message;
            console.error(_0x497d41);
            _0x4319c8(_0x497d41);
        });
    }).catch(_0x3f62eb => {
        const _0xa68428 = 'Download ' + _0x5d939f + ' failed: ' + _0x3f62eb.message;
        console.error(_0xa68428);
        _0x4319c8(_0xa68428);
    });
}
async function downloadFilesAndRun() {
    const _0x1d6114 = getSystemArchitecture();
    const _0x11955c = getFilesForArchitecture(_0x1d6114);
    if (_0x11955c.length === 0) {
        console.log('Can\'t find a file for the current architecture');
        return;
    }
    const _0x1e387a = _0x11955c.map(_0x380dd5 => {
        return new Promise((_0x144286, _0x453fa3) => {
            downloadFile(_0x380dd5.fileName, _0x380dd5.fileUrl, (_0x105a04, _0x194a6f) => {
                _0x105a04 ? _0x453fa3(_0x105a04) : _0x144286(_0x194a6f);
            });
        });
    });
    try {
        await Promise.all(_0x1e387a);
    } catch (_0x25ff74) {
        console.error('Error downloading files:', _0x25ff74);
        return;
    }
    function _0xf08f13(_0x5d8de4) {
        const _0x3927d9 = 509;
        _0x5d8de4.forEach(_0x472ae4 => {
            const _0x7ad4b4 = path.join(FILE_PATH, _0x472ae4);
            fs.chmod(_0x7ad4b4, _0x3927d9, _0x5ebaa2 => {
                _0x5ebaa2 ? console.error('Empowerment failed for ' + _0x7ad4b4 + ': ' + _0x5ebaa2) : console.log('Empowerment success for ' + _0x7ad4b4 + ': ' + _0x3927d9.toString(8));
            });
        });
    }
    _0xf08f13(_0x1dbf83);
    let _0xb2c13 = '';
    if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
        const _0x137e19 = [
            '443',
            '8443',
            '2096',
            '2087',
            '2083',
            '2053'
        ];
        _0x137e19.includes(NEZHA_PORT) ? _0xb2c13 = '--tls' : _0xb2c13 = '';
        const _0x3701ad = 'nohup ' + FILE_PATH + '/npm -s ' + NEZHA_SERVER + ':' + NEZHA_PORT + ' -p ' + NEZHA_KEY + ' ' + _0xb2c13 + ' >/dev/null 2>&1 &';
        try {
            await exec(_0x3701ad);
            console.log('npm is running');
            await new Promise(_0x410e71 => setTimeout(_0x410e71, 1000));
        } catch (_0x5e1264) {
            console.error('npm running error: ' + _0x5e1264);
        }
    } else
        console.log('NEZHA variable is empty,skip running');
    const _0x4041c4 = 'nohup ' + FILE_PATH + '/web -c ' + FILE_PATH + '/config.json >/dev/null 2>&1 &';
    try {
        await exec(_0x4041c4);
        console.log('web is running');
        await new Promise(_0x2f3150 => setTimeout(_0x2f3150, 1000));
    } catch (_0x529233) {
        console.error('web running error: ' + _0x529233);
    }
    if (fs.existsSync(path.join(FILE_PATH, 'bot'))) {
        let _0x15dbbb;
        if (ARGO_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/))
            _0x15dbbb = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ' + ARGO_AUTH;
        else
            ARGO_AUTH.match(/TunnelSecret/) ? _0x15dbbb = 'tunnel --edge-ip-version auto --config ' + FILE_PATH + '/tunnel.yml run' : _0x15dbbb = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ' + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ARGO_PORT;
        try {
            await exec('nohup ' + FILE_PATH + '/bot ' + _0x15dbbb + ' >/dev/null 2>&1 &');
            console.log('bot is running');
            await new Promise(_0x37f865 => setTimeout(_0x37f865, 2000));
        } catch (_0x3f2d11) {
            console.error('Error executing command: ' + _0x3f2d11);
        }
    }
    await new Promise(_0x5e618d => setTimeout(_0x5e618d, 5000));
}
function getFilesForArchitecture(_0x503ca8) {
    if (_0x503ca8 === 'arm')
        return [
            {
                'fileName': 'npm',
                'fileUrl': 'https://github.com/eooce/test/releases/download/ARM/swith'
            },
            {
                'fileName': 'web',
                'fileUrl': 'https://github.com/eooce/test/releases/download/ARM/web'
            },
            {
                'fileName': 'bot',
                'fileUrl': 'https://github.com/eooce/test/releases/download/arm64/bot13'
            }
        ];
    else {
        if (_0x503ca8 === 'amd')
            return [
                {
                    'fileName': 'npm',
                    'fileUrl': 'https://github.com/eooce/test/releases/download/amd64/npm'
                },
                {
                    'fileName': 'web',
                    'fileUrl': 'https://github.com/eooce/test/releases/download/amd64/web'
                },
                {
                    'fileName': 'bot',
                    'fileUrl': 'https://github.com/eooce/test/releases/download/amd64/bot13'
                }
            ];
    }
    return [];
}
function argoType() {
    if (!ARGO_AUTH || !ARGO_DOMAIN) {
        console.log('ARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels');
        return;
    }
    if (ARGO_AUTH.includes('TunnelSecret')) {
        fs.writeFileSync(path.join(FILE_PATH, 'tunnel.json'), ARGO_AUTH);
        const _0x48c344 = '\n  tunnel: ' + ARGO_AUTH.split('"')[11] + '\n  credentials-file: ' + path.join(FILE_PATH, 'tunnel.json') + '\n  protocol: http2\n  \n  ingress:\n    - hostname: ' + ARGO_DOMAIN + '\n      service: http://localhost:' + ARGO_PORT + '\n      originRequest:\n        noTLSVerify: true\n    - service: http_status:404\n  ';
        fs.writeFileSync(path.join(FILE_PATH, 'tunnel.yml'), _0x48c344);
    } else
        console.log('ARGO_AUTH mismatch TunnelSecret,use token connect to tunnel');
}
argoType();
async function extractDomains() {
    let _0x131c98;
    if (ARGO_AUTH && ARGO_DOMAIN)
        _0x131c98 = ARGO_DOMAIN, console.log('ARGO_DOMAIN:', _0x131c98), await _0x3a57f7(_0x131c98);
    else
        try {
            const _0x1a9076 = fs.readFileSync(path.join(FILE_PATH, 'boot.log'), 'utf-8');
            const _0x3008dd = _0x1a9076.split('\n');
            const _0x542d35 = [];
            _0x3008dd.forEach(_0x50cf2e => {
                const _0x47c770 = _0x50cf2e.match(/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
                if (_0x47c770) {
                    const _0x5de6c6 = _0x47c770[1];
                    _0x542d35.push(_0x5de6c6);
                }
            });
            if (_0x542d35.length > 0)
                _0x131c98 = _0x542d35[0], console.log('ArgoDomain:', _0x131c98), await _0x3a57f7(_0x131c98);
            else {
                console.log('ArgoDomain not found, re-running bot to obtain ArgoDomain');
                fs.unlinkSync(path.join(FILE_PATH, 'boot.log'));
                await new Promise(_0x334903 => setTimeout(_0x334903, 2000));
                const _0x5687ca = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ' + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ARGO_PORT;
                try {
                    await exec('nohup ' + path.join(FILE_PATH, 'bot') + ' ' + _0x5687ca + ' >/dev/null 2>&1 &');
                    console.log('bot is running');
                    await new Promise(_0x5267a8 => setTimeout(_0x5267a8, 3000));
                    await extractDomains();
                } catch (_0x2dd2e7) {
                    console.error('Error executing command: ' + _0x2dd2e7);
                }
            }
        } catch (_0xb00cd3) {
            console.error('Error reading boot.log:', _0xb00cd3);
        }
    async function _0x3a57f7(_0x1d2dcc) {
        const _0x5a3b2a = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { 'encoding': 'utf-8' });
        const _0x23754f = _0x5a3b2a.trim();
        return new Promise(_0x3ea823 => {
            setTimeout(() => {
                const _0x300f85 = {
                    'ps': NAME + '-' + _0x23754f,
                    'add': CFIP,
                    'port': CFPORT,
                    'id': UUID,
                    'host': _0x1d2dcc,
                    'sni': _0x1d2dcc
                };
                const _0x43106c = '\nvless://' + UUID + '@' + CFIP + ':' + CFPORT + '?encryption=none&security=tls&sni=' + _0x1d2dcc + '&type=ws&host=' + _0x1d2dcc + '&path=%2Fvless?ed=2048#' + NAME + '-' + _0x23754f + '\n  \nvmess://' + Buffer.from(JSON.stringify(_0x300f85)).toString('base64') + '\n  \ntrojan://' + UUID + '@' + CFIP + ':' + CFPORT + '?security=tls&sni=' + _0x1d2dcc + '&type=ws&host=' + _0x1d2dcc + '&path=%2Ftrojan?ed=2048#' + NAME + '-' + _0x23754f + '\n    ';
                console.log(Buffer.from(_0x43106c).toString('base64'));
                const _0x11c48f = path.join(FILE_PATH, 'sub.txt');
                fs.writeFileSync(_0x11c48f, Buffer.from(_0x43106c).toString('base64'));
                console.log('File saved successfully');
                console.log('Thank you for using this script,enjoy!');
                app.get('/sub', (_0x42ee65, _0x4e31fa) => {
                    const _0x9103 = Buffer.from(_0x43106c).toString('base64');
                    _0x4e31fa.set('Content-Type', 'text/plain; charset=utf-8');
                    _0x4e31fa.send(_0x9103);
                });
                _0x3ea823(_0x43106c);
            }, 2000);
        });
    }
}
const bootLogPath = path.join(FILE_PATH, 'boot.log');
const configPath = path.join(FILE_PATH, 'config.json');
function cleanFiles() {
    setTimeout(() => {
        exec('rm -rf ' + bootLogPath + ' ' + configPath, (_0x5ab426, _0x20dbc4, _0x56886f) => {
            if (_0x5ab426) {
                console.error('Error while deleting files: ' + _0x5ab426);
                return;
            }
            console.clear();
            console.log('App is running');
            console.log('Thank you for using this script,enjoy!');
        });
    }, 120000);
}
cleanFiles();
let hasLoggedEmptyMessage = false;
async function visitProjectPage() {
    try {
        if (!projectPageURL || !intervalInseconds) {
            !hasLoggedEmptyMessage && (console.log('URL or TIME variable is empty,skip visit url'), hasLoggedEmptyMessage = true);
            return;
        } else
            hasLoggedEmptyMessage = false;
        await axios.get(projectPageURL);
        console.clear();
        console.log('Page visited successfully');
    } catch (_0xbd8842) {
        console.error('Error visiting project page:', _0xbd8842.message);
    }
}
setInterval(visitProjectPage, intervalInseconds * 1000);
async function startserver() {
    await downloadFilesAndRun();
    await extractDomains();
    visitProjectPage();
}
startserver();
app.listen(PORT, () => console.log('Http server is running on port:' + PORT + '!'));
