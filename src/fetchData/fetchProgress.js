import { supabase } from '@/src/lib/supabase';

export const fetchTopicProgress= async (userId, topicId) => {
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