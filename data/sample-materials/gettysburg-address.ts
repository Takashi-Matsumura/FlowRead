import { Material } from '@/lib/types';

export const gettysburgAddress: Material = {
  id: 'builtin-gettysburg-address',
  title: 'ゲティスバーグ演説',
  description: '1863年、リンカーン大統領による歴史的な短い演説。民主主義の理念を説く名文。',
  source: 'Abraham Lincoln - Gettysburg Address (1863)',
  isBuiltIn: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  sentences: [
    {
      id: 'ga-1',
      order: 1,
      originalText: 'Four score and seven years ago our fathers brought forth on this continent a new nation,',
      chunks: [
        {
          id: 'ga-1-1',
          text: 'Four score and seven years ago',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: '87年前（独立宣言から）',
          },
        },
        {
          id: 'ga-1-2',
          text: 'our fathers',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '建国の父たち',
          },
        },
        {
          id: 'ga-1-3',
          text: 'brought forth',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: '生み出した',
          },
        },
        {
          id: 'ga-1-4',
          text: 'on this continent',
          order: 4,
          guide: {
            role: 'place',
            questionForm: 'どこに？',
            flowHint: 'この大陸に',
          },
        },
        {
          id: 'ga-1-5',
          text: 'a new nation,',
          order: 5,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '新しい国家を',
          },
        },
      ],
    },
    {
      id: 'ga-2',
      order: 2,
      originalText: 'conceived in Liberty, and dedicated to the proposition that all men are created equal.',
      chunks: [
        {
          id: 'ga-2-1',
          text: 'conceived in Liberty,',
          order: 1,
          guide: {
            role: 'modifier',
            questionForm: 'どんな？',
            flowHint: '自由の精神で生まれた',
          },
        },
        {
          id: 'ga-2-2',
          text: 'and dedicated to the proposition',
          order: 2,
          guide: {
            role: 'modifier',
            questionForm: '何に捧げられた？',
            flowHint: 'ある理念に捧げられた',
          },
        },
        {
          id: 'ga-2-3',
          text: 'that all men are created equal.',
          order: 3,
          guide: {
            role: 'complement',
            questionForm: 'どんな理念？',
            flowHint: '人は皆平等に創られた',
          },
        },
      ],
    },
    {
      id: 'ga-3',
      order: 3,
      originalText: 'Now we are engaged in a great civil war,',
      chunks: [
        {
          id: 'ga-3-1',
          text: 'Now',
          order: 1,
          guide: {
            role: 'time',
            questionForm: 'いつ？',
            flowHint: '今',
          },
        },
        {
          id: 'ga-3-2',
          text: 'we are engaged',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: '私たちは？',
            flowHint: '巻き込まれている',
          },
        },
        {
          id: 'ga-3-3',
          text: 'in a great civil war,',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何に？',
            flowHint: '大きな内戦に',
          },
        },
      ],
    },
    {
      id: 'ga-4',
      order: 4,
      originalText: 'testing whether that nation, or any nation so conceived and so dedicated, can long endure.',
      chunks: [
        {
          id: 'ga-4-1',
          text: 'testing',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: '何をしている？',
            flowHint: '試されている',
          },
        },
        {
          id: 'ga-4-2',
          text: 'whether that nation, or any nation so conceived and so dedicated,',
          order: 2,
          guide: {
            role: 'object',
            questionForm: '何が？',
            flowHint: 'そのような国家が',
          },
        },
        {
          id: 'ga-4-3',
          text: 'can long endure.',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうなるか？',
            flowHint: '長く存続できるか',
          },
        },
      ],
    },
    {
      id: 'ga-5',
      order: 5,
      originalText: 'We are met on a great battlefield of that war.',
      chunks: [
        {
          id: 'ga-5-1',
          text: 'We are met',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: '私たちは？',
            flowHint: '集まっている',
          },
        },
        {
          id: 'ga-5-2',
          text: 'on a great battlefield',
          order: 2,
          guide: {
            role: 'place',
            questionForm: 'どこに？',
            flowHint: '大きな戦場に',
          },
        },
        {
          id: 'ga-5-3',
          text: 'of that war.',
          order: 3,
          guide: {
            role: 'modifier',
            questionForm: 'どの？',
            flowHint: 'その戦争の',
          },
        },
      ],
    },
    {
      id: 'ga-6',
      order: 6,
      originalText: 'We have come to dedicate a portion of that field as a final resting place for those who here gave their lives that that nation might live.',
      chunks: [
        {
          id: 'ga-6-1',
          text: 'We have come',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: '私たちは？',
            flowHint: 'やって来た',
          },
        },
        {
          id: 'ga-6-2',
          text: 'to dedicate a portion of that field',
          order: 2,
          guide: {
            role: 'object',
            questionForm: '何のために？',
            flowHint: 'その土地の一部を捧げるため',
          },
        },
        {
          id: 'ga-6-3',
          text: 'as a final resting place',
          order: 3,
          guide: {
            role: 'complement',
            questionForm: '何として？',
            flowHint: '永眠の地として',
          },
        },
        {
          id: 'ga-6-4',
          text: 'for those who here gave their lives',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: '誰のため？',
            flowHint: 'ここで命を捧げた者たちの',
          },
        },
        {
          id: 'ga-6-5',
          text: 'that that nation might live.',
          order: 5,
          guide: {
            role: 'reason',
            questionForm: 'なぜ？',
            flowHint: '国家が生き続けるために',
          },
        },
      ],
    },
    {
      id: 'ga-7',
      order: 7,
      originalText: 'It is altogether fitting and proper that we should do this.',
      chunks: [
        {
          id: 'ga-7-1',
          text: 'It is altogether fitting and proper',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: 'どうである？',
            flowHint: '全くふさわしい',
          },
        },
        {
          id: 'ga-7-2',
          text: 'that we should do this.',
          order: 2,
          guide: {
            role: 'subject',
            questionForm: '何が？',
            flowHint: '私たちがこれをすること',
          },
        },
      ],
    },
    {
      id: 'ga-8',
      order: 8,
      originalText: 'But, in a larger sense, we can not dedicate, we can not consecrate, we can not hallow this ground.',
      chunks: [
        {
          id: 'ga-8-1',
          text: 'But, in a larger sense,',
          order: 1,
          guide: {
            role: 'connector',
            questionForm: '',
            flowHint: 'しかし広い意味では',
          },
        },
        {
          id: 'ga-8-2',
          text: 'we can not dedicate,',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: '私たちは？',
            flowHint: '捧げることはできない',
          },
        },
        {
          id: 'ga-8-3',
          text: 'we can not consecrate,',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'さらに？',
            flowHint: '聖別することもできない',
          },
        },
        {
          id: 'ga-8-4',
          text: 'we can not hallow this ground.',
          order: 4,
          guide: {
            role: 'verb',
            questionForm: 'そして？',
            flowHint: 'この地を神聖にすることも',
          },
        },
      ],
    },
    {
      id: 'ga-9',
      order: 9,
      originalText: 'The brave men, living and dead, who struggled here, have consecrated it far above our poor power to add or detract.',
      chunks: [
        {
          id: 'ga-9-1',
          text: 'The brave men, living and dead,',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: '生死を問わず勇敢な人々',
          },
        },
        {
          id: 'ga-9-2',
          text: 'who struggled here,',
          order: 2,
          guide: {
            role: 'modifier',
            questionForm: 'どんな人々？',
            flowHint: 'ここで戦った',
          },
        },
        {
          id: 'ga-9-3',
          text: 'have consecrated it',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうした？',
            flowHint: 'すでに聖別した',
          },
        },
        {
          id: 'ga-9-4',
          text: 'far above our poor power to add or detract.',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: 'どの程度？',
            flowHint: '私たちの力では及ばないほど',
          },
        },
      ],
    },
    {
      id: 'ga-10',
      order: 10,
      originalText: 'The world will little note nor long remember what we say here, but it can never forget what they did here.',
      chunks: [
        {
          id: 'ga-10-1',
          text: 'The world will little note nor long remember',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: '世界は？',
            flowHint: 'あまり注目も記憶もしない',
          },
        },
        {
          id: 'ga-10-2',
          text: 'what we say here,',
          order: 2,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '私たちの言葉を',
          },
        },
        {
          id: 'ga-10-3',
          text: 'but it can never forget',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'しかし？',
            flowHint: '決して忘れない',
          },
        },
        {
          id: 'ga-10-4',
          text: 'what they did here.',
          order: 4,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '彼らの行いを',
          },
        },
      ],
    },
    {
      id: 'ga-11',
      order: 11,
      originalText: 'It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced.',
      chunks: [
        {
          id: 'ga-11-1',
          text: 'It is for us the living, rather,',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰にとって？',
            flowHint: 'むしろ生きている私たちが',
          },
        },
        {
          id: 'ga-11-2',
          text: 'to be dedicated here',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうすべき？',
            flowHint: '身を捧げるべき',
          },
        },
        {
          id: 'ga-11-3',
          text: 'to the unfinished work',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何に？',
            flowHint: '未完の仕事に',
          },
        },
        {
          id: 'ga-11-4',
          text: 'which they who fought here have thus far so nobly advanced.',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: 'どんな仕事？',
            flowHint: '戦った者たちが気高く進めた',
          },
        },
      ],
    },
    {
      id: 'ga-12',
      order: 12,
      originalText: 'It is rather for us to be here dedicated to the great task remaining before us.',
      chunks: [
        {
          id: 'ga-12-1',
          text: 'It is rather for us',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '誰が？',
            flowHint: 'むしろ私たちが',
          },
        },
        {
          id: 'ga-12-2',
          text: 'to be here dedicated',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: 'どうすべき？',
            flowHint: 'ここで身を捧げる',
          },
        },
        {
          id: 'ga-12-3',
          text: 'to the great task remaining before us.',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何に？',
            flowHint: '私たちの前に残る大きな仕事',
          },
        },
      ],
    },
    {
      id: 'ga-13',
      order: 13,
      originalText: 'That from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion.',
      chunks: [
        {
          id: 'ga-13-1',
          text: 'That from these honored dead',
          order: 1,
          guide: {
            role: 'modifier',
            questionForm: '誰から？',
            flowHint: '名誉ある死者たちから',
          },
        },
        {
          id: 'ga-13-2',
          text: 'we take increased devotion',
          order: 2,
          guide: {
            role: 'verb',
            questionForm: '私たちは？',
            flowHint: 'より深い献身を得る',
          },
        },
        {
          id: 'ga-13-3',
          text: 'to that cause',
          order: 3,
          guide: {
            role: 'object',
            questionForm: '何への？',
            flowHint: 'その大義への',
          },
        },
        {
          id: 'ga-13-4',
          text: 'for which they gave the last full measure of devotion.',
          order: 4,
          guide: {
            role: 'modifier',
            questionForm: 'どんな大義？',
            flowHint: '彼らが全てを捧げた',
          },
        },
      ],
    },
    {
      id: 'ga-14',
      order: 14,
      originalText: 'That we here highly resolve that these dead shall not have died in vain.',
      chunks: [
        {
          id: 'ga-14-1',
          text: 'That we here highly resolve',
          order: 1,
          guide: {
            role: 'verb',
            questionForm: '私たちは？',
            flowHint: 'ここに固く決意する',
          },
        },
        {
          id: 'ga-14-2',
          text: 'that these dead shall not have died in vain.',
          order: 2,
          guide: {
            role: 'object',
            questionForm: '何を？',
            flowHint: '死者たちの死を無駄にしない',
          },
        },
      ],
    },
    {
      id: 'ga-15',
      order: 15,
      originalText: 'That this nation, under God, shall have a new birth of freedom.',
      chunks: [
        {
          id: 'ga-15-1',
          text: 'That this nation,',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '何が？',
            flowHint: 'この国家が',
          },
        },
        {
          id: 'ga-15-2',
          text: 'under God,',
          order: 2,
          guide: {
            role: 'modifier',
            questionForm: '誰のもとで？',
            flowHint: '神のもとで',
          },
        },
        {
          id: 'ga-15-3',
          text: 'shall have a new birth of freedom.',
          order: 3,
          guide: {
            role: 'verb',
            questionForm: 'どうなる？',
            flowHint: '自由の新たな誕生を得る',
          },
        },
      ],
    },
    {
      id: 'ga-16',
      order: 16,
      originalText: 'And that government of the people, by the people, for the people, shall not perish from the earth.',
      chunks: [
        {
          id: 'ga-16-1',
          text: 'And that government of the people,',
          order: 1,
          guide: {
            role: 'subject',
            questionForm: '何が？',
            flowHint: '人民の政府',
          },
        },
        {
          id: 'ga-16-2',
          text: 'by the people,',
          order: 2,
          guide: {
            role: 'modifier',
            questionForm: '誰による？',
            flowHint: '人民による',
          },
        },
        {
          id: 'ga-16-3',
          text: 'for the people,',
          order: 3,
          guide: {
            role: 'modifier',
            questionForm: '誰のため？',
            flowHint: '人民のための',
          },
        },
        {
          id: 'ga-16-4',
          text: 'shall not perish from the earth.',
          order: 4,
          guide: {
            role: 'verb',
            questionForm: 'どうなる？',
            flowHint: '地上から滅びない',
          },
        },
      ],
    },
  ],
};
