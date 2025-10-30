; MCP Market NSIS Installer
; Run `npm run make` before compiling this installer.
; Build with: `makensis scripts\mcp-market-installer.nsi`

Unicode true
!include "MUI2.nsh"

!define PROJECT_DIR "${__FILEDIR__}\..\.."
!define BUILD_DIR "${PROJECT_DIR}\out\mcp-market-win32-x64"
!define INSTALLER_OUTPUT "${PROJECT_DIR}\installer"
!define ICON_FILE "${PROJECT_DIR}\public\icon.ico"
!define LICENSE_FILE "${PROJECT_DIR}\LICENSE"

!define APP_NAME "MCP Market"
!define APP_SLUG "mcp-market"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Superwindcloud"
!define APP_EXECUTABLE "${APP_SLUG}.exe"

Name "${APP_NAME}"
OutFile "${INSTALLER_OUTPUT}\${APP_SLUG}-${APP_VERSION}-setup.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
InstallDirRegKey HKCU "Software\${APP_NAME}" "InstallDir"
RequestExecutionLevel admin
BrandingText "${APP_NAME} Installer"
SetCompress auto
SetCompressor /SOLID lzma

!define MUI_ICON "${ICON_FILE}"
!define MUI_UNICON "${ICON_FILE}"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXECUTABLE}"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APP_NAME}"

Var StartMenuFolder

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${LICENSE_FILE}"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "SimpChinese"

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

Section "Uninstall Data" SEC_UNINSTALL
SectionEnd

Function .onInit
  SetShellVarContext all
  IfFileExists "${BUILD_DIR}\${APP_EXECUTABLE}" 0 MissingBuild
  CreateDirectory "${INSTALLER_OUTPUT}"
  Return
MissingBuild:
  MessageBox MB_ICONSTOP "Build output not found. Run `npm run make` first." /SD IDOK
  Abort
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
