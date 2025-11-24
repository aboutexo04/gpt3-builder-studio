import React from 'react';

export type StepId = 
  | 'intro'
  | 'embeddings'
  | 'attention'
  | 'feedforward'
  | 'block'
  | 'gpt_model'
  | 'instruction_tuning'
  | 'classification_tuning';

export interface CodeSnippet {
  language: 'python' | 'json' | 'text';
  filename: string;
  code: string;     // The full solution
  skeleton: string; // The scaffolding/TODOs for the user to fill in
}

export type SimulationType = 'none' | 'completion' | 'chat' | 'classification';

export interface SimulationConfig {
  type: SimulationType;
  placeholder: string;
  buttonLabel: string;
  systemPrompt?: string;
  description: string;
}

export interface LearningStep {
  id: StepId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  content: React.ReactNode;
  codeSnippets: CodeSnippet[];
  simulation?: SimulationConfig;
}