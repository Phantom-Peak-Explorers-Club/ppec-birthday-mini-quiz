Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repo 'design-previews\share-card-frame-source.png'
$outputPath = Join-Path $repo 'docs\assets\share-card-master.jpg'
$source = [System.Drawing.Bitmap]::new($sourcePath)
$master = [System.Drawing.Bitmap]::new(1080, 1080)
$graphics = [System.Drawing.Graphics]::FromImage($master)
$graphics.CompositingQuality = 'HighQuality'
$graphics.InterpolationMode = 'HighQualityBicubic'
$graphics.DrawImage($source, 0, 0, 1080, 1080)
$graphics.Dispose()

# Keep the frame, skyline, clock, gears and paper grain in one neutral master.
# The card renderer applies a game's shareBg colour to this image at draw time.
for ($y = 0; $y -lt $master.Height; $y++) {
  for ($x = 0; $x -lt $master.Width; $x++) {
    $pixel = $master.GetPixel($x, $y)
    $grey = [int][Math]::Round(0.299 * $pixel.R + 0.587 * $pixel.G + 0.114 * $pixel.B)
    $master.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($grey, $grey, $grey))
  }
}

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg' | Select-Object -First 1
$quality = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]94)
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = $quality
$master.Save($outputPath, $encoder, $parameters)
$parameters.Dispose()
$quality.Dispose()
$master.Dispose()
$source.Dispose()
Write-Output $outputPath
