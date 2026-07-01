import { execSync } from 'child_process';

const ports = [5005, 5173, 5174];

for (const port of ports) {
  try {
    console.log(`Checking port ${port}...`);
    // Find PID on port using Windows netstat
    const output = execSync(`netstat -ano | findstr LISTENING | findstr :${port}`).toString();
    const lines = output.split('\n').map(l => l.trim()).filter(Boolean);
    
    for (const line of lines) {
      const parts = line.split(/\s+/);
      const pid = parseInt(parts[parts.length - 1], 10);
      if (pid && pid > 4) { // PIDs <= 4 are System/Idle
        console.log(`Killing process ${pid} on port ${port}...`);
        try {
          process.kill(pid, 'SIGKILL');
          console.log(`Successfully killed process ${pid}`);
        } catch (killErr) {
          // Fallback to taskkill
          try {
            execSync(`taskkill /F /PID ${pid}`);
            console.log(`Killed via taskkill /PID ${pid}`);
          } catch (taskErr) {
            console.error(`Failed to kill process ${pid}: ${taskErr.message}`);
          }
        }
      }
    }
  } catch (err) {
    console.log(`Port ${port} is already free or no process found.`);
  }
}
console.log('Port cleanup finished.');
