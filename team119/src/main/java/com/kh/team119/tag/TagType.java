package com.kh.team119.tag;

public enum TagType {

    // -------------------
    // 1. 건강 관련
    // -------------------
    HEALTH__GENERAL("건강"),
    HEALTH__SLEEP("수면건강"),
    HEALTH__CARDIOVASCULAR("심혈관건강"),
    HEALTH__DIGESTIVE("소화기건강"),
    HEALTH__BONE("뼈건강"),
    HEALTH__SKIN("피부건강"),
    HEALTH__EYE("눈건강"),
    HEALTH__EAR("귀건강"),
    HEALTH__FAMILY("가족건강"),
    HEALTH__CHRONIC_DISEASE("만성질환관리"),
    HEALTH__ALLERGY("알레르기관리"),
    HEALTH__PAIN("통증관리"),
    HEALTH__PREVENTION("예방"),
    CARDIOVASCULAR__LOW("심혈관_질환_주의"),
    CARDIOVASCULAR__MODERATE("심혈관_질환_예방_필요"),
    CARDIOVASCULAR__HIGH("심혈관_건강_양호"),
    METABOLIC__LOW("대사_질환_주의"),
    METABOLIC__MODERATE("대사_질환_예방_필요"),
    METABOLIC__HIGH("대사_건강상태_양호"),
    HEART__LOW("체성분,심박_불안정"),
    HEART__MODERATE("체성분,심박_대체로_안정"),
    HEART__HIGH("체성분,심박 매우 안정"),

    // -------------------
    // 2. 운동/피트니스
    // -------------------
    EXERCISE__GENERAL("운동"),
    EXERCISE__CARDIO("유산소운동"),
    EXERCISE__STRENGTH("근력운동"),
    EXERCISE__FLEXIBILITY("유연성운동"),
    EXERCISE__BALANCE("균형운동"),
    EXERCISE__YOGA("요가"),
    EXERCISE__PILATES("필라테스"),
    EXERCISE__AEROBIC_DANCE("에어로빅"),
    EXERCISE__CYCLING("자전거타기"),
    EXERCISE__RUNNING("달리기"),
    EXERCISE__SWIMMING("수영"),
    EXERCISE__WALKING("걷기"),
    EXERCISE__STRETCHING("스트레칭"),
    EXERCISE__HIIT("고강도인터벌트레이닝"),
    EXERCISE__BODYWEIGHT("맨몸운동"),
    EXERCISE__WEIGHTLIFTING("웨이트트레이닝"),
    EXERCISE__PERSONAL_TRAINING("퍼스널트레이닝"),
    AEROBIC__LOW("유산소_활동_낮음"),
    AEROBIC__MODERATE("유산소_활동_보통"),
    AEROBIC__HIGH("유산소_활동_우수"),
    STRENGTH__LOW("근력운동_활동_낮음"),
    STRENGTH__MODERATE("근력운동_활동_보통"),
    STRENGTH__HIGH("근력운동_활동_우수"),

    // -------------------
    // 3. 영양/식단/보충제
    // -------------------
    NUTRIENT__GENERAL("영양"),
    NUTRIENT__VITAMIN_A("비타민-A"),
    NUTRIENT__VITAMIN_B("비타민-B"),
    NUTRIENT__VITAMIN_C("비타민-C"),
    NUTRIENT__VITAMIN_D("비타민-D"),
    NUTRIENT__VITAMIN_E("비타민-E"),
    NUTRIENT__VITAMIN_K("비타민-K"),
    NUTRIENT__MINERALS("미네랄"),
    NUTRIENT__CALCIUM("칼슘"),
    NUTRIENT__IRON("철분"),
    NUTRIENT__MAGNESIUM("마그네슘"),
    NUTRIENT__ZINC("아연"),
    NUTRIENT__OMEGA3("오메가-3"),
    NUTRIENT__PROTEIN("단백질"),
    NUTRIENT__FIBER("식이섬유"),
    NUTRIENT__ANTIOXIDANTS("항산화제"),
    NUTRIENT__HERBAL_SUPPLEMENTS("허브보조식품"),
    NUTRIENT__SUPPLEMENTS("보충제"),
    NUTRITION__LOW("영양상태_불균형"),
    NUTRITION__MODERATE("영양상태_양호"),
    NUTRITION__HIGH("영양상태_우수"),

    // --- 탄수화물 세부 (추가 제안) ---
    CARBS__COMPLEX("복합탄수"),
    CARBS__SIMPLE("단순당"),
    CARBS__RESISTANT_STARCH("저항성 전분"),
    CARBS__LOW_GI("저혈당"),
    CARBS__HIGH_GI("고혈당"),
    CARBS__WHOLE_GRAINS("통곡물"),
    CARBS__REFINED_GRAINS("정제곡물"),
    CARBS__ADDED_SUGARS("첨가당"),

    // --- 식단 유형 ---
    DIET__BALANCED("균형식단"),
    DIET__HIGH_CARB("고탄수화물"),
    DIET__LOW_CARB("저탄수화물"),
    DIET__HIGH_PROTEIN("고단백질"),
    DIET__KETO("키토제닉"),
    DIET__MEDITERRANEAN("지중해식"),
    DIET__PALEO("팔레오"),
    DIET__LOW_FAT("저지방"),
    DIET__VEGAN("비건"),
    DIET__GLUTEN_FREE("글루텐프리"),
    DIET__LACTOSE_FREE("무유당"),
    DIET__CARB_CYCLING("탄수사이클링"),

    // -------------------
    // 4. 정신/명상/스트레스
    // -------------------
    MENTAL__MEDITATION("명상"),
    MENTAL__STRESS_MANAGEMENT("스트레스관리"),
    MENTAL__HEALTH("정신건강"),
    SLEEP__LOW("수면_부족"),
    SLEEP__MODERATE("수면_보통"),
    SLEEP__HIGH("수면_과다"),
    STRESS__LOW("스트레스_낮음"),
    STRESS__MODERATE("스트레스_보통"),
    STRESS__HIGH("스트레스_높음"),
    MOOD__LOW("우울증_주의"),
    MOOD__MODERATE("중간정도_우울"),
    MOOD__HIGH("정상"),
    SLEEPEMOTION__LOW("부분적_영향"),
    SLEEPEMOTION__MODERATE("대체로_안정"),
    SLEEPEMOTION__HIGH("매우_안정"),
    FOCUSFATIGUE__LOW("집중력_낮음,피로도_높음"),
    FOCUSFATIGUE__MODERATE("집중력,피로도_보통"),
    FOCUSFATIGUE__HIGH("집중력_우수,피로도_낮음"),
    ANXIETY__LOW("불안_높음"),
    ANXIETY__MODERATE("중간정도_불안"),
    ANXIETY__HIGH("불안_낮음"),

    // -------------------
    // 5. 치료/재활/의료
    // -------------------
    MEDICAL__PHYSICAL_THERAPY("물리치료"),
    MEDICAL__REHABILITATION("재활"),
    MEDICAL__GENERAL("의료"),

    // -------------------
    // 6. 기타/상태
    // -------------------
    CONDITION__DIABETES("당뇨"),
    CONDITION__HYPERTENSION("고혈압"),
    CONDITION__OBESITY("비만"),
    CONDITION__HYPERLIPIDEMIA("고지혈증"),
    CONDITION__NAFLD("지방간"),
    CONDITION__THYROID("갑상선"),
    CONDITION__PCOS("다낭성난소증후군"),

    LIFESTYLE__NON_SMOKER("비흡연자"),
    LIFESTYLE__SMOKER("흡연자"),
    LIFESTYLE__EX_SMOKER("과거흡연자"),
    LIFEBALANCE__LOW("워라벨_낮음"),
    LIFEBALANCE__MODERATE("워라벨_보통"),
    LIFEBALANCE__HIGH("워라벨_높음"),
    DIGITALHABIT__LOW("디지털사용습관_주의"),
    DIGITALHABIT__MODERATE("디지털사용습관_적정"),
    DIGITALHABIT__HIGH("디지털사용습관_좋음"),
    LEISURE__LOW("취미활동_부족"),
    LEISURE__MODERATE("취미활동_보통"),
    LEISURE__HIGH("취미활동_우수"),

    OTHER__ANTI_AGING("항노화"),
    OTHER__IMMUNITY("면역력"),
    OTHER__WEIGHT_LOSS("체중감량");

    private final String desc;

    TagType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }

    public static TagType descToTagType(String tagName) {
        for (TagType tag : TagType.values()) {
            if (!tag.getDesc().equals(tagName))
                continue;
            return tag;
        }
        return null;
    }
}
