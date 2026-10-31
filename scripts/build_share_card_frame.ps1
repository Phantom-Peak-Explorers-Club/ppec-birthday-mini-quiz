Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repo 'design-previews\share-card-frame-source.png'
$outputPath = Join-Path $repo 'docs\assets\share-card-frame.jpg'
$source = [System.Drawing.Image]::FromFile($sourcePath)
$bitmap = [System.Drawing.Bitmap]::new(1080, 1080)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CompositingQuality = 'HighQuality'
$graphics.InterpolationMode = 'HighQualityBicubic'
$graphics.SmoothingMode = 'AntiAlias'
$graphics.DrawImage($source, 0, 0, 1080, 1080)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg' | Select-Object -First 1
$quality = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]92)
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = $quality
$bitmap.Save($outputPath, $encoder, $parameters)
$parameters.Dispose()
$quality.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
$source.Dispose()
Write-Output $outputPath
