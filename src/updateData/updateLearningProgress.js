import { supabase } from '@/src/lib/supabase';

export const updateUserLevel = async (userID, level) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ level: level })
    .eq('id', userID);

  if (error) {
    // Cung cấp thông tin chi tiết về lỗi
    console.error('Error updating level:', error.message || error.details || error);
    return { success: false, error };
  }

  return { success: true, data };
};

export const completeLearningVocab = async (userID, topicID) => {
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

export const completedPracticingVocab = async (userID, topicID) => {
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

  return { success: true, message: 'Practicing already completed' };
};

//// ------------ GRAMMAR --------------------

export const completeLearningGrammar = async (userID, topicID) => {
  // Kiểm tra nếu bản ghi đã tồn tại
  const { data, error } = await supabase
    .from('CompletedTopicGrammar')
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
      .from('CompletedTopicGrammar')
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
      .from('CompletedTopicGrammar')
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

export const completedPracticingGrammar = async (userID, topicID) => {
  const { data, error } = await supabase
    .from('CompletedTopicGrammar')
    .select('completedPracticing')
    .eq('user_id', userID)
    .eq('topic_id', topicID);

  if (error) {
    console.error('Error fetching record:', error);
    return { success: false, error };
  }
 
  if (data.length === 0) {
    const { data: insertData, error: insertError } = await supabase
      .from('CompletedTopicGrammar')
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
      .from('CompletedTopicGrammar')
      .update({ completedPracticing: true })
      .eq('user_id', userID)
      .eq('topic_id', topicID);

    if (updateError) {
      console.error('Error updating record:', updateError);
      return { success: false, error: updateError };
    }

    return { success: true, data: updateData };
  }

  return { success: true, message: 'Practicing already completed' };
};
