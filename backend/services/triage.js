/**
 * =========================================
 * Rules-Based Triage Engine (rules-v1)
 * =========================================
 *
 * This module performs basic issue classification using
 * keyword scoring heuristics.
 *
 * Responsibilities:
 *  - Clean and normalize ticket text
 *  - Score predefined label buckets
 *  - Predict label + confidence
 *  - Infer priority level
 *  - Map ticket to internal queue
 *
 * NOTE:
 * This is version 1 (rules-based).
 * Future versions may integrate a trained ML model.
 */

function cleanText(input) {
    if (!input) return '';
    return String(input)
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function keywordScore(text, keywords) {
    let score = 0;
    for (const k of keywords) {
        if (text.includes(k)) score += 1;
    }
    return score;
}

function predictLabel(title, body) {
    const text = cleanText(`${title} ${body}`);

   const buckets = [
    {
      label: 'billing',
      keywords: ['refund', 'charge', 'charged', 'invoice', 'billing', 'payment', 'card', 'credit', 'subscription'],
    },
    {
      label: 'account',
      keywords: ['login', 'sign in', 'password', 'reset', 'locked', '2fa', 'verification', 'email change'],
    },
    {
      label: 'bug',
      keywords: ['error', 'crash', 'broken', 'bug', 'issue', 'stack trace', 'exception', 'fails', 'not working'],
    },
    {
      label: 'feature',
      keywords: ['feature', 'request', 'enhancement', 'add', 'support', 'would be nice', 'can we'],
    },
    {
      label: 'question',
      keywords: ['how do i', 'how to', 'what is', 'help', 'where can', 'does it', 'is it possible'],
    },
  ];

  const scored = buckets
    .map(b => ({ label: b.label, score: keywordScore(text, b.keywords) }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];

  let confidence = 0.5;
  if (top.score === 0) {
    return { label: 'other', confidence: 0.35, reasons: [] };
  }

  const gap = top.score - (second?.score ?? 0);
  confidence = Math.min(0.95, 0.55 + 0.1 * gap);

  const topKeywords = buckets.find(b => b.label === top.label)?.keywords ?? [];
  const reasons = topKeywords.filter(k => text.includes(k)).slice(0, 6);
  return { label: top.label, confidence, reasons };
}

function predictPriority(title, body) {
    const text = cleanText(`${title} ${body}`);
    const urgentWords = ['urgent', 'asap', 'immediately', 'down', 'outage', 'security', 'breach', 'cannot login', "can't login"];
    const highWords = ['crash', 'payment failed', 'blocked', 'broken', 'not working']; 

    if (urgentWords.some(w => text.includes(w))) return 'urgent';
    if (highWords.some(w => text.includes(w))) return 'high';
    if (text.length > 200) return 'medium';
    return 'low';
}

function mapQueue(label) {
    const map = {
        billing: 'finance',
        account: 'support',
        bug: 'engineering',
        feature: 'product',
        question: 'support',
        other: 'triage',
  };
    return map[label] || 'triage';
}

function triageTicket({ title, body}) {
    const clean = cleanText(`${title} ${body}`);
    const pred = predictLabel(title, body);
    const priority = predictPriority(title, body);
    const queue = mapQueue(pred.label);

    return {
        clean_text: clean,
        predicted: {
            label: pred.label,
            confidence: pred.confidence,
            model_version: 'rules-v1',
        },
        routing: { queue, priority },
        explanations: pred.reasons.map(r => ({type: 'keyword', value: r})),
    };
}
// TODO: Store raw predictions for future ML training dataset

export { triageTicket };