# BYYXTAutoNext

[简体中文](README.zh-CN.md)

BYYXTAutoNext is a small browser script that automatically opens the next BYYXT lesson when the current course video finishes.

## Features

- Listens for the current video to end.
- Finds the active lesson in the course catalog.
- Clicks the next lesson automatically.
- Expands the next lecture when the current lecture is finished; if the next lecture has a PPT/courseware item, it opens it first, then switches to the first video.
- Lets you set a custom video playback speed and keeps it when the next lesson opens.
- Shows a small bottom-right toast when the script is enabled or switches lessons.

## Browser Support

- **Safari**: inject `auto_next.js` with AppleScript. This must be run each time you open or reload the course player.
- **Chrome, Edge, and Firefox**: install `auto_next.user.js` with Tampermonkey. The script then runs automatically on matching BYYXT course pages.

## Safari

1. Open your BYYXT course player page:

```text
https://byyxt.pupedu.cn/.../c/pc/viewer...
```

![BYYXT course player](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/%E6%88%AA%E5%B1%8F2026-05-11%2023.22.48.png)

2. Download or keep [`auto_next.js`](auto_next.js) and [`inject_auto_next.applescript`](inject_auto_next.applescript) in the same folder.

3. Open Terminal, go to that folder, and run:

```zsh
osascript inject_auto_next.applescript
```

4. If the injection succeeds, Terminal prints:

```text
auto-next installed
```

You should also see a toast in the bottom-right corner of the course page:

![Auto next enabled toast](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/20260511232817431.png)

Run the command again every time you reopen or reload the BYYXT course player.

## Chrome, Edge, and Firefox

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open the Tampermonkey dashboard.
3. Create a new script.

![create a new script](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/62da21ba20956c787d6690382fe7533a.png)

4. Copy the contents of [`auto_next.user.js`](auto_next.user.js) into the editor.

![Add script](https://raw.githubusercontent.com/bianwoyali-design/Img/main/Img/a4345b884d89400b2204ae8e57c15bf1.jpg)

4. Save the script.
5. Open your BYYXT course player page:

```text
https://byyxt.pupedu.cn/.../c/pc/viewer...
```

Tampermonkey will inject the script automatically whenever you open a matching BYYXT course player page.

## Custom Playback Speed

After the script is enabled, a speed input appears in the bottom-right corner of the page. Enter the playback speed you want and press Enter, or leave the input to apply it. The script saves that speed and reapplies it after automatically switching to the next lesson.

## Troubleshooting

- In Safari, make sure JavaScript from Apple Events is allowed if the AppleScript injection fails.
- Keep the course catalog visible on the right side of the player so the script can find the next lesson.
- If the next lecture is collapsed, the script expands it before looking for the PPT/courseware item and first video.
- If the page was refreshed after injection in Safari, run the AppleScript command again.
