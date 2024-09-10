import { supabase } from '@/src/lib/supabase';


export const completeLearning = async (userID, topicID) => {
  // Kiểm tra nếu bản ghi đã tồn tại
  const { data, error } = await supabase
    .from('CompletedTopicVocab')
    .select('completedLearning')
    .eq('user_id', userID)
    .eq('topic_id', topicID);

  if (error) {
    console.error('Error fetching record:', error);
    return { success: false, error };
  }
 

  // Nếu không có bản ghi nào được tìm thấy, thêm mới
  if (data.length === 0) {
    const { data: insertData, error: insertError } = await supabase
      .from('CompletedTopicVocab')
      .insert({
        user_id: userID,
        topic_id: topicID,
        time: new Date().toISOString(), // Thời gian hiện tại
        completedLearning: true,
        completedPracticing: false,
      });

    if (insertError) {
      console.error('Error inserting record:', insertError);
      return { success: false, error: insertError };
    }

    return { success: true, data: insertData };
  }

  // Nếu bản ghi tồn tại và completedLearning đang là 0, thì update thành 1
  const existingRecord = data[0]; // Vì chỉ có một bản ghi được trả về trong mảng
  if (existingRecord.completedLearning === false) {
    const { data: updateData, error: updateError } = await supabase
      .from('CompletedTopicVocab')
      .update({ completedLearning: true })
      .eq('user_id', userID)
      .eq('topic_id', topicID);

    if (updateError) {
      console.error('Error updating record:', updateError);
      return { success: false, error: updateError };
    }

    return { success: true, data: updateData };
  }

  // Nếu completedLearning đã là 1 thì không cần update
  return { success: true, message: 'Learning already completed' };
};

export const completedPracticing = async (userID, topicID) => {
  const { data, error } = await supabase
    .from('CompletedTopicVocab')
    .select('completedPracticing')
    .eq('user_id', userID)
    .eq('topic_id', topicID);

  if (error) {
    console.error('Error fetching record:', error);
    return { success: false, error };
  }
 
  if (data.length === 0) {
    const { data: insertData, error: insertError } = await supabase
      .from('CompletedTopicVocab')
      .insert({
        user_id: userID,
        topic_id: topicID,
        time: new Date().toISOString(),
        completedLearning: false,
        completedPracticing: true,
      });

    if (insertError) {
      console.error('Error inserting record:', insertError);
      return { success: false, error: insertError };
    }

    return { success: true, data: insertData };
  }

  const existingRecord = data[0];
  if (existingRecord.completedPracticing === false) {
    const { data: updateData, error: updateError } = await supabase
      .from('CompletedTopicVocab')
      .update({ completedPracticing: true })
      .eq('user_id', userID)
      .eq('topic_id', topicID);

    if (updateError) {
      console.error('Error updating record:', updateError);
      return { success: false, error: updateError };
    }

    return { success: true, data: updateData };
  }

  return { success: true, message: 'Learning already completed' };
};