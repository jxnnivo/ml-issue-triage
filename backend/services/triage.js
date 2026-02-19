// Normalize text for consistent keyword matching.
function cleanText(input) {
    if (!input) return '';
    return String(input)
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

// Count the amount of category keywords appear in the text.
function keywordScore(text, keywords) {
    let score = 0;
    for (const k of keywords) {
        if (text.includes(k)) score += 1;
    }
    return score;
}

// Predict ticket category uding rule-based keyword buckets.
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

  // Score each category and sort by highest match.
  const scored = buckets
    .map(b => ({ label: b.label, score: keywordScore(text, b.keywords) }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];

  let confidence = 0.5; // Base heuristic confidence score.

  if (top.score === 0) {
    return { label: 'other', confidence: 0.35, reasons: [] }; // Fallback when no keywords match.
  }

  const gap = top.score - (second?.score ?? 0); // Increase confidence when category separation is clear.
  confidence = Math.min(0.95, 0.55 + 0.1 * gap);

  // Capture matched keywords for explainability.
  const topKeywords = buckets.find(b => b.label === top.label)?.keywords ?? [];
  const reasons = topKeywords.filter(k => text.includes(k)).slice(0, 6);
  return { label: top.label, confidence, reasons };
}

// Assign priority using urgency and failure indicators.
function predictPriority(title, body) {
    const text = cleanText(`${title} ${body}`);
    const urgentWords = ['urgent', 'asap', 'immediately', 'down', 'outage', 'security', 'breach', 'cannot login', "can't login"];
    const highWords = ['crash', 'payment failed', 'blocked', 'broken', 'not working']; 

    if (urgentWords.some(w => text.includes(w))) return 'urgent'; // Critical business impact.
    if (highWords.some(w => text.includes(w))) return 'high'; // Major functionality issue.
    if (text.length > 200) return 'medium'; // Longer descriptions imply complexity.
    return 'low'; // Default priority.
}

// Map predicted label to internal team queue.
function mapQueue(label) {
    const map = {
        billing: 'finance',
        account: 'support',
        bug: 'engineering',
        feature: 'product',
        question: 'support',
        other: 'triage',
  };
    return map[label] || 'triage'; // Default to triage if unknown.
}

// Main function for ticket classification and routing.
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
            model_version: 'rules-v1', // Explicit versioning for future ML upgrades.
        },
        routing: { queue, priority },
        explanations: pred.reasons.map(r => ({type: 'keyword', value: r})), // Transparent keyword explanations.
    };
}

// TODO: Store raw predictions for future ML training dataset

export { triageTicket };