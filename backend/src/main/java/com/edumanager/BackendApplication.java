package com.edumanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3002")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }

    // Données en mémoire
    private List<Map<String, Object>> classes = new ArrayList<>();
    private List<Map<String, Object>> eleves = new ArrayList<>();
    private List<Map<String, Object>> personnel = new ArrayList<>();

    // Initialisation des données
    {
        // Classes
        Map<String, Object> classe1 = new HashMap<>();
        classe1.put("id", 1);
        classe1.put("nom", "6ème A");
        classe1.put("niveau", "6ème");
        classe1.put("section", "A");
        classe1.put("effectifMax", 30);
        classe1.put("salle", "Salle 101");
        classe1.put("description", "Classe de 6ème section A");
        List<Map<String, Object>> matieres1 = new ArrayList<>();
        matieres1.add(Map.of("nom", "Mathématiques", "coefficient", 4));
        matieres1.add(Map.of("nom", "Français", "coefficient", 4));
        classe1.put("matieres", matieres1);
        classes.add(classe1);

        // Élèves
        Map<String, Object> eleve1 = new HashMap<>();
        eleve1.put("id", 1);
        eleve1.put("nom", "Dupont");
        eleve1.put("prenom", "Jean");
        eleve1.put("classeId", 1);
        eleve1.put("dateNaissance", "2010-05-15");
        eleve1.put("telephone", "0123456789");
        eleve1.put("email", "jean.dupont@email.com");
        eleve1.put("adresse", "123 Rue de la Paix, Abidjan");
        eleve1.put("paiementStatut", "paye");
        Map<String, List<Integer>> notes1 = new HashMap<>();
        notes1.put("mathematiques", Arrays.asList(15, 12, 18, 14));
        notes1.put("francais", Arrays.asList(16, 14, 15, 17));
        eleve1.put("notes", notes1);
        eleves.add(eleve1);

        // Personnel
        Map<String, Object> person1 = new HashMap<>();
        person1.put("id", 1);
        person1.put("nom", "Martin");
        person1.put("prenom", "Alice");
        person1.put("poste", "Enseignant");
        person1.put("matiere", "Mathématiques");
        person1.put("telephone", "123456789");
        person1.put("email", "alice@ecole.com");
        person1.put("adresse", "Cocody, Abidjan");
        personnel.add(person1);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "Backend is running");
    }

    // Classes endpoints
    @GetMapping("/classes")
    public List<Map<String, Object>> getClasses() {
        return classes;
    }

    @PostMapping("/classes")
    public Map<String, Object> createClasse(@RequestBody Map<String, Object> classe) {
        classe.put("id", classes.size() + 1);
        classes.add(classe);
        return classe;
    }

    @PutMapping("/classes/{id}")
    public Map<String, Object> updateClasse(@PathVariable int id, @RequestBody Map<String, Object> classe) {
        for (int i = 0; i < classes.size(); i++) {
            if ((Integer) classes.get(i).get("id") == id) {
                classe.put("id", id);
                classes.set(i, classe);
                return classe;
            }
        }
        return null;
    }

    // Élèves endpoints
    @GetMapping("/eleves")
    public List<Map<String, Object>> getEleves() {
        return eleves;
    }

    @PostMapping("/eleves")
    public Map<String, Object> createEleve(@RequestBody Map<String, Object> eleve) {
        eleve.put("id", eleves.size() + 1);
        eleves.add(eleve);
        return eleve;
    }

    @PutMapping("/eleves/{id}")
    public Map<String, Object> updateEleve(@PathVariable int id, @RequestBody Map<String, Object> eleve) {
        for (int i = 0; i < eleves.size(); i++) {
            if ((Integer) eleves.get(i).get("id") == id) {
                eleve.put("id", id);
                eleves.set(i, eleve);
                return eleve;
            }
        }
        return null;
    }

    // Personnel endpoints
    @GetMapping("/personnel")
    public List<Map<String, Object>> getPersonnel() {
        return personnel;
    }

    @PostMapping("/personnel")
    public Map<String, Object> createPersonnel(@RequestBody Map<String, Object> person) {
        person.put("id", personnel.size() + 1);
        personnel.add(person);
        return person;
    }

    @PutMapping("/personnel/{id}")
    public Map<String, Object> updatePersonnel(@PathVariable int id, @RequestBody Map<String, Object> person) {
        for (int i = 0; i < personnel.size(); i++) {
            if ((Integer) personnel.get(i).get("id") == id) {
                person.put("id", id);
                personnel.set(i, person);
                return person;
            }
        }
        return null;
    }

    // Notes endpoints
    @GetMapping("/notes")
    public Map<String, String> getNotes() {
        return Map.of("message", "Notes endpoint");
    }

    // Paiements endpoints
    @GetMapping("/paiements")
    public Map<String, String> getPaiements() {
        return Map.of("message", "Paiements endpoint");
    }
}