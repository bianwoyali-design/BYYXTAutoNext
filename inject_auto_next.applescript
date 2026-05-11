use framework "Foundation"

set jsPath to "auto_next.js"
set currentDirectory to ((current application's NSFileManager's defaultManager())'s currentDirectoryPath()) as text
set currentDirectoryURL to current application's NSURL's fileURLWithPath:currentDirectory isDirectory:true
set jsURL to current application's NSURL's fileURLWithPath:jsPath relativeToURL:currentDirectoryURL
set jsString to current application's NSString's stringWithContentsOfURL:jsURL encoding:(current application's NSUTF8StringEncoding) |error|:(missing value)
if jsString is missing value then error "Cannot read " & jsPath & " from " & currentDirectory
set jsCode to jsString as text

tell application "Safari"
	do JavaScript jsCode in current tab of front window
end tell
