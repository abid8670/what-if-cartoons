Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 1
$synth.Volume = 100
$voices = $synth.GetInstalledVoices()
Write-Host "Available voices:"
foreach ($v in $voices) { Write-Host "  $($v.VoiceInfo.Name)" }
# Pick a male voice if available
$maleVoice = $voices | Where-Object { $_.VoiceInfo.Gender -eq 'Male' } | Select-Object -First 1
if ($maleVoice) { $synth.SelectVoice($maleVoice.VoiceInfo.Name) }
$text = Get-Content -Path "D:\AI-Cartoons\scripts\no-water-script.txt" -Raw
$synth.SetOutputToWaveFile("D:\AI-Cartoons\what-if-studio\public\no-water\voice_3m.wav")
$synth.Speak($text)
$synth.Dispose()
Write-Host "Audio generated successfully"
