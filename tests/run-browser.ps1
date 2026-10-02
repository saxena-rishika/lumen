$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$profilePath = Join-Path $projectRoot '.browser-check'
$chrome = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList '--headless=new','--disable-gpu','--no-sandbox','--remote-debugging-port=9224',"--user-data-dir=$profilePath",'about:blank' -WindowStyle Hidden -PassThru
$socket = [System.Net.WebSockets.ClientWebSocket]::new()
try {
  Start-Sleep -Seconds 2
  $targets = Invoke-RestMethod 'http://localhost:9224/json'
  $target = $targets | Where-Object type -eq 'page' | Select-Object -First 1
  $socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  $script:requestId = 0
  function Send-Cdp($method, $parameters) {
    $script:requestId++
    $id = $script:requestId
    $payload = @{id=$id;method=$method;params=$parameters} | ConvertTo-Json -Depth 20 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
    $socket.SendAsync([ArraySegment[byte]]::new($bytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    do {
      $stream = [IO.MemoryStream]::new()
      do {
        $buffer = New-Object byte[] 65536
        $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
        $stream.Write($buffer, 0, $received.Count)
      } while (-not $received.EndOfMessage)
      $message = [Text.Encoding]::UTF8.GetString($stream.ToArray()) | ConvertFrom-Json
      $stream.Dispose()
    } while ($message.id -ne $id)
    if ($message.error) { throw ($message.error | ConvertTo-Json) }
    return $message.result
  }
  Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=390;height=844;deviceScaleFactor=1;mobile=$true} | Out-Null
  Send-Cdp 'Page.navigate' @{url='http://localhost:8080/tests/browser.html'} | Out-Null
  Start-Sleep -Seconds 3
  $result = Send-Cdp 'Runtime.evaluate' @{expression='JSON.stringify({title:document.title,results:JSON.parse(document.getElementById("test-results").textContent),width:innerWidth,documentWidth:document.documentElement.scrollWidth})';returnByValue=$true}
  $report = $result.result.value | ConvertFrom-Json
  Write-Output "$($report.title): $($report.results.Count) checks; viewport $($report.width), document $($report.documentWidth)"
  if ($report.title -ne 'TESTS PASSED' -or $report.width -ne 390 -or $report.documentWidth -gt $report.width) { throw 'Mobile browser verification failed.' }
  $screenshot = Send-Cdp 'Page.captureScreenshot' @{format='png'}
  [IO.File]::WriteAllBytes((Join-Path $PSScriptRoot 'mobile-preview.png'), [Convert]::FromBase64String($screenshot.data))
  Send-Cdp 'Browser.close' @{} | Out-Null
} finally {
  $socket.Dispose()
}
