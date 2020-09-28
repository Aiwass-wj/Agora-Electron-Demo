// 此处需要对webpack配置和webpack-chain有一定了解，可以直接复制使用也可以按需修改，文档：https://cli.vuejs.org/zh/config/
const os = require("os");

const config = {
    configureWebpack: {
        module: {
            // 调整对.node文件的加载路径
            rules: [{
                test: /\.node$/,
                loader: 'native-ext-loader',
                options: {
                    rewritePath: os.platform() === 'win32' ? './resources' : '../Resources'
                }
            }]
        }
    },
    chainWebpack: config => {
        // 开发模式下告诉webpack排除agora-electron-sdk并在运行时加载，相关文档：https://webpack.js.org/configuration/externals/#root
        if (process.env.NODE_ENV !== 'production') {
            config.externals({
                "agora-electron-sdk": "commonjs2 agora-electron-sdk",
            });
        }
      	// 告诉webpack处理.node文件后缀
        config.resolve.extensions.add('.node');
    },
    pluginOptions: {
      	// electron-builder的配置项,文档：https://www.electron.build/configuration/configuration
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                appId: "com.agora.demo",
                productName: "Agora Electron Demo",
                directories: {
                    app: "./dist_electron/bundled",
                    output: "dist_electron"
                },
                asar: true,
                mac: {
                    target: [
                        "dmg"
                    ],
                    hardenedRuntime: false,
                    extraFiles:[{
                        "from": "node_modules/agora-electron-sdk/build/Release",
                        "to": './Resources'
                    }]
                },
                dmg: {
                    window: {
                        width: 540,
                        height: 380
                    },
                    contents: [{
                            x: 410,
                            y: 180,
                            type: "link",
                            path: "/Applications"
                        },
                        {
                            x: 130,
                            y: 180,
                            type: "file"
                        }
                    ],
                    iconSize: 128
                },
                win: {
                    target: [{
                        "target": "nsis",
                        "arch": [
                            "ia32",
                            // "x64"
                        ]
                    }],
                    extraFiles: [{
                        "from": "node_modules/agora-electron-sdk/build/Release",
                        "to": './resources'
                    }]
                },
                nsis: {
                    oneClick: false, // 是否一键安装
                    allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    allowToChangeInstallationDirectory: true, // 允许修改安装目录
                    createDesktopShortcut: true, // 创建桌面图标
                },
            }
        }
    }
}

module.exports = config;
