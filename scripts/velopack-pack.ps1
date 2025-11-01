param()

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $root '..') | Select-Object -ExpandProperty Path
Set-Location $projectRoot

$packageJson = Get-Content -Raw 'package.json' | ConvertFrom-Json
$version = $packageJson.version

$packDir = Resolve-Path 'out/Mcp Market-win32-x64' -ErrorAction SilentlyContinue
if (-not $packDir) {
  throw "Pack directory 'out/Mcp Market-win32-x64' not found. Run `npm run make` first."
}

$outputDir = Join-Path $projectRoot 'velopack/Releases'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Write-Host "Packing MCP Market v$version from '$packDir'..."

vpk pack `
  --packId 'com.superwindcloud.mcp-market' `
  --packVersion $version `
  --packDir $packDir `
  --mainExe 'Mcp Market.exe' `
  --packTitle 'MCP Market' `
  --packAuthors 'SuperWindCloud' `
  --outputDir $outputDir

Write-Host "Velopack packages generated in '$outputDir'."
