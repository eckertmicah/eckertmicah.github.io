$root = 'C:\Users\ecker\Cowork\Website'
$port = 5173

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.png'  = 'image/png'
  '.webp' = 'image/webp'
  '.gif'  = 'image/gif'
  '.svg'  = 'image/svg+xml'
  '.mp4'  = 'video/mp4'
  '.mov'  = 'video/mp4'
  '.pdf'  = 'application/pdf'
  '.docx' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

$handler = {
  param($client, $rootDir, $mimes)
  try {
    $stream = $client.GetStream()
    $buf = New-Object byte[] 8192
    $sb  = New-Object System.Text.StringBuilder
    do {
      $n = $stream.Read($buf, 0, $buf.Length)
      if ($n -le 0) { return }
      $sb.Append([System.Text.Encoding]::ASCII.GetString($buf, 0, $n)) | Out-Null
    } while ($stream.DataAvailable -and -not $sb.ToString().Contains("`r`n`r`n"))

    $text  = $sb.ToString()
    $line0 = $text.Split("`r`n")[0]
    $parts = $line0.Split(' ')
    $url   = if ($parts.Count -ge 2) { $parts[1].Split('?')[0] } else { '/' }
    if ($url -eq '/') { $url = '/index.html' }

    $rel  = [Uri]::UnescapeDataString($url.TrimStart('/').Replace('/', [char]92))
    $file = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootDir, $rel))

    $bw = New-Object System.IO.BinaryWriter($stream)
    if ($file.StartsWith($rootDir) -and [System.IO.File]::Exists($file)) {
      $ext  = [System.IO.Path]::GetExtension($file).ToLower()
      $mime = if ($mimes.ContainsKey($ext)) { $mimes[$ext] } else { 'application/octet-stream' }
      $body = [System.IO.File]::ReadAllBytes($file)
      $hdr  = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $bw.Write([System.Text.Encoding]::ASCII.GetBytes($hdr))
      $bw.Write($body)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
      $hdr  = "HTTP/1.1 404 Not Found`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $bw.Write([System.Text.Encoding]::ASCII.GetBytes($hdr))
      $bw.Write($body)
    }
    $bw.Flush()
  } catch { }
  finally { try { $client.Close() } catch { } }
}

# Runspace pool – up to 20 concurrent requests
$pool = [System.Management.Automation.Runspaces.RunspaceFactory]::CreateRunspacePool(1, 20)
$pool.Open()

# Dual-stack listener: accepts IPv4 and IPv6 (covers both 127.0.0.1 and ::1)
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::IPv6Any, $port)
$listener.Server.SetSocketOption(
  [System.Net.Sockets.SocketOptionLevel]::IPv6,
  [System.Net.Sockets.SocketOptionName]::IPv6Only,
  $false
)
$listener.Start()
Write-Output "Serving at http://localhost:$port"

while ($true) {
  $client = $listener.AcceptTcpClient()
  $ps = [System.Management.Automation.PowerShell]::Create()
  $ps.RunspacePool = $pool
  [void]$ps.AddScript($handler).AddArgument($client).AddArgument($root).AddArgument($mimeTypes)
  [void]$ps.BeginInvoke()
}
