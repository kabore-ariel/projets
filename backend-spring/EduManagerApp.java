import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import com.sun.net.httpserver.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EduManagerApp {
    private static final int PORT = 8081;
    private static final String CORS_HEADERS = "Access-Control-Allow-Origin: http://localhost:3000\r\n" +
            "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n" +
            "Access-Control-Allow-Headers: Content-Type, Authorization\r\n" +
            "Access-Control-Allow-Credentials: true\r\n";

    // Données en mémoire
    private static List<Classe> classes = new ArrayList<>();
    private static List<Eleve> eleves = new ArrayList<>();
    private static List<Personnel> personnel = new ArrayList<>();
    private static List<Note> notes = new ArrayList<>();
    private static List<Paiement> paiements = new ArrayList<>();
    
    private static long nextId = 1;

    public static void main(String[] args) throws IOException {
        initializeData();
        
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        
        // Routes API
        server.createContext("/api/classes", new ClasseHandler());
        server.createContext("/api/eleves", new EleveHandler());
        server.createContext("/api/personnel", new PersonnelHandler());
        server.createContext("/api/notes", new NoteHandler());
        server.createContext("/api/paiements", new PaiementHandler());
        server.createContext("/api/health", new HealthHandler());
        
        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();
        
        System.out.println("========================================");
        System.out.println("   EduManager Backend - DEMARRÉ");
        System.out.println("========================================");
        System.out.println();
        System.out.println("Serveur demarre sur le port " + PORT);
        System.out.println();
        System.out.println("Endpoints disponibles:");
        System.out.println("   - API Base: http://localhost:" + PORT + "/api");
        System.out.println("   - Classes: http://localhost:" + PORT + "/api/classes");
        System.out.println("   - Eleves: http://localhost:" + PORT + "/api/eleves");
        System.out.println("   - Personnel: http://localhost:" + PORT + "/api/personnel");
        System.out.println("   - Notes: http://localhost:" + PORT + "/api/notes");
        System.out.println("   - Paiements: http://localhost:" + PORT + "/api/paiements");
        System.out.println("   - Health: http://localhost:" + PORT + "/api/health");
        System.out.println();
        System.out.println("Backend pret pour le frontend Next.js");
        System.out.println("Appuyez sur Ctrl+C pour arreter");
        System.out.println();
    }

    private static void initializeData() {
        // Personnel
        personnel.add(new Personnel(nextId++, "Professeur", "Alice", "ENSEIGNANT", "Mathématiques", 150000, "123456789", "alice@ecole.com"));
        personnel.add(new Personnel(nextId++, "Directeur", "Bob", "DIRECTION", "Administration", 200000, "987654321", "bob@ecole.com"));
        personnel.add(new Personnel(nextId++, "Kone", "Fatou", "ENSEIGNANT", "Français", 145000, "111222333", "fatou@ecole.com"));

        // Classes
        classes.add(new Classe(nextId++, "6ème A", "6ème", "A", 30, "Salle 101", "Classe de 6ème section A", 1L));
        classes.add(new Classe(nextId++, "5ème B", "5ème", "B", 28, "Salle 205", "Classe de 5ème section B", 3L));
        classes.add(new Classe(nextId++, "4ème A", "4ème", "A", 32, "Salle 301", "Classe de 4ème section A", null));

        // Élèves
        eleves.add(new Eleve(nextId++, "Dupont", "Jean", "2010-05-15", "123 Rue de la Paix, Abidjan", "0123456789", "jean.dupont@email.com", 1L));
        eleves.add(new Eleve(nextId++, "Martin", "Marie", "2010-08-22", "456 Avenue des Fleurs, Abidjan", "0987654321", "marie.martin@email.com", 1L));
        eleves.add(new Eleve(nextId++, "Kouassi", "Aya", "2008-12-10", "789 Boulevard du Commerce, Abidjan", "0555666777", "aya.kouassi@email.com", 3L));

        // Notes
        notes.add(new Note(nextId++, 15.0, "Mathématiques", "DEVOIR_SURVEILLE", "2024-09-15", "PREMIER", 1L, 1L));
        notes.add(new Note(nextId++, 12.0, "Mathématiques", "CONTROLE_CONTINU", "2024-10-05", "PREMIER", 1L, 1L));
        notes.add(new Note(nextId++, 18.0, "Français", "DEVOIR_MAISON", "2024-09-20", "PREMIER", 2L, 3L));

        // Paiements
        paiements.add(new Paiement(nextId++, 50000, "SEPTEMBRE", 2024, "PAYE", "2024-09-01", "ESPECES", 1L));
        paiements.add(new Paiement(nextId++, 50000, "OCTOBRE", 2024, "PAYE", "2024-10-01", "ESPECES", 1L));
        paiements.add(new Paiement(nextId++, 50000, "NOVEMBRE", 2024, "EN_ATTENTE", null, null, 1L));
    }

    // Classes de données
    static class Classe {
        public long id;
        public String nom, niveau, section, salle, description;
        public int effectifMax;
        public Long enseignantPrincipalId;
        public String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        public Classe(long id, String nom, String niveau, String section, int effectifMax, String salle, String description, Long enseignantPrincipalId) {
            this.id = id; this.nom = nom; this.niveau = niveau; this.section = section;
            this.effectifMax = effectifMax; this.salle = salle; this.description = description;
            this.enseignantPrincipalId = enseignantPrincipalId;
        }
    }

    static class Eleve {
        public long id;
        public String nom, prenom, dateNaissance, adresse, telephone, email;
        public Long classeId;
        public String statut = "ACTIF";
        public String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        public Eleve(long id, String nom, String prenom, String dateNaissance, String adresse, String telephone, String email, Long classeId) {
            this.id = id; this.nom = nom; this.prenom = prenom; this.dateNaissance = dateNaissance;
            this.adresse = adresse; this.telephone = telephone; this.email = email; this.classeId = classeId;
        }
    }

    static class Personnel {
        public long id;
        public String nom, prenom, poste, matiere, telephone, email;
        public double salaire;
        public String statut = "ACTIF";
        public String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        public Personnel(long id, String nom, String prenom, String poste, String matiere, double salaire, String telephone, String email) {
            this.id = id; this.nom = nom; this.prenom = prenom; this.poste = poste;
            this.matiere = matiere; this.salaire = salaire; this.telephone = telephone; this.email = email;
        }
    }

    static class Note {
        public long id;
        public double valeur;
        public String matiere, typeEvaluation, dateEvaluation, trimestre;
        public Long eleveId, enseignantId;
        public String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        public Note(long id, double valeur, String matiere, String typeEvaluation, String dateEvaluation, String trimestre, Long eleveId, Long enseignantId) {
            this.id = id; this.valeur = valeur; this.matiere = matiere; this.typeEvaluation = typeEvaluation;
            this.dateEvaluation = dateEvaluation; this.trimestre = trimestre; this.eleveId = eleveId; this.enseignantId = enseignantId;
        }
    }

    static class Paiement {
        public long id;
        public double montant;
        public String mois, statut, datePaiement, modePaiement;
        public int annee;
        public Long eleveId;
        public String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        public Paiement(long id, double montant, String mois, int annee, String statut, String datePaiement, String modePaiement, Long eleveId) {
            this.id = id; this.montant = montant; this.mois = mois; this.annee = annee;
            this.statut = statut; this.datePaiement = datePaiement; this.modePaiement = modePaiement; this.eleveId = eleveId;
        }
    }

    // Handlers HTTP
    static class ClasseHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            
            try {
                if ("GET".equals(method)) {
                    String response = "[";
                    for (int i = 0; i < classes.size(); i++) {
                        Classe c = classes.get(i);
                        long effectifActuel = eleves.stream().mapToLong(e -> e.classeId != null && e.classeId == c.id ? 1 : 0).sum();
                        
                        response += "{\"id\":" + c.id + ",\"nom\":\"" + c.nom + "\",\"niveau\":\"" + c.niveau + 
                                   "\",\"section\":\"" + c.section + "\",\"effectifMax\":" + c.effectifMax + 
                                   ",\"effectifActuel\":" + effectifActuel + ",\"salle\":\"" + c.salle + 
                                   "\",\"description\":\"" + c.description + "\",\"createdAt\":\"" + c.createdAt + "\"}";
                        if (i < classes.size() - 1) response += ",";
                    }
                    response += "]";
                    sendResponse(exchange, 200, response);
                } else if ("POST".equals(method)) {
                    String body = readRequestBody(exchange);
                    // Parse simple JSON (nom, niveau, section, effectifMax, salle, description)
                    String nom = extractJsonValue(body, "nom");
                    String niveau = extractJsonValue(body, "niveau");
                    String section = extractJsonValue(body, "section");
                    int effectifMax = Integer.parseInt(extractJsonValue(body, "effectifMax"));
                    String salle = extractJsonValue(body, "salle");
                    String description = extractJsonValue(body, "description");
                    
                    Classe newClasse = new Classe(nextId++, nom, niveau, section, effectifMax, salle, description, null);
                    classes.add(newClasse);
                    
                    String response = "{\"id\":" + newClasse.id + ",\"nom\":\"" + newClasse.nom + 
                                     "\",\"niveau\":\"" + newClasse.niveau + "\",\"section\":\"" + newClasse.section + 
                                     "\",\"effectifMax\":" + newClasse.effectifMax + ",\"effectifActuel\":0" +
                                     ",\"salle\":\"" + newClasse.salle + "\",\"description\":\"" + newClasse.description + 
                                     "\",\"createdAt\":\"" + newClasse.createdAt + "\"}";
                    sendResponse(exchange, 201, response);
                }
            } catch (Exception e) {
                sendResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    static class EleveHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            String method = exchange.getRequestMethod();
            
            try {
                if ("GET".equals(method)) {
                    String response = "[";
                    for (int i = 0; i < eleves.size(); i++) {
                        Eleve e = eleves.get(i);
                        String nomClasse = "Non assigné";
                        if (e.classeId != null) {
                            for (Classe c : classes) {
                                if (c.id == e.classeId) {
                                    nomClasse = c.nom;
                                    break;
                                }
                            }
                        }
                        
                        response += "{\"id\":" + e.id + ",\"nom\":\"" + e.nom + "\",\"prenom\":\"" + e.prenom + 
                                   "\",\"dateNaissance\":\"" + e.dateNaissance + "\",\"adresse\":\"" + e.adresse + 
                                   "\",\"telephone\":\"" + e.telephone + "\",\"email\":\"" + e.email + 
                                   "\",\"classeId\":" + e.classeId + ",\"nomClasse\":\"" + nomClasse + 
                                   "\",\"statut\":\"" + e.statut + "\",\"createdAt\":\"" + e.createdAt + "\"}";
                        if (i < eleves.size() - 1) response += ",";
                    }
                    response += "]";
                    sendResponse(exchange, 200, response);
                } else if ("POST".equals(method)) {
                    String body = readRequestBody(exchange);
                    String nom = extractJsonValue(body, "nom");
                    String prenom = extractJsonValue(body, "prenom");
                    String dateNaissance = extractJsonValue(body, "dateNaissance");
                    String adresse = extractJsonValue(body, "adresse");
                    String telephone = extractJsonValue(body, "telephone");
                    String email = extractJsonValue(body, "email");
                    Long classeId = Long.parseLong(extractJsonValue(body, "classeId"));
                    
                    Eleve newEleve = new Eleve(nextId++, nom, prenom, dateNaissance, adresse, telephone, email, classeId);
                    eleves.add(newEleve);
                    
                    String nomClasse = "Non assigné";
                    for (Classe c : classes) {
                        if (c.id == classeId) {
                            nomClasse = c.nom;
                            break;
                        }
                    }
                    
                    String response = "{\"id\":" + newEleve.id + ",\"nom\":\"" + newEleve.nom + 
                                     "\",\"prenom\":\"" + newEleve.prenom + "\",\"dateNaissance\":\"" + newEleve.dateNaissance + 
                                     "\",\"adresse\":\"" + newEleve.adresse + "\",\"telephone\":\"" + newEleve.telephone + 
                                     "\",\"email\":\"" + newEleve.email + "\",\"classeId\":" + newEleve.classeId + 
                                     ",\"nomClasse\":\"" + nomClasse + "\",\"statut\":\"" + newEleve.statut + 
                                     "\",\"createdAt\":\"" + newEleve.createdAt + "\"}";
                    sendResponse(exchange, 201, response);
                }
            } catch (Exception e) {
                sendResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    static class PersonnelHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "[";
                for (int i = 0; i < personnel.size(); i++) {
                    Personnel p = personnel.get(i);
                    response += "{\"id\":" + p.id + ",\"nom\":\"" + p.nom + "\",\"prenom\":\"" + p.prenom + 
                               "\",\"poste\":\"" + p.poste + "\",\"matiere\":\"" + p.matiere + 
                               "\",\"salaire\":" + p.salaire + ",\"telephone\":\"" + p.telephone + 
                               "\",\"email\":\"" + p.email + "\",\"statut\":\"" + p.statut + 
                               "\",\"createdAt\":\"" + p.createdAt + "\"}";
                    if (i < personnel.size() - 1) response += ",";
                }
                response += "]";
                sendResponse(exchange, 200, response);
            }
        }
    }

    static class NoteHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "[";
                for (int i = 0; i < notes.size(); i++) {
                    Note n = notes.get(i);
                    response += "{\"id\":" + n.id + ",\"valeur\":" + n.valeur + ",\"matiere\":\"" + n.matiere + 
                               "\",\"typeEvaluation\":\"" + n.typeEvaluation + "\",\"dateEvaluation\":\"" + n.dateEvaluation + 
                               "\",\"trimestre\":\"" + n.trimestre + "\",\"eleveId\":" + n.eleveId + 
                               ",\"enseignantId\":" + n.enseignantId + ",\"createdAt\":\"" + n.createdAt + "\"}";
                    if (i < notes.size() - 1) response += ",";
                }
                response += "]";
                sendResponse(exchange, 200, response);
            }
        }
    }

    static class PaiementHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "[";
                for (int i = 0; i < paiements.size(); i++) {
                    Paiement p = paiements.get(i);
                    response += "{\"id\":" + p.id + ",\"montant\":" + p.montant + ",\"mois\":\"" + p.mois + 
                               "\",\"annee\":" + p.annee + ",\"statut\":\"" + p.statut + 
                               "\",\"datePaiement\":" + (p.datePaiement != null ? "\"" + p.datePaiement + "\"" : "null") + 
                               ",\"modePaiement\":" + (p.modePaiement != null ? "\"" + p.modePaiement + "\"" : "null") + 
                               ",\"eleveId\":" + p.eleveId + ",\"createdAt\":\"" + p.createdAt + "\"}";
                    if (i < paiements.size() - 1) response += ",";
                }
                response += "]";
                sendResponse(exchange, 200, response);
            }
        }
    }

    static class HealthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            String response = "{\"status\":\"UP\",\"timestamp\":\"" + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + 
                             "\",\"data\":{\"classes\":" + classes.size() + ",\"eleves\":" + eleves.size() + 
                             ",\"personnel\":" + personnel.size() + ",\"notes\":" + notes.size() + 
                             ",\"paiements\":" + paiements.size() + "}}";
            sendResponse(exchange, 200, response);
        }
    }

    // Utilitaires
    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
            return body.toString();
        }
    }

    private static String extractJsonValue(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]+)\"";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        
        // Pour les nombres
        pattern = "\"" + key + "\"\\s*:\\s*([0-9]+)";
        p = java.util.regex.Pattern.compile(pattern);
        m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        
        return "";
    }
}