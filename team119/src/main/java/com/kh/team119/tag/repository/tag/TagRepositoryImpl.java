package com.kh.team119.tag.repository.tag;

import com.kh.team119.tag.entity.QTagEntity;
import com.kh.team119.tag.entity.TagEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.tag.entity.QTagEntity.tagEntity;

@RequiredArgsConstructor
public class TagRepositoryImpl implements TagRepositoryCustom{

    private final JPAQueryFactory queryFactory;


}
