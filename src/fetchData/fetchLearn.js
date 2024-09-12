import { supabase } from '@/src/lib/supabase';

export const fetchUserLevel = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('level')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const getVocabTopicList = async (userId, level) => {
  const { data, error } = await supabase
    .from('TopicVocab')
    .select(`
      id,
      title,
      ImageUrl,
      level,
      CompletedTopicVocab(
        completedLearning,
        completedPracticing,
        time
      )
    `)
    .eq('level', level)
    .eq('CompletedTopicVocab.user_id', userId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching record:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getGrammarTopicList = async (userId, level) => {
  const { data, error } = await supabase
    .from('TopicGrammar')
    .select(`
      id,
      title,
      lectureLink,
      ImageUrl,
      level,
      CompletedTopicGrammar(
        completedLearning,
        completedPracticing,
        time
      )
    `)
    .eq('level', level)
    .eq('CompletedTopicGrammar.user_id', userId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching record:', error);
    throw new Error(error.message);
  }

  return data;
};

// Hàm lấy danh sách từ vựng theo TopicID
export const getVocabList = async (topicID) => {
  const { data, error } = await supabase
    .from('Vocab')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


// Hàm lấy danh sách bài tập kiểu 1 theo TopicID
export const getVocabExType1List = async (topicID) => {
  const { data, error } = await supabase
    .from('VocabExType1')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    questionImage: item.ImageUrl,
    correctAnswerIndex: item.solution,
    answers: [item.choice1, item.choice2, item.choice3, item.choice4],
  }));
};

// Hàm lấy danh sách bài tập kiểu 2 theo TopicID
export const getVocabExType2List = async (topicID) => {
  const { data, error } = await supabase
    .from('VocabExType2')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    question: item.question,
    correctAnswerIndex: item.solution,
    answers: [item.choice1, item.choice2, item.choice3, item.choice4],
  }));
};

// Hàm lấy danh sách bài tập kiểu 3 theo TopicID
export const getVocabExType3List = async (topicID) => {
  const { data, error } = await supabase
    .from('VocabExType3')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => {
    const pair1Array = item.pair1.split('|');
    const pair2Array = item.pair2.split('|');
    const synonyms = pair1Array.map((word, index) => [word, pair2Array[index]]);

    return {
      question: item.question,
      synonyms,
    };
  });
};

//// ------------ GRAMMAR --------------
export const getGrammarExType1List = async (topicID) => {
  const { data, error } = await supabase
    .from('GrammarExType1')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
};

export const getGrammarExType2List = async (topicID) => {
  const { data, error } = await supabase
    .from('GrammarExType2')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return data.map((item) => {
    const correctSentence = item.sentence.split('|'); // Câu trả lời đúng
    const randomSentence = shuffleArray([...correctSentence]); // Đảo ngẫu nhiên

    return {
      words: randomSentence,
      correctAnswer: correctSentence,
    };
  });
};

export const getGrammarExType3List = async (topicID) => {
  const { data, error } = await supabase
    .from('GrammarExType3')
    .select('*')
    .eq('TopicId', topicID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    question: item.question,
    correctAnswerIndex: item.solution,
    answers: [item.choice1, item.choice2, item.choice3, item.choice4],
  }));
};
