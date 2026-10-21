// songs.js — all text for the site lives here.
//
// Each couplet is one unit: the original, optional Urdu / Roman transliteration,
// an optional literal gloss, and the translation. Lines are arrays, one string
// per line. `null` means "not written yet" (see the TODO comments).
// `strong`: indexes of translation lines shown in bold (song 2's refrain).
// `words`: glossary terms that appear in this couplet (exact text in `deva`).
// `versions`: { singer, year, url, note, sung } per rendition. `url` links out to
//   the recording; `sung` lists couplet ids in the order that rendition sings
//   them (repeat an id for a reprise). The Versions block shows once a song has one.

window.SONGS = [
  {
    id: "ranjish-hi-sahi",
    number: 1,
    // TODO: settle one Roman spelling (see docs/AUDIT.md, section 2)
    title: { roman: "Ranjish hi sahi", deva: "रंजिश ही सही", urdu: null /* TODO */ },
    poet: "Ahmed Faraz",
    form: "ghazal",
    blurb: "\"Ranjish Hi Sahi\" is a deeply emotional Urdu ghazal written by Ahmed Faraz and made famous by Mehdi Hassan. The song captures the anguish of unrequited love and longing, where the singer pleads for their beloved to return—even if only to hurt them again. It reflects themes of pain, estrangement, and the paradox of love, where even suffering in love is preferable to complete abandonment.",
    couplets: [
      {
        id: "c1",
        deva: [
          "रंजिश ही सही दिल ही दुखाने के लिए आ",
          "आ फिर से मुझे छोड़ के जाने के लिए आ"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Let it be anguish, even to torment my heart, come,",
          "Come once again, even if only to abandon me."
        ],
        words: []
      },
      {
        id: "c2",
        deva: [
          "कुछ तो मिरे पिंदार-ए-मोहब्बत का भरम रख",
          "तू भी तो कभी मुझ को मनाने के लिए आ"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Respect, if only a little, the pride of my love for you,",
          "Come, someday, to console me as well."
        ],
        words: []
      },
      {
        id: "c3",
        deva: [
          "पहले से मरासिम न सही फिर भी कभी तो",
          "रस्म-ओ-रह-ए-दुनिया ही निभाने के लिए आ"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "If not for past affections, then at least for the sake of propriety,",
          "Come, if only to honor the customs of this world."
        ],
        words: []
      },
      {
        id: "c4",
        deva: [
          "किस किस को बताएँगे जुदाई का सबब हम",
          "तू मुझ से ख़फ़ा है तो ज़माने के लिए आ"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "How many people will I explain my sorrow to?",
          "If you are mad at me, then come, if only for the world’s sake."
        ],
        words: []
      },
      {
        id: "c5",
        deva: [
          "इक उम्र से हूँ लज़्ज़त-ए-गिर्या से भी महरूम",
          "ऐ राहत-ए-जाँ मुझ को रुलाने के लिए आ"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "For ages, I have been deprived of the solace of tears,",
          "O peace of my soul, come back—if only to make me weep."
        ],
        words: []
      },
      {
        id: "c6",
        deva: [
          "अब तक दिल-ए-ख़ुश-फ़ह्‌म को तुझ से हैं उमीदें",
          "ये आख़िरी शम'एँ भी बुझाने के लिए आ"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Till now, my naive heart still holds some hope in you,",
          "Come, and snuff out even these last flickering candles of expectation."
        ],
        words: []
      },
      {
        id: "c7",
        // TODO: original text — translation exists, original not yet on the page
        deva: null,
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Agreed, concealing love is the true essence of love,",
          "But one day, come secretly—to confess it in silence."
        ],
        words: []
      },
      {
        id: "c8",
        // TODO: original text — translation exists, original not yet on the page
        deva: null,
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Just as you have excuses for never arriving,",
          "Someday, make an excuse to never leave."
        ],
        words: []
      }
    ],
    glossary: {},
    versions: []
  },
  {
    id: "aaj-jaane-ki-zidd-na-karo",
    number: 2,
    // TODO: settle one Roman spelling (see docs/AUDIT.md, section 2)
    title: { roman: "Aaj Jaane Ki Zidd Na Karo", deva: "आज जाने की ज़िद ना करो", urdu: null /* TODO */ },
    poet: "Fayyaz Hashmi",
    form: "geet",
    blurb: "\"Aaj Jaane Ki Zid Na Karo\" is a timeless geet written by Pakistani poet Fayyaz Hashmi and composed by Sohail Rana. Originally popularized by classical vocalist Habib Wali Mohammad in the 1973 Pakistani film 'Badal Aur Bijli', the song later gained legendary status through ghazal singer Farida Khanum’s rendition in 1993. Sung in 'Raag Yaman Kalyan', this deeply romantic and melancholic piece expresses a lover's desperate plea for their beloved to stay a little longer, cherishing fleeting moments of togetherness. The song’s evocative lyrics and soul-stirring melody have made it an enduring classic, with many celebrated artists reinterpreting it over the years.",
    couplets: [
      {
        id: "c1",
        deva: [
          "आज जाने की ज़िद ना करो",
          "आज जाने की ज़िद ना करो",
          "यूँ ही पहलु में बैठे रहो",
          "आज जाने की ज़िद न करो"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Don't insist on leaving today",
          "Just stay a little longer",
          "Sit close beside me"
        ],
        strong: [0],
        words: []
      },
      {
        id: "c2",
        deva: [
          "हाय मर जाएंगे",
          "हम तो लुट जाएंगे",
          "ऐसी बातें किया ना करो",
          "आज जाने की ज़िद ना करो"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Oh, I swear I’ll perish",
          "I’ll be utterly lost",
          "Please don’t say such things",
          "Don't insist on leaving today"
        ],
        words: []
      },
      {
        id: "c3",
        deva: [
          "तुम ही सोचो ज़रा",
          "क्यूँ ना रोकें तुम्हें",
          "जान जाती है जब",
          "उठ के जाते हो तुम"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Think for a moment, my love",
          "How could I let you go?",
          "It feels like my life fades away",
          "Every time you rise to leave"
        ],
        words: []
      },
      {
        id: "c4",
        deva: [
          "तुमको अपनी क़सम जानेजां",
          "बात इतनी मेरी मान लो",
          "आज जाने की ज़िद ना करो"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "For my sake, my love",
          "Grant me just this one wish",
          "Don’t insist on leaving today"
        ],
        words: []
      },
      {
        id: "c5",
        deva: [
          "वक़्त की कैद में ज़िन्दगी है मगर",
          "चंद घड़ियां यही हैं जो आज़ाद हैं",
          "इनको खो कर कहीं जानेजाँ",
          "उम्र भर ना तरसते रहो"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Life is trapped within time’s grasp",
          "But these few moments are ours",
          "Lose them now, my love",
          "And you’ll long for them forever"
        ],
        words: []
      },
      {
        id: "c6",
        deva: [
          "कितना मासूम रंगीन है ये समां",
          "हुस्न और इश्क़ की आज बैराज है",
          "कल की किसको ख़बर जानेजाँ",
          "रोक लो आज की रात को"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "The night is innocent and beautiful",
          "A rare meeting of love and desire",
          "Who knows what tomorrow brings?",
          "Hold onto this night, my love"
        ],
        words: []
      },
      {
        id: "c7",
        deva: [
          "आज जाने की ज़िद ना करो",
          "आज जाने की ज़िद ना करो"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Don't insist on leaving today"
        ],
        strong: [0],
        words: []
      }
    ],
    glossary: {},
    versions: []
  },
  {
    id: "baat-karni-mujhe-mushkil",
    number: 3,
    // TODO: settle one Roman spelling (see docs/AUDIT.md, section 2)
    title: { roman: "Baat Karni Mujhe Mushkil", deva: "बात करनी मुझे मुश्किल", urdu: null /* TODO */ },
    poet: "Bahadur Shah Zafar",
    form: "ghazal",
    blurb: "This ghazal by Bahadur Shah Zafar is a poignant expression of longing, loss, and the passage of time. The poet reflects on how life, love, and companionship have changed, lamenting that conversations and gatherings, once effortless and joyous, have now become difficult and burdened with sorrow. The verses explore themes of restlessness, heartbreak, and the transformative power of love and separation. Through evocative imagery—of eyes casting spells, reflections illuminating, and chains echoing in solitude—Zafar captures a deep sense of nostalgia and despair. The ghazal resonates not just as a personal lament but as a reflection of the decline of the Mughal era, mirroring the poet's own struggles and the fading grandeur of his time.",
    couplets: [
      {
        id: "c1",
        deva: [
          "बात करनी मुझे मुश्किल कभी ऐसी तो न थी",
          "जैसी अब है तिरी महफ़िल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "It was never this difficult for me to speak,",
          "Nor was your company ever quite like this before."
        ],
        words: []
      },
      {
        id: "c2",
        deva: [
          "ले गया छीन के कौन आज तिरा सब्र ओ क़रार",
          "बे-क़रारी तुझे ऐ दिल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Who has stolen away your peace today, O my heart?",
          "You were never this restless before."
        ],
        words: []
      },
      {
        id: "c3",
        deva: [
          "उस की आँखों ने ख़ुदा जाने किया क्या जादू",
          "कि तबीअ'त मिरी माइल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "God knows what sorcery their eyes have cast,",
          "That my heart bends toward them like never before."
        ],
        words: []
      },
      {
        id: "c4",
        deva: [
          "अक्स-ए-रुख़्सार ने किस के है तुझे चमकाया",
          "ताब तुझ में मह-ए-कामिल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "O moon, what secret light has my beloved’s reflection gifted you,",
          "That your radiance shines fuller than ever before?"
        ],
        words: []
      },
      {
        id: "c5",
        deva: [
          "अब की जो राह-ए-मोहब्बत में उठाई तकलीफ़",
          "सख़्त होती हमें मंज़िल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        // TODO: translation
        translation: null,
        words: []
      },
      {
        id: "c6",
        deva: [
          "पा-ए-कूबाँ कोई ज़िंदाँ में नया है मजनूँ",
          "आती आवाज़-ए-सलासिल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        // TODO: translation
        translation: null,
        words: []
      },
      {
        id: "c7",
        deva: [
          "निगह-ए-यार को अब क्यूँ है तग़ाफ़ुल ऐ दिल",
          "वो तिरे हाल से ग़ाफ़िल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        // TODO: translation
        translation: null,
        words: []
      },
      {
        id: "c8",
        deva: [
          "चश्म-ए-क़ातिल मिरी दुश्मन थी हमेशा लेकिन",
          "जैसी अब हो गई क़ातिल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Your deadly eyes have always been my foe,",
          "But never before have they been this lethal."
        ],
        words: []
      },
      {
        id: "c9",
        deva: [
          "क्या सबब तू जो बिगड़ता है 'ज़फ़र' से हर बार",
          "ख़ू तिरी हूर-शमाइल कभी ऐसी तो न थी"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Why do you turn against me, Zafar, time and again?",
          "This was never your nature, O my angelic beloved."
        ],
        words: []
      }
    ],
    glossary: {},
    versions: []
  },
  {
    id: "mohobbat-karne-wale",
    number: 4,
    // TODO: settle one Roman spelling (see docs/AUDIT.md, section 2)
    title: { roman: "Mohobbat Karne Wale", deva: "मोहब्बत करने वाले कम न होंगे", urdu: null /* TODO */ },
    poet: "Hafeez Jalandhari",
    form: "ghazal",
    blurb: "This ghazal by Hafeez Jalandhari explores themes of unfulfilled love, longing, and separation. The poet reflects on the idea that while there may be many admirers of the beloved, he himself will not be among them. He contrasts the weight of personal sorrow against the world's collective grief, suggesting that the pain of loving and losing the beloved surpasses all other troubles. Despite the possibility of reunion, the scars of separation remain, making love a bittersweet experience. The poem beautifully captures the essence of heartbreak, quiet acceptance, and the melancholic fate of the unrequited lover.",
    couplets: [
      {
        id: "c1",
        deva: [
          "मोहब्बत करने वाले कम न होंगे",
          "तिरी महफ़िल में लेकिन हम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "There will be no shortage of those who love you,",
          "But in your gathering, I will not be present."
        ],
        words: []
      },
      {
        id: "c2",
        deva: [
          "मैं अक्सर सोचता हूँ फूल कब तक",
          "शरीक-ए-गिर्या-ए-शबनम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "I often wonder, how long will flowers",
          "Continue to share the tears of the dewdrop?"
        ],
        words: []
      },
      {
        id: "c3",
        deva: [
          "ज़रा देर-आश्ना चश्म-ए-करम है",
          "सितम ही इश्क़ में पैहम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Your merciful gaze is fleeting,",
          "Yet love is not always filled with suffering."
        ],
        words: []
      },
      {
        id: "c4",
        deva: [
          "दिलों की उलझनें बढ़ती रहेंगी",
          "अगर कुछ मशवरे बाहम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "The confusions of hearts will only grow,",
          "If lovers do not share their counsel."
        ],
        words: []
      },
      {
        id: "c5",
        deva: [
          "ज़माने भर के ग़म या इक तिरा ग़म",
          "ये ग़म होगा तो कितने ग़म न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "The grief of the entire world or just your sorrow—",
          "If your pain exists, what other pains could remain?"
        ],
        words: []
      },
      {
        id: "c6",
        deva: [
          "कहूँ बेदर्द क्यूँ अहल-ए-जहाँ को",
          "वो मेरे हाल से महरम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Why should I call the people of the world heartless?",
          "They are simply unaware of my condition."
        ],
        words: []
      },
      {
        id: "c7",
        deva: [
          "हमारे दिल में सैल-ए-गिर्या होगा",
          "अगर बा-दीदा-ए-पुर-नम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "My heart will be flooded with tears,",
          "If my eyes do not carry their usual sorrow."
        ],
        words: []
      },
      {
        id: "c8",
        deva: [
          "अगर तू इत्तिफ़ाक़न मिल भी जाए",
          "तिरी फ़ुर्क़त के सदमे कम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Even if by some chance I meet you,",
          "The pain of separation will never diminish."
        ],
        words: []
      },
      {
        id: "c9",
        deva: [
          "'हफ़ीज़' उन से मैं जितना बद-गुमाँ हूँ",
          "वो मुझ से उस क़दर बरहम न होंगे"
        ],
        urdu: null,
        roman: null,
        gloss: null, // TODO: literal gloss
        translation: [
          "Hafiz, no matter how much I distrust them,",
          "They will never be as displeased with me as I am with them."
        ],
        words: []
      }
    ],
    glossary: {},
    versions: []
  }
];
