const express = require('express');
const Query = require('../models/Query');
const router = express.Router();

const EMERGENCY_KEYWORDS = [
  'chest pain', 'bleeding', 'heart attack', 'stroke', 
  'unconscious', 'breathing difficulty', 'difficulty breathing', 
  'severe burn', 'head injury', 'slurred speech', 'seizure', 'fainting'
];

const CATEGORY_KEYWORDS = {
  Cardiology: [
    'chest', 'heart', 'palpitation', 'pulse', 'cardiac', 
    'blood pressure', 'tightness in chest', 'angina', 'fluttering', 'arrhythmia'
  ],
  Dermatology: [
    'skin', 'rash', 'itch', 'itching', 'mole', 'acne', 
    'eczema', 'psoriasis', 'bump', 'redness', 'lesion', 
    'peeling', 'blister', 'hives', 'scalp', 'hair loss', 'spot'
  ],
  Neurology: [
    'headache', 'migraine', 'dizzy', 'dizziness', 'vertigo', 
    'numb', 'numbness', 'tingling', 'nerve', 'vision blur', 
    'memory', 'tremor', 'neuropathy', 'confusion', 'faint'
  ],
  Pediatrics: [
    'child', 'baby', 'infant', 'toddler', 'kid', 'son', 
    'daughter', 'pediatric', 'teething', 'growth', 'colic'
  ],
  Orthopedics: [
    'bone', 'joint', 'knee', 'back pain', 'spine', 'fracture', 
    'wrist', 'ankle', 'shoulder', 'ligament', 'muscle', 'sprain', 
    'strain', 'swollen joint', 'arthritis', 'tendon', 'hip', 'neck pain'
  ]
};

// AI Engine: Auto-Categorize from natural patient language
const analyzeCategory = (text) => {
  const lower = text.toLowerCase();
  const scores = {};

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[cat] = 0;
    for (const word of words) {
      if (lower.includes(word)) {
        scores[cat] += 1;
      }
    }
  }

  let bestCategory = 'General';
  let maxScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  const confidenceScore = maxScore > 0 ? Math.min(0.98, 0.72 + maxScore * 0.08) : 0.85;
  return { category: bestCategory, confidenceScore: parseFloat(confidenceScore.toFixed(2)) };
};

// AI Engine: Auto-Generate Clinical Summary / Title from patient description
const generateClinicalTitle = (description, category) => {
  if (!description) return `Inquiry regarding ${category} health`;

  // Clean conversational fluff (e.g. "Hi doctor, I am having...", "For the past 3 days I noticed...")
  let cleaned = description
    .replace(/^(hello|hi|hey|dear)\s+(doctor|doc|team|dr)?[,\.\s]*/i, '')
    .replace(/^(i am|i'm|i have been|i've been|having|experiencing|noticed)\s+/i, '')
    .replace(/^(please help|help me|can someone tell me)\s+/i, '')
    .trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Extract the first key sentence or first 12-15 words
  const firstSentence = cleaned.split(/[\.\n!?]/)[0].trim();
  const words = firstSentence.split(/\s+/);

  if (words.length <= 12 && words.join(' ').length > 10) {
    return words.join(' ');
  }

  const trimmed = words.slice(0, 10).join(' ');
  return trimmed ? `${trimmed}...` : `Patient Report (${category})`;
};

// AI Engine: Emergency Triage
const analyzeEmergency = (text) => {
  const lower = text.toLowerCase();
  const matched = EMERGENCY_KEYWORDS.filter(kw => lower.includes(kw));
  const isEmergency = matched.length > 0;
  return {
    isEmergency,
    matchedKeywords: matched,
    confidenceScore: isEmergency ? 0.96 : 0.90
  };
};

router.post('/', async (req, res) => {
  try {
    let { description, title, category, patientId } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Please describe what you are experiencing.' });
    }

    const patientText = description.trim();

    // 1. AI Categorization (if not manually specified)
    const categoryAnalysis = analyzeCategory(patientText);
    const finalCategory = category && category !== 'General' ? category : categoryAnalysis.category;

    // 2. AI Clinical Title Synthesis (if not manually specified)
    const finalTitle = title && title.trim().length > 3 
      ? title.trim() 
      : generateClinicalTitle(patientText, finalCategory);

    // 3. AI Emergency Triage
    const triageAnalysis = analyzeEmergency(patientText);

    const query = new Query({
      title: finalTitle,
      description: patientText,
      category: finalCategory,
      patientId,
      aiTriage: {
        isEmergency: triageAnalysis.isEmergency,
        confidenceScore: triageAnalysis.confidenceScore
      }
    });

    await query.save();
    res.status(201).json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: 'OPEN' };
    if (category) filter.category = category;

    const queries = await Query.find(filter).populate('patientId', 'name').sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
