import { Audio } from "expo-av";

type Phonetic = {
  audio: string;
};

type WordData = {
  phonetics: Phonetic[];
};

export async function playPronunciation(word: string) {
  try {
    // Fetch word data from the API
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    const data: WordData[] = await response.json();

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const wordData = data[0];
    console.log("Word data:", wordData);

    // Find the first available audio URL
    const audioUrl = wordData.phonetics.find(
      (phonetic) => phonetic.audio
    )?.audio;

    if (!audioUrl) {
      console.log("No audio available for this word");
      return;
    }

    console.log("Audio URI:", audioUrl);

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );

    console.log("Audio played successfully");
  } catch (error) {
    // Ensure error is of type Error before accessing its message
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
