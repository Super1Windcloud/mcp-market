; MCP Market Inno Setup Installer
; Requires Inno Setup 6 with Unicode support.
; Build with: `iscc scripts\mcp-market-installer.iss`

#define ScriptsDir RemoveBackslash(SourcePath)
#define ProjectRoot ExtractFileDir(ScriptsDir)
#define BuildDir ProjectRoot + "\out\mcp-market-win32-x64"
#define InstallersDir ProjectRoot + "\out\installers"
#define IconFile ProjectRoot + "\public\icon.ico"
#define WelcomeBitmap ProjectRoot + "\public\installer\inno-banner.bmp"
#define SmallBitmap ProjectRoot + "\public\installer\inno-small.bmp"
#define LicenseFile ProjectRoot + "\LICENSE"

#define AppId "MCPMarket"
#define AppName "MCP Market"
#define AppVersion "1.0.0"
#define AppExe "mcp-market.exe"
#define AppPublisher "Superwindcloud"
#define AppURL "https://github.com/Super1WindCloud/mcp-market.git"

#ifnexist "{#BuildDir}\{#AppExe}"
  #pragma message "Warning: Build output not found at {#BuildDir}\{#AppExe}. Run `npm run make` before packaging."
#endif

[Setup]
AppId={#AppId}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}
AppUpdatesURL={#AppURL}
AppMutex={#AppId}
DefaultDirName={localappdata}\Programs\{#AppName}
DisableProgramGroupPage=no
DefaultGroupName={#AppName}
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir={#InstallersDir}
OutputBaseFilename=mcp-market-{#AppVersion}-inno-setup
SetupIconFile={#IconFile}
UninstallDisplayIcon={app}\{#AppExe}
LicenseFile={#LicenseFile}
PrivilegesRequired=lowest
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
WizardSizePercent=110
WizardImageStretch=yes
WizardImageFile={#WelcomeBitmap}
WizardSmallImageFile={#SmallBitmap}
AppCopyright=© {#AppPublisher}
DisableDirPage=no
DisableWelcomePage=no
DisableReadyMemo=no
SetupLogging=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
#ifexist "compiler:Languages\ChineseSimplified.isl"
Name: "schinese"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
#endif

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: unchecked
Name: "startwithwindows"; Description: "Launch MCP Market on startup"; GroupDescription: "Automation:"; Flags: unchecked

[Files]
Source: "{#BuildDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\MCP Market"; Filename: "{app}\{#AppExe}"
Name: "{group}\Uninstall MCP Market"; Filename: "{uninstallexe}"
Name: "{commondesktop}\MCP Market"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon

[Registry]
Root: HKCU; Subkey: "Software\MCP Market"; ValueType: string; ValueName: "InstallDir"; ValueData: "{app}"
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "MCP Market"; ValueData: """{app}\{#AppExe}"""; Tasks: startwithwindows; Flags: uninsdeletevalue

[Run]
Filename: "{app}\{#AppExe}"; Description: "Launch {#AppName}"; Flags: postinstall nowait skipifsilent

[UninstallRun]
Filename: "{cmd}"; Parameters: "/c taskkill /IM {#AppExe} /F"; RunOnceId: "CloseMCPMarket"

[Code]
procedure CurPageChanged(CurPageID: Integer);
begin
  if CurPageID = wpFinished then
  begin
    WizardForm.FinishedLabel.Font.Style := [fsBold];
    WizardForm.FinishedLabel.Font.Size := 11;
    WizardForm.FinishedHeadingLabel.Font.Size := 14;
  end;
end;

procedure InitializeWizard();
begin
  WizardForm.WelcomeLabel2.Font.Style := [fsBold];
  WizardForm.WelcomeLabel2.Font.Color := $00FFCC;
  WizardForm.FinishedLabel.Font.Color := $00C0FF;
  WizardForm.PageDescriptionLabel.Font.Color := $00E0FF;
end;
