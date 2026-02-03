import React from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

// Define types for view state
export type ViewState = 'home' | 'chat' | 'features' | 'fees' | 'exams' | 'settings';