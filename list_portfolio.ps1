$path = 'C:\Users\ecker\Cowork\Website\Portfolio_2025'
if (Test-Path $path) {
    Get-ChildItem $path | Select-Object Name, Length | Format-Table -AutoSize
} else {
    Write-Output "Not found at $path"
    Write-Output "Searching website folder..."
    Get-ChildItem 'C:\Users\ecker\Cowork\Website' -Recurse -Directory | Format-Table FullName -AutoSize
}
