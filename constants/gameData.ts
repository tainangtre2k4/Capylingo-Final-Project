// gameData.js

type Grid = number[][];

type Question = {
  question: string;
  options: string[];
  correct: string;
};

type PlayerPosition = {
  row: number;
  col: number;
};

type Level = {
  level: number;
  gridSize: number;
  initialMaps: Grid[];
  initialPlayerPosition: PlayerPosition;
  questions: Question[];
};


export const levels = [
    {
      level: 1,
      gridSize: 5,
      initialMaps: [
        [
          [0, 0, 0, 2, 3], // Treasure at top-right corner
          [0, 1, 0, 1, 1],
          [0, 0, 0, 1, 0],
          [1, 1, 0, 0, 0],
          [0, 2, 0, 0, 0], // Character starts bottom-left
        ],
        [
          [0, 1, 0, 1, 3], 
          [1, 0, 0, 1, 2],
          [0, 1, 0, 1, 2],
          [0, 1, 0, 1, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 1, 0, 2, 3], 
          [1, 0, 0, 1, 1],
          [0, 1, 2, 1, 0],
          [0, 1, 0, 1, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 1, 0, 2, 3], 
          [1, 0, 0, 1, 2],
          [0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0],
          [0, 2, 0, 0, 0],
        ],
      ],
      initialPlayerPosition: { row: 4, col: 0 },
      questions: [
        {
          question: "A strong wind spread the flames very quickly, _______?",
          options: ["does not it", "does it", "did it", "did not it"],
          correct: "did not it",
        },
        {
          question: "Many of the items such as rings, key chains, or souvenirs are made of unusual shell or unique stones illegally _______ from the protected areas.",
          options: ["which is removed", "removing", "which is removing", "removed"],
          correct: "removed",
        },
        {
          question: "He arrived _______ than anyone else, so he had to wait more than an hour.",
          options: ["earlier", "more early", "early", "earliest"],
          correct: "earlier",
        },
        {
          question: "As soon as the taxi _______, we will be able to leave for the airport.",
          options: ["arrives", "arrive", "will arrive", "arrived"],
          correct: "arrives",
        },
        {
          question: "Educated women are becoming less dependent _______ their husbands’ decisions.",
          options: ["about", "of", "on", "for"],
          correct: "on",
        },
        {
          question: "Regular radio broadcasting to inform and entertain the general public started in _______ 1920s.",
          options: ["the", "a", "no article", "an"],
          correct: "the",
        },
        {
          question: "Mr. Nixon refused to answer the questions on the _______ that the matter was confidential.",
          options: ["reasons", "excuses", "grounds", "foundation"],
          correct: "the",
        },
        {
            question: "The acupoints are stimulated _______ the healing capability of the body itself.",
            options: ["enhance", "to enhance", "enhancing", "enhanced"],
            correct: "to enhance",
        },
        {
            question: "After congratulating his team, the coach left, allowing the players to let their______ down for a while.",
            options: ["hearts", "hair", "souls", "heads"],
            correct: "hair",
        },
        {
            question: "When she came home from school yesterday, her mother _______ in the kitchen.",
            options: ["cooked", "was cooking", "is cooking", "cooks"],
            correct: "was cooking",
        },
        {
            question: "At the beach, seagulls _______ a bad reputation for swooping down on unsuspecting people to steal their food.",
            options: ["pay", "take", "have", "get"],
            correct: "have",
        },
        {
            question: "The contract ________ when we reach an agreement on the price.",
            options: ["will have signed", "signs", "is signing", "will be signed"],
            correct: "will be signed",
        },
        {
            question: "For a public campaign to_______, it is important to make use of existing social organizations as well as other relations.",
            options: ["successful", "success", "succeed", "successfully"],
            correct: "succeed",
        },
        {
            question: "The________lay with the organizers, who failed to make the necessary arrangements for dealing with so many people.",
            options: ["mistake", "foul", "fault", "error"],
            correct: "fault",
        },
        {
          question: "The little girl __________ in mud is now receiving a beating.",
          options: ["covered", "covering", "is covered", "is covering"],
          correct: "covered",
        },
      ],
    },
    {
      level: 2,
      gridSize: 6,
      initialMaps: [
        [
          [0, 0, 0, 2, 2, 3], // Bigger grid with 6x6 size
          [0, 1, 0, 1, 1, 1],
          [0, 0, 0, 1, 0, 0],
          [1, 1, 0, 0, 0, 0],
          [0, 2, 0, 1, 1, 0],
          [0, 2, 0, 0, 0, 2], // Character starts bottom-left
        ],
        [
          [0, 0, 1, 0, 2, 3], 
          [0, 1, 0, 0, 2, 2],
          [0, 0, 0, 1, 1, 0],
          [1, 1, 0, 0, 1, 0],
          [0, 0, 2, 1, 1, 0],
          [0, 0, 0, 0, 0, 2], 
        ],
        [
          [0, 0, 0, 0, 2, 3], 
          [0, 0, 0, 1, 2, 1],
          [2, 1, 0, 1, 0, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 1, 1, 0, 1, 0],
          [0, 0, 2, 0, 0, 2], 
        ],
        [
          [0, 1, 0, 0, 2, 0], 
          [0, 1, 0, 2, 3, 2],
          [0, 1, 0, 0, 2, 0],
          [0, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 1, 0],
          [0, 2, 0, 0, 1, 0], 
        ],
        [
          [0, 1, 0, 2, 2, 0], 
          [0, 1, 0, 1, 3, 2],
          [0, 1, 0, 1, 2, 0],
          [0, 0, 0, 1, 0, 0],
          [1, 1, 0, 0, 0, 0],
          [0, 2, 0, 0, 1, 0], 
        ],
      ],
      initialPlayerPosition: { row: 5, col: 0 },
      questions: [
        {
            question: "The Bhaktapur Durbar square, also__________as Bhadgaon, consists of at least four distinct squares.",
            options: ["known", "knew", "to know", "knowing"],
            correct: "known",
        },
        {
            question: "Goods sold in the open markets are often __________than those in the supermarket.",
            options: ["resonable", "most reasonable", "the most reasonable", "more reasonable"],
            correct: "more reasonable",
        },
        {
            question: "She says she won’t phone us _______",
            options: ["until she has the information", "when she had the information", "after she had had the information", "by the time she got the information"],
            correct: "until she has the information",
        },
        {
            question: "Jane: 'Shall we turn back?' - Tom: 'Well, I'm______turning back. It’s too dangerous to go mountain climbing against this weather.'",
            options: ["for", "against", "off", "over"],
            correct: "for",
        },
        {
            question: "The mail scarcely ever arrives before noon, ________?",
            options: ["is it", "doesn’t it", "does it", "don’t they"],
            correct: "does it",
        },
        {
            question: "Global warming, the rise in temperature around the earth’s atmosphere, is one of _______ biggest issues facing humans nowadays.",
            options: ["a", "an", "the", "x"],
            correct: "the",
        },
        {
            question: "Road atlas programs will map out your route between two cities or set up a whole__________of stops.",
            options: ["excavation", "dome", "cruise", "itinerary"],
            correct: "itinerary",
        },
        {
            question: "Let's take _______ the situation before we make a final decision.",
            options: ["up with", "up on", "stock of", "out of"],
            correct: "stock of",
        },
        {
            question: "Every man in this country who reaches the age of 18 is required _______ in the army for two years.",
            options: ["to serve", "serving", "served", "serve"],
            correct: "to serve",
        },
        {
            question: "I am afraid that if this solution isn't accepted, we'll be back to _______ one.",
            options: ["circle", "rectangle", "triangle", "square"],
            correct: "square",
        },
        {
            question: "The teacher and her students _______ a discussion about job orientation when the light went out.",
            options: ["were having", "are having", "have had", "have"],
            correct: "were having",
        },
        {
            question: "I _______ my breath waiting for my exam’s result and fortunately I passed it.",
            options: ["held", "have", "gave", "save"],
            correct: "held",
        },
        {
            question: "He _______ the job as an administrative assistant if he meets the requirements of the company.",
            options: ["offers", "will be offered", "offered", "is offering"],
            correct: "will be offered",
        },
        {
            question: "Every morning, my mother usually drinks several cups of tea, has a _______ breakfast and then leads the buffalo to the field.",
            options: ["quick", "quickly", "quickness", "quicker"],
            correct: "quick",
        },
        {
            question: "When there is a surplus electricity on the grid, these facilities use that power to pump water from the lower _______ to the higher one.",
            options: ["reservoir", "lake", "puddle", "pond"],
            correct: "reservoir",
        },
        {
          question: "Being self-reliant is what many young people__________.",
          options: ["take care of", "strive for", "cope with", "figure out"],
          correct: "strive for",
        },
        {
            question: "Mark remembered__________many wild animals in Cuc Phuong national park.",
            options: ["to see", "to be seen", "seeing", "being seen"],
            correct: "seeing",
        },
        {
            question: "You’re falling short on class attendance and you failed to submit the last assignment. You’re __________in this semester.",
            options: ["walking on thin ice", "walking on thin eggshells", "walking on thin air", "walking on thin sky"],
            correct: "walking on thin ice",
        },
        {
            question: "When Carol called last night, I ________ my favorite show on television.",
            options: ["watched", "am watching", "was watching", "have watched"],
            correct: "was watching",
        },
        {
            question: "The minister refused to______ the figures to the press.",
            options: ["leak", "release", "show", "add"],
            correct: "release",
        },
        {
            question: "The next meeting ________ in May.",
            options: ["will hold", "will be held", "are discuss", "discuss"],
            correct: "will be held",
        },
        {
            question: "Don't worry! He'll do the job as ________ as possible.",
            options: ["economical", "economically", "uneconomically", "economizing"],
            correct: "economically",
        },
        {
            question: "Dawson, I hear that the new regulation will take ________from October 1st, won’t it?",
            options: ["effect", "force", "power", "use"],
            correct: "effect",
        },
        {
            question: "The acupoints are stimulated _______ the healing capability of the body itself.",
            options: ["enhance", "to enhance", "enhancing", "enhanced"],
            correct: "to enhance",
        },
        {
            question: "After congratulating his team, the coach left, allowing the players to let their______ down for a while.",
            options: ["hearts", "hair", "souls", "heads"],
            correct: "hair",
        },
        {
            question: "When she came home from school yesterday, her mother _______ in the kitchen.",
            options: ["cooked", "was cooking", "is cooking", "cooks"],
            correct: "was cooking",
        },
        {
            question: "At the beach, seagulls _______ a bad reputation for swooping down on unsuspecting people to steal their food.",
            options: ["pay", "take", "have", "get"],
            correct: "have",
        },
        {
            question: "The contract ________ when we reach an agreement on the price.",
            options: ["will have signed", "signs", "is signing", "will be signed"],
            correct: "will be signed",
        },
        {
            question: "For a public campaign to_______, it is important to make use of existing social organizations as well as other relations.",
            options: ["successful", "success", "succeed", "successfully"],
            correct: "succeed",
        },
        {
            question: "The________lay with the organizers, who failed to make the necessary arrangements for dealing with so many people.",
            options: ["mistake", "foul", "fault", "error"],
            correct: "fault",
        },
        {
          question: "The little girl __________ in mud is now receiving a beating.",
          options: ["covered", "covering", "is covered", "is covering"],
          correct: "covered",
        },
      ],    
    },
    // Add more levels as 
    {
        level: 3,
        gridSize: 7,
        initialMaps: [
          [
            [0, 0, 0, 0, 0, 1, 3], // Treasure at top-right corner
            [0, 0, 0, 0, 0, 2, 2],
            [0, 0, 0, 0, 0, 1, 0],
            [2, 1, 1, 1, 1, 0, 2],
            [0, 0, 0, 0, 0, 0, 0], // Character starts bottom-left
            [1, 1, 1, 1, 2, 1, 2],
            [0, 0, 0, 2, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 0, 1, 0], 
            [0, 0, 0, 0, 0, 2, 2],
            [0, 0, 0, 0, 1, 3, 0],
            [2, 1, 1, 1, 1, 2, 2],
            [0, 0, 0, 0, 0, 0, 2], 
            [1, 1, 1, 1, 2, 2, 2],
            [0, 0, 0, 0, 0, 0, 0],
          ],
          [
            [0, 2, 3, 2, 0, 1, 0], 
            [0, 2, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 2, 2],
            [0, 0, 0, 2, 0, 0, 2], 
            [1, 1, 0, 1, 2, 2, 2],
            [0, 0, 0, 0, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 2, 1, 0], 
            [0, 0, 1, 1, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 2, 2, 2],
            [0, 2, 2, 1, 0, 0, 0], 
            [2, 1, 2, 1, 0, 0, 0],
            [0, 1, 3, 2, 0, 0, 0],
          ],
        ],
        initialPlayerPosition: { row: 6, col: 0 },
        questions: [
          {
              question: "The report shows that poor families spend a larger proportion of their _____ on food.",
              options: ["wage", "debt", "tip", "income"],
              correct: "income",
          },
          {
              question: "I was in the hospital for a week after I contracted malaria, but now I'm back home, and I'm on the _____ .",
              options: ["repair", "mend", "recover", "fix"],
              correct: "mend",
          },
          {
              question: "His boss asked him to take _____ of the office for a few days while she was away.",
              options: ["responsibility", "advantage", "duty", "charge"],
              correct: "charge",
          },
          {
              question: "They firmly _____ the view that it was wrong to use violence in educating children.",
              options: ["brought", "held", "made", "drew"],
              correct: "held",
          },
          {
              question: "Sarah is _____ at playing the guitar than her brother.",
              options: ["good", "better", "best", "well"],
              correct: "better",
          },
          {
              question: "On March 23rd, 2021, the Sputnik V vaccine _____ in Vietnam 'for emergency use' to help achieve the total target of 150 million doses.",
              options: ["approved", "was approved", "has been approved", "is approved"],
              correct: "was approved",
          },
          {
              question: "Don’t forget _______ the door before going to bed.",
              options: ["lock", "to lock", "locking", "locks"],
              correct: "to lock",
          },
          {
              question: "Many students in the class were addicted _____ their smartphones.",
              options: ["with", "to", "for", "about"],
              correct: "to",
          },
          {
              question: "_______________, he will tell us about the results of the match.",
              options: ["When he arrives", "After he had arrived", "Before he arrived", "Until he arrived"],
              correct: "When he arrives",
          },
          {
              question: "The book _________ by Stephen King is very popular.",
              options: ["to write", "written", "wrote", "writing"],
              correct: "written",
          },
          {
              question: "Your brother has been shortlisted for the interview, _____ ?",
              options: ["did he", "didn't he", "hasn't he", "has he"],
              correct: "hasn't he",
          },
          {
              question: "Endangered species may be at risk due to factors such as habitat loss, poaching and _____ species.",
              options: ["invasive", "invade", "invasion", "invasively"],
              correct: "invasive",
          },
          {
              question: "Her explanation of the phenomenon was so confusing that I couldn't _____ anything.",
              options: ["take in", "put back", "call for", "go over"],
              correct: "take in",
          },
          {
              question: "He entered the room quietly while she _____ a romantic piece of music on her piano.",
              options: ["was playing", "is playing", "has played", "plays"],
              correct: "was playing",
          },
          {
              question: "______ United States is a country in North America.",
              options: ["The", "A", "An", "No article"],
              correct: "The",
          },
          {
            question: "John is the first person _________ documents from the others in our group.",
            options: ["who stole", "steals", "to steal", "stealing"],
            correct: "to steal",
          },
          {
              question: "Creating something new for ourselves is ________ than duplicating it from someone else.",
              options: ["hard", "hardly", "harder", "more hardly"],
              correct: "harder",
          },
          {
              question: "_______, I will buy for my mother a penthouse in Da Lat.",
              options: ["While I am having money", "Once I had money", "When I had had money", "As soon as I have money"],
              correct: "As soon as I have money",
          },
          {
              question: "They are crazy _______ fictional movies, so they watch 'The Last of Us' every week.",
              options: ["on", "in", "of", "about"],
              correct: "about",
          },
          {
              question: "Betty plagiarized our document because of her arrogance, _______?",
              options: ["doesn’t she", "won’t she", "hadn’t she", "didn’t she"],
              correct: "didn’t she",
          },
          {
              question: "______ moon is the most beautiful object in the sky at night.",
              options: ["a", "an", "the", "Ø (no article)"],
              correct: "the",
          },
          {
              question: "I _______ a phone call because I felt worried about Nhung Glenda’s surgeon.",
              options: ["did", "made", "took", "had"],
              correct: "made",
          },
          {
              question: "My grandfather died because of the war. However, his great spirit was _________ for all generations.",
              options: ["given down", "handed down", "hold down", "went down"],
              correct: "handed down",
          },
          {
              question: "She had better ______ at home, she has been sick for a week.",
              options: ["stay", "to stay", "staying", "stayed"],
              correct: "stay",
          },
          {
              question: "You shouldn’t be too interested in foreign jobs, __________ home is best!",
              options: ["north or south", "east or west", "west or south", "south or east"],
              correct: "east or west",
          },
          {
              question: "He ___________ his guitar when his friend arrived.",
              options: ["played", "plays", "was playing", "has played"],
              correct: "was playing",
          },
          {
              question: "Lying to gain personal benefits can be considered as _________ a crime.",
              options: ["happening", "committing", "attending", "supporting"],
              correct: "committing",
          },
          {
              question: "The report ____ by the research team tomorrow.",
              options: ["will be completed", "will complete", "completed", "is completing"],
              correct: "will be completed",
          },
          {
              question: "He both looks like Korean and Chinese, so everyone still confuses about his ________.",
              options: ["nationality", "national", "nation", "nationally"],
              correct: "nationality",
          },
          {
              question: "The bank will insist you produce a driving ________ or passport as a form of ID.",
              options: ["certificate", "degree", "license", "diploma"],
              correct: "license",
          },
          {
            question: "Halong Bay, __________ with 1,600 limestone islands and islets, is a beautiful natural wonder in northern Vietnam near the Chinese border.",
            options: ["dotted", "dotting", "which dots", "to dot"],
            correct: "dotted",
          },
          {
              question: "I lost the match because I was playing very badly. It was even________ than the last game.",
              options: ["more badly", "badly", "worst", "worse"],
              correct: "worse",
          },
          {
              question: "_________, we will be able to leave for the airport.",
              options: ["Before the taxi arrived", "After the taxi had arrived", "While the taxi was arriving", "As soon as the taxi arrives"],
              correct: "As soon as the taxi arrives",
          },
          {
              question: "I could not _______ the lecture at all. It was too difficult for me.",
              options: ["hold on", "make off", "get along", "take in"],
              correct: "take in",
          },
          {
              question: "Don’t let anyone know our secret, ___________?",
              options: ["can’t you", "can you", "won’t you", "will you"],
              correct: "will you",
          },
          {
              question: "At first she was trained to be ________ scriptwriter, but later she worked as ________ secretary.",
              options: ["the / a", "a / a", "the / the", "a / the"],
              correct: "a / a",
          },
          {
              question: "Many students will not have to pay__________fees if their financial situation is below a certain level.",
              options: ["collaboration", "institution", "tuition", "transcript"],
              correct: "tuition",
          },
          {
              question: "We have been talking__________a good half hour.",
              options: ["to", "for", "about", "at"],
              correct: "for",
          },
          {
              question: "My parents were really disappointed__________out the truth.",
              options: ["finding", "to find", "for finding", "find"],
              correct: "to find",
          },
          {
              question: "When hearing the news, Tom tried his best to keep a _______ on his surprise.",
              options: ["hat", "roof", "hood", "lid"],
              correct: "lid",
          },
          {
              question: "Ngoc _______ in the kitchen when she saw a mouse.",
              options: ["is cooking", "has cooked", "was cooking", "cooks"],
              correct: "was cooking",
          },
          {
              question: "Unfortunately, the company closed down because it couldn't ________ pace with rapidly changing technology.",
              options: ["look", "come", "catch", "keep"],
              correct: "keep",
          },
          {
              question: "Mary________a pink dress by her mum yesterday.",
              options: ["is given", "was given", "will be given", "has been given"],
              correct: "was given",
          },
          {
              question: "You get to apply your newly acquired knowledge in ________.",
              options: ["practically", "practical", "practicing", "practice"],
              correct: "practice",
          },
          {
              question: "We had a dreadful________ in the restaurant, but he phoned me the next day to apologise.",
              options: ["discussion", "presentation", "debate", "argument"],
              correct: "argument",
          }
        ]      
    },
    {
        level: 4,
        gridSize: 8,
        initialMaps: [
          [
            [0, 0, 2, 0, 0, 2, 2, 3], 
            [0, 2, 2, 0, 0, 0, 2, 2],
            [0, 0, 1, 1, 1, 1, 1, 1],
            [0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 2, 2, 1, 2, 2, 0], 
            [2, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 1, 1, 1, 0],
            [0, 0, 2, 0, 0, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 0, 2, 0, 0], 
            [0, 1, 0, 0, 2, 2, 2, 0],
            [0, 1, 0, 2, 2, 3, 2, 0],
            [0, 2, 0, 0, 1, 1, 1, 2],
            [2, 1, 1, 2, 1, 1, 2, 2], 
            [0, 0, 2, 0, 0, 0, 0, 0],
            [2, 2, 1, 0, 0, 0, 0, 0],
            [0, 2, 1, 0, 0, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 2, 2, 2, 3], 
            [1, 1, 2, 1, 2, 1, 1, 2],
            [0, 0, 0, 0, 0, 0, 1, 2],
            [0, 0, 0, 0, 1, 0, 1, 2],
            [0, 0, 0, 0, 1, 0, 1, 0], 
            [2, 2, 1, 0, 1, 0, 2, 0],
            [0, 2, 1, 0, 1, 0, 2, 0],
            [0, 1, 1, 0, 1, 0, 2, 0],
          ],
          [
            [0, 2, 0, 0, 0, 0, 0, 0], 
            [0, 2, 2, 1, 2, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 1, 3, 1, 0, 0],
            [2, 1, 2, 1, 2, 2, 0, 0], 
            [0, 0, 0, 2, 2, 1, 0, 0],
            [2, 2, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
          ],

        ],
        initialPlayerPosition: { row: 7, col: 0 },
        questions: [
          {
              question: "One masterpiece of literature _______ for the first time in 1975 has been nominated the best short story ever.",
              options: ["was published", "published", "which published", "has published"],
              correct: "published",
          },
          {
              question: "Learning a new language is _______ than learning a new skill on the computer.",
              options: ["the most difficult", "most difficult", "more difficult", "the least difficult"],
              correct: "more difficult",
          },
          {
              question: "That rising star won’t appear in the commercial _______.",
              options: ["once the contract will be signed", "when the contract had been signed", "until the contract has been signed", "after the contract was signed"],
              correct: "until the contract has been signed",
          },
          {
              question: "Doctors advise people who are deficient _______ Vitamin C to eat more fruit and vegetables.",
              options: ["in", "of", "from", "for"],
              correct: "in",
          },
          {
              question: "Bob told you something about my story, _______?",
              options: ["didn’t he", "doesn’t he", "did he", "hadn’t he"],
              correct: "didn’t he",
          },
          {
              question: "Half of the children were away from school last week because of an outbreak of _______ influenza.",
              options: ["a", "Ø", "an", "the"],
              correct: "Ø",
          },
          {
              question: "Monica, his mother agrees to _______ David, a robotic boy capable of human emotions.",
              options: ["interfere", "resurrect", "reunite", "activate"],
              correct: "activate",
          },
          {
              question: "They _______ an old cottage in the Scottish Highlands because it was in bad condition.",
              options: ["did up", "filled up", "set up", "turn up"],
              correct: "did up",
          },
          {
              question: "The researchers advise people _______ car windows when in traffic because the car fumes.",
              options: ["to close", "close", "closing", "to closing"],
              correct: "to close",
          },
          {
              question: "The student had to keep his _______ to the grindstone all year and passed the entrance exam into the university he wanted.",
              options: ["nose", "mind", "heart", "face"],
              correct: "nose",
          },
          {
              question: "When he came, his girlfriend _______ in the living room.",
              options: ["has studied", "is studying", "studied", "was studying"],
              correct: "was studying",
          },
          {
              question: "Many A.I. experts believe that A.I. technology will soon _______ even greater advances in many other areas.",
              options: ["say", "make", "take", "do"],
              correct: "make",
          },
          {
              question: "The new shopping mall _______ next month and a grand opening ceremony is being planned.",
              options: ["will be opened", "opens", "opened", "will open"],
              correct: "will be opened",
          },
          {
              question: "Darwin's theory of _______ explains that the strongest species can survive because they have the ability to adapt to the new environment better than others.",
              options: ["evolution", "evolute", "evolutional", "evolutionally"],
              correct: "evolution",
          },
          {
              question: "It was the case of any port in a _______ when the supermodel went to work in my centre after she had been unemployed for 10 months due to corona pandemic.",
              options: ["storm", "typhoon", "tornado", "hurricane"],
              correct: "storm",
          },
          {
            question: "Women no longer have to do hard work nowadays as they used to, _________?",
            options: ["are they", "aren’t they", "do they", "don’t they"],
            correct: "do they",
        },
        {
            question: "We decided ____________ at home this afternoon.",
            options: ["staying", "stayed", "stay", "to stay"],
            correct: "to stay",
        },
        {
            question: "The charity fundraiser, _____ by a local non-profit, raised thousands of dollars for a good cause.",
            options: ["held", "were held", "holding", "were holding"],
            correct: "held",
        },
        {
            question: "The snow ___________ heavily when we woke up this morning.",
            options: ["was falling", "fell", "has fallen", "had been falling"],
            correct: "was falling",
        },
        {
            question: "The message ____ to her before she leaves.",
            options: ["will convey", "conveyed", "will be conveyed", "is conveying"],
            correct: "will be conveyed",
        },
        {
            question: "________, there will be great joy throughout the land.",
            options: ["After the war had been over.", "When the war was over", "As soon as the war is over", "Once the war will be over"],
            correct: "As soon as the war is over",
        },
        {
            question: "John would like to specialize ___________ computer science.",
            options: ["of", "to", "in", "at"],
            correct: "in",
        },
        {
            question: "He was the last man _________ the ship.",
            options: ["who leave", "to leave", "leaving", "left"],
            correct: "to leave",
        },
        {
            question: "We haven’t reached the final _______ on the funding for scientific research yet.",
            options: ["decides", "decision", "deciding", "decisive"],
            correct: "decision",
        },
        {
            question: "Please help me with this math problem. I can’t___________the answer.",
            options: ["end up", "face up to", "come up with", "run into"],
            correct: "come up with",
        },
        {
            question: "If we lose the case we may be _______________ for the costs of the whole trial.",
            options: ["compatible", "liable", "available", "accessible"],
            correct: "liable",
        },
        {
            question: "The committee is _______ of well-known mountaineers.",
            options: ["contained", "comprised", "included", "consisted"],
            correct: "comprised",
        },
        {
            question: "This ticket ____ you to a free meal in our new restaurant.",
            options: ["allows", "grants", "entitles", "credits"],
            correct: "entitles",
        },
        {
            question: "We were all in___________of the fact that the new manager was our old friend Duncan.",
            options: ["surprise", "shock", "awe", "amazement"],
            correct: "awe",
        },
        {
            question: "It is estimated that about 640 women remain illiterate in the world, mostly in ________ developing countries.",
            options: ["the", "no article", "a", "an"],
            correct: "no article",
        },
        {
          question: "Taj Mahal is the second World Heritage site__________under the campaign which will be carried out by ONGC at this monument.",
          options: ["covered", "covering", "to cover", "to be covered"],
          correct: "to be covered",
        },
        {
            question: "Universities in Vietnam have become ____________ to foreign students than ever before.",
            options: ["the most attractive", "most attractive", "more attractive", "attractive"],
            correct: "more attractive",
        },
        {
            question: "I will call and tell you something interesting _______.",
            options: ["when I come home after work", "after I had come home after work", "before I came home after work", "while I was coming home after work"],
            correct: "when I come home after work",
        },
        {
            question: "Such approaches should be supported and mainstreamed in health interventions in order to________ positive behavior change.",
            options: ["put off", "set off", "bring about", "hold up"],
            correct: "bring about",
        },
        {
            question: "Her parents rarely let her stay out late, _______?",
            options: ["do they", "don’t they", "does she", "doesn’t she"],
            correct: "do they",
        },
        {
            question: "It is _______ funniest book that I have ever read.",
            options: ["a", "an", "the", "Ø (no article)"],
            correct: "the",
        },
        {
            question: "The discovery was a major ________ for research workers.",
            options: ["breakthrough", "breakdown", "break-in", "breakout"],
            correct: "breakthrough",
        },
        {
            question: "I think there's a picture of the hotel ________ the first page.",
            options: ["on", "at", "in", "to"],
            correct: "on",
        },
        {
            question: "To save energy, we should remember ________ off the lights before going out.",
            options: ["being turned", "turning", "to turn", "turn"],
            correct: "to turn",
        },
        {
            question: "I tried to talk to her, but she was __________",
            options: ["as high as a kite", "as high as a house", "as high as a sky", "as high as a wall"],
            correct: "as high as a kite",
        },
        {
            question: "I _______ along the street when I suddenly heard footsteps behind me.",
            options: ["was walking", "walk", "am walking", "walked"],
            correct: "was walking",
        },
        {
            question: "The young girl ______ down completely on hearing of her father’s death.",
            options: ["broke", "fell", "turned", "went"],
            correct: "broke",
        },
        {
            question: "This old wooden chest _______ by my grandfather over 40 years ago.",
            options: ["built", "had built", "was built", "was building"],
            correct: "was built",
        },
        {
            question: "Delegates will meet with ______ from industry and the government.",
            options: ["represented", "representative", "representatives", "representers"],
            correct: "representatives",
        },
        {
            question: "We usually do go by train, even though the car……………….is a lot quicker.",
            options: ["travel", "journey", "trip", "voyage"],
            correct: "journey",
        },
        {
          question: "We can also see the stone dragons of Kinh Thien Palace and relics associated with many Vietnamese royal families, ____ during archaeological excavations.",
          options: ["discovered", "being discovered", "to discover", "discovering"],
          correct: "discovered",
        },
        {
            question: "Going by air is sometimes __________ than going by train.",
            options: ["dangerous", "most dangerous", "the most dangerous", "more dangerous"],
            correct: "more dangerous",
        },
        {
            question: "I will send you some postcards, ______.",
            options: ["until I will arrive at the destination", "as soon as I arrive at the destination", "when I arrived at the destination", "after I had arrived at the destination"],
            correct: "as soon as I arrive at the destination",
        },
        {
            question: "The iPhone 14 Pro Max is very popular _______ young adults because of its notable features.",
            options: ["with", "on", "for", "about"],
            correct: "with",
        },
        {
            question: "The flowers in our school garden are very beautiful, _______?",
            options: ["aren't we", "is it", "isn't he", "aren’t they"],
            correct: "aren’t they",
        },
        {
            question: "The concert is expected to attract a lot of audience, so you should book _______ tickets in advance.",
            options: ["a", "an", "the", "x"],
            correct: "the",
        },
        {
            question: "Oprah Winfrey has been an important role model for black American women, breaking down many invisible _______.",
            options: ["barriers", "trends", "gaps", "races"],
            correct: "barriers",
        },
        {
            question: "I am thinking of changing my current job because I can’t _______ my low salary.",
            options: ["live on", "pay out", "save up", "set out"],
            correct: "live on",
        },
        {
            question: "The acupoints are stimulated _______ the healing capability of the body itself.",
            options: ["enhance", "to enhance", "enhancing", "enhanced"],
            correct: "to enhance",
        },
        {
            question: "After congratulating his team, the coach left, allowing the players to let their______ down for a while.",
            options: ["hearts", "hair", "souls", "heads"],
            correct: "hair",
        },
        {
            question: "When she came home from school yesterday, her mother _______ in the kitchen.",
            options: ["cooked", "was cooking", "is cooking", "cooks"],
            correct: "was cooking",
        },
        {
            question: "At the beach, seagulls _______ a bad reputation for swooping down on unsuspecting people to steal their food.",
            options: ["pay", "take", "have", "get"],
            correct: "have",
        },
        {
            question: "The contract ________ when we reach an agreement on the price.",
            options: ["will have signed", "signs", "is signing", "will be signed"],
            correct: "will be signed",
        },
        {
            question: "For a public campaign to_______, it is important to make use of existing social organizations as well as other relations.",
            options: ["successful", "success", "succeed", "successfully"],
            correct: "succeed",
        },
        {
            question: "The________lay with the organizers, who failed to make the necessary arrangements for dealing with so many people.",
            options: ["mistake", "foul", "fault", "error"],
            correct: "fault",
        },
        {
          question: "The little girl __________ in mud is now receiving a beating.",
          options: ["covered", "covering", "is covered", "is covering"],
          correct: "covered",
        },
        {
            question: "Our new products are __________ in the USA than in Europe.",
            options: ["more popular", "most popular", "popular", "the most popular"],
            correct: "more popular",
        },
        {
            question: "_______________, I will discuss them with you.",
            options: ["As soon as I finish all required readings in our class.", "When I will finish all required readings in our class.", "After I had finished all required readings in our class.", "By the time I finished all required readings in our class."],
            correct: "As soon as I finish all required readings in our class.",
        },
        {
            question: "Nam Dong Market is famous ________ delicious che (sweet soup), such as Thai sweet soup, grapefruit sweet soup, taro sweet soup, etc.",
            options: ["by", "at", "on", "for"],
            correct: "for",
        },
        {
            question: "Your brother is reading books in the library, ________?",
            options: ["doesn’t he", "is he", "isn’t he", "isn’t she"],
            correct: "isn’t he",
        },
        {
            question: "Our teacher often gives us videos to watch at _______ home.",
            options: ["the", "Ø", "a", "an"],
            correct: "Ø",
        },
        {
            question: "Cosmetic or plastic surgery often __________ images of famous personalities wanting to alter their appearances through elective surgical procedures.",
            options: ["prohibits", "evokes", "exterminates", "publicizes"],
            correct: "evokes",
        },
        {
            question: "We must continually learn and acquire new knowledge if we are to adapt and ___________ changing events.",
            options: ["lose contact with", "catch sight of", "do away with", "keep up with"],
            correct: "keep up with",
        },
        {
            question: "Before Tom decides __________ a gap year, he must make sure that the university will hold his place for him till the following year.",
            options: ["taking", "take", "to take", "taken"],
            correct: "to take",
        },
        {
            question: "We were ready to pack our bags and go on vacation _____________",
            options: ["at the drop of a hat", "few and far between", "in vain", "when pigs fly"],
            correct: "at the drop of a hat",
        },
        {
            question: "The bus driver __________ into town when the brakes broke down.",
            options: ["drove", "was driving", "drives", "will drive"],
            correct: "was driving",
        },
        {
            question: "She has had three heart attacks, so now she has to ___________ an operation.",
            options: ["make", "have", "try", "come"],
            correct: "have",
        },
        {
            question: "The 33rd SEA Games __________ in Thailand from December 9th to 20th, 2025.",
            options: ["hold", "will be held", "takes place", "be held"],
            correct: "will be held",
        },
        {
            question: "For sedentary workers, a __________ lifestyle helps them limit obesity and prevent diseases (cancer, disc herniation, etc.)",
            options: ["health", "healthily", "healthiness", "healthy"],
            correct: "healthy",
        },
        {
            question: "Fog smothered districts 1, 4 and 7, where many drivers complained of poor ________ until noon.",
            options: ["tension", "view", "visibility", "vision"],
            correct: "visibility",
        }
      ]
      
    },
  ];
  