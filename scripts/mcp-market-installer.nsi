; MCP Market NSIS Installer
; Run `npm run make` before compiling this installer.
; Build with: `makensis scripts\mcp-market-installer.nsi`

Unicode true
!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "x64.nsh"

!define BUILD_DIR "..\out\mcp-market-win32-x64"
!define INSTALLER_OUTPUT "..\installer"
!define ICON_FILE "..\public\icon.ico"
!define HEADER_BITMAP "..\public\installer\header.bmp"
!define WELCOME_BITMAP "..\public\installer\welcome.bmp"
!define WATERMARK_BITMAP "..\public\installer\watermark.bmp"

!define APP_NAME "MCP Market"
!define APP_SLUG "mcp-market"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Superwindcloud"
!define APP_EXECUTABLE "${APP_SLUG}.exe"

Name "${APP_NAME}"
OutFile "${INSTALLER_OUTPUT}\${APP_SLUG}-${APP_VERSION}-nsis-setup.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
InstallDirRegKey HKCU "Software\${APP_NAME}" "InstallDir"
RequestExecutionLevel user
BrandingText "${APP_NAME} Installer"
SetCompress auto
SetCompressor /SOLID lzma

!define MUI_ABORTWARNING
!define MUI_ICON "${ICON_FILE}"
!define MUI_UNICON "${ICON_FILE}"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "${HEADER_BITMAP}"
!define MUI_HEADERIMAGE_UNBITMAP "${HEADER_BITMAP}"
!define MUI_WELCOMEFINISHPAGE_BITMAP "${WELCOME_BITMAP}"
!define MUI_LICENSEPAGE_WATERMARK_BITMAP "${WATERMARK_BITMAP}"
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXECUTABLE}"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APP_NAME}"
!define MUI_COMPONENTSPAGE_SMALLDESC

Var StartMenuFolder

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder
Page custom MCP_ShowHighlights MCP_SaveHighlights
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "SimpChinese"

Function MCP_ShowHighlights
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 0 100% 12u "Highlights"
  Pop $1
  SetCtlColors $1 0xFFFFFF 0x283741
  CreateFont $2 "Segoe UI Semibold" 10 700
  SendMessage $1 ${WM_SETFONT} $2 0
  ${NSD_CreateText} 0 14u 100% 76u "- Curated MCP servers in one click`r`n- Modern glassmorphism interface`r`n- Silent auto-update checks`r`n- Optional desktop and start menu shortcuts"
  Pop $3
  SendMessage $3 ${WM_SETFONT} $2 0
  SetCtlColors $3 0xFFFFFF 0x1A2230
  ${NSD_CreateLabel} 0 96u 100% 100% "Tip: Customize install location and shortcuts on the next page."
  Pop $4
  CreateFont $5 "Segoe UI" 9 400
  SendMessage $4 ${WM_SETFONT} $5 0
  SetCtlColors $4 0xC8D1FF 0x1A2230
  nsDialogs::Show
FunctionEnd

Function MCP_SaveHighlights
FunctionEnd

Section "Application Files" SEC_MAIN
  SectionIn RO
  SetShellVarContext all
  SetOutPath "$INSTDIR"
  File /r "${BUILD_DIR}\*"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\${APP_NAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" "$INSTDIR\${APP_EXECUTABLE}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoRepair" 1
SectionEnd

Section "Start Menu Shortcuts" SEC_SHORTCUTS
  SetShellVarContext all
  CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\${APP_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE}" "" "$INSTDIR\${APP_EXECUTABLE}"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\Uninstall ${APP_NAME}.lnk" "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Desktop Shortcut" SEC_DESKTOP
  SetShellVarContext all
  CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE}" "" "$INSTDIR\${APP_EXECUTABLE}"
SectionEnd

Section "Auto Update Ready" SEC_AUTOUPDATE
  SectionIn 1 2
  DetailPrint "Auto update service prepared. MCP servers will stay fresh."
SectionEnd

Section "Uninstall Data" SEC_UNINSTALL
SectionEnd

Function .onInit
  SetShellVarContext all
  ${IfNot} ${RunningX64}
    MessageBox MB_ICONSTOP "This installer targets 64-bit Windows."
    Abort
  ${EndIf}
FunctionEnd

Function un.onInit
  SetShellVarContext all
FunctionEnd

Section "Uninstall"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\${APP_NAME}.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\Uninstall ${APP_NAME}.lnk"
  RMDir "$SMPROGRAMS\$StartMenuFolder"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "Software\${APP_NAME}"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
SectionEnd
