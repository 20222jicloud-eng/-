export type GasId = 'oxygen' | 'co2' | 'nitrogen' | 'helium' | 'hydrogen' | 'neon';

export type ExperimentId = 'flame' | 'limewater' | 'weight' | 'electric';

export interface EverydayUseCase {
  id: string;
  place: string;
  objectName: string;
  useSummary: string;
  whyReason: string;
}

export interface ExperimentResult {
  outcomeTitle: string;
  observation: string;
  visualState:
    | 'bright-burn'
    | 'extinguish'
    | 'pop-burn'
    | 'no-change'
    | 'cloudy'
    | 'clear'
    | 'float-up'
    | 'float-mid'
    | 'sink-down'
    | 'glow-orange'
    | 'no-glow';
}

export interface CardSceneVariant {
  id: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
  customIllustrationType?:
    | 'hospital-oxygen'
    | 'welding-oxygen'
    | 'dryice-co2'
    | 'liquid-nitrogen'
    | 'weather-helium'
    | 'rocket-hydrogen'
    | 'airport-neon';
  skillTitle: string;
  skillDesc: string;
  powerLabel: string;
}

export interface GasInfo {
  id: GasId;
  name: string;
  symbol: string;
  englishName: string;
  airShareText: string;
  colorClass: string;
  surfaceClass: string;
  accentHex: string;
  shortTagline: string;
  colorSmell: string;
  weightComparison: string;
  keyProperties: string[];
  answerIllustration: string;
  answerIllustrationAlt: string;
  labImage?: string;
  labImageAlt?: string;
  experiments: Record<ExperimentId, ExperimentResult>;
  everydayUses: EverydayUseCase[];
  workbookModelProperties: string;
  workbookModelUses: string;
  cardVariants: CardSceneVariant[];
}

export interface StepBulletPoint {
  label: string;
  text: string;
}

export interface StepMiniQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  successNote: string;
}

export interface SceneHotspot {
  id: string;
  number: number;
  label: string;
  pinShortLabel: string;
  placeLabel: string;
  gasId: GasId;
  xPercent: number;
  yPercent: number;
  isOnMap: boolean;
  clueQuestion: string;
  clueHint: string;
  discoveryTitle: string;
  step1Property: string;
  step1Points: StepBulletPoint[];
  step1Quiz: StepMiniQuiz;
  step1Image: string;
  step1ImageAlt: string;
  step2WhyUse: string;
  step2Points: StepBulletPoint[];
  step2Quiz: StepMiniQuiz;
  step2Image: string;
  step2ImageAlt: string;
  step3MoreUses: string;
  step3Points: StepBulletPoint[];
  step3Quiz: StepMiniQuiz;
  step3Image: string;
  step3ImageAlt: string;
}

export interface QuizMission {
  id: string;
  caseNumber: string;
  situation: string;
  hint: string;
  correctGasId: GasId;
  explanation: string;
}

export const GENERATED_IMAGES = {
  heroTownPanorama: '/src/assets/images/hero_town_6_clean_1794556177543.jpg',
  heroTown: '/src/assets/images/hero_gases_town_6zones_1794554699436.jpg',
  labOxygen: '/src/assets/images/lab_oxygen_experiment_1794546106277.jpg',
  step2OxygenBreathing: '/src/assets/images/step2_oxygen_breathing_1794555890380.jpg',
  labCo2: '/src/assets/images/step1_co2_properties_1794554701348.jpg',
  labHeliumOnly: '/src/assets/images/lab_helium_only_1794552786364.jpg',
  labNitrogenOnly: '/src/assets/images/step1_nitrogen_air_1794554700258.jpg',
  labNeonTube: '/src/assets/images/step1_neon_tube_1794554703793.jpg',
  step3NitrogenFreezeTire: '/src/assets/images/step3_nitrogen_freeze_tire_1794554700889.jpg',
  step3HeliumWeather: '/src/assets/images/step3_helium_weather_1794554701117.jpg',
  step3Co2DryiceMore: '/src/assets/images/step3_co2_dryice_v2_1794556285681.jpg',
  step3HydrogenRocket: '/src/assets/images/step3_hydrogen_rocket_1794554703493.jpg',
  cardNitrogenChips: '/src/assets/images/card_nitrogen_chips_1794547134433.jpg',
  cardOxygenDiver: '/src/assets/images/card_oxygen_diver_1794547135280.jpg',
  cardCo2Soda: '/src/assets/images/card_co2_soda_1794547136019.jpg',
  cardHeliumBalloons: '/src/assets/images/card_helium_balloons_1794547136620.jpg',
  cardHydrogenBus: '/src/assets/images/card_hydrogen_bus_1794547136704.jpg',
  cardNeonSign: '/src/assets/images/card_neon_sign_1794547137858.jpg',
  answerOxygenPencil: '/src/assets/images/answer_oxygen_pencil_1794548820672.jpg',
  answerHeliumPencil: '/src/assets/images/answer_helium_pencil_1794548821012.jpg',
  answerNitrogenPencil: '/src/assets/images/answer_nitrogen_pencil_1794548821884.jpg',
  answerCo2Pencil: '/src/assets/images/answer_co2_pencil_1794548821812.jpg',
  answerNeonPencil: '/src/assets/images/answer_neon_pencil_1794548822022.jpg',
  answerHydrogenPencil: '/src/assets/images/answer_hydrogen_pencil_1794548823438.jpg',
  answerNeonAirportPencil: '/src/assets/images/answer_neon_airport_pencil_1794549383879.jpg',
  answerHydrogenSciencePencil: '/src/assets/images/answer_hydrogen_science_pencil_1794549383752.jpg',
} as const;

export const GASES_DATA: GasInfo[] = [
  {
    id: 'oxygen',
    name: '산소',
    symbol: 'O₂',
    englishName: 'Oxygen',
    airShareText: '공기의 약 21%',
    colorClass: 'text-sky-700',
    surfaceClass: 'bg-sky-50 border-sky-200',
    accentHex: '#0284C7',
    shortTagline: '생물이 숨 쉬게 하고 불이 잘 타도록 도와주는 기체',
    colorSmell: '색깔과 냄새가 없음',
    weightComparison: '공기보다 아주 조금 무거움',
    keyProperties: [
      '색깔과 냄새가 없습니다.',
      '스스로 타지는 않지만, 다른 물질이 잘 타도록 돕는 성질이 있습니다.',
      '사람과 동물이 숨을 쉬고 살아가는 데 꼭 필요합니다.',
      '물에 아주 조금 녹아 물고기도 아가미로 숨을 쉴 수 있습니다.',
    ],
    answerIllustration: GENERATED_IMAGES.answerOxygenPencil,
    answerIllustrationAlt: '공원에서 맑은 산소 공기를 들이마시며 웃는 어린이와 산소 캐릭터의 색연필화 그림',
    labImage: GENERATED_IMAGES.labOxygen,
    labImageAlt: '산소가 든 유리병 속에서 향불이 밝게 타오르는 과학 실험 그림',
    experiments: {
      flame: {
        outcomeTitle: '불꽃이 훨씬 밝고 세게 타오릅니다',
        observation:
          '꺼져 가는 향불을 산소 병에 넣으면 불씨가 다시 살아나며 환하게 타오릅니다. 산소가 다른 물질이 타는 것을 도와주기 때문입니다.',
        visualState: 'bright-burn',
      },
      limewater: {
        outcomeTitle: '석회수에 변화가 없습니다',
        observation:
          '맑은 석회수와 산소를 섞어 흔들어도 석회수는 맑고 투명한 모습 그대로입니다.',
        visualState: 'clear',
      },
      weight: {
        outcomeTitle: '공기와 비슷한 높이로 떠 있습니다',
        observation:
          '산소는 공기와 무게가 거의 비슷해서 헬륨 풍선처럼 하늘로 솟구치지 않습니다.',
        visualState: 'float-mid',
      },
      electric: {
        outcomeTitle: '눈에 보이지 않고 빛을 내지 않습니다',
        observation:
          '산소는 색깔과 냄새가 없고, 네온처럼 전기를 통했을 때 밝은 색 빛을 내는 간판 기체는 아닙니다.',
        visualState: 'no-glow',
      },
    },
    everydayUses: [
      {
        id: 'ox-1',
        place: '병원 · 응급실',
        objectName: '산소 호흡기',
        useSummary: '숨쉬기 어려운 환자에게 맑은 산소를 공급합니다.',
        whyReason: '우리 몸이 에너지를 만들고 생명을 유지하려면 산소가 꼭 필요하기 때문입니다.',
      },
      {
        id: 'ox-2',
        place: '바닷속 · 높은 산 · 화재 현장',
        objectName: '잠수부·소방관 산소통',
        useSummary: '물속이나 연기가 가득한 곳에서도 안전하게 숨을 쉬도록 돕습니다.',
        whyReason: '공기가 부족하거나 유독 가스가 있는 곳에서 호흡할 수 있는 산소를 담아 휴대할 수 있기 때문입니다.',
      },
      {
        id: 'ox-3',
        place: '공장 · 우주 발사대',
        objectName: '금속 용접기와 로켓 연료',
        useSummary: '쇠를 녹여 붙이거나 우주 로켓을 힘차게 발사할 때 씁니다.',
        whyReason: '산소가 물질을 아주 뜨겁고 세게 태우도록 도와주는 성질이 있기 때문입니다.',
      },
    ],
    workbookModelProperties:
      '색깔과 냄새가 없다. 다른 물질이 잘 타도록 돕고, 생물이 숨을 쉬는 데 꼭 필요하다.',
    workbookModelUses:
      '잠수부와 소방관의 산소통, 병원의 산소 호흡기(숨 쉬는 데 꼭 필요하기 때문), 금속 용접(불이 잘 타도록 돕기 때문)',
    cardVariants: [
      {
        id: 'ox-diver',
        title: '바닷속 잠수 탐험가 산소',
        subtitle: '깊은 물속에서도 숨을 쉴 수 있게 도와줘요!',
        imageSrc: GENERATED_IMAGES.cardOxygenDiver,
        skillTitle: '생명 호흡 도우미',
        skillDesc: '잠수부의 공기통에 들어가 바닷속 물고기 친구들과 함께 안전하게 숨 쉴 수 있게 해 줍니다.',
        powerLabel: '호흡 에너지 100',
      },
      {
        id: 'ox-park',
        title: '초록 공원 맑은 숨 산소',
        subtitle: '우리가 신나게 뛰어놀 때 꼭 필요한 생명 기체!',
        imageSrc: GENERATED_IMAGES.answerOxygenPencil,
        skillTitle: '상쾌한 활력 충전',
        skillDesc: '색깔과 냄새는 없지만 공기의 21%를 차지하며 사람과 동물이 힘차게 움직이도록 도와줍니다.',
        powerLabel: '활력 충전 98',
      },
      {
        id: 'ox-lab',
        title: '반짝 불꽃 지킴이 산소',
        subtitle: '꺼져 가는 불씨를 다시 환하게 살려요!',
        imageSrc: GENERATED_IMAGES.labOxygen,
        skillTitle: '타오르는 불꽃 부스터',
        skillDesc: '다른 물질이 잘 타도록 도와주어 용접기나 로켓에서도 꼭 필요한 힘을 발휘합니다.',
        powerLabel: '불꽃 도움 95',
      },
      {
        id: 'ox-hospital',
        title: '응급실 히어로 산소 호흡기',
        subtitle: '숨쉬기 힘든 환자분께 맑은 숨을 전해요!',
        customIllustrationType: 'hospital-oxygen',
        skillTitle: '건강 회복 바람',
        skillDesc: '병원 응급실과 구급차에서 숨 쉬는 데 어려움을 겪는 사람들에게 맑은 산소를 전해 줍니다.',
        powerLabel: '생명 수호 100',
      },
    ],
  },
  {
    id: 'co2',
    name: '이산화 탄소',
    symbol: 'CO₂',
    englishName: 'Carbon Dioxide',
    airShareText: '공기의 약 0.04%',
    colorClass: 'text-amber-700',
    surfaceClass: 'bg-amber-50 border-amber-200',
    accentHex: '#D97706',
    shortTagline: '불을 끄고 석회수를 뿌옇게 만들며 톡 쏘는 맛을 내는 기체',
    colorSmell: '색깔과 냄새가 없음',
    weightComparison: '공기보다 무거워 아래로 가라앉음',
    keyProperties: [
      '색깔과 냄새가 없습니다.',
      '공기보다 무거워서 아래쪽으로 가라앉습니다.',
      '다른 물질이 타는 것을 막아 불을 끄는 성질이 있습니다.',
      '석회수를 만나면 우유처럼 뿌옇게 흐리게 만듭니다.',
      '물에 잘 녹아 시원하고 톡 쏘는 맛(탄산)을 냅니다.',
    ],
    answerIllustration: GENERATED_IMAGES.answerCo2Pencil,
    answerIllustrationAlt: '톡 쏘는 탄산음료 거품과 작은 불을 끄는 소화기의 색연필화 그림',
    labImage: GENERATED_IMAGES.labCo2,
    labImageAlt: '무거운 이산화 탄소로 촛불이 꺼지고 석회수가 뿌옇게 흐려지는 실험 그림',
    experiments: {
      flame: {
        outcomeTitle: '불꽃이 곧바로 꺼집니다',
        observation:
          '타고 있던 향불이나 촛불에 이산화 탄소를 부으면 불이 바로 꺼집니다. 산소를 막아 불이 타지 못하게 하기 때문입니다.',
        visualState: 'extinguish',
      },
      limewater: {
        outcomeTitle: '맑은 석회수가 뿌옇게 흐려집니다',
        observation:
          '투명하던 석회수에 이산화 탄소를 넣고 흔들면 하얀 앙금이 생기며 우윳빛으로 뿌옇게 변합니다.',
        visualState: 'cloudy',
      },
      weight: {
        outcomeTitle: '공기보다 무거워 아래로 가라앉습니다',
        observation:
          '이산화 탄소가 든 풍선은 공기 중에서 위로 뜨지 않고 바닥 쪽으로 내려갑니다.',
        visualState: 'sink-down',
      },
      electric: {
        outcomeTitle: '색깔과 냄새가 보이지 않습니다',
        observation:
          '투명한 기체라서 눈으로는 보이지 않고, 탄산음료 거품이나 드라이아이스의 연기로 흔적을 확인할 수 있습니다.',
        visualState: 'no-glow',
      },
    },
    everydayUses: [
      {
        id: 'co2-1',
        place: '학교 복도 · 건물 벽',
        objectName: '이산화 탄소 소화기',
        useSummary: '불이 났을 때 뿌려서 불을 빠르게 끕니다.',
        whyReason: '공기보다 무거워 불꽃을 덮어 주고, 다른 물질이 타는 것을 막는 성질이 있기 때문입니다.',
      },
      {
        id: 'co2-2',
        place: '카페 · 마트 음료 코너',
        objectName: '탄산음료 (사이다, 콜라, 탄산수)',
        useSummary: '음료수 속에 녹아 톡 쏘는 시원한 맛과 거품을 만듭니다.',
        whyReason: '이산화 탄소가 물에 잘 녹아 약한 산성 맛을 내는 성질이 있기 때문입니다.',
      },
      {
        id: 'co2-3',
        place: '아이스크림 가게 · 택배 상자',
        objectName: '드라이아이스',
        useSummary: '아이스크림이나 냉동식품이 녹지 않도록 아주 차갑게 보관합니다.',
        whyReason: '이산화 탄소를 차갑게 얼려 고체로 만든 것이 드라이아이스이며, 녹을 때 물이 생기지 않아 깔끔합니다.',
      },
    ],
    workbookModelProperties:
      '색깔과 냄새가 없고 공기보다 무겁다. 불을 끄고, 석회수를 뿌옇게 흐리게 하며, 물에 잘 녹는다.',
    workbookModelUses:
      '소화기(공기보다 무겁고 불을 끄는 성질 때문), 탄산음료(물에 잘 녹아 톡 쏘는 맛을 내기 때문), 드라이아이스(식품을 차갑게 보관하기 위함)',
    cardVariants: [
      {
        id: 'co2-soda',
        title: '톡 쏘는 탄산 & 소화기 히어로',
        subtitle: '시원한 거품도 만들고 불도 끄는 만능 기체!',
        imageSrc: GENERATED_IMAGES.cardCo2Soda,
        skillTitle: '탄산 팡팡 & 불꽃 진압',
        skillDesc: '물속에 녹아 톡 쏘는 탄산음료를 만들고, 불이 났을 때는 공기보다 무거운 힘으로 불꽃을 덮어 끕니다.',
        powerLabel: '소화·탄산 98',
      },
      {
        id: 'co2-dryice',
        title: '하얀 연기 드라이아이스 요정',
        subtitle: '아이스크림 보관부터 온실·구명조끼까지!',
        imageSrc: GENERATED_IMAGES.step3Co2DryiceMore,
        skillTitle: '차가운 냉기 보호막',
        skillDesc: '이산화 탄소를 꽁꽁 얼려 만든 드라이아이스는 물이 생기지 않아 냉동 포장에 딱 좋고 식물 성장도 돕습니다.',
        powerLabel: '시원함 100',
      },
      {
        id: 'co2-pencil',
        title: '톡톡 거품 실험 대장 이산화 탄소',
        subtitle: '색연필 동화 속 탄산과 소화기 히어로!',
        imageSrc: GENERATED_IMAGES.answerCo2Pencil,
        skillTitle: '무거운 공기 수호 방패',
        skillDesc: '공기보다 무거워 아래로 가라앉는 성질로 불꽃을 빠르게 덮어 끄고, 물속에서 톡 쏘는 거품을 만듭니다.',
        powerLabel: '불꽃 진압 97',
      },
      {
        id: 'co2-lab',
        title: '석회수 변신 과학 마법사',
        subtitle: '맑은 석회수를 우유처럼 뿌옇게 바꿔요!',
        imageSrc: GENERATED_IMAGES.labCo2,
        skillTitle: '뿌연 석회수 반응',
        skillDesc: '맑은 석회수와 만나면 하얗고 뿌옇게 변하는 특별한 성질로 이산화 탄소를 바로 찾아낼 수 있습니다.',
        powerLabel: '관찰 특징 96',
      },
    ],
  },
  {
    id: 'nitrogen',
    name: '질소',
    symbol: 'N₂',
    englishName: 'Nitrogen',
    airShareText: '공기의 약 78% (가장 많음)',
    colorClass: 'text-emerald-700',
    surfaceClass: 'bg-emerald-50 border-emerald-200',
    accentHex: '#059669',
    shortTagline: '공기 중에 가장 많고 음식이 상하거나 부서지지 않게 지키는 기체',
    colorSmell: '색깔과 냄새가 없음',
    weightComparison: '공기와 무게가 거의 비슷함',
    keyProperties: [
      '색깔과 냄새가 없습니다.',
      '우리가 숨 쉬는 공기 중에서 가장 많은 양(약 78%)을 차지합니다.',
      '다른 물질과 잘 반응하지 않아 물건이나 음식이 변하는 것을 막아 줍니다.',
      '온도를 아주 낮추면 차가운 액체 질소가 됩니다.',
    ],
    answerIllustration: GENERATED_IMAGES.answerNitrogenPencil,
    answerIllustrationAlt: '바삭한 과자 봉지를 보호하는 초록 방패 질소 캐릭터의 색연필화 그림',
    labImage: GENERATED_IMAGES.labNitrogenOnly,
    labImageAlt: '공기 중 78%를 차지하며 다른 물질과 잘 반응하지 않는 질소 실험 그림',
    experiments: {
      flame: {
        outcomeTitle: '향불이 타지 못하고 꺼집니다',
        observation:
          '질소만 가득한 병에 불이 붙은 향을 넣으면 산소가 없어서 불이 꺼집니다.',
        visualState: 'extinguish',
      },
      limewater: {
        outcomeTitle: '석회수에 변화가 없습니다',
        observation:
          '질소는 다른 물질과 잘 어울려 반응하지 않아서 석회수가 맑은 상태로 유지됩니다.',
        visualState: 'clear',
      },
      weight: {
        outcomeTitle: '공기와 비슷한 높이로 머뭅니다',
        observation:
          '공기의 대부분이 질소이기 때문에 공기 중에서의 무게가 공기와 거의 같습니다.',
        visualState: 'float-mid',
      },
      electric: {
        outcomeTitle: '변화 없이 안정된 상태를 유지합니다',
        observation:
          '다른 물질을 상하게 하거나 색을 바꾸지 않아 식품 포장 안에서 보호막 역할을 합니다.',
        visualState: 'no-glow',
      },
    },
    everydayUses: [
      {
        id: 'n2-1',
        place: '매점 · 마트 과자 코너',
        objectName: '빵빵한 과자 봉지',
        useSummary: '봉지 속을 가득 채워 과자가 부서지거나 상하지 않게 지켜 줍니다.',
        whyReason: '다른 물질과 잘 반응하지 않아 음식의 맛과 바삭함을 오래 유지시켜 주기 때문입니다.',
      },
      {
        id: 'n2-2',
        place: '냉동 식품 공장 · 연구실',
        objectName: '액체 질소 급속 냉동',
        useSummary: '음식이나 식물 씨앗, 세포 등을 아주 빠르게 얼려 오래 보관합니다.',
        whyReason: '액체 질소는 영하 196도 정도로 매우 차가워서 순식간에 얼릴 수 있기 때문입니다.',
      },
      {
        id: 'n2-3',
        place: '자동차 정비소 · 비행기 바퀴',
        objectName: '타이어 질소 충전',
        useSummary: '자동차나 비행기 타이어가 쉽게 터지거나 바람이 빠지지 않게 합니다.',
        whyReason: '온도가 변해도 부피 변화가 적고 바퀴 안쪽 고무가 상하는 것을 막아 주기 때문입니다.',
      },
    ],
    workbookModelProperties:
      '색깔과 냄새가 없고 공기 중에서 가장 많은 양(약 78%)을 차지한다. 다른 물질과 잘 반응하지 않아 음식 등이 변하는 것을 막는다.',
    workbookModelUses:
      '과자 봉지 충전(과자가 부서지거나 상하지 않게 보호하기 위함), 냉동 보관(액체 질소로 아주 차갑게 보관하기 위함), 타이어 충전',
    cardVariants: [
      {
        id: 'n2-chips',
        title: '과자 봉지 수호천사 질소',
        subtitle: '바삭바삭 과자가 부서지지 않게 지켜 줘요!',
        imageSrc: GENERATED_IMAGES.cardNitrogenChips,
        skillTitle: '푹신한 신선 보호막',
        skillDesc: '다른 물질과 잘 반응하지 않는 성질 덕분에 과자가 눅눅해지거나 부서지지 않도록 꽉 채워 지켜 줍니다.',
        powerLabel: '보호력 100',
      },
      {
        id: 'n2-ice',
        title: '영하 196도 얼음 마법사 액체 질소',
        subtitle: '딸기와 씨앗을 꽁꽁 얼리고 타이어도 채워요!',
        imageSrc: GENERATED_IMAGES.step3NitrogenFreezeTire,
        skillTitle: '초스피드 급속 냉동',
        skillDesc: '아주 차가운 액체 질소로 음식과 씨앗을 빠르게 얼려 보관하고, 자동차와 비행기 타이어에도 채워 안전을 지킵니다.',
        powerLabel: '냉동 파워 99',
      },
      {
        id: 'n2-shield',
        title: '초록 방패 신선 지킴이 질소',
        subtitle: '음식이 상하지 않게 막아 주는 든든한 방패!',
        imageSrc: GENERATED_IMAGES.answerNitrogenPencil,
        skillTitle: '변함없는 신선 방패',
        skillDesc: '산소 대신 식품 속에 들어가 맛이 변하는 것을 막아 주어 언제나 바삭하고 맛있는 간식을 지킵니다.',
        powerLabel: '방어력 99',
      },
      {
        id: 'n2-desk',
        title: '공기 78% 최다 멤버 질소',
        subtitle: '우리가 숨 쉬는 공기 중 가장 많은 기체!',
        imageSrc: GENERATED_IMAGES.labNitrogenOnly,
        skillTitle: '공기 속 최다 멤버',
        skillDesc: '공기의 약 78%를 차지하며 다른 물질과 쉽게 반응하지 않아 지구의 공기를 안정적으로 지켜 줍니다.',
        powerLabel: '안정성 98',
      },
    ],
  },
  {
    id: 'helium',
    name: '헬륨',
    symbol: 'He',
    englishName: 'Helium',
    airShareText: '공기 중 아주 적은 양',
    colorClass: 'text-rose-700',
    surfaceClass: 'bg-rose-50 border-rose-200',
    accentHex: '#E11D48',
    shortTagline: '공기보다 매우 가볍고 불이 붙지 않아 안전한 기체',
    colorSmell: '색깔과 냄새가 없음',
    weightComparison: '공기보다 훨씬 가벼워 위로 뜸',
    keyProperties: [
      '색깔과 냄새가 없습니다.',
      '공기보다 매우 가벼워서 하늘 위로 두둥실 떠오릅니다.',
      '다른 물질과 반응하지 않고 불이 붙지 않아 매우 안전합니다.',
    ],
    answerIllustration: GENERATED_IMAGES.answerHeliumPencil,
    answerIllustrationAlt: '구름 위로 떠오른 풍선과 분홍색 헬륨 캐릭터의 색연필화 그림',
    labImage: GENERATED_IMAGES.labHeliumOnly,
    labImageAlt: '창밖 하늘을 향해 떠오르는 빨간 풍선과 스마일 풍선을 들고 웃는 아이들과 불꽃 안전 표시 그림',
    experiments: {
      flame: {
        outcomeTitle: '불이 붙지 않아 안전합니다',
        observation:
          '헬륨은 스스로 타지도 않고 다른 물질이 타는 것도 돕지 않아서 불꽃을 가까이 대어도 터지거나 타지 않습니다.',
        visualState: 'no-change',
      },
      limewater: {
        outcomeTitle: '석회수에 변화가 없습니다',
        observation:
          '석회수를 만나도 아무 변화 없이 투명한 상태를 유지합니다.',
        visualState: 'clear',
      },
      weight: {
        outcomeTitle: '하늘 위로 두둥실 높이 떠오릅니다',
        observation:
          '헬륨은 공기보다 훨씬 가볍기 때문에 풍선에 넣으면 손에서 놓자마자 천장이나 하늘로 올라갑니다.',
        visualState: 'float-up',
      },
      electric: {
        outcomeTitle: '다른 기체와 섞이지 않고 안정적입니다',
        observation:
          '입으로 마시면 목소리가 높아지기도 하지만, 장난으로 마시면 위험하므로 절대 마시지 않아야 합니다.',
        visualState: 'no-glow',
      },
    },
    everydayUses: [
      {
        id: 'he-1',
        place: '공원 · 놀이공원 · 축제 현장',
        objectName: '하늘에 뜨는 풍선 · 애드벌룬',
        useSummary: '풍선이나 광고용 비행선을 하늘 높이 띄울 때 넣습니다.',
        whyReason: '공기보다 훨씬 가벼우면서도 불이 붙지 않아 폭발할 위험이 없이 안전하기 때문입니다.',
      },
      {
        id: 'he-2',
        place: '기상청 · 관측소',
        objectName: '기상 관측 기구 (라디오존데)',
        useSummary: '높은 하늘의 온도, 바람, 구름을 조사하는 기계를 실어 나릅니다.',
        whyReason: '무거운 장비를 달고도 아주 높은 하늘까지 안전하게 올라갈 수 있기 때문입니다.',
      },
      {
        id: 'he-3',
        place: '큰 병원 영상의학과',
        objectName: 'MRI 장치 냉각',
        useSummary: '몸속을 자세히 찍는 MRI 기계가 뜨거워지지 않게 식혀 줍니다.',
        whyReason: '헬륨을 액체로 만들면 아주 차가운 온도로 기계를 식힐 수 있기 때문입니다.',
      },
    ],
    workbookModelProperties:
      '색깔과 냄새가 없다. 공기보다 매우 가벼워 위로 떠오르며, 불이 붙지 않아 안전하다.',
    workbookModelUses:
      '하늘에 뜨는 풍선과 비행선, 애드벌룬, 기상 관측 기구(공기보다 가볍고 불이 붙지 않아 안전하기 때문)',
    cardVariants: [
      {
        id: 'he-balloons',
        title: '하늘을 나는 풍선과 비행선 헬륨',
        subtitle: '구름 위까지 두둥실 안전하게 날아올라요!',
        imageSrc: GENERATED_IMAGES.cardHeliumBalloons,
        skillTitle: '두둥실 안전 비행',
        skillDesc: '공기보다 훨씬 가벼워 풍선과 비행선을 띄우고, 불이 붙지 않아 축제 현장에서 안전하게 사용할 수 있습니다.',
        powerLabel: '부력 하늘 100',
      },
      {
        id: 'he-weather',
        title: '기상 관측 하늘 탐사선 헬륨',
        subtitle: '높은 하늘의 날씨를 측정하는 기상 관측 기구!',
        imageSrc: GENERATED_IMAGES.step3HeliumWeather,
        skillTitle: '구름 너머 날씨 탐사',
        skillDesc: '기상청의 날씨 측정 기계를 매달고 높은 하늘까지 올라가 온도와 바람, 구름 정보를 알려 줍니다.',
        powerLabel: '하늘 탐사 99',
      },
      {
        id: 'he-cloud',
        title: '구름 산책 동화 요정 헬륨',
        subtitle: '손에서 놓치면 하늘 높이 둥실 떠올라요!',
        imageSrc: GENERATED_IMAGES.answerHeliumPencil,
        skillTitle: '무지개 구름 부양',
        skillDesc: '색깔과 냄새는 없지만 공기보다 훨씬 가벼워 구름 가까운 곳까지 힘차게 올라가는 성질이 있습니다.',
        powerLabel: '부양력 98',
      },
      {
        id: 'he-smile',
        title: '불꽃 안전 스마일 풍선 헬륨',
        subtitle: '불이 붙지 않아 아이들이 들어도 안전해요!',
        imageSrc: GENERATED_IMAGES.labHeliumOnly,
        skillTitle: '가벼운 깃털 점프',
        skillDesc: '가벼우면서도 불이 붙지 않아 수소 대신 놀이공원과 교실 축제 풍선에 안심하고 사용합니다.',
        powerLabel: '안전도 100',
      },
    ],
  },
  {
    id: 'hydrogen',
    name: '수소',
    symbol: 'H₂',
    englishName: 'Hydrogen',
    airShareText: '우주에서 가장 많은 기체',
    colorClass: 'text-indigo-700',
    surfaceClass: 'bg-indigo-50 border-indigo-200',
    accentHex: '#4F46E5',
    shortTagline: '세상에서 가장 가볍고 타면서 깨끗한 물만 남기는 미래 에너지 기체',
    colorSmell: '색깔과 냄새가 없음',
    weightComparison: '세상에서 가장 가벼운 기체',
    keyProperties: [
      '색깔과 냄새가 없습니다.',
      '세상에서 가장 가벼운 기체입니다.',
      '불씨를 가까이 하면 "퍽" 소리를 내며 스스로 잘 탑니다.',
      '타고 난 뒤에는 나쁜 매연 대신 깨끗한 물만 남는 친환경 에너지입니다.',
    ],
    answerIllustration: GENERATED_IMAGES.answerHydrogenPencil,
    answerIllustrationAlt: '물방울만 남기며 달리는 친환경 수소 버스와 우주 로켓의 색연필화 그림',
    labImage: GENERATED_IMAGES.answerHydrogenSciencePencil,
    labImageAlt: '세상에서 가장 가볍고 타면서 깨끗한 물방울만 남기는 수소 실험 그림',
    experiments: {
      flame: {
        outcomeTitle: '"퍽" 소리를 내며 불꽃이 타오릅니다',
        observation:
          '수소는 스스로 잘 타는 성질이 있어 불을 붙이면 소리를 내며 빠르게 타고, 병 안쪽에 물방울이 맺힙니다.',
        visualState: 'pop-burn',
      },
      limewater: {
        outcomeTitle: '석회수에 변화가 없습니다',
        observation: '석회수와 반응하지 않아 맑은 상태 그대로 유지됩니다.',
        visualState: 'clear',
      },
      weight: {
        outcomeTitle: '가장 빠르게 위로 솟아오릅니다',
        observation:
          '세상에서 가장 가벼운 기체이지만, 불이 잘 붙기 때문에 요즘은 풍선 대신 안전한 헬륨을 씁니다.',
        visualState: 'float-up',
      },
      electric: {
        outcomeTitle: '연료전지에서 전기를 만들어 냅니다',
        observation:
          '산소와 만나면 전기를 만들고 깨끗한 물만 내보내 자동차를 움직이는 힘이 됩니다.',
        visualState: 'no-glow',
      },
    },
    everydayUses: [
      {
        id: 'h2-1',
        place: '도로 · 친환경 버스 정류장',
        objectName: '수소 자동차 · 수소 버스',
        useSummary: '기름 대신 수소를 연료로 사용하여 매연 없이 달립니다.',
        whyReason: '수소가 산소와 만나 전기를 만들 때 배기가스 대신 깨끗한 물만 나오기 때문입니다.',
      },
      {
        id: 'h2-2',
        place: '우주 센터 발사대',
        objectName: '우주 로켓 연료',
        useSummary: '커다란 우주선을 대기권 밖 우주로 쏘아 올리는 강력한 힘을 냅니다.',
        whyReason: '무게가 매우 가벼우면서도 탈 때 엄청나게 큰 에너지를 내기 때문입니다.',
      },
    ],
    workbookModelProperties:
      '색깔과 냄새가 없으며 세상에서 가장 가벼운 기체이다. 불이 잘 붙고, 산소와 만나 에너지를 낸 뒤 깨끗한 물만 남는다.',
    workbookModelUses:
      '수소 자동차와 수소 버스(매연 없이 물만 내보내는 친환경 연료), 우주 로켓 연료(가볍고 큰 힘을 내기 때문)',
    cardVariants: [
      {
        id: 'h2-bus',
        title: '물만 남기는 친환경 수소 버스',
        subtitle: '나쁜 연기 없이 깨끗한 물방울만 톡톡!',
        imageSrc: GENERATED_IMAGES.cardHydrogenBus,
        skillTitle: '초록 지구 에코 드라이브',
        skillDesc: '수소 자동차와 수소 버스의 연료로 쓰이며, 달린 뒤에는 깨끗한 물만 내보내 공기를 지켜 줍니다.',
        powerLabel: '친환경 100',
      },
      {
        id: 'h2-rocket',
        title: '우주 로켓 & 수소 드론 파워',
        subtitle: '세상에서 가장 가볍지만 힘은 우주 최강!',
        imageSrc: GENERATED_IMAGES.step3HydrogenRocket,
        skillTitle: '로켓 추진 점화',
        skillDesc: '가장 가벼운 무게로 로켓과 구조용 드론을 하늘과 우주로 힘차게 날려 보내는 미래 에너지입니다.',
        powerLabel: '추진력 100',
      },
      {
        id: 'h2-town',
        title: '맑은 물방울 미래 도시 수소',
        subtitle: '도시와 우주를 잇는 깨끗한 에너지!',
        imageSrc: GENERATED_IMAGES.answerHydrogenPencil,
        skillTitle: '청정 에너지 순환',
        skillDesc: '산소와 만나 전기를 만들 때 배기가스 대신 깨끗한 물만 남아 지구를 맑게 지킵니다.',
        powerLabel: '청정도 99',
      },
      {
        id: 'h2-science',
        title: '세상에서 가장 가벼운 기체 수소',
        subtitle: '깃털보다 가볍고 불꽃처럼 에너지가 넘쳐요!',
        imageSrc: GENERATED_IMAGES.answerHydrogenSciencePencil,
        skillTitle: '초경량 에너지 코어',
        skillDesc: '지구상 모든 기체 중 가장 가벼우며, 스스로 타면서 큰 에너지를 내는 특별한 성질을 지녔습니다.',
        powerLabel: '에너지 98',
      },
    ],
  },
  {
    id: 'neon',
    name: '네온',
    symbol: 'Ne',
    englishName: 'Neon',
    airShareText: '공기 중 아주 적은 양',
    colorClass: 'text-orange-700',
    surfaceClass: 'bg-orange-50 border-orange-200',
    accentHex: '#EA580C',
    shortTagline: '전기를 통하면 밝고 선명한 빛을 내는 간판 속 기체',
    colorSmell: '색깔과 냄새가 없음',
    weightComparison: '공기보다 조금 가벼움',
    keyProperties: [
      '평소에는 색깔과 냄새가 없습니다.',
      '유리관에 넣고 전기를 통하게 하면 밝고 선명한 주황·붉은빛을 냅니다.',
      '다른 물질과 거의 반응하지 않아 유리관 안에서 오래 사용할 수 있습니다.',
    ],
    answerIllustration: GENERATED_IMAGES.answerNeonPencil,
    answerIllustrationAlt: '밤거리를 환하게 밝히는 별과 달 네온 간판의 색연필화 그림',
    labImage: GENERATED_IMAGES.labNeonTube,
    labImageAlt: '전기를 연결하자 주황빛으로 환하게 빛나는 네온 유리 방전관 실험 그림',
    experiments: {
      flame: {
        outcomeTitle: '불이 붙지 않고 안전합니다',
        observation: '네온은 다른 물질과 반응하지 않아서 불꽃을 대어도 타지 않습니다.',
        visualState: 'no-change',
      },
      limewater: {
        outcomeTitle: '석회수에 변화가 없습니다',
        observation: '석회수를 뿌옇게 만들지 않습니다.',
        visualState: 'clear',
      },
      weight: {
        outcomeTitle: '공기보다 조금 가볍지만 풍선에는 잘 안 씁니다',
        observation: '풍선보다는 유리관 속에 가두어 전기를 흘려보내는 데 주로 활용합니다.',
        visualState: 'float-mid',
      },
      electric: {
        outcomeTitle: '전기를 흘리면 밝은 주황빛으로 빛납니다',
        observation:
          '네온이 들어 있는 유리관에 전기를 연결하면 어두운 곳에서도 멀리까지 보이는 선명한 빛이 켜집니다.',
        visualState: 'glow-orange',
      },
    },
    everydayUses: [
      {
        id: 'ne-1',
        place: '거리 · 책방 · 상점 앞',
        objectName: '반짝이는 네온사인 간판',
        useSummary: '밤에도 가게 이름이나 안내 글자가 환하게 잘 보이도록 비춥니다.',
        whyReason: '유리관 안에 네온을 넣고 전기를 통하면 예쁘고 밝은 빛을 내기 때문입니다.',
      },
      {
        id: 'ne-2',
        place: '공항 활주로 · 안개 낀 도로',
        objectName: '비행기 안내등 · 안전 표시등',
        useSummary: '비나 안개가 껴도 비행기나 운전자가 길을 잘 찾도록 도와줍니다.',
        whyReason: '네온이 내는 붉은빛과 주황빛은 안개를 뚫고 멀리까지 잘 보이기 때문입니다.',
      },
    ],
    workbookModelProperties:
      '평소에는 색깔과 냄새가 없지만, 전기를 통하게 하면 밝고 선명한 빛을 낸다. 다른 물질과 잘 반응하지 않는다.',
    workbookModelUses:
      '가게의 네온사인 간판(전기를 통하면 밝은 빛을 내기 때문), 공항 활주로 안내등(안개가 껴도 빛이 멀리 잘 보이기 때문)',
    cardVariants: [
      {
        id: 'ne-sign',
        title: '밤거리를 비추는 네온사인',
        subtitle: '전기를 연결하면 반짝반짝 빛나는 마법 유리관!',
        imageSrc: GENERATED_IMAGES.cardNeonSign,
        skillTitle: '무지개 불빛 쇼',
        skillDesc: '평소에는 투명하지만 유리관 속에서 전기를 만나면 환하고 선명한 빛을 내어 밤거리를 아름답게 밝힙니다.',
        powerLabel: '반짝임 100',
      },
      {
        id: 'ne-airport',
        title: '안개 뚫는 활주로 안내등 네온',
        subtitle: '어두운 밤 비행기가 안전하게 착륙하도록 안내해요!',
        imageSrc: GENERATED_IMAGES.answerNeonAirportPencil,
        skillTitle: '안전 길잡이 빛',
        skillDesc: '비나 안개가 껴도 멀리까지 잘 보이는 붉은·주황빛 덕분에 공항 활주로와 안전등에 꼭 쓰입니다.',
        powerLabel: '안내력 98',
      },
      {
        id: 'ne-star',
        title: '별과 달이 빛나는 네온 간판',
        subtitle: '어두운 밤하늘 아래 반짝반짝 빛나는 가게 이름!',
        imageSrc: GENERATED_IMAGES.answerNeonPencil,
        skillTitle: '은은한 별빛 간판',
        skillDesc: '구부린 유리관 모양에 따라 글자나 별·달 모양으로 예쁘게 빛나 사람들의 시선을 사로잡습니다.',
        powerLabel: '시선 집중 97',
      },
      {
        id: 'ne-tube',
        title: '전기로 깨어나는 네온 방전관',
        subtitle: '스위치를 켜는 순간 투명한 기체가 빛으로 변신!',
        imageSrc: GENERATED_IMAGES.labNeonTube,
        skillTitle: '전류 발광 스파크',
        skillDesc: '평소엔 투명하지만 전기를 연결하면 밝은 주황·붉은빛을 내고 오래 변하지 않는 신기한 기체입니다.',
        powerLabel: '발광 파워 99',
      },
    ],
  },
];

export const TOWN_HOTSPOTS: SceneHotspot[] = [
  {
    id: 'spot-1-oxygen',
    number: 1,
    label: '공원에서 숨 쉬는 아이들',
    pinShortLabel: '1. 공원 아이들',
    placeLabel: '1번 구역 · 초록 공원',
    gasId: 'oxygen',
    xPercent: 10,
    yPercent: 14,
    isOnMap: true,
    clueQuestion: '공원에서 신나게 뛰어노는 친구들이 숨 쉴 때 꼭 필요한 기체는 무엇일까요?',
    clueHint: '우리가 숨을 들이마실 때 꼭 필요하고, 병원의 호흡기나 잠수부 공기통에도 들어 있어요!',
    discoveryTitle: '정답은 "산소"예요!',
    step1Property: '색깔과 냄새가 없고 공기 중에 약 21% 들어 있어요. 생물이 숨 쉬는 데 꼭 필요하며 다른 물질이 잘 타도록 도와줍니다.',
    step1Points: [
      { label: '색깔·냄새', text: '색깔과 냄새가 없어서 눈에 보이지 않아요.' },
      { label: '공기 속 양', text: '우리가 마시는 공기의 약 21%를 차지해요.' },
      { label: '불꽃 성질', text: '스스로 타지는 않지만 다른 물질이 잘 타도록 도와줘요.' },
      { label: '생명 활동', text: '사람과 동물이 숨을 쉬며 살아가는 데 꼭 필요해요.' },
    ],
    step1Image: GENERATED_IMAGES.labOxygen,
    step1ImageAlt: '산소 유리병 속에서 향불이 밝게 타오르는 성질 그림',
    step1Quiz: {
      question: '그림 속 유리병에 꺼져 가는 향불을 넣었을 때, 산소는 어떤 성질을 보여 줄까요?',
      options: [
        '산소 스스로 활활 불이 붙어 폭발한다',
        '다른 물질이 잘 타도록 도와주어 불꽃이 밝아진다',
        '불꽃을 바로 꺼뜨린다',
      ],
      correctIndex: 1,
      hint: '그림을 보세요! 산소는 스스로 타지 않지만 향불을 더 환하게 살려 줘요.',
      successNote: '맞아요! 산소는 다른 물질이 잘 타도록 도와주는 기체예요.',
    },
    step2WhyUse: '사람과 동물이 숨을 쉬며 에너지를 만들려면 반드시 산소가 필요하기 때문이에요.',
    step2Points: [
      { label: '숨쉬기', text: '사람이 숨을 들이마실 때 몸속으로 들어가 에너지를 만들어요.' },
      { label: '물고기 호흡', text: '물에도 아주 조금 녹아 있어 물고기가 아가미로 숨 쉴 수 있어요.' },
    ],
    step2Image: GENERATED_IMAGES.step2OxygenBreathing,
    step2ImageAlt: '초록 공원에서 맑은 산소를 들이마시는 어린이와 물속 산소 방울로 숨 쉬는 물고기 색연필화 그림',
    step2Quiz: {
      question: '공원에서 뛰어노는 친구들과 물속 물고기가 모두 살기 위해 꼭 필요한 것은?',
      options: [
        '숨을 쉴 수 있도록 산소가 물과 공기 중에 들어 있는 것',
        '산소의 달콤한 냄새를 맡는 것',
      ],
      correctIndex: 0,
      hint: '산소는 색깔과 냄새가 없지만 물에도 조금 녹아 있어 생물의 숨쉬기를 도와요!',
      successNote: '정확해요! 사람도 물고기도 모두 산소로 숨을 쉬며 살아가요.',
    },
    step3MoreUses: '병원의 산소 호흡기, 바닷속 잠수부와 소방관의 산소통, 쇠를 녹여 붙이는 용접기에도 이용됩니다.',
    step3Points: [
      { label: '잠수부·소방관 산소통', text: '물속이나 연기가 가득한 곳에서도 숨을 쉴 수 있게 도와줘요.' },
      { label: '병원 산소 호흡기', text: '숨쉬기 어려운 환자에게 맑은 산소를 바로 공급해 줘요.' },
      { label: '금속 용접기', text: '불꽃을 훨씬 뜨겁고 강하게 태워 쇠를 녹여 붙일 때 써요.' },
    ],
    step3Image: GENERATED_IMAGES.cardOxygenDiver,
    step3ImageAlt: '산소통을 메고 바닷속을 탐험하는 잠수부 그림',
    step3Quiz: {
      question: '다음 중 일상생활에서 산소가 이용되는 예로 알맞은 것은 무엇일까요?',
      options: [
        '과자가 부서지지 않도록 과자 봉지 채우기',
        '잠수부 산소통, 병원 산소 호흡기, 쇠를 붙이는 용접기',
        '가게 앞 반짝이는 네온사인 간판',
      ],
      correctIndex: 1,
      hint: '숨쉬기가 어렵거나 아주 뜨거운 불꽃이 필요할 때 산소가 쓰여요!',
      successNote: '잘했어요! 잠수부, 소방관, 병원, 용접기까지 산소가 꼭 쓰인답니다.',
    },
  },
  {
    id: 'spot-2-helium',
    number: 2,
    label: '하늘로 떠오른 풍선',
    pinShortLabel: '2. 하늘 풍선',
    placeLabel: '2번 구역 · 파란 하늘',
    gasId: 'helium',
    xPercent: 43,
    yPercent: 14,
    isOnMap: true,
    clueQuestion: '손에서 놓아도 바닥에 떨어지지 않고 하늘 위로 두둥실 뜨는 풍선 속 기체는 무엇일까요?',
    clueHint: '공기보다 훨씬 가볍고, 불이 붙지 않아 아주 안전한 기체예요!',
    discoveryTitle: '정답은 "헬륨"이에요!',
    step1Property: '색깔과 냄새가 없고 공기보다 매우 가벼워 위로 떠오릅니다. 불이 붙지 않아 아주 안전해요.',
    step1Points: [
      { label: '색깔·냄새', text: '색깔과 냄새가 없어요.' },
      { label: '무게 비교', text: '공기보다 훨씬 가벼워서 하늘 위로 두둥실 떠올라요.' },
      { label: '안전성', text: '다른 물질과 반응하지 않고 불이 붙지 않아 아주 안전해요.' },
    ],
    step1Image: GENERATED_IMAGES.labHeliumOnly,
    step1ImageAlt: '교실 창가에서 하늘 위로 두둥실 떠오르는 헬륨 풍선과 불이 붙지 않아 안전한 표시 그림',
    step1Quiz: {
      question: '헬륨의 두 가지 대표 성질을 바르게 짝지은 것은 무엇일까요?',
      options: [
        '공기보다 가볍고, 불이 붙지 않아 안전하다',
        '공기보다 무겁고, 물에 잘 녹는다',
        '노란색을 띠며, 전기를 연결하면 빛난다',
      ],
      correctIndex: 0,
      hint: '창밖으로 날아가는 풍선과 안전한 불꽃 표시 그림을 살펴보세요!',
      successNote: '완벽해요! 가벼우면서도 불이 붙지 않아 아주 안전한 기체예요.',
    },
    step2WhyUse: '공기보다 가벼워서 풍선을 하늘로 띄워 주고, 불이 붙지 않아 아이들이 들고 다녀도 안전하기 때문이에요.',
    step2Points: [
      {
        label: '둥실 뜨는 힘',
        text: '입으로 분 풍선은 아래로 내려앉지만, 헬륨을 넣은 풍선은 손을 놓으면 하늘 위로 높이 떠올라요.',
      },
      {
        label: '폭발 위험 없음',
        text: '가벼운 수소와 달리 불이 붙지 않아 축제나 공원 풍선에 안전하게 써요.',
      },
    ],
    step2Image: GENERATED_IMAGES.cardHeliumBalloons,
    step2ImageAlt: '구름 위로 두둥실 떠오르는 알록달록 헬륨 풍선과 비행선 그림',
    step2Quiz: {
      question: '세상에서 가장 가벼운 수소 대신, 축제 풍선과 비행선에 헬륨을 쓰는 가장 큰 까닭은?',
      options: [
        '헬륨의 색깔이 알록달록하고 예뻐서',
        '헬륨은 공기보다 가벼우면서도 불이 붙지 않아 안전하기 때문',
      ],
      correctIndex: 1,
      hint: '수소는 불이 잘 붙어 위험하지만, 헬륨은 불꽃 안전 성질이 있어요!',
      successNote: '정답! 안전하게 하늘로 띄울 수 있어서 헬륨을 사용해요.',
    },
    step3MoreUses: '기상 관측 기구(라디오존데), 축제용 애드벌룬과 비행선, 병원 MRI 기계 냉각에도 이용됩니다.',
    step3Points: [
      { label: '기상 관측 기구', text: '커다란 흰 풍선에 온도·바람 측정 기계를 매달아 높은 하늘 날씨를 조사해요.' },
      { label: '애드벌룬·비행선', text: '행사장 하늘 높이 광고 풍선이나 비행선을 안전하게 띄울 때 써요.' },
      { label: '병원 MRI 냉각', text: '아주 차가운 액체 헬륨으로 몸속을 찍는 큰 의료 기계를 식혀 줘요.' },
    ],
    step3Image: GENERATED_IMAGES.step3HeliumWeather,
    step3ImageAlt: '기상 관측 기구를 매달고 구름 위로 올라가는 흰색 기상 풍선과 줄무늬 비행선 그림',
    step3Quiz: {
      question: '그림 속 주황색 기계를 매달고 높은 구름 위까지 올라가 날씨를 조사하는 도구는?',
      options: [
        '기상 관측 기구(라디오존데)',
        '탄산음료 제조기',
        '액체 질소 냉동고',
      ],
      correctIndex: 0,
      hint: '높은 하늘의 온도, 바람, 구름 등 날씨를 관측하는 기구예요!',
      successNote: '맞아요! 기상 관측 기구와 비행선도 헬륨의 힘을 빌린답니다.',
    },
  },
  {
    id: 'spot-3-nitrogen',
    number: 3,
    label: '빵빵한 과자 봉지',
    pinShortLabel: '3. 과자 가게',
    placeLabel: '3번 구역 · 간식 매점',
    gasId: 'nitrogen',
    xPercent: 76,
    yPercent: 14,
    isOnMap: true,
    clueQuestion: '감자칩 과자가 부서지거나 눅눅해지지 않도록 봉지를 빵빵하게 채운 기체는 무엇일까요?',
    clueHint: '공기 중에서 약 78%로 가장 많은 양을 차지하고, 다른 물질과 잘 반응하지 않아요!',
    discoveryTitle: '정답은 "질소"예요!',
    step1Property: '색깔과 냄새가 없고 공기 중 약 78%로 가장 많아요. 다른 물질과 잘 반응하지 않아 음식 등이 변하는 것을 막아 줍니다.',
    step1Points: [
      { label: '색깔·냄새', text: '색깔과 냄새가 없어요.' },
      { label: '공기 속 양', text: '우리가 숨 쉬는 공기 중 약 78%로 가장 많이 들어 있어요.' },
      { label: '안정된 성질', text: '다른 물질과 잘 반응하지 않아 물건이나 음식이 변하지 않게 지켜 줘요.' },
      { label: '불꽃 반응', text: '산소가 없어 스스로 타거나 불이 타는 것을 돕지 않아요.' },
    ],
    step1Image: GENERATED_IMAGES.labNitrogenOnly,
    step1ImageAlt: '공기 유리병과 공기 성분 78% 원그래프, 그리고 다른 물질과 반응하지 않는 질소 실험 그림',
    step1Quiz: {
      question: '그림 속 원그래프를 보세요! 질소는 우리가 숨 쉬는 공기 중에서 얼마나 차지할까요?',
      options: [
        '약 21%로 두 번째로 많다',
        '약 78%로 가장 많은 양을 차지한다',
        '약 0.04%로 아주 적다',
      ],
      correctIndex: 1,
      hint: '원그래프에서 초록색으로 가장 넓은 부분을 차지한 숫자를 찾아보세요!',
      successNote: '정답! 공기의 약 78%가 질소이고, 다른 물질과 잘 반응하지 않아요.',
    },
    step2WhyUse: '다른 물질과 잘 반응하지 않아서 과자의 바삭한 맛을 지키고, 부서지지 않게 쿠션 역할을 해 주기 때문이에요.',
    step2Points: [
      { label: '바삭함 유지', text: '산소 대신 질소를 채워 과자가 눅눅해지거나 상하는 것을 막아 줘요.' },
      { label: '푹신한 쿠션', text: '봉지를 빵빵하게 채워 옮기는 동안 과자가 부서지지 않게 지켜 줘요.' },
    ],
    step2Image: GENERATED_IMAGES.cardNitrogenChips,
    step2ImageAlt: '보호막 속에서 안전하게 지켜지는 바삭한 과자 봉지들 그림',
    step2Quiz: {
      question: '과자 봉지에 산소 대신 질소를 빵빵하게 채워 넣는 까닭으로 옳지 않은 것은?',
      options: [
        '다른 물질과 잘 반응하지 않아 과자가 상하는 것을 막기 위해',
        '옮기는 동안 과자가 부서지지 않도록 쿠션 역할을 하려고',
        '과자를 눅눅하게 만들고 매운맛을 더하려고',
      ],
      correctIndex: 2,
      hint: '질소는 과자를 부서지지 않게 보호하고 바삭함을 지켜 줘요!',
      successNote: '맞아요! 과자를 상하지 않고 바삭하게 지키기 위해서랍니다.',
    },
    step3MoreUses: '음식이나 씨앗을 빠르게 얼려 보관하는 액체 질소 냉동, 자동차와 비행기 타이어 충전에도 쓰입니다.',
    step3Points: [
      { label: '액체 질소 급속 냉동', text: '영하 196도의 매우 차가운 액체 질소로 딸기, 아이스크림, 식물 씨앗을 순식간에 얼려 보관해요.' },
      { label: '자동차·비행기 타이어', text: '온도가 변해도 바람이 쉽게 빠지거나 고무가 상하지 않도록 타이어에 채워 넣어요.' },
    ],
    step3Image: GENERATED_IMAGES.step3NitrogenFreezeTire,
    step3ImageAlt: '액체 질소로 딸기를 급속 냉동하는 모습과 자동차 타이어에 질소를 충전하는 그림',
    step3Quiz: {
      question: '그림처럼 질소를 아주 차갑게 만든 “액체 질소”는 주로 어디에 이용할까요?',
      options: [
        '음식이나 씨앗을 순식간에 꽁꽁 얼려 오래 보관할 때',
        '어두운 밤가게 네온사인 불을 켤 때',
      ],
      correctIndex: 0,
      hint: '그림 왼쪽에서 딸기를 아주 차갑게 얼리고 있는 모습을 보세요!',
      successNote: '정확해요! 급속 냉동과 타이어 충전에도 질소가 맹활약한답니다.',
    },
  },
  {
    id: 'spot-4-co2',
    number: 4,
    label: '탄산음료와 빨간 소화기',
    pinShortLabel: '4. 탄산·소화기',
    placeLabel: '4번 구역 · 카페 테라스',
    gasId: 'co2',
    xPercent: 10,
    yPercent: 64,
    isOnMap: true,
    clueQuestion: '음료수를 톡 쏘게 만들고, 불이 났을 때 소화기에서 나와 불을 끄는 기체는 무엇일까요?',
    clueHint: '공기보다 무겁고 불을 끄며, 물에 잘 녹아 거품을 만들고 석회수를 뿌옇게 만들어요!',
    discoveryTitle: '정답은 "이산화 탄소"예요!',
    step1Property: '색깔과 냄새가 없고 공기보다 무거워 아래로 가라앉아요. 불을 끄고 석회수를 뿌옇게 흐리게 하며 물에 잘 녹습니다.',
    step1Points: [
      { label: '색깔·냄새', text: '색깔과 냄새가 없어요.' },
      { label: '무게 비교', text: '공기보다 무거워서 아래쪽으로 가라앉아요.' },
      { label: '불꽃 반응', text: '다른 물질이 타는 것을 막아 불을 끄는 성질이 있어요.' },
      { label: '석회수·물', text: '맑은 석회수를 우유처럼 뿌옇게 만들고, 물에 잘 녹아 톡 쏘는 맛을 내요.' },
    ],
    step1Image: GENERATED_IMAGES.labCo2,
    step1ImageAlt: '무거운 이산화 탄소로 촛불이 꺼지고 석회수가 뿌옇게 흐려지는 실험 그림',
    step1Quiz: {
      question: '맑고 투명한 석회수에 이산화 탄소를 넣고 흔들면 어떤 변화가 일어날까요?',
      options: [
        '아무 변화 없이 투명하다',
        '우유처럼 뿌옇게 흐려진다',
        '보글보글 끓으며 주황빛이 난다',
      ],
      correctIndex: 1,
      hint: '그림 오른쪽 비커 속 석회수가 어떤 색으로 변했는지 살펴보세요!',
      successNote: '딩동댕! 석회수를 뿌옇게 만드는 것은 이산화 탄소만의 중요한 특징이에요.',
    },
    step2WhyUse: '물에 잘 녹아 톡 쏘는 탄산음료를 만들고, 공기보다 무겁고 타는 것을 막아 소화기로 불을 끌 수 있기 때문이에요.',
    step2Points: [
      { label: '탄산음료', text: '물에 잘 녹는 성질 덕분에 사이다·콜라 속에서 톡 쏘는 시원한 거품을 만들어요.' },
      { label: '소화기', text: '공기보다 무거워 불꽃을 덮어 주고, 산소를 막아 불을 빠르게 꺼 줘요.' },
    ],
    step2Image: GENERATED_IMAGES.cardCo2Soda,
    step2ImageAlt: '시원한 레몬 탄산음료 거품과 불을 끄는 빨간 소화기 그림',
    step2Quiz: {
      question: '이산화 탄소 소화기가 불을 잘 끌 수 있는 까닭으로 알맞은 것은?',
      options: [
        '공기보다 무거워 아래로 가라앉아 불꽃을 덮고, 타는 것을 막기 때문',
        '공기보다 훨씬 가벼워 천장으로 날아가기 때문',
      ],
      correctIndex: 0,
      hint: '무거운 성질과 불을 끄는 성질을 함께 떠올려 보세요!',
      successNote: '정답! 무거워서 불꽃을 감싸 덮고 산소를 막아 불을 끈답니다.',
    },
    step3MoreUses: '드라이아이스 냉동 포장, 비닐하우스 식물의 광합성, 구명조끼 자동 팽창 등 다양하게 이용됩니다.',
    step3Points: [
      { label: '드라이아이스', text: '이산화 탄소를 꽁꽁 얼려 만든 것으로, 물이 생기지 않아 아이스크림·냉동식품 포장에 써요.' },
      { label: '식물의 광합성', text: '온실이나 비닐하우스 속 식물이 햇빛을 받아 쑥쑥 자라도록 도와줘요.' },
      { label: '구명조끼·무대 안개', text: '물에 빠졌을 때 조끼를 빠르게 부풀리거나 공연장의 하얀 안개 효과를 만들 때도 써요.' },
    ],
    step3Image: GENERATED_IMAGES.step3Co2DryiceMore,
    step3ImageAlt: '책상 위 작은 아이스박스 안에 포장된 아이스크림과 하얀 드라이아이스 블록이 담긴 모습, 비닐하우스 식물, 구명조끼가 그려진 그림',
    step3Quiz: {
      question: '아이스크림 포장에 쓰이며 녹을 때 물방울이 생기지 않는 “드라이아이스”는 무엇을 얼려 만들까요?',
      options: [
        '산소',
        '네온',
        '이산화 탄소',
      ],
      correctIndex: 2,
      hint: '지금 탐험하고 있는 4번 기체를 아주 차갑게 얼려서 만들어요!',
      successNote: '맞아요! 드라이아이스, 온실 식물 광합성, 구명조끼까지 쓰임새가 다양해요.',
    },
  },
  {
    id: 'spot-5-neon',
    number: 5,
    label: '반짝이는 가게 네온사인',
    pinShortLabel: '5. 네온 간판',
    placeLabel: '5번 구역 · 베이커리 거리',
    gasId: 'neon',
    xPercent: 43,
    yPercent: 64,
    isOnMap: true,
    clueQuestion: '유리관 안에 들어 있다가 전기를 연결하면 밝고 알록달록하게 빛나는 기체는 무엇일까요?',
    clueHint: '밤에도 가게 간판이나 공항 활주로가 멀리서 잘 보이게 빛을 내는 기체예요!',
    discoveryTitle: '정답은 "네온"이에요!',
    step1Property: '평소에는 색깔과 냄새가 없지만, 유리관에 넣고 전기를 통하게 하면 밝고 선명한 빛을 냅니다.',
    step1Points: [
      { label: '평소 모습', text: '평소에는 색깔과 냄새가 없는 투명한 기체예요.' },
      { label: '전기 반응', text: '유리관에 넣고 전기를 통하게 하면 밝고 선명한 주황·붉은빛을 내요.' },
      { label: '수명', text: '다른 물질과 거의 반응하지 않아 유리관 안에서 오래 사용할 수 있어요.' },
    ],
    step1Image: GENERATED_IMAGES.labNeonTube,
    step1ImageAlt: '실험실 책상 위에서 전기를 연결하자 주황빛으로 환하게 빛나는 네온 유리 방전관 그림',
    step1Quiz: {
      question: '평소에는 투명해서 보이지 않던 네온이 언제 밝은 주황·붉은빛을 낼까요?',
      options: [
        '유리관에 넣고 전기를 통하게 했을 때',
        '물에 녹여 차갑게 식혔을 때',
        '과자 봉지에 채워 넣었을 때',
      ],
      correctIndex: 0,
      hint: '그림 속 유리관에 연결된 전선과 스위치를 확인해 보세요!',
      successNote: '정답이에요! 전기를 연결하면 환하고 예쁜 빛이 켜진답니다.',
    },
    step2WhyUse: '전기를 연결하면 멀리서도 한눈에 들어오는 환한 빛을 내서 가게 이름을 알리기 좋기 때문이에요.',
    step2Points: [
      { label: '눈에 띄는 빛', text: '어두운 저녁이나 밤에도 가게 모양과 글자가 환하게 잘 보여요.' },
      { label: '자유로운 모양', text: '구부린 유리관 안에 네온을 채워 빵, 별, 글자 등 예쁜 간판을 만들어요.' },
    ],
    step2Image: GENERATED_IMAGES.cardNeonSign,
    step2ImageAlt: '밤거리를 환하게 밝히는 가게 네온사인 간판 그림',
    step2Quiz: {
      question: '어두운 밤거리에 가게 간판(네온사인)을 네온으로 만드는 까닭으로 알맞은 것은?',
      options: [
        '전기를 통하면 멀리서도 잘 보이는 밝은 빛을 내기 때문',
        '가게 안에서 음식이 상하지 않게 얼려 주기 때문',
      ],
      correctIndex: 0,
      hint: '밤에도 가게 모양과 글자가 환하게 잘 보이게 해 주는 성질을 생각해 보세요!',
      successNote: '맞아요! 구부린 유리관으로 예쁜 모양의 빛나는 간판을 만들 수 있어요.',
    },
    step3MoreUses: '비가 오거나 안개가 낀 날에도 비행기가 길을 잘 찾도록 돕는 공항 활주로 안내등에도 쓰입니다.',
    step3Points: [
      { label: '공항 활주로 안내등', text: '네온이 내는 붉은빛과 주황빛은 안개나 비를 뚫고 멀리까지 잘 보여 비행기 착륙을 도와줘요.' },
      { label: '안전 표시등·신호등', text: '위험 구간이나 도로 공사를 멀리서도 쉽게 알아볼 수 있는 표시등에 써요.' },
    ],
    step3Image: GENERATED_IMAGES.answerNeonAirportPencil,
    step3ImageAlt: '안개 낀 밤 비행기 착륙을 돕는 공항 활주로 네온 안내등 색연필화',
    step3Quiz: {
      question: '비나 안개가 낀 어두운 밤, 그림 속 공항 활주로에 네온 안내등을 설치하는 이유는?',
      options: [
        '비행기 날개를 가볍게 띄워 주기 위해',
        '안개를 뚫고 붉은·주황빛이 멀리까지 잘 보여 안전한 착륙을 돕기 위해',
      ],
      correctIndex: 1,
      hint: '네온이 내는 붉은빛·주황빛은 안개 속에서도 시야가 아주 잘 통해요!',
      successNote: '잘했어요! 공항 활주로와 도로 안전 표시등에도 네온이 활약해요.',
    },
  },
  {
    id: 'spot-6-hydrogen',
    number: 6,
    label: '친환경 수소 버스와 로켓',
    pinShortLabel: '6. 수소 버스·로켓',
    placeLabel: '6번 구역 · 미래 에너지 도로',
    gasId: 'hydrogen',
    xPercent: 76,
    yPercent: 64,
    isOnMap: true,
    clueQuestion: '매연 대신 깨끗한 물만 내보내며 달리는 친환경 버스와 우주 로켓 연료에 쓰이는 기체는 무엇일까요?',
    clueHint: '세상에서 가장 가벼운 기체이고, 산소와 만나 큰 힘을 낸 뒤 깨끗한 물만 남아요!',
    discoveryTitle: '정답은 "수소"예요!',
    step1Property: '색깔과 냄새가 없고 세상에서 가장 가벼운 기체예요. 스스로 잘 타며 에너지를 낸 뒤 깨끗한 물만 남습니다.',
    step1Points: [
      { label: '색깔·냄새', text: '색깔과 냄새가 없어요.' },
      { label: '무게 비교', text: '지구에 있는 모든 기체 중에서 가장 가벼운 기체예요.' },
      { label: '불꽃 반응', text: '불을 가까이하면 "퍽" 소리를 내며 스스로 잘 타요.' },
      { label: '친환경 특징', text: '에너지를 만들고 난 뒤 나쁜 매연 대신 깨끗한 물만 남아요.' },
    ],
    step1Image: GENERATED_IMAGES.answerHydrogenSciencePencil,
    step1ImageAlt: '깃털처럼 가볍고 깨끗한 물방울을 만드는 수소 과학 그림',
    step1Quiz: {
      question: '수소가 에너지를 내고 난 뒤에 나쁜 연기(매연) 대신 남는 깨끗한 물질은 무엇일까요?',
      options: [
        '하얀 석회수',
        '깨끗한 물(물방울)',
        '까만 숯가루',
      ],
      correctIndex: 1,
      hint: '그림 아래쪽에 그려진 파란 물방울을 찾아보세요!',
      successNote: '정답이에요! 세상에서 가장 가볍고 깨끗한 물만 남는 기체예요.',
    },
    step2WhyUse: '기름 대신 쓰면 매연 없이 깨끗한 물만 나오고, 무게가 아주 가벼워 큰 힘을 낼 수 있기 때문이에요.',
    step2Points: [
      { label: '매연 제로', text: '수소 버스는 달릴 때 나쁜 연기 대신 맑은 물방울만 배출해 공기를 깨끗하게 지켜요.' },
      { label: '강력한 전기', text: '산소와 만나 연료전지에서 전기를 만들어 커다란 버스를 힘차게 움직여요.' },
    ],
    step2Image: GENERATED_IMAGES.cardHydrogenBus,
    step2ImageAlt: '초록 들판을 달리며 물방울만 남기는 친환경 수소 버스 그림',
    step2Quiz: {
      question: '수소 버스나 수소 자동차가 지구를 지키는 친환경 교통수단으로 불리는 까닭은?',
      options: [
        '공기를 더럽히는 매연 대신 깨끗한 물만 내보내며 달리기 때문',
        '전기를 연결하면 버스가 주황색으로 빛나기 때문',
      ],
      correctIndex: 0,
      hint: '수소가 산소와 만나 전기를 만들고 나면 배기가스 대신 무엇이 나오는지 떠올려 보세요!',
      successNote: '완벽해요! 공기를 맑게 지키는 미래 에너지랍니다.',
    },
    step3MoreUses: '대기권 밖으로 날아가는 우주 로켓의 연료와 오래 날 수 있는 수소 드론에도 이용됩니다.',
    step3Points: [
      { label: '우주 로켓 연료', text: '세상에서 가장 가벼우면서도 탈 때 엄청난 추진력을 내어 우주선을 우주로 쏘아 올려요.' },
      { label: '수소 드론·발전소', text: '배터리보다 훨씬 오래 날아가는 구조용 드론과 깨끗한 전기를 만드는 발전소에도 쓰여요.' },
    ],
    step3Image: GENERATED_IMAGES.step3HydrogenRocket,
    step3ImageAlt: '우주 센터 발사대에서 날아오르는 우주 로켓과 하늘을 나는 친환경 수소 드론 그림',
    step3Quiz: {
      question: '가벼운 무게와 강력한 추진력 덕분에 하늘 너머로 날아가는 수소의 또 다른 쓰임새는?',
      options: [
        '우주 로켓 연료와 오래 날아가는 수소 드론',
        '아이스크림을 차갑게 포장하는 드라이아이스',
      ],
      correctIndex: 0,
      hint: '그림 속 우주로 힘차게 발사되는 로켓과 하늘을 나는 드론을 보세요!',
      successNote: '짝짝짝! 버스뿐만 아니라 우주 로켓과 드론까지 수소가 쓰여요.',
    },
  },
];

export const EXPERIMENT_LIST: {
  id: ExperimentId;
  title: string;
  shortLabel: string;
  question: string;
}[] = [
  {
    id: 'flame',
    title: '① 꺼져 가는 향불 대보기',
    shortLabel: '향불 실험',
    question: '기체가 든 병에 불씨를 넣으면 불꽃이 어떻게 될까요?',
  },
  {
    id: 'limewater',
    title: '② 맑은 석회수와 섞어 보기',
    shortLabel: '석회수 실험',
    question: '투명한 석회수에 기체를 넣고 흔들면 색이 어떻게 변할까요?',
  },
  {
    id: 'weight',
    title: '③ 풍선에 넣어 무게 비교하기',
    shortLabel: '무게 실험',
    question: '공기와 비교했을 때 위로 뜰까요, 아래로 가라앉을까요?',
  },
  {
    id: 'electric',
    title: '④ 전기·특징 관찰하기',
    shortLabel: '전기·특징',
    question: '전기를 흘리거나 눈으로 관찰하면 어떤 특징이 나타날까요?',
  },
];

export const QUIZ_MISSIONS: QuizMission[] = [
  {
    id: 'q1',
    caseNumber: '미션 1',
    situation: '소풍 날, 동생이 손에서 놓쳐도 하늘 위로 두둥실 뜨는 안전한 풍선을 선물하고 싶어요!',
    hint: '공기보다 가볍고 불이 붙지 않아 안전해야 해요.',
    correctGasId: 'helium',
    explanation: '정답은 헬륨이에요! 헬륨은 공기보다 훨씬 가벼워 하늘로 뜨고, 불이 붙지 않아 아주 안전합니다.',
  },
  {
    id: 'q2',
    caseNumber: '미션 2',
    situation: '감자칩 과자가 배송되는 동안 부서지지 않고 바삭한 맛도 그대로 유지되게 포장하고 싶어요.',
    hint: '공기 중에 가장 많고, 다른 물질과 잘 반응하지 않아요.',
    correctGasId: 'nitrogen',
    explanation: '정답은 질소예요! 질소는 다른 물질과 잘 반응하지 않아 과자가 상하거나 눅눅해지는 것을 막아 줍니다.',
  },
  {
    id: 'q3',
    caseNumber: '미션 3',
    situation: '과학실에서 실험하다가 작은 불이 났어요! 불꽃을 덮어서 빠르게 불을 끄고, 석회수를 뿌옇게 만드는 기체는 무엇일까요?',
    hint: '공기보다 무겁고 물에 녹으면 톡 쏘는 맛도 나요.',
    correctGasId: 'co2',
    explanation: '정답은 이산화 탄소예요! 공기보다 무겁고 불을 끄는 성질이 있어 소화기에 사용되며, 석회수를 뿌옇게 흐리게 합니다.',
  },
  {
    id: 'q4',
    caseNumber: '미션 4',
    situation: '깊은 바닷속을 탐사하는 잠수부와 연기가 자욱한 곳에 들어가는 소방관의 공기통에 꼭 넣어야 해요.',
    hint: '사람이 숨 쉬는 데 꼭 필요하고, 불이 잘 타도록 돕는 성질도 있어요.',
    correctGasId: 'oxygen',
    explanation: '정답은 산소예요! 산소는 생물이 숨 쉬고 살아가는 데 반드시 필요한 기체입니다.',
  },
  {
    id: 'q5',
    caseNumber: '미션 5',
    situation: '매연이나 나쁜 연기 대신 깨끗한 물만 내보내며 달리는 친환경 미래 버스를 움직이고 싶어요.',
    hint: '세상에서 가장 가벼운 기체로, 우주로 날아가는 로켓 연료로도 써요.',
    correctGasId: 'hydrogen',
    explanation: '정답은 수소예요! 수소는 가장 가볍고 산소와 만나 큰 에너지를 만든 뒤 물만 남기는 친환경 연료입니다.',
  },
  {
    id: 'q6',
    caseNumber: '미션 6',
    situation: '비나 안개가 끼어 어두운 밤에도 비행장과 가게 간판이 멀리서 환하게 빛나도록 만들고 싶어요.',
    hint: '유리관에 넣고 전기를 통하면 밝고 선명한 주황빛·붉은빛을 내요.',
    correctGasId: 'neon',
    explanation: '정답은 네온이에요! 네온은 전기를 통하게 하면 밝고 선명한 빛을 내어 간판이나 안내등에 이용합니다.',
  },
];
