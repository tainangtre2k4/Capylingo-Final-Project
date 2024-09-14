import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

interface TopicV {
  id: number;
  title: string;
  ImageUrl: string;
  isLearned: boolean;
  isPracticed: boolean;
}

interface TopicG {
    id: number;
    title: string;
    ImageUrl: string;
    lectureLink: string;
    isLearned: boolean;
    isPracticed: boolean;
  }

interface UserLearnContextType {
  level: number;
  TopicsVocab: TopicV[];
  TopicsGrammar: TopicG[];
  totalPercent: number;
  vocabPercent: number;
  grammarPercent: number;
  learnedVocabCount: number;
  learnedGrammarCount: number;
  totalVocabCount: number;
  totalGrammarCount: number;
  updateLevel: (newLevel: number) => void;
  setTopicsVocab: React.Dispatch<React.SetStateAction<TopicV[]>>; // Truyền trực tiếp hàm set
  setTopicsGrammar: React.Dispatch<React.SetStateAction<TopicG[]>>; // Truyền trực tiếp hàm set
  updateTopicVocab: (topicId: number, isLearned?: boolean, isPracticed?: boolean) => void;
  updateTopicGrammar: (topicId: number, isLearned?: boolean, isPracticed?: boolean) => void;
}

const UserLearnContext = createContext<UserLearnContextType | undefined>(undefined);

export const UserLearnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState(0);
  const [TopicsVocab, setTopicsVocab] = useState<TopicV[]>([]);
  const [TopicsGrammar, setTopicsGrammar] = useState<TopicG[]>([]);

  // Tính số topics đã học của vocab và grammar
  const learnedVocabCount = useMemo(
    () => TopicsVocab.filter((topic) => topic.isLearned && topic.isPracticed).length,
    [TopicsVocab]
  );
  const learnedGrammarCount = useMemo(
    () => TopicsGrammar.filter((topic) => topic.isLearned && topic.isPracticed).length,
    [TopicsGrammar]
  );

  // Tổng số topics của vocab và grammar
  const totalVocabCount = TopicsVocab.length;
  const totalGrammarCount = TopicsGrammar.length;

  // Tính phần trăm hoàn thành của vocab và grammar
  const vocabPercent = useMemo(
    () => (totalVocabCount > 0 ? Math.round((learnedVocabCount / totalVocabCount) * 100) : 0),
    [learnedVocabCount, totalVocabCount]
  );
  const grammarPercent = useMemo(
    () => (totalGrammarCount > 0 ? Math.round((learnedGrammarCount / totalGrammarCount) * 100) : 0),
    [learnedGrammarCount, totalGrammarCount]
  );

  const totalPercent = useMemo(() => {
    return Math.round((vocabPercent + grammarPercent) / 2);
  }, [vocabPercent, grammarPercent]);

  // Hàm để cập nhật level hiện tại
  const updateLevel = (newLevel: number) => {
    if (newLevel >= 1 && newLevel <= 5) {
      setLevel(newLevel);
    }
  };

  // Hàm để cập nhật một topic trong TopicsVocab
  const updateTopicVocab = (topicId: number, isLearned?: boolean, isPracticed?: boolean) => {
    setTopicsVocab((prevTopics) =>
      prevTopics.map((topic) => {
        if (topic.id === topicId) {
          return {
            ...topic,
            isLearned: isLearned !== undefined ? isLearned : topic.isLearned,
            isPracticed: isPracticed !== undefined ? isPracticed : topic.isPracticed
          };
        }
        return topic;
      })
    );
  };

  // Hàm để cập nhật một topic trong TopicsGrammar
  const updateTopicGrammar = (topicId: number, isLearned?: boolean, isPracticed?: boolean) => {
    setTopicsGrammar((prevTopics) =>
      prevTopics.map((topic) => {
        if (topic.id === topicId) {
          return {
            ...topic,
            isLearned: isLearned !== undefined ? isLearned : topic.isLearned,
            isPracticed: isPracticed !== undefined ? isPracticed : topic.isPracticed
          };
        }
        return topic;
      })
    );
  };
  
    // // In các giá trị ra console để kiểm tra
    // useMemo(() => {
    //     console.log('TopicsGrammar:', TopicsGrammar);
    //     console.log('learnedGrammarCount:', learnedGrammarCount);
    //     console.log('totalGrammarCount:', totalGrammarCount);
    //     console.log('grammarPercent:', grammarPercent);
    //   }, [TopicsGrammar, learnedGrammarCount, totalGrammarCount, grammarPercent]);

  return (
    <UserLearnContext.Provider
      value={{
        level,
        TopicsVocab,
        TopicsGrammar,
        totalPercent,
        vocabPercent,
        grammarPercent,
        learnedVocabCount,
        learnedGrammarCount,
        totalVocabCount,
        totalGrammarCount,
        updateLevel,
        setTopicsVocab,
        setTopicsGrammar,
        updateTopicVocab,
        updateTopicGrammar,
      }}
    >
      {children}
    </UserLearnContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useUserLearn = () => {
  const context = useContext(UserLearnContext);
  if (!context) {
    throw new Error("Oops! useUserLearn must be used within UserLearnProvider");
  }
  return context;
};
