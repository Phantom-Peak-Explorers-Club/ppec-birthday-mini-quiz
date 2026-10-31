Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repo 'design-previews\app-logo-v3.png'
$assets = Join-Path $repo 'docs\assets'
$source = [System.Drawing.Image]::FromFile($sourcePath)

foreach ($size in 180, 192, 512) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = 'AntiAlias'
    $graphics.InterpolationMode = 'HighQualityBicubic'
    $graphics.DrawImage($source, 0, 0, $size, $size)
    $path = Join-Path $assets "app-icon-v3-$size.png"
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output $path
}

$source.Dispose()
