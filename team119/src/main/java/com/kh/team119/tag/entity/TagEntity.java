package com.kh.team119.tag.entity;

import com.kh.team119.tag.TagType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TAG")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TagEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagNo;
    private String tagName;

}
