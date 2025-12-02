import {viteBundler} from '@vuepress/bundler-vite'
import {defaultTheme} from '@vuepress/theme-default'
import {defineUserConfig} from 'vuepress'

export default defineUserConfig({
    bundler: viteBundler(),
    theme: defaultTheme(
        {
            sidebar: [
                {
                    text: '收割机',
                    children: [
                        '/收割机/app.md',
                        '/收割机/home.md',
                        '/收割机/install.md',
                        '/收割机/import.md',
                        '/收割机/使用指南.md',
                        '/收割机/common.md',
                        '/收割机/ssh.md',
                        '/收割机/wechat.md',
                        '/收割机/custom-add.md',
                    ]
                },
                {
                    text: 'Unraid',
                    children: [
                        '/Unraid/wire-guard.md',
                        '/Unraid/wireguard-lan2lan.md',
                    ]
                },
                {
                    text: '通用教程',
                    children: [
                        '/通用教程/aliyun.md',
                        '/通用教程/baidu-ocr.md',
                        '/通用教程/CookieCloud.md',
                        '/通用教程/password.md',
                        '/通用教程/tailscale-nat.md',
                        '/通用教程/telegram-bot.md',
                        '/通用教程/termnal.md',
                        '/通用教程/tunnel.md',
                        '/通用教程/wxpusher.md'
                    ]
                }
            ],

        }
    ),
    themeComfig: {
        // sidebar: false,
        // nav: {
        //     text: '收割机文档',
        //     link: "/all.html"
        // },
    },

    lang: 'zh-CN',
    title: '你好，收割机！',
    description: ' 收割机文档',

    pages: ['README.md'],
})