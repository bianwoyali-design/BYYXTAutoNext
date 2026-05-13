# BYYXTAutoNext

[English](README.md)

BYYXTAutoNext 是一个轻量级浏览器脚本，用于在博雅云学堂课程视频播放结束后，自动切换到课程目录中的下一节。

## 功能

- 监听当前视频的播放结束事件。
- 在课程目录中定位当前课节。
- 自动点击下一节课。
- 当前讲结束后自动展开下一讲；如果下一讲有 PPT/课件，会先打开课件，再切换到下一讲第一个视频。
- 可在页面右下角自定义视频播放倍速，切换下一节后继续保持该倍速。
- 在脚本启用或切换课节时，在页面右下角显示提示。

## 浏览器支持

- **Safari**：通过 AppleScript 注入 `auto_next.js`。每次打开或刷新课程播放页后都需要重新运行。
- **Chrome、Edge、Firefox**：通过 Tampermonkey 安装 `auto_next.user.js`，之后访问匹配的 BYYXT 课程页面时会自动运行。

## Safari 使用方法

1. 打开博雅云学堂课程播放页面：

```text
https://byyxt.pupedu.cn/.../c/pc/viewer...
```

![BYYXT 课程播放页](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/%E6%88%AA%E5%B1%8F2026-05-11%2023.22.48.png)

2. 下载或确保 [`auto_next.js`](auto_next.js) 和 [`inject_auto_next.applescript`](inject_auto_next.applescript) 位于同一个文件夹中。

3. 打开终端，进入该文件夹后运行：

```zsh
osascript inject_auto_next.applescript
```

4. 如果注入成功，终端会输出：

```text
auto-next installed
```

页面右下角也会出现启用提示：

![自动下一节启用提示](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/20260511232817431.png)

每次重新打开或刷新博雅云学堂课程播放页后，都需要重新运行这条命令。

## Chrome、Edge、Firefox 使用方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)。
2. 打开 Tampermonkey 控制面板。
3. 新建一个脚本。

![create a new script](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/62da21ba20956c787d6690382fe7533a.png)

4. 将 [`auto_next.user.js`](auto_next.user.js) 的内容复制到编辑器中。

![Add script](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/a4345b884d89400b2204ae8e57c15bf1.jpg)

5. 保存脚本。
6. 打开博雅云学堂课程播放页面：

```text
https://byyxt.pupedu.cn/.../c/pc/viewer...
```

之后每次打开匹配的 BYYXT 课程播放页时，Tampermonkey 都会自动注入脚本。

## 自定义播放倍速

脚本启用后，页面右下角会显示“倍速”输入框。输入想要的播放倍速并按回车，或在输入框失焦后应用；脚本会保存该倍速，并在自动切换到下一节时继续使用。
![](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/20260513234640077.png)

## 常见问题

- 如果 Safari 注入失败，请确认 Safari 已允许来自 Apple Events 的 JavaScript。
- 请保持播放器右侧课程目录可见，脚本需要通过目录定位下一节课。
- 如果下一讲处于折叠状态，脚本会先展开下一讲，再继续寻找 PPT/课件和第一个视频。
- 如果 Safari 页面刷新过，需要重新运行 AppleScript 注入命令。
