# dsh-desktop-folders

> 个人自用插件，代码和文档由 AI 参与编写，不承诺维护。使用前请先备份 DSH 配置。

[DSH Desktop](https://github.com/Huakira/dsh-desktop)（Mac Electron 壳）的配套 DSH 插件：在 DSH 设置页里管理连接给壳的本地信任文件夹（Claude Cowork 式工作目录）。

连接过的文件夹对 DSH 直接可读写，不再逐个文件授权；也可以随时在设置页撤销。所有连接/撤销/删除操作都由壳弹系统确认框，删除永远只进废纸篓。

## 工作方式

- 壳端把 `window.dshBridge`（folders / connect / revoke / delete 等方法）注入页面；本插件读取该桥，把文件夹列表渲染成设置页。
- 在浏览器、iOS 等没有桥的环境里，页面会提示"仅 DSH Desktop 可用"，不影响其他功能。
- 纯 UI 插件，宿主侧 `apply()` 为空，全部逻辑在 `client.js`。

## 安装

```sh
dsh plugin --profile web add @huakirax/dsh-desktop-folders
```

或把 `"@huakirax/dsh-desktop-folders": "^0.2.3"` 加进 profile 的 `package.json` 依赖与 `dsh.profile.bundles` 后 `pnpm install`。

## 壳端要求

需要 dsh-desktop v0.3.0 及以上（v0.3 引入了持久信任文件夹与确认-废纸篓删除）。

## LICENSE

MIT © Huakira。AI 参与编写的自用插件，文档由 AI 生成，使用前请先备份。
