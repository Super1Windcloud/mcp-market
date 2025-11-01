param()

$ErrorActionPreference = 'Stop'

if (-not $env:GITHUB_TOKEN) {
  throw 'GITHUB_TOKEN is not set.'
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $root '..') | Select-Object -ExpandProperty Path
Set-Location $projectRoot

$packageJson = Get-Content -Raw 'package.json' | ConvertFrom-Json
$version = $packageJson.version
$releaseName = "MCP Market v$version"

$outputDir = Join-Path $projectRoot 'velopack/Releases'

if (-not (Test-Path $outputDir)) {
  throw "Output directory '$outputDir' not found. Run `just pack` first."
}

Write-Host "Uploading Velopack packages from '$outputDir' to GitHub release $releaseName..."

vpk upload github `
  --outputDir $outputDir `
  --repoUrl 'https://github.com/Super1WindCloud/mcp-market' `
  --token $env:GITHUB_TOKEN `
  --publish `
  --releaseName $releaseName `
  --tag "v$version"

Write-Host "Upload complete."
