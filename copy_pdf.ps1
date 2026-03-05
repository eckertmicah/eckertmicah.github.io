$src = Get-ChildItem 'C:\Users\ecker\Downloads' -Filter '*Verkaik*' | Select-Object -First 1
if ($src) {
    Copy-Item $src.FullName 'C:\Users\ecker\Cowork\Website\verkaik2025.pdf'
    Write-Output "Copied: $($src.Name)"
    $dest = Get-Item 'C:\Users\ecker\Cowork\Website\verkaik2025.pdf'
    Write-Output "Size: $([math]::Round($dest.Length/1KB, 1)) KB"
} else {
    Write-Output "File not found"
}
