    package com.kh.team119.research.repository;

    import com.kh.team119.club.board.entity.BoardEntity;
    import com.kh.team119.club.board.enums.Status;
    import com.kh.team119.research.entity.QResearchEntity;
    import com.kh.team119.research.entity.ResearchEntity;
    import com.querydsl.core.types.dsl.BooleanExpression;
    import com.querydsl.jpa.impl.JPAQueryFactory;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.support.PageableExecutionUtils;

    import java.util.List;

    import static com.kh.team119.research.entity.QResearchEntity.researchEntity;


    @RequiredArgsConstructor
    public class ResearchRepositoryImpl implements ResearchRepositoryCustom{

        private final JPAQueryFactory queryFactory;

        @Override
        public List<ResearchEntity> LookUp(String category) {
            BooleanExpression cond1 = researchEntity.category.stringValue().eq(category);
            BooleanExpression cond2 = researchEntity.deletedAt.isNull();
            return queryFactory.selectFrom(researchEntity)
                    .where(cond1, cond2)
                    .orderBy(researchEntity.no.desc())
                    .fetch();
        }
    }
