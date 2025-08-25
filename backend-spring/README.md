# EduManager Backend - API Spring Boot

## Description
Backend API REST pour le système de gestion scolaire EduManager, développé avec Spring Boot 3.2.

## Fonctionnalités

### Gestion des Classes
- CRUD complet des classes
- Assignation d'enseignants principaux et secondaires
- Gestion des effectifs et places disponibles

### Gestion des Élèves
- CRUD complet des élèves
- Recherche par nom, prénom ou classe
- Calcul automatique des moyennes
- Suivi des performances scolaires

### Gestion du Personnel
- CRUD complet du personnel enseignant et administratif
- Assignation aux classes
- Gestion des spécialités et matières

### Gestion des Notes
- Saisie et modification des notes
- Calcul automatique des moyennes par matière et générale
- Support des différents types d'évaluations
- Gestion par trimestre

### Gestion des Paiements
- Suivi des frais de scolarité
- Gestion des échéances et retards
- Différents modes de paiement
- Calcul des recettes

## Technologies Utilisées

- **Spring Boot 3.2** - Framework principal
- **Spring Data JPA** - Persistance des données
- **Spring Security** - Sécurité (configuration basique pour développement)
- **H2 Database** - Base de données en mémoire (développement)
- **MySQL** - Base de données de production
- **MapStruct** - Mapping entre entités et DTOs
- **Lombok** - Réduction du code boilerplate
- **SpringDoc OpenAPI** - Documentation API automatique
- **Maven** - Gestion des dépendances

## Prérequis

- Java 17 ou supérieur
- Maven 3.6 ou supérieur
- MySQL 8.0 (pour la production)

## Installation et Démarrage

### 1. Cloner le projet
```bash
cd backend-spring
```

### 2. Compiler le projet
```bash
mvn clean compile
```

### 3. Lancer l'application
```bash
mvn spring-boot:run
```

L'application sera accessible sur `http://localhost:8080/api`

## Configuration

### Base de données H2 (Développement)
- URL: `jdbc:h2:mem:edumanager`
- Console H2: `http://localhost:8080/api/h2-console`
- Username: `sa`
- Password: `password`

### Base de données MySQL (Production)
```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: jdbc:mysql://localhost:3306/edumanager
    username: ${DB_USERNAME:edumanager}
    password: ${DB_PASSWORD:password}
```

## Documentation API

### Swagger UI
Accessible sur: `http://localhost:8080/api/swagger-ui.html`

### Endpoints principaux

#### Classes
- `GET /api/classes` - Liste toutes les classes
- `GET /api/classes/{id}` - Récupère une classe par ID
- `POST /api/classes` - Crée une nouvelle classe
- `PUT /api/classes/{id}` - Met à jour une classe
- `DELETE /api/classes/{id}` - Supprime une classe
- `PUT /api/classes/{classeId}/enseignant-principal/{enseignantId}` - Assigne un enseignant principal

#### Élèves
- `GET /api/eleves` - Liste tous les élèves
- `GET /api/eleves/{id}` - Récupère un élève par ID
- `POST /api/eleves` - Crée un nouvel élève
- `PUT /api/eleves/{id}` - Met à jour un élève
- `DELETE /api/eleves/{id}` - Supprime un élève

#### Personnel
- `GET /api/personnel` - Liste tout le personnel
- `GET /api/personnel/{id}` - Récupère un membre du personnel par ID
- `POST /api/personnel` - Crée un nouveau membre du personnel
- `PUT /api/personnel/{id}` - Met à jour un membre du personnel
- `DELETE /api/personnel/{id}` - Supprime un membre du personnel

#### Notes
- `GET /api/notes` - Liste toutes les notes
- `GET /api/notes/eleve/{eleveId}` - Notes d'un élève
- `POST /api/notes` - Crée une nouvelle note
- `PUT /api/notes/{id}` - Met à jour une note
- `DELETE /api/notes/{id}` - Supprime une note

#### Paiements
- `GET /api/paiements` - Liste tous les paiements
- `GET /api/paiements/eleve/{eleveId}` - Paiements d'un élève
- `POST /api/paiements` - Crée un nouveau paiement
- `PUT /api/paiements/{id}` - Met à jour un paiement
- `PUT /api/paiements/{id}/marquer-paye` - Marque un paiement comme payé

## Structure du Projet

```
src/main/java/com/edumanager/
├── config/          # Configuration Spring
├── controller/      # Contrôleurs REST
├── dto/            # Data Transfer Objects
├── entity/         # Entités JPA
├── exception/      # Gestion des exceptions
├── mapper/         # Mappers MapStruct
├── repository/     # Repositories Spring Data
└── service/        # Services métier
```

## Modèle de Données

### Entités principales
- **Classe** - Représente une classe scolaire
- **Eleve** - Représente un élève
- **Personnel** - Représente le personnel (enseignants, administration)
- **Note** - Représente une note d'évaluation
- **Paiement** - Représente un paiement de frais de scolarité

### Relations
- Une classe peut avoir plusieurs élèves
- Une classe a un enseignant principal et plusieurs enseignants assignés
- Un élève appartient à une classe
- Un élève peut avoir plusieurs notes et paiements
- Une note est associée à un élève et un enseignant

## Tests

```bash
mvn test
```

## Déploiement

### Profil de production
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Génération du JAR
```bash
mvn clean package
java -jar target/edumanager-backend-1.0.0.jar --spring.profiles.active=prod
```

## Sécurité

⚠️ **Note**: La configuration actuelle est adaptée pour le développement. Pour la production, il faut :
- Configurer une authentification robuste
- Activer HTTPS
- Configurer les CORS de manière restrictive
- Sécuriser les endpoints sensibles

## Support

Pour toute question ou problème, veuillez créer une issue dans le repository du projet.