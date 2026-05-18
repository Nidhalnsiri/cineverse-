# Libere le port 8081
$conns = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
if (-not $conns) { Write-Host "Port 8081 deja libre."; exit 0 }
foreach ($processId in ($conns.OwningProcess | Sort-Object -Unique)) {
    $p = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($p) {
        Write-Host "Arret: $($p.ProcessName) (PID $processId)"
        Stop-Process -Id $processId -Force
    }
}
Write-Host "Port 8081 libere."
