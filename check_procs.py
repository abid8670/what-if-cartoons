import subprocess

cmd = ['wmic', 'process', 'where', "name='ffmpeg.exe' or name='node.exe' or name='python.exe'", 'get', 'ProcessId,CommandLine,Name']
res = subprocess.run(cmd, capture_output=True, text=True, errors='ignore')
print(res.stdout)

