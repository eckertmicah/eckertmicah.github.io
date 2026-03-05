Get-ChildItem 'C:\Users\ecker\Cowork\Website' -Recurse -Directory | Select-Object FullName
Write-Output "---"
Get-ChildItem 'C:\Users\ecker\Cowork\Website' -File | Select-Object Name
