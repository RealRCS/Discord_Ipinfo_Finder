@echo off
goto start

:start
node app.js
goto restart

:restart
goto start