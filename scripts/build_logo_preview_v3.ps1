Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repo 'design-previews\jonabot-quiz-question-cutout.png'
$output = Join-Path $repo 'design-previews\app-logo-v3.png'
$purple = [System.Drawing.ColorTranslator]::FromHtml('#2b0b46')
$gold = [System.Drawing.ColorTranslator]::FromHtml('#edbc5d')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#fff0d0')

$bitmap = [System.Drawing.Bitmap]::new(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.InterpolationMode = 'HighQualityBicubic'
$graphics.TextRenderingHint = 'AntiAliasGridFit'
$graphics.Clear($purple)
$graphics.DrawRectangle([System.Drawing.Pen]::new($gold, 20), 26, 26, 972, 972)
$graphics.DrawRectangle([System.Drawing.Pen]::new($cream, 4), 55, 55, 914, 914)

$source = [System.Drawing.Image]::FromFile($sourcePath)
$scale = [Math]::Min(860 / $source.Width, 820 / $source.Height)
$width = [int]($source.Width * $scale)
$height = [int]($source.Height * $scale)
$graphics.DrawImage($source, [int]((1024 - $width) / 2), 156, $width, $height)

$textLayout = [System.Drawing.StringFormat]::new()
$textLayout.Alignment = 'Center'
$textLayout.LineAlignment = 'Center'
$graphics.DrawString('PPEC QUIZ', [System.Drawing.Font]::new('Arial', 69, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($cream), [System.Drawing.RectangleF]::new(100, 61, 824, 104), $textLayout)

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$source.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
Write-Output $output
