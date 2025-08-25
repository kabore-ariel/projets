package com.edumanager.mapper;

import com.edumanager.dto.EleveDTO;
import com.edumanager.entity.Eleve;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ClasseMapper.class})
public interface EleveMapper {
    
    @Mapping(target = "nomComplet", expression = "java(eleve.getNomComplet())")
    @Mapping(target = "age", expression = "java(eleve.getAge())")
    @Mapping(target = "nombreNotes", expression = "java((long) eleve.getNotes().size())")
    EleveDTO toDTO(Eleve eleve);
    
    List<EleveDTO> toDTO(List<Eleve> eleves);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "classe", ignore = true)
    @Mapping(target = "notes", ignore = true)
    @Mapping(target = "paiements", ignore = true)
    Eleve toEntity(EleveDTO eleveDTO);
    
    @Mapping(target = "nomComplet", expression = "java(eleve.getNomComplet())")
    EleveDTO.EleveSimpleDTO toSimpleDTO(Eleve eleve);
    
    List<EleveDTO.EleveSimpleDTO> toSimpleDTO(List<Eleve> eleves);
}