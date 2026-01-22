import { Material } from '@/lib/types';

export const northWindAndSun: Material = {
  id: 'builtin-north-wind-and-sun',
  title: '北風と太陽',
  description: 'イソップ寓話より。北風と太陽が旅人の外套を脱がせる競争をする物語。',
  source: "Aesop's Fables - The North Wind and the Sun",
  isBuiltIn: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  sentences: [
    {
      id: 'sentence-1',
      order: 1,
      originalText: 'The North Wind and the Sun were disputing which was the stronger,',
      chunks: [
        {
          id: 'chunk-1-1',
          text: 'The North Wind and the Sun',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '物語の主役たちが登場',
          },
        },
        {
          id: 'chunk-1-2',
          text: 'were disputing',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうしていた？',
            flowHint: '二人の間で起きていること',
          },
        },
        {
          id: 'chunk-1-3',
          text: 'which was the stronger,',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何について？',
            flowHint: '議論の中身が見える',
          },
        },
      ],
    },
    {
      id: 'sentence-2',
      order: 2,
      originalText: 'when a traveler came along wrapped in a warm cloak.',
      chunks: [
        {
          id: 'chunk-2-1',
          text: 'when',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: '場面が動く合図',
          },
        },
        {
          id: 'chunk-2-2',
          text: 'a traveler',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '新しい登場人物',
          },
        },
        {
          id: 'chunk-2-3',
          text: 'came along',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: 'その人物の動き',
          },
        },
        {
          id: 'chunk-2-4',
          text: 'wrapped in a warm cloak.',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: 'どんな様子で？',
            flowHint: '旅人の状態が見える',
          },
        },
      ],
    },
    {
      id: 'sentence-3',
      order: 3,
      originalText: 'They agreed that the one who first succeeded in making the traveler take his cloak off should be considered stronger than the other.',
      chunks: [
        {
          id: 'chunk-3-1',
          text: 'They',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '先ほどの二人',
          },
        },
        {
          id: 'chunk-3-2',
          text: 'agreed',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '二人の決断',
          },
        },
        {
          id: 'chunk-3-3',
          text: 'that the one who first succeeded',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '合意の内容が始まる',
          },
        },
        {
          id: 'chunk-3-4',
          text: 'in making the traveler take his cloak off',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: '何に成功？',
            flowHint: '成功の中身',
          },
        },
        {
          id: 'chunk-3-5',
          text: 'should be considered stronger than the other.',
          order: 5,
          guide: {
            role: 'complement',
            questionForm: 'どうなる？',
            flowHint: '勝利の条件',
          },
        },
      ],
    },
    {
      id: 'sentence-4',
      order: 4,
      originalText: 'Then the North Wind blew as hard as he could,',
      chunks: [
        {
          id: 'chunk-4-1',
          text: 'Then',
          order: 1,
          guide: {
            role: 'connector',
            questionForm: '',
            flowHint: '話が次へ進む',
          },
        },
        {
          id: 'chunk-4-2',
          text: 'the North Wind',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '最初の挑戦者',
          },
        },
        {
          id: 'chunk-4-3',
          text: 'blew',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '北風の行動',
          },
        },
        {
          id: 'chunk-4-4',
          text: 'as hard as he could,',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: 'どのくらい？',
            flowHint: '全力の様子',
          },
        },
      ],
    },
    {
      id: 'sentence-5',
      order: 5,
      originalText: 'but the more he blew the more closely did the traveler fold his cloak around him;',
      chunks: [
        {
          id: 'chunk-5-1',
          text: 'but',
          order: 1,
          guide: {
            role: 'connector',
            questionForm: '',
            flowHint: '展開が変わる',
          },
        },
        {
          id: 'chunk-5-2',
          text: 'the more he blew',
          order: 2,
          guide: {
            role: 'condition',
            questionForm: '〜すればするほど',
            flowHint: '北風の努力',
          },
        },
        {
          id: 'chunk-5-3',
          text: 'the more closely',
          order: 3,
          guide: {
            role: 'modifier',
            questionForm: 'それだけ〜',
            flowHint: '結果の度合い',
          },
        },
        {
          id: 'chunk-5-4',
          text: 'did the traveler fold his cloak around him;',
          order: 4,
          guide: {
            role: 'verb',
            questionForm: 'どうなった？',
            flowHint: '旅人の反応',
          },
        },
      ],
    },
    {
      id: 'sentence-6',
      order: 6,
      originalText: 'and at last the North Wind gave up the attempt.',
      chunks: [
        {
          id: 'chunk-6-1',
          text: 'and at last',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'ついに',
            flowHint: '結末へ向かう',
          },
        },
        {
          id: 'chunk-6-2',
          text: 'the North Wind',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '北風',
          },
        },
        {
          id: 'chunk-6-3',
          text: 'gave up the attempt.',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '北風の決断',
          },
        },
      ],
    },
    {
      id: 'sentence-7',
      order: 7,
      originalText: 'Then the Sun shone out warmly,',
      chunks: [
        {
          id: 'chunk-7-1',
          text: 'Then',
          order: 1,
          guide: {
            role: 'connector',
            questionForm: '',
            flowHint: '次の展開へ',
          },
        },
        {
          id: 'chunk-7-2',
          text: 'the Sun',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '次の挑戦者',
          },
        },
        {
          id: 'chunk-7-3',
          text: 'shone out warmly,',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '太陽のやり方',
          },
        },
      ],
    },
    {
      id: 'sentence-8',
      order: 8,
      originalText: 'and immediately the traveler took off his cloak.',
      chunks: [
        {
          id: 'chunk-8-1',
          text: 'and immediately',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'すると',
            flowHint: 'すぐに結果が',
          },
        },
        {
          id: 'chunk-8-2',
          text: 'the traveler',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '旅人',
          },
        },
        {
          id: 'chunk-8-3',
          text: 'took off his cloak.',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '旅人の行動',
          },
        },
      ],
    },
    {
      id: 'sentence-9',
      order: 9,
      originalText: 'And so the North Wind was obliged to confess that the Sun was the stronger of the two.',
      chunks: [
        {
          id: 'chunk-9-1',
          text: 'And so',
          order: 1,
          guide: {
            role: 'connector',
            questionForm: '',
            flowHint: '結論へ',
          },
        },
        {
          id: 'chunk-9-2',
          text: 'the North Wind',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '敗者',
          },
        },
        {
          id: 'chunk-9-3',
          text: 'was obliged to confess',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうせざるを得なかった？',
            flowHint: '認めることに',
          },
        },
        {
          id: 'chunk-9-4',
          text: 'that the Sun was the stronger of the two.',
          order: 4,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '物語の結論',
          },
        },
      ],
    },
  ],
};

// 組み込み教材の一覧
export const builtInMaterials: Material[] = [northWindAndSun];
