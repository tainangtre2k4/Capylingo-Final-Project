import { supabase } from '@/src/lib/supabase';

export const fetchVocabLevelPercent = async (userId, level) => {
  try {
    // Lấy tổng số topic trong level được yêu cầu
    const { data: totalTopics, error: totalTopicsError } = await supabase
      .from('TopicVocab')
      .select('id')
      .eq('level', level);

    if (totalTopicsError) {
      throw totalTopicsError;
    }

    const totalTopicCount = totalTopics.length;

    // Lấy số lượng topic mà user đã hoàn thành (completedLearning và completedPracticing đều true)
    const { data: completedTopics, error: completedTopicsError } = await supabase
      .from('CompletedTopicVocab')
      .select('topic_id')
      .eq('user_id', userId)
      .eq('completedLearning', true)
      .eq('completedPracticing', true)
      .in(
        'topic_id',
        totalTopics.map((topic) => topic.id)
      );

    if (completedTopicsError) {
      throw completedTopicsError;
    }

    const completedTopicCount = completedTopics.length;

    // Tính phần trăm hoàn thành
    const percentCompleted = (completedTopicCount / totalTopicCount) * 100;

    return percentCompleted;
  } catch (error) {
    console.error('Error fetching vocab level percent:', error);
    throw error;
  }
};

export const fetchGrammarLevelPercent = async (userId, level) => {
  try {
    // Lấy tổng số topic trong level được yêu cầu
    const { data: totalTopics, error: totalTopicsError } = await supabase
      .from('TopicGrammar')
      .select('id')
      .eq('level', level);

    if (totalTopicsError) {
      throw totalTopicsError;
    }

    const totalTopicCount = totalTopics.length;

    // Lấy số lượng topic mà user đã hoàn thành (completedLearning và completedPracticing đều true)
    const { data: completedTopics, error: completedTopicsError } = await supabase
      .from('CompletedTopicGrammar')
      .select('topic_id')
      .eq('user_id', userId)
      .eq('completedLearning', true)
      .eq('completedPracticing', true)
      .in(
        'topic_id',
        totalTopics.map((topic) => topic.id)
      );

    if (completedTopicsError) {
      throw completedTopicsError;
    }

    const completedTopicCount = completedTopics.length;

    // Tính phần trăm hoàn thành
    const percentCompleted = (completedTopicCount / totalTopicCount) * 100;

    return percentCompleted;
  } catch (error) {
    console.error('Error fetching vocab level percent:', error);
    throw error;
  }
};
