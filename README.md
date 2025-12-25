node --watch src/server.js

Check MongoDB Service Status

Open PowerShell as Administrator.
Run:
Get-Service | Where-Object { $\_.DisplayName -like "_MongoDB_" }

Look for a service named MongoDB or similar. The Status should be Running.
If it's Stopped, start it with:
Start-Service -Name "MongoDB"

(If the exact name is different, use the name you see from the previous command.)
Try Connecting Again from Compass

Open MongoDB Compass.
Use your connection string:
mongodb://localhost:27017/

Click "Connect".
If You Still Can't Connect

There may be a problem with the server configuration or files. Try restarting your computer to ensure the service attempts to start automatically after reboot.
If issues persist, locate the MongoDB log file:
C:\Program Files\MongoDB\Server\<version>\log\

Look for errors in mongod.log.
Verify Network and Firewall Settings

Make sure no software is blocking port 27017.
Summary:

MongoDB Compass is only a client tool—it needs the MongoDB Server to be running to connect. Start the server service, then try connecting again.

If you encounter any errors when starting the service, please share the error message for further help!
