@echo off
echo ========================================
echo   EduManager Backend - Spring Boot
echo ========================================
echo.
echo Demarrage de l'application...
echo.
echo L'application sera accessible sur:
echo - API: http://localhost:8080/api
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo - Console H2: http://localhost:8080/api/h2-console
echo.
echo Appuyez sur Ctrl+C pour arreter l'application
echo.

java -jar target/edumanager-backend-1.0.0.jar

pause