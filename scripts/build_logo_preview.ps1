Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $repo 'design-previews'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$output = Join-Path $outputDir 'app-logo-v1.png'
$mascotPath = Join-Path $repo 'docs\assets\jonabot-jr.png'

$bitmap = [System.Drawing.Bitmap]::new(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.InterpolationMode = 'HighQualityBicubic'
$graphics.TextRenderingHint = 'AntiAliasGridFit'
$purple = [System.Drawing.ColorTranslator]::FromHtml('#280b3e')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#f6dfb4')
$gold = [System.Drawing.ColorTranslator]::FromHtml('#f0ba58')
$violet = [System.Drawing.ColorTranslator]::FromHtml('#681b82')
$graphics.Clear($purple)

$goldPen = [System.Drawing.Pen]::new($gold, 20)
$creamPen = [System.Drawing.Pen]::new($cream, 4)
$graphics.DrawRectangle($goldPen, 30, 30, 964, 964)
$graphics.DrawRectangle($creamPen, 56, 56, 912, 912)
$graphics.FillEllipse([System.Drawing.SolidBrush]::new($cream), 144, 174, 736, 736)
$graphics.DrawEllipse([System.Drawing.Pen]::new($gold, 13), 144, 174, 736, 736)

$mascot = [System.Drawing.Image]::FromFile($mascotPath)
$scale = [Math]::Min(720 / $mascot.Width, 680 / $mascot.Height)
$w = [int]($mascot.Width * $scale)
$h = [int]($mascot.Height * $scale)
$graphics.DrawImage($mascot, [int]((1024 - $w) / 2 - 30), 216, $w, $h)

$graphics.FillEllipse([System.Drawing.SolidBrush]::new($gold), 716, 167, 235, 235)
$graphics.DrawEllipse([System.Drawing.Pen]::new($purple, 14), 716, 167, 235, 235)
$graphics.FillEllipse([System.Drawing.SolidBrush]::new($violet), 738, 189, 191, 191)
$graphics.DrawEllipse([System.Drawing.Pen]::new($cream, 5), 738, 189, 191, 191)

$center = [System.Drawing.StringFormat]::new()
$center.Alignment = 'Center'
$center.LineAlignment = 'Center'
$graphics.DrawString('?', [System.Drawing.Font]::new('Arial', 147, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($cream), [System.Drawing.RectangleF]::new(735, 178, 197, 196), $center)

$graphics.FillRectangle([System.Drawing.SolidBrush]::new($cream), 138, 70, 386, 103)
$graphics.DrawRectangle([System.Drawing.Pen]::new($purple, 9), 138, 70, 386, 103)
$graphics.DrawString('PPEC', [System.Drawing.Font]::new('Arial', 61, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($violet), [System.Drawing.RectangleF]::new(138, 70, 386, 103), $center)

$graphics.FillRectangle([System.Drawing.SolidBrush]::new($violet), 174, 802, 676, 145)
$graphics.DrawRectangle([System.Drawing.Pen]::new($gold, 15), 174, 802, 676, 145)
$graphics.DrawString('QUIZ', [System.Drawing.Font]::new('Arial', 105, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($cream), [System.Drawing.RectangleF]::new(174, 802, 676, 145), $center)

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$mascot.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
Write-Output $output
