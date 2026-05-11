set jsPath to "/Users/zho/Documents/Codex/2026-05-10/new-chat/auto_next.js"
set jsCode to read POSIX file jsPath as «class utf8»
tell application "Safari"
	do JavaScript jsCode in current tab of front window
end tell
