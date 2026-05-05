const symptomAliases = [
  ['bukhar', 'fever'],
  ['khansi', 'cough'],
  ['ulti', 'vomiting'],
  ['pet dard', 'stomach pain'],
  ['gas problem', 'acidity'],
  ['saans lene mein takleef', 'shortness of breath'],
  ['saans ki dikkat', 'breathing difficulty'],
  ['sardi', 'cold'],
  ['jukaam', 'cold'],
  ['sir dard', 'headache'],
  ['sar dard', 'headache'],
  ['gale mein dard', 'sore throat'],
  ['loose motions', 'diarrhea'],
  ['loose motion', 'diarrhea'],
  ['motion problem', 'constipation'],
  ['chest pain', 'chest pain'],
  ['high bp', 'blood pressure'],
  ['sugar high', 'diabetes'],
]

const stopWords = new Set(['i', 'am', 'have', 'has', 'with', 'and', 'for', 'since', 'from', 'very', 'just', 'feel', 'feeling', 'not', 'well'])

const levenshteinDistance = (left = '', right = '') => {
  if (left === right) return 0
  if (!left.length) return right.length
  if (!right.length) return left.length

  const matrix = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0))
  for (let row = 0; row <= left.length; row += 1) matrix[row][0] = row
  for (let col = 0; col <= right.length; col += 1) matrix[0][col] = col

  for (let row = 1; row <= left.length; row += 1) {
    for (let col = 1; col <= right.length; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      )
    }
  }

  return matrix[left.length][right.length]
}

const normalizeSymptoms = (input = '') => {
  const typoMap = [
    ['feaver', 'fever'],
    ['feverr', 'fever'],
    ['dizzines', 'dizziness'],
    ['dizzyness', 'dizziness'],
    ['headak', 'headache'],
    ['hedache', 'headache'],
    ['stomch', 'stomach'],
    ['stomache', 'stomach'],
    ['vomitting', 'vomiting'],
    ['diarhea', 'diarrhea'],
    ['diarhoea', 'diarrhea'],
    ['brething', 'breathing'],
    ['breating', 'breathing'],
    ['anxeity', 'anxiety'],
    ['insomia', 'insomnia'],
    ['urination pain', 'painful urination'],
  ]

  let text = input.toLowerCase()
  text = text.replace(/[^\w\s,+-]/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()

  for (const [rawPhrase, normalizedPhrase] of symptomAliases) {
    const regex = new RegExp(`\\b${rawPhrase}\\b`, 'g')
    text = text.replace(regex, normalizedPhrase)
  }

  for (const [wrong, corrected] of typoMap) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'g')
    text = text.replace(regex, corrected)
  }

  const knownWords = getKnownSymptomWords()
  const normalizedTokens = text.split(' ').map((token) => {
    if (!token || token.length < 4) return token
    if (knownWords.has(token) || stopWords.has(token)) return token

    let bestWord = token
    let bestDistance = Number.POSITIVE_INFINITY

    for (const knownWord of knownWords) {
      if (Math.abs(knownWord.length - token.length) > 2) continue
      const distance = levenshteinDistance(token, knownWord)
      if (distance < bestDistance) {
        bestDistance = distance
        bestWord = knownWord
      }
    }

    return bestDistance <= 1 ? bestWord : token
  })

  text = normalizedTokens.join(' ').replace(/\s+/g, ' ').trim()
  return text
}

const isLowQualitySymptoms = (text) => {
  if (!text) return true
  if (text.length < 5) return true

  const words = text.split(' ').filter(Boolean)
  const knownSymptomWords = new Set(
    fallbackRules.flatMap((rule) => rule.keywords).map((keyword) => keyword.trim().toLowerCase())
  )
  const hasKnownSingleWordSymptom =
    words.length === 1 && knownSymptomWords.has(words[0].toLowerCase())

  if (words.length < 2 && !hasKnownSingleWordSymptom) return true

  const alphaOnly = text.replace(/[^a-z]/g, '')
  if (alphaOnly.length < 4) return true

  const vowelCount = (alphaOnly.match(/[aeiou]/g) || []).length
  const vowelRatio = alphaOnly.length ? vowelCount / alphaOnly.length : 0

  // Very low-vowel strings are often keyboard mash/gibberish.
  if (vowelRatio < 0.12) return true

  return false
}

const fallbackRules = [
  {
    specialist: 'General Physician',
    possibleCondition: 'Your symptoms may be related to a common infection, viral illness, or general inflammation.',
    healthTips: ['Rest and drink plenty of fluids', 'Track temperature and any new symptoms', 'Seek urgent care if fever is very high, persistent, or comes with breathing trouble'],
    keywords: ['fever', 'temperature', 'high temperature', 'chills', 'body pain', 'body ache', 'weakness', 'tired', 'tiredness', 'fatigue', 'viral', 'infection', 'malaise'],
  },
  {
    specialist: 'Cardiologist',
    possibleCondition: 'Your symptoms may be related to the heart or circulation system.',
    healthTips: ['Avoid heavy exertion for now', 'Track pain, dizziness, or palpitations', 'Seek urgent care if symptoms become severe'],
    keywords: ['heart', 'chest', 'palpitation', 'palpitations', 'chest tightness', 'chest pressure', 'bp', 'blood pressure', 'pressure', 'fainting'],
  },
  {
    specialist: 'Pulmonologist',
    possibleCondition: 'Your symptoms may involve the lungs or airways and should be reviewed soon.',
    healthTips: ['Avoid smoke, dust, and strong irritants', 'Rest and monitor breathing changes', 'Seek urgent care if breathing becomes difficult'],
    keywords: ['asthma', 'wheezing', 'shortness of breath', 'breathing difficulty', 'breathless', 'lung', 'cough', 'coughing', 'persistent cough', 'phlegm', 'mucus', 'congestion'],
  },
  {
    specialist: 'Dermatologist',
    possibleCondition: 'Your symptoms may be related to a skin irritation, allergy, or infection.',
    healthTips: ['Avoid scratching the affected area', 'Use gentle skin care products', 'Note any new food, soap, or medicine exposure'],
    keywords: ['skin', 'rash', 'itch', 'itching', 'allergy', 'acne', 'eczema', 'hives', 'red spots', 'pimple', 'dry skin'],
  },
  {
    specialist: 'Neurologist',
    possibleCondition: 'Your symptoms may involve the nervous system and should be checked by a specialist.',
    healthTips: ['Rest in a quiet environment', 'Stay hydrated', 'Seek urgent care if weakness, confusion, or severe symptoms appear'],
    keywords: ['headache', 'migraine', 'seizure', 'numb', 'numbness', 'brain', 'dizzy', 'dizziness', 'vertigo', 'tingling', 'faint', 'confusion'],
  },
  {
    specialist: 'Ophthalmologist',
    possibleCondition: 'Your symptoms may involve the eyes or vision and should be assessed by an eye specialist.',
    healthTips: ['Avoid rubbing the eyes', 'Rest your eyes from screens when possible', 'Seek urgent care for sudden vision loss or severe eye pain'],
    keywords: ['eye', 'eyes', 'vision', 'blurred', 'blurry', 'red eye', 'eye pain', 'watery eye', 'itchy eye', 'double vision', 'sensitivity to light'],
  },
  {
    specialist: 'Orthopedic',
    possibleCondition: 'Your symptoms may be related to bones, joints, muscles, or posture.',
    healthTips: ['Limit movements that worsen pain', 'Use light support if needed', 'Apply ice or rest until reviewed'],
    keywords: ['bone', 'joint', 'knee', 'back', 'back pain', 'neck', 'shoulder', 'fracture', 'sprain', 'muscle pain', 'leg pain', 'arm pain', 'swelling'],
  },
  {
    specialist: 'Pediatrician',
    possibleCondition: 'These symptoms appear to be related to a child or infant health concern.',
    healthTips: ['Monitor temperature and hydration', 'Watch eating and sleeping patterns', 'Seek urgent care if the child becomes unusually weak'],
    keywords: ['child', 'kid', 'baby', 'infant', 'newborn'],
  },
  {
    specialist: 'ENT Specialist',
    possibleCondition: 'Your symptoms may involve the ear, nose, throat, or nearby infection.',
    healthTips: ['Drink warm fluids if comfortable', 'Avoid smoke or irritants', 'Monitor fever, swelling, or trouble swallowing'],
    keywords: ['ear', 'ear pain', 'nose', 'runny nose', 'blocked nose', 'throat', 'sore throat', 'sinus', 'tonsil', 'cold', 'sneezing', 'hoarseness'],
  },
  {
    specialist: 'Gastroenterologist',
    possibleCondition: 'Your symptoms may be related to digestion, the stomach, or the intestines.',
    healthTips: ['Drink fluids in small amounts and avoid dehydration', 'Choose light meals until symptoms settle', 'Seek urgent care if you have severe pain, blood, or repeated vomiting'],
    keywords: ['stomach', 'stomach pain', 'abdomen', 'abdominal', 'vomit', 'vomiting', 'nausea', 'diarrhea', 'loose motion', 'constipation', 'acidity', 'gas', 'indigestion', 'bloating', 'heartburn', 'food poisoning'],
  },
  {
    specialist: 'Gynecologist',
    possibleCondition: 'Your symptoms may be related to menstrual, hormonal, pelvic, or pregnancy-related health concerns.',
    healthTips: ['Track bleeding, discharge, or pain timing', 'Rest and stay hydrated', 'Seek urgent care for severe bleeding, fainting, or intense pelvic pain'],
    keywords: ['period', 'menstrual', 'pregnancy', 'pregnant', 'pelvic', 'pcos', 'ovary', 'uterus', 'vaginal', 'missed period', 'period pain', 'white discharge', 'breast pain'],
  },
  {
    specialist: 'Psychiatrist',
    possibleCondition: 'Your symptoms may reflect mental health strain, anxiety, mood changes, or sleep-related stress.',
    healthTips: ['Try to rest in a calm environment', 'Reduce stimulants if they worsen symptoms', 'Seek urgent support immediately for self-harm thoughts or severe panic'],
    keywords: ['anxiety', 'panic', 'stress', 'depression', 'sad', 'insomnia', 'sleep', 'mental health', 'overthinking', 'low mood', 'panic attack', 'can not sleep', 'cant sleep'],
  },
  {
    specialist: 'Dentist',
    possibleCondition: 'Your symptoms may be related to the teeth, gums, jaw, or oral infection.',
    healthTips: ['Avoid very hot, cold, or sugary foods', 'Keep the area clean gently', 'Seek urgent dental care if swelling or severe pain worsens'],
    keywords: ['tooth', 'teeth', 'gum', 'gums', 'mouth', 'jaw', 'dental', 'cavity', 'toothache', 'mouth ulcer', 'oral pain'],
  },
  {
    specialist: 'Endocrinologist',
    possibleCondition: 'Your symptoms may be related to hormones, thyroid issues, or blood sugar imbalance.',
    healthTips: ['Track fatigue, weight changes, thirst, or appetite changes', 'Stay hydrated and eat regularly', 'Seek prompt medical review if symptoms are rapidly worsening'],
    keywords: ['thyroid', 'diabetes', 'sugar', 'glucose', 'hormone', 'weight gain', 'weight loss', 'fatigue', 'excess thirst', 'frequent hunger', 'frequent urination'],
  },
  {
    specialist: 'Urologist',
    possibleCondition: 'Your symptoms may involve the urinary tract or kidneys and should be evaluated.',
    healthTips: ['Drink water unless a doctor has told you to restrict fluids', 'Track pain, frequency, or burning while urinating', 'Seek urgent care for fever, severe back pain, or blood in urine'],
    keywords: ['urine', 'urinary', 'burning urination', 'painful urination', 'pee', 'kidney', 'bladder', 'blood in urine', 'urine infection', 'uti', 'frequent urination'],
  },
]

const emergencyRules = [
  {
    signs: ['chest pain', 'shortness of breath', 'breathing difficulty'],
    alert: 'Chest pain with breathing difficulty can be serious. Seek emergency care immediately.',
  },
  {
    signs: ['one side weakness', 'slurred speech', 'face drooping', 'confusion'],
    alert: 'Possible stroke warning signs detected. Go to emergency care immediately.',
  },
  {
    signs: ['suicidal', 'self harm', 'kill myself'],
    alert: 'Immediate mental health emergency support is recommended. Contact emergency services right now.',
  },
  {
    signs: ['blood in stool', 'vomiting blood', 'severe bleeding'],
    alert: 'Severe bleeding signs detected. Seek urgent emergency care immediately.',
  },
]

function getKnownSymptomWords() {
  const words = new Set()
  for (const rule of fallbackRules) {
    for (const keyword of rule.keywords) {
      for (const token of keyword.toLowerCase().split(' ')) {
        if (token.length > 2) words.add(token)
      }
    }
  }
  for (const [fromWord, toWord] of symptomAliases) {
    for (const token of `${fromWord} ${toWord}`.toLowerCase().split(' ')) {
      if (token.length > 2) words.add(token)
    }
  }
  return words
}

const detectEmergencyAlert = (symptoms) => {
  const lowered = symptoms.toLowerCase()
  for (const rule of emergencyRules) {
    const matched = rule.signs.filter((sign) => lowered.includes(sign))
    if (matched.length >= 2 || (rule.signs.length === 1 && matched.length === 1)) {
      return { emergency: true, emergencyAlert: rule.alert, emergencyMatched: matched }
    }
  }
  return { emergency: false, emergencyAlert: null, emergencyMatched: [] }
}

const extractContext = (symptoms) => {
  const lowered = symptoms.toLowerCase()
  const durationMatch = lowered.match(/(\d+\s*(day|days|week|weeks|month|months|hour|hours))/)
  const severityWords = ['mild', 'moderate', 'severe', 'intense', 'worst']
  const detectedSeverity = severityWords.find((word) => lowered.includes(word)) || null

  return {
    duration: durationMatch ? durationMatch[1] : null,
    severity: detectedSeverity,
  }
}

const buildRuleBasedResponse = (symptoms) => {
  const normalizedSymptoms = symptoms.toLowerCase()
  const matches = fallbackRules
    .map((rule) => {
      const score = rule.keywords.reduce((total, keyword) => {
        return normalizedSymptoms.includes(keyword) ? total + keyword.split(' ').length : total
      }, 0)

      const matchedKeywords = rule.keywords.filter((keyword) => normalizedSymptoms.includes(keyword))
      const longestKeywordLength = matchedKeywords.reduce((longest, keyword) => {
        return Math.max(longest, keyword.split(' ').length)
      }, 0)

      return {
        rule,
        score,
        matchCount: matchedKeywords.length,
        longestKeywordLength,
        matchedKeywords,
      }
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      if (right.matchCount !== left.matchCount) return right.matchCount - left.matchCount
      if (right.longestKeywordLength !== left.longestKeywordLength) {
        return right.longestKeywordLength - left.longestKeywordLength
      }

      const leftIsGeneric = left.rule.specialist === 'General Physician'
      const rightIsGeneric = right.rule.specialist === 'General Physician'

      if (leftIsGeneric !== rightIsGeneric) {
        return leftIsGeneric ? 1 : -1
      }

      return 0
    })

  const bestMatch = matches[0]
  const match = bestMatch?.rule

  if (match) {
    const totalWords = normalizedSymptoms.split(' ').filter(Boolean).length || 1
    const confidenceScore = Math.min(100, Math.max(35, Math.round((bestMatch.score / totalWords) * 100)))

    return {
      possibleCondition: match.possibleCondition,
      recommendedSpecialist: match.specialist,
      healthTips: match.healthTips,
      source: 'rule-based',
      confidenceScore,
      matchedSymptoms: bestMatch.matchedKeywords,
      clarifyingQuestions:
        confidenceScore < 55
          ? [
              'How long have these symptoms been present?',
              'Are symptoms getting better or worse?',
              'Do you have fever, chest pain, or breathing difficulty along with this?',
            ]
          : [],
    }
  }

  return {
    possibleCondition: 'Your symptoms need a general review before narrowing down a specific cause.',
    recommendedSpecialist: 'General Physician',
    healthTips: [
      'Rest and stay hydrated',
      'Track how long the symptoms have been happening',
      'See urgent care quickly if symptoms suddenly worsen',
    ],
    source: 'rule-based',
    confidenceScore: 20,
    matchedSymptoms: [],
    clarifyingQuestions: [
      'How long have these symptoms been present?',
      'Can you share 2-3 specific symptoms together?',
      'Any red-flag signs like chest pain, breathlessness, or severe weakness?',
    ],
  }
}

// @desc    Symptom checker — local rule-based specialist suggestion
// @route   POST /api/symptoms/check
// @access  Public
const checkSymptoms = async (req, res) => {
  const { symptoms } = req.body
  const normalizedSymptoms = normalizeSymptoms(symptoms || '')

  if (!normalizedSymptoms) {
    return res.status(400).json({ message: 'Please provide symptoms' })
  }

  if (isLowQualitySymptoms(normalizedSymptoms)) {
    return res.status(400).json({
      message: 'Please describe symptoms in at least a short sentence (for example: "fever, cough, and body pain for 2 days").',
    })
  }

  const ruleBased = buildRuleBasedResponse(normalizedSymptoms)
  const emergency = detectEmergencyAlert(normalizedSymptoms)
  const context = extractContext(normalizedSymptoms)

  return res.json({
    symptoms: normalizedSymptoms,
    ...ruleBased,
    ...context,
    ...emergency,
  })
}

module.exports = { checkSymptoms }
