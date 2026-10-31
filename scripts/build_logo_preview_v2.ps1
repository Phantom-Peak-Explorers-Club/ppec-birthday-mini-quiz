Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $repo 'design-previews'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$output = Join-Path $outputDir 'app-logo-v2.png'

function RoundedPath([int]$x, [int]$y, [int]$w, [int]$h, [int]$radius) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $d = $radius * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

$purple = [System.Drawing.ColorTranslator]::FromHtml('#2b0b46')
$deep = [System.Drawing.ColorTranslator]::FromHtml('#160522')
$gold = [System.Drawing.ColorTranslator]::FromHtml('#edbc5d')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#fff0d0')
$image = [System.Drawing.Bitmap]::new(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($image)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.TextRenderingHint = 'AntiAliasGridFit'
$graphics.Clear($purple)

$border = RoundedPath 28 28 968 968 176
$graphics.DrawPath([System.Drawing.Pen]::new($gold, 18), $border)
$inner = RoundedPath 58 58 908 908 153
$graphics.DrawPath([System.Drawing.Pen]::new($cream, 4), $inner)

$center = [System.Drawing.StringFormat]::new()
$center.Alignment = 'Center'
$center.LineAlignment = 'Center'
$questionFont = [System.Drawing.Font]::new('Arial', 545, [System.Drawing.FontStyle]::Bold)
$graphics.DrawString('?', $questionFont, [System.Drawing.SolidBrush]::new($deep), [System.Drawing.RectangleF]::new(192, 104, 650, 695), $center)
$graphics.DrawString('?', $questionFont, [System.Drawing.SolidBrush]::new($gold), [System.Drawing.RectangleF]::new(180, 91, 650, 695), $center)

$graphics.DrawLine([System.Drawing.Pen]::new($gold, 5), 197, 804, 827, 804)
$graphics.DrawString('PPEC QUIZ', [System.Drawing.Font]::new('Arial', 89, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($cream), [System.Drawing.RectangleF]::new(130, 823, 764, 123), $center)

$image.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$image.Dispose()
Write-Output $output
