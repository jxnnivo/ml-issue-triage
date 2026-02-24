# ml-issue triage (Phase 1)
Backend API for automatically classifying, prioritizing, and routing support tickets.

This project is being built in phases. The current version implements a modular rule-based triage engine designed to later be extended into a machine learning-powered system.

## Current Features
    - Text normalization and preprocessing
    - Rule-based category prediction
    - Priority inference using urgency indicators
    - Queue routing logic
    - Confidence scoring heuristic
    - Explainable keyword-based reasoning
    - REST API endpoints for ticket processing

## Triage Engine (rules-v1)
### How it works:
    1. Cleans and standardizes ticket text
    2. Scores predefined keyword buckets
    3. Selects the highest scoring category
    4. Computes a confidence heuristic
    5. Infers priority level
    6. Routes the ticket to an internal queue

The engine is intentionally modular so it can be replaced with a trained ML classifier in the future phase.

### Architecture (Current)
    - Backend: Node.js + Express
    - Classification Layer: Rule-based scoring module
    - API Endpoints: /tickets, /status

### Planned Enhancements
    - Persist labeled tickets for training dataset generation
    - Replace rule engine with supervised ML model
    - Add evaluation metrics (precision, recall, F1)
    - Implement frontend UI for ticket submission and visualization
    - Deploy to cloud environment

### Project Purpose
This project demonstrates:
    - Backend API design
    - Modular system architecture
    - Text preprocessing and classification logic
    - Explainable decision systems
    - Scalable design for future ML integration