export const defaultQuestions = [
  {
    type: '漢字読み',
    question: '_____のことばはひらがなでどうかきますか。',
    context: '彼女は毎日__散歩__に行きます。',
    choices: ['さんぽ', 'さんほ', 'ざんぽ', 'ざんほ'],
    correctAnswer: 1
  },
  {
    type: '文法1',
    question: '正しい言葉を選んでください。',
    context: '今日は暑い_____、窓を開けましょう。',
    choices: ['から', 'が', 'けど', 'のに'],
    correctAnswer: 1
  },
  {
    type: '語彙',
    question: '適切な言葉を選んでください。',
    context: 'この本は_____です。もう一度読みたいです。',
    choices: ['おもしろい', 'つまらない', 'きびしい', 'ふべん'],
    correctAnswer: 1
  }
];