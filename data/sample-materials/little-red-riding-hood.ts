import { Material } from '@/lib/types';

export const littleRedRidingHood: Material = {
  id: 'builtin-little-red-riding-hood',
  title: '赤ずきん',
  description: 'グリム童話より。おばあさんの家へ向かう少女と狼の物語。',
  source: "Grimm's Fairy Tales - Little Red Riding Hood",
  isBuiltIn: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  sentences: [
    {
      id: 'lrrh-1',
      order: 1,
      originalText: 'Once upon a time there lived a sweet little girl.',
      chunks: [
        {
          id: 'lrrh-1-1',
          text: 'Once upon a time',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: '物語の始まりを告げる',
          },
        },
        {
          id: 'lrrh-1-2',
          text: 'there lived',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうしていた？',
            flowHint: '存在を示す',
          },
        },
        {
          id: 'lrrh-1-3',
          text: 'a sweet little girl.',
          order: 3,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '主人公の登場',
          },
        },
      ],
    },
    {
      id: 'lrrh-2',
      order: 2,
      originalText: 'Everyone who saw her liked her, but most of all her grandmother.',
      chunks: [
        {
          id: 'lrrh-2-1',
          text: 'Everyone who saw her',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '彼女を見た人みんな',
          },
        },
        {
          id: 'lrrh-2-2',
          text: 'liked her,',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '周囲の反応',
          },
        },
        {
          id: 'lrrh-2-3',
          text: 'but most of all her grandmother.',
          order: 3,
          guide: {
            role: 'modifier',
            questionForm: '特に誰が？',
            flowHint: '一番の理解者',
          },
        },
      ],
    },
    {
      id: 'lrrh-3',
      order: 3,
      originalText: 'She gave her a little red velvet cap, and it suited her so well that she would never wear anything else.',
      chunks: [
        {
          id: 'lrrh-3-1',
          text: 'She',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: 'おばあさん',
          },
        },
        {
          id: 'lrrh-3-2',
          text: 'gave her',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: 'プレゼントをした',
          },
        },
        {
          id: 'lrrh-3-3',
          text: 'a little red velvet cap,',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '赤いずきんの登場',
          },
        },
        {
          id: 'lrrh-3-4',
          text: 'and it suited her so well',
          order: 4,
          guide: {
            role: 'verb',
            questionForm: 'どうだった？',
            flowHint: 'とても似合った',
          },
        },
        {
          id: 'lrrh-3-5',
          text: 'that she would never wear anything else.',
          order: 5,
          guide: {
            role: 'complement',
            questionForm: 'どのくらい？',
            flowHint: 'いつも身につけるように',
          },
        },
      ],
    },
    {
      id: 'lrrh-4',
      order: 4,
      originalText: 'So she was always called Little Red Riding Hood.',
      chunks: [
        {
          id: 'lrrh-4-1',
          text: 'So',
          order: 1,
          guide: {
            role: 'connector',
            questionForm: '',
            flowHint: 'だから',
          },
        },
        {
          id: 'lrrh-4-2',
          text: 'she was always called',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうされた？',
            flowHint: '呼ばれるように',
          },
        },
        {
          id: 'lrrh-4-3',
          text: 'Little Red Riding Hood.',
          order: 3,
          guide: {
            role: 'complement',
            questionForm: '何と？',
            flowHint: '名前の由来',
          },
        },
      ],
    },
    {
      id: 'lrrh-5',
      order: 5,
      originalText: 'One day her mother said to her, "Come, Little Red Riding Hood, here is a piece of cake and a bottle of wine."',
      chunks: [
        {
          id: 'lrrh-5-1',
          text: 'One day',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: 'ある日',
          },
        },
        {
          id: 'lrrh-5-2',
          text: 'her mother said to her,',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: '誰がどうした？',
            flowHint: 'お母さんの言葉',
          },
        },
        {
          id: 'lrrh-5-3',
          text: '"Come, Little Red Riding Hood,',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何と？',
            flowHint: '呼びかけ',
          },
        },
        {
          id: 'lrrh-5-4',
          text: 'here is a piece of cake and a bottle of wine."',
          order: 4,
          guide: {
            role: 'object',
            questionForm: '何がある？',
            flowHint: 'お土産の品々',
          },
        },
      ],
    },
    {
      id: 'lrrh-6',
      order: 6,
      originalText: '"Take them to your grandmother, for she is ill and weak, and they will do her good."',
      chunks: [
        {
          id: 'lrrh-6-1',
          text: '"Take them to your grandmother,',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: 'どうしなさい？',
            flowHint: 'お使いの依頼',
          },
        },
        {
          id: 'lrrh-6-2',
          text: 'for she is ill and weak,',
          order: 2,
          guide: {
            role: 'reason',
            questionForm: 'なぜ？',
            flowHint: 'おばあさんの状態',
          },
        },
        {
          id: 'lrrh-6-3',
          text: 'and they will do her good."',
          order: 3,
          guide: {
            role: 'complement',
            questionForm: 'どうなる？',
            flowHint: '元気になるはず',
          },
        },
      ],
    },
    {
      id: 'lrrh-7',
      order: 7,
      originalText: 'Little Red Riding Hood set out at once for the house of her grandmother, who lived in the woods.',
      chunks: [
        {
          id: 'lrrh-7-1',
          text: 'Little Red Riding Hood',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '主人公',
          },
        },
        {
          id: 'lrrh-7-2',
          text: 'set out at once',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: 'すぐに出発',
          },
        },
        {
          id: 'lrrh-7-3',
          text: 'for the house of her grandmother,',
          order: 3,
          guide: {
            role: 'place',
            questionForm: 'どこへ？',
            flowHint: '目的地',
          },
        },
        {
          id: 'lrrh-7-4',
          text: 'who lived in the woods.',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: 'どんな場所？',
            flowHint: '森の中に住んでいた',
          },
        },
      ],
    },
    {
      id: 'lrrh-8',
      order: 8,
      originalText: 'Just as she entered the woods, a wolf met her.',
      chunks: [
        {
          id: 'lrrh-8-1',
          text: 'Just as she entered the woods,',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: '森に入った瞬間',
          },
        },
        {
          id: 'lrrh-8-2',
          text: 'a wolf',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '危険な存在の登場',
          },
        },
        {
          id: 'lrrh-8-3',
          text: 'met her.',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '出会ってしまった',
          },
        },
      ],
    },
    {
      id: 'lrrh-9',
      order: 9,
      originalText: 'Little Red Riding Hood did not know what a wicked creature he was, and was not at all afraid of him.',
      chunks: [
        {
          id: 'lrrh-9-1',
          text: 'Little Red Riding Hood',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '主人公',
          },
        },
        {
          id: 'lrrh-9-2',
          text: 'did not know',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうだった？',
            flowHint: '知らなかった',
          },
        },
        {
          id: 'lrrh-9-3',
          text: 'what a wicked creature he was,',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '狼の本性',
          },
        },
        {
          id: 'lrrh-9-4',
          text: 'and was not at all afraid of him.',
          order: 4,
          guide: {
            role: 'verb',
            questionForm: 'どうだった？',
            flowHint: '全く怖がらなかった',
          },
        },
      ],
    },
    {
      id: 'lrrh-10',
      order: 10,
      originalText: '"Good day, Little Red Riding Hood," said the wolf.',
      chunks: [
        {
          id: 'lrrh-10-1',
          text: '"Good day, Little Red Riding Hood,"',
          order: 1,
          guide: {
            role: 'object',
            questionForm: '何と？',
            flowHint: '狼の挨拶',
          },
        },
        {
          id: 'lrrh-10-2',
          text: 'said the wolf.',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: '誰が言った？',
            flowHint: '狼が話しかける',
          },
        },
      ],
    },
    {
      id: 'lrrh-11',
      order: 11,
      originalText: '"Where are you going so early?"',
      chunks: [
        {
          id: 'lrrh-11-1',
          text: '"Where are you going',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: 'どこへ？',
            flowHint: '行き先を聞く',
          },
        },
        {
          id: 'lrrh-11-2',
          text: 'so early?"',
          order: 2,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: 'こんなに早く',
          },
        },
      ],
    },
    {
      id: 'lrrh-12',
      order: 12,
      originalText: '"To my grandmother\'s house," she answered.',
      chunks: [
        {
          id: 'lrrh-12-1',
          text: '"To my grandmother\'s house,"',
          order: 1,
          guide: {
            role: 'place',
            questionForm: 'どこへ？',
            flowHint: '正直に答えてしまう',
          },
        },
        {
          id: 'lrrh-12-2',
          text: 'she answered.',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: '誰が？',
            flowHint: '赤ずきんの返答',
          },
        },
      ],
    },
  ],
};
