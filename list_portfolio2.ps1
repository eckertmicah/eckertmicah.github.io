$path = 'C:\Users\ecker\Cowork\Website\Portfolio_2025'
$files = Get-ChildItem $path -Recurse -File
Write-Output "File count: $($files.Count)"
foreach ($f in $files) {
    Write-Output "$($f.Name)  $([math]::Round($f.Length/1KB))KB"
}
