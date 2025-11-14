package com.kh.team119.healthBoard.entity;

import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.TagEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Builder
@Getter
@Table(name = "HEALTH_BOARD_TAG")
@AllArgsConstructor
@NoArgsConstructor
public class HealthBoardTag {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bno", nullable = false, foreignKey = @ForeignKey(name = "FK_HEALTH_BOARD_NO_TO_HEALTH_BOARD_TAG"))
    private HealthBoardEntity healthBoard;

    private List<TagType> tag;

    public void unlink() {
        this.healthBoard = null;
        this.tag = null;
    }
}