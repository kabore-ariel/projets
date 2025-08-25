package com.edumanager.mapper;

import com.edumanager.dto.ClasseDTO;
import com.edumanager.entity.Classe;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PersonnelMapper.class, EleveMapper.class})
public interface ClasseMapper {
    
    @Mapping(target = "effectifActuel", expression = "java(classe.getEffectifActuel())")
    @Mapping(target = "complete", expression = "java(classe.isComplete())")
    ClasseDTO toDTO(Classe classe);
    
    List<ClasseDTO> toDTO(List<Classe> classes);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "eleves", ignore = true)
    @Mapping(target = "enseignantPrincipal", ignore = true)
    @Mapping(target = "enseignants", ignore = true)
    Classe toEntity(ClasseDTO classeDTO);
    
    @Mapping(target = "effectifActuel", expression = "java(classe.getEffectifActuel())")
    ClasseDTO.ClasseSimpleDTO toSimpleDTO(Classe classe);
    
    List<ClasseDTO.ClasseSimpleDTO> toSimpleDTO(List<Classe> classes);
}