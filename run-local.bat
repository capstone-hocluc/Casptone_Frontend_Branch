@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem HocLuc local launcher
rem - PostgreSQL: 5432
rem - Spring Boot API: 8080
rem - Vite frontend: 5173

set "FRONTEND_DIR=%~dp0"
set "BACKEND_DIR=%~dp0..\HocLuc\"
set "DB_PORT=5432"
set "BACKEND_PORT=8080"
set "FRONTEND_PORT=5173"
set "DB_NAME=hocluc"
set "DB_USER=postgres"
set "DB_PASSWORD=password"
set "PSQL=C:\Program Files\PostgreSQL\17\bin\psql.exe"

rem Port cleanup and Windows service control may require Administrator rights.
fltmc >nul 2>&1
if not errorlevel 1 goto admin_ready
echo [INFO] Dang yeu cau quyen Administrator...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
exit /b 0

:admin_ready

if not exist "%FRONTEND_DIR%package.json" (
  echo [ERROR] Khong tim thay frontend: %FRONTEND_DIR%
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%mvnw.cmd" (
  echo [ERROR] Khong tim thay backend: %BACKEND_DIR%
  pause
  exit /b 1
)

if not exist "%PSQL%" set "PSQL=C:\Program Files\PostgreSQL\18\bin\psql.exe"
if not exist "%PSQL%" (
  echo [ERROR] Khong tim thay psql.exe cua PostgreSQL 17/18.
  pause
  exit /b 1
)

rem Read the local database credentials when the backend .env exists.
if exist "%BACKEND_DIR%.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%BACKEND_DIR%.env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)
if defined DB_USERNAME set "DB_USER=%DB_USERNAME%"

if not defined SPRING_PROFILES_ACTIVE set "SPRING_PROFILES_ACTIVE=dev"

echo.
echo [1/7] Dong cac process dang chiem port %DB_PORT%, %BACKEND_PORT%, %FRONTEND_PORT%...
call :stop_service_if_exists postgresql-x64-17
call :stop_service_if_exists postgresql-x64-18
call :kill_port %DB_PORT%
call :kill_port %BACKEND_PORT%
call :kill_port %FRONTEND_PORT%

echo [2/7] Khoi dong PostgreSQL local...
call :start_service_if_exists postgresql-x64-17
call :start_service_if_exists postgresql-x64-18

set "PGPASSWORD=%DB_PASSWORD%"
echo [3/7] Cho PostgreSQL lang nghe port %DB_PORT%...
for /l %%I in (1,1,20) do (
  "%PSQL%" -h 127.0.0.1 -p %DB_PORT% -U "%DB_USER%" -d postgres --no-psqlrc -Atc "SELECT 1" >nul 2>&1
  if not errorlevel 1 goto postgres_ready
  timeout /t 1 /nobreak >nul
)

echo [ERROR] PostgreSQL chua san sang tren port %DB_PORT%.
echo         Kiem tra Windows Service PostgreSQL va thu lai.
pause
exit /b 1

:postgres_ready
echo [OK] PostgreSQL da san sang.

rem Create the project database once when it does not exist yet.
"%PSQL%" -h 127.0.0.1 -p %DB_PORT% -U "%DB_USER%" -d postgres --no-psqlrc -Atc "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%'" | findstr /r /c:"^ *1 *$" >nul
if errorlevel 1 (
  echo [INFO] Tao database %DB_NAME%...
  "%PSQL%" -h 127.0.0.1 -p %DB_PORT% -U "%DB_USER%" -d postgres --no-psqlrc -c "CREATE DATABASE %DB_NAME%;" >nul
  if errorlevel 1 (
    echo [ERROR] Khong tao duoc database %DB_NAME%.
    pause
    exit /b 1
  )
)

echo [4/7] Tao database va chuan bi backend...
set "DB_URL=jdbc:postgresql://127.0.0.1:%DB_PORT%/%DB_NAME%"
set "SERVER_PORT=%BACKEND_PORT%"
set "REDIS_HOST=127.0.0.1"
set "REDIS_PORT=6379"

echo [5/7] Kiem tra Redis va Kafka qua Docker...
docker info >nul 2>&1
if errorlevel 1 (
  if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    echo [INFO] Dang mo Docker Desktop...
    start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
    for /l %%I in (1,1,60) do (
      docker info >nul 2>&1
      if not errorlevel 1 goto docker_ready
      timeout /t 1 /nobreak >nul
    )
  )
  echo [WARN] Docker chua san sang. Backend co the khong ket noi duoc Redis/Kafka.
  goto docker_done
)

:docker_ready
docker compose -f "%BACKEND_DIR%src\docker\docker-compose.yml" up -d redis kafka >nul
echo [OK] Redis va Kafka da duoc yeu cau khoi dong.

:docker_done

echo [6/7] Mo backend Spring Boot tren port %BACKEND_PORT%...
start "HocLuc Backend" /D "%BACKEND_DIR%" cmd /k "call mvnw.cmd spring-boot:run"

echo [7/7] Mo frontend Vite tren port %FRONTEND_PORT%...
set "VITE_API_BASE_URL=http://127.0.0.1:%BACKEND_PORT%"
start "HocLuc Frontend" /D "%FRONTEND_DIR%" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port %FRONTEND_PORT% --strictPort"

echo.
echo HocLuc dang duoc khoi dong:
echo   Frontend: http://127.0.0.1:%FRONTEND_PORT%/
echo   Backend:  http://127.0.0.1:%BACKEND_PORT%/
echo   Database: localhost:%DB_PORT%/%DB_NAME%
echo.
echo Dong hai cua so Backend va Frontend de dung ung dung.
exit /b 0

:kill_port
for /f "tokens=5" %%P in ('netstat -ano -p tcp ^| findstr /R /C:":%~1 .*LISTENING"') do (
  if not "%%P"=="0" taskkill /F /PID %%P >nul 2>&1
)
exit /b 0

:stop_service_if_exists
sc query "%~1" >nul 2>&1
if not errorlevel 1 net stop "%~1" /y >nul 2>&1
exit /b 0

:start_service_if_exists
sc query "%~1" >nul 2>&1
if not errorlevel 1 net start "%~1" >nul 2>&1
exit /b 0
