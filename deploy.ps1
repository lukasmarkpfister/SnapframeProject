# Deploy to Netcup via FTP
# Benötigt WinSCP: https://winscp.net/eng/download.php

$FTP_SERVER = "202.61.232.124"
$FTP_USERNAME = "hosting229609"
$FTP_PASSWORD = "Im3Mzs0dNzsftp!"
$REMOTE_PATH = "/lightpicture-3d.de/httpdocs"
$LOCAL_PATH = ".\dist"

Write-Host "Building project..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Uploading to Netcup..." -ForegroundColor Green

# WinSCP Upload
& "C:\Users\lukas\AppData\Local\Programs\WinSCP\WinSCP.com" `
  /command `
  "open ftp://${FTP_USERNAME}:${FTP_PASSWORD}@${FTP_SERVER}" `
  "lcd $LOCAL_PATH" `
  "cd $REMOTE_PATH" `
  "synchronize remote -delete" `
  "exit"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
}
