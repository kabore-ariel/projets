@echo off
echo ========================================
echo   EduManager Backend - Demarrage
echo ========================================
echo.

REM Créer les répertoires nécessaires
if not exist "target" mkdir target
if not exist "target\classes" mkdir target\classes

echo Compilation des sources Java...
echo.

REM Compiler les sources Java (version simplifiée)
javac -d target\classes -cp "." src\main\java\com\edumanager\*.java src\main\java\com\edumanager\entity\*.java src\main\java\com\edumanager\repository\*.java src\main\java\com\edumanager\service\*.java src\main\java\com\edumanager\controller\*.java src\main\java\com\edumanager\dto\*.java src\main\java\com\edumanager\mapper\*.java src\main\java\com\edumanager\config\*.java src\main\java\com\edumanager\exception\*.java

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR: La compilation a echoue.
    echo.
    echo Pour lancer le backend, vous devez installer Maven:
    echo 1. Telecharger Maven depuis https://maven.apache.org/download.cgi
    echo 2. Extraire et ajouter le dossier bin au PATH
    echo 3. Executer: mvn spring-boot:run
    echo.
    echo Ou utiliser un IDE comme IntelliJ IDEA ou Eclipse.
    echo.
    pause
    exit /b 1
)

echo.
echo Compilation terminee avec succes!
echo.
echo IMPORTANT: Pour lancer completement l'application Spring Boot,
echo vous devez installer Maven ou utiliser un IDE.
echo.
echo Une fois Maven installe:
echo   mvn spring-boot:run
echo.
echo L'application sera accessible sur:
echo   - API: http://localhost:8080/api
echo   - Swagger: http://localhost:8080/api/swagger-ui.html
echo   - Console H2: http://localhost:8080/api/h2-console
echo.

pause