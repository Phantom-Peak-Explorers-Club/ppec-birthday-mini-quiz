Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repo 'design-previews\jonabot-quiz-question-cutout.png'
$outputPath = Join-Path $repo 'docs\assets\jonabot-quiz-hero.png'

$source = [System.Drawing.Image]::FromFile($sourcePath)
$bitmap = [System.Drawing.Bitmap]::new(480, 480)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.CompositingQuality = 'HighQuality'
$graphics.InterpolationMode = 'HighQualityBicubic'
$graphics.SmoothingMode = 'AntiAlias'
$graphics.DrawImage($source, 0, 0, 480, 480)
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
$source.Dispose()
Write-Output $outputPath

$countdownSourcePath = Join-Path $repo 'design-previews\jonabot-countdown-card-source.png'
$countdownOutputPath = Join-Path $repo 'docs\assets\jonabot-countdown-card.png'
$countdownSource = [System.Drawing.Image]::FromFile($countdownSourcePath)
$countdownBitmap = [System.Drawing.Bitmap]::new(600, 600)
$countdownGraphics = [System.Drawing.Graphics]::FromImage($countdownBitmap)
$countdownGraphics.Clear([System.Drawing.Color]::Transparent)
$countdownGraphics.CompositingQuality = 'HighQuality'
$countdownGraphics.InterpolationMode = 'HighQualityBicubic'
$countdownGraphics.SmoothingMode = 'AntiAlias'
$countdownGraphics.DrawImage($countdownSource, 0, 0, 600, 600)
$countdownBitmap.Save($countdownOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$countdownGraphics.Dispose()
$countdownBitmap.Dispose()
$countdownSource.Dispose()
Write-Output $countdownOutputPath

$avatarSourcePath = Join-Path $repo 'docs\assets\jonabot-jr.png'
$avatarOutputPath = Join-Path $repo 'docs\assets\jonabot-avatar.png'
$avatarSource = [System.Drawing.Image]::FromFile($avatarSourcePath)
$avatarBitmap = [System.Drawing.Bitmap]::new(256, 256)
$avatarGraphics = [System.Drawing.Graphics]::FromImage($avatarBitmap)
$avatarGraphics.Clear([System.Drawing.Color]::Transparent)
$avatarGraphics.CompositingQuality = 'HighQuality'
$avatarGraphics.InterpolationMode = 'HighQualityBicubic'
$avatarGraphics.DrawImage($avatarSource, [System.Drawing.Rectangle]::new(0, 0, 256, 256), [System.Drawing.Rectangle]::new(75, 0, 370, 370), [System.Drawing.GraphicsUnit]::Pixel)
$avatarBitmap.Save($avatarOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$avatarGraphics.Dispose()
$avatarBitmap.Dispose()
$avatarSource.Dispose()
Write-Output $avatarOutputPath
