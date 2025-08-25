@echo off
echo ========================================
echo   Compilation EduManager Backend
echo ========================================

REM Créer les répertoires nécessaires
if not exist "target" mkdir target
if not exist "target\classes" mkdir target\classes

echo.
echo Téléchargement des dépendances Spring Boot...
echo.

REM Créer un répertoire lib pour les dépendances
if not exist "lib" mkdir lib

echo Les dépendances doivent être téléchargées manuellement.
echo.
echo Pour lancer l'application, vous devez:
echo 1. Installer Java 17 ou supérieur
echo 2. Installer Maven ou Gradle
echo 3. Exécuter: mvn spring-boot:run
echo.
echo Ou utiliser un IDE comme IntelliJ IDEA ou Eclipse
echo avec le support Spring Boot.
echo.
echo L'application sera accessible sur:
echo - API: http://localhost:8080/api
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo - Console H2: http://localhost:8080/api/h2-console
echo.

pause