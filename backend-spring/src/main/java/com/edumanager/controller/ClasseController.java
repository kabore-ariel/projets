package com.edumanager.controller;

import com.edumanager.dto.ClasseDTO;
import com.edumanager.service.ClasseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Classes", description = "API de gestion des classes")
@CrossOrigin(origins = "http://localhost:3000")
public class ClasseController {
    
    private final ClasseService classeService;
    
    @GetMapping
    @Operation(summary = "Récupérer toutes les classes", description = "Retourne la liste de toutes les classes")
    @ApiResponse(responseCode = "200", description = "Liste des classes récupérée avec succès")
    public ResponseEntity<List<ClasseDTO>> getAllClasses() {
        log.debug("GET /classes - Récupération de toutes les classes");
        List<ClasseDTO> classes = classeService.findAll();
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une classe par ID", description = "Retourne une classe spécifique par son ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Classe trouvée"),
        @ApiResponse(responseCode = "404", description = "Classe non trouvée")
    })
    public ResponseEntity<ClasseDTO> getClasseById(
            @Parameter(description = "ID de la classe") @PathVariable Long id) {
        log.debug("GET /classes/{} - Récupération de la classe", id);
        ClasseDTO classe = classeService.findById(id);
        return ResponseEntity.ok(classe);
    }
    
    @GetMapping("/niveau/{niveau}")
    @Operation(summary = "Récupérer les classes par niveau", description = "Retourne toutes les classes d'un niveau donné")
    @ApiResponse(responseCode = "200", description = "Classes du niveau récupérées avec succès")
    public ResponseEntity<List<ClasseDTO>> getClassesByNiveau(
            @Parameter(description = "Niveau des classes") @PathVariable String niveau) {
        log.debug("GET /classes/niveau/{} - Récupération des classes du niveau", niveau);
        List<ClasseDTO> classes = classeService.findByNiveau(niveau);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/disponibles")
    @Operation(summary = "Récupérer les classes avec places disponibles", 
               description = "Retourne les classes qui ont encore des places disponibles")
    @ApiResponse(responseCode = "200", description = "Classes disponibles récupérées avec succès")
    public ResponseEntity<List<ClasseDTO>> getClassesAvecPlacesDisponibles() {
        log.debug("GET /classes/disponibles - Récupération des classes avec places disponibles");
        List<ClasseDTO> classes = classeService.findClassesAvecPlacesDisponibles();
        return ResponseEntity.ok(classes);
    }
    
    @PostMapping
    @Operation(summary = "Créer une nouvelle classe", description = "Crée une nouvelle classe")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Classe créée avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "409", description = "Classe avec ce nom existe déjà")
    })
    public ResponseEntity<ClasseDTO> createClasse(
            @Parameter(description = "Données de la classe à créer") @Valid @RequestBody ClasseDTO classeDTO) {
        log.debug("POST /classes - Création d'une nouvelle classe: {}", classeDTO.getNom());
        ClasseDTO createdClasse = classeService.create(classeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClasse);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une classe", description = "Met à jour une classe existante")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Classe mise à jour avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "404", description = "Classe non trouvée"),
        @ApiResponse(responseCode = "409", description = "Classe avec ce nom existe déjà")
    })
    public ResponseEntity<ClasseDTO> updateClasse(
            @Parameter(description = "ID de la classe") @PathVariable Long id,
            @Parameter(description = "Nouvelles données de la classe") @Valid @RequestBody ClasseDTO classeDTO) {
        log.debug("PUT /classes/{} - Mise à jour de la classe", id);
        ClasseDTO updatedClasse = classeService.update(id, classeDTO);
        return ResponseEntity.ok(updatedClasse);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une classe", description = "Supprime une classe existante")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Classe supprimée avec succès"),
        @ApiResponse(responseCode = "404", description = "Classe non trouvée"),
        @ApiResponse(responseCode = "409", description = "Impossible de supprimer une classe avec des élèves")
    })
    public ResponseEntity<Void> deleteClasse(
            @Parameter(description = "ID de la classe") @PathVariable Long id) {
        log.debug("DELETE /classes/{} - Suppression de la classe", id);
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{classeId}/enseignant-principal/{enseignantId}")
    @Operation(summary = "Assigner un enseignant principal", 
               description = "Assigne un enseignant comme enseignant principal d'une classe")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Enseignant principal assigné avec succès"),
        @ApiResponse(responseCode = "404", description = "Classe ou enseignant non trouvé"),
        @ApiResponse(responseCode = "400", description = "Le personnel n'est pas un enseignant")
    })
    public ResponseEntity<ClasseDTO> assignerEnseignantPrincipal(
            @Parameter(description = "ID de la classe") @PathVariable Long classeId,
            @Parameter(description = "ID de l'enseignant") @PathVariable Long enseignantId) {
        log.debug("PUT /classes/{}/enseignant-principal/{} - Assignation enseignant principal", 
                classeId, enseignantId);
        ClasseDTO classe = classeService.assignerEnseignantPrincipal(classeId, enseignantId);
        return ResponseEntity.ok(classe);
    }
    
    @PutMapping("/{classeId}/enseignants/{enseignantId}")
    @Operation(summary = "Assigner un enseignant", description = "Assigne un enseignant à une classe")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Enseignant assigné avec succès"),
        @ApiResponse(responseCode = "404", description = "Classe ou enseignant non trouvé"),
        @ApiResponse(responseCode = "400", description = "Le personnel n'est pas un enseignant")
    })
    public ResponseEntity<ClasseDTO> assignerEnseignant(
            @Parameter(description = "ID de la classe") @PathVariable Long classeId,
            @Parameter(description = "ID de l'enseignant") @PathVariable Long enseignantId) {
        log.debug("PUT /classes/{}/enseignants/{} - Assignation enseignant", classeId, enseignantId);
        ClasseDTO classe = classeService.assignerEnseignant(classeId, enseignantId);
        return ResponseEntity.ok(classe);
    }
    
    @DeleteMapping("/{classeId}/enseignants/{enseignantId}")
    @Operation(summary = "Retirer un enseignant", description = "Retire un enseignant d'une classe")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Enseignant retiré avec succès"),
        @ApiResponse(responseCode = "404", description = "Classe ou enseignant non trouvé")
    })
    public ResponseEntity<ClasseDTO> retirerEnseignant(
            @Parameter(description = "ID de la classe") @PathVariable Long classeId,
            @Parameter(description = "ID de l'enseignant") @PathVariable Long enseignantId) {
        log.debug("DELETE /classes/{}/enseignants/{} - Retrait enseignant", classeId, enseignantId);
        ClasseDTO classe = classeService.retirerEnseignant(classeId, enseignantId);
        return ResponseEntity.ok(classe);
    }
}