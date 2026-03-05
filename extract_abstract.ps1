Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = 'C:\Users\ecker\Desktop\Conferences\CGU26_Abstract_Eckert.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry('word/document.xml')
$reader = New-Object System.IO.StreamReader($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$text = [regex]::Replace($xml, '<[^>]+>', ' ')
$text = [regex]::Replace($text, '\s+', ' ')
$text.Trim()
