# ml-issue-triage
ML-powered web application for automatically classifying and prioritizing user-submitted support tickets.

## Triage Engine (rules-v1)
The backend currently uses a rule-based triage engine to classify incoming tickets.

### How it works:
    - Normalizes and cleans ticket text
    - Scores predefined keyword buckets
    - Selects the highest scroing label
    - Calculates a simple confidence heuristic
    - Infers ticket priority
    - Routes the ticket to the appropiate internal queue
This serves as a version 1 of the triage system and will later be extended or replaced with a trained ML model