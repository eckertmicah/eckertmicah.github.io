$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://+:5174/')
$listener.Start()

$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object IPAddress -notlike '127.*' | Where-Object IPAddress -notlike '169.*' | Select-Object -First 1).IPAddress
Write-Output ""
Write-Output "  *** PHONE ACCESS SERVER RUNNING ***"
Write-Output ""
Write-Output "  Open this on your phone:"
Write-Output "  http://$ip`:5174"
Write-Output ""
Write-Output "  (Both devices must be on the same WiFi)"
Write-Output "  Press Ctrl+C to stop."
Write-Output ""

$root = 'C:\Users\ecker\Cowork\Website'
$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.mp4'  = 'video/mp4'
  '.docx' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

while ($listener.IsListening) {
  $ctx  = $listener.GetContext()
  $req  = $ctx.Request
  $res  = $ctx.Response
  $path = $req.Url.LocalPath
  if ($path -eq '/') { $path = '/index.html' }
  $file = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))
  if (Test-Path $file -PathType Leaf) {
    $ext  = [System.IO.Path]::GetExtension($file).ToLower()
    $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
    $res.OutputStream.Write($body, 0, $body.Length)
  }
  $res.OutputStream.Close()
}
