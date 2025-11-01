set export := true


default:
    echo 'Hello, world!'

push:
    git add . && git commit -m "update" && git push repo main && git push github main 

clear:
    git rm --cached -r .


publish:
    npm run publish

pack:
	pwsh -NoLogo -NoProfile -File ./scripts/velopack-pack.ps1 &&   ./velopack/Releases/com.superwindcloud.mcp-market-win-Setup.exe

upload:
	pwsh -NoLogo -NoProfile -File ./scripts/velopack-upload.ps1
