@echo off
echo ========================================
echo   EduManager Backend - Compilation
echo ========================================
echo.

REM Compilation du fichier Java
echo Compilation en cours...
javac EduManagerApp.java

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR: Compilation echouee!
    pause
    exit /b 1
)

echo Compilation reussie!
echo.
echo Demarrage du serveur...
echo.

REM Lancement du serveur
java EduManagerApp

pause