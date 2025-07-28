'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef
} from 'react';
import { brandAPI } from '@/lib/api';
import {
  DetailedBrandRequest,
  ProgressUpdate,
  BrandPackage
} from '@/lib/types';

/* ------------------------------------------------------------------ */
/* Types & State                                                      */
/* ------------------------------------------------------------------ */

type GenerationStatus = 'idle' | 'in_progress' | 'completed' | 'error';

export interface GenerationState {
  status: GenerationStatus;
  /** Live or demo backend mode */
  backendMode?: 'live' | 'demo';
  /** Latest progress update (only while in_progress) */
  progress?: ProgressUpdate;
  /** Final result when completed */
  result?: BrandPackage;
  /** Error message if failed */
  error?: string;
  /** Whether the UI is currently minimised */
  minimized: boolean;
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

type Action =
  | { type: 'START_REQUEST'; payload: { request: DetailedBrandRequest } }
  | { type: 'SET_BACKEND_MODE'; payload: { mode: 'live' | 'demo' } }
  | { type: 'PROGRESS_UPDATE'; payload: { progress: ProgressUpdate } }
  | { type: 'COMPLETE'; payload: { result: BrandPackage } }
  | { type: 'ERROR'; payload: { error: string } }
  | { type: 'MINIMIZE' }
  | { type: 'RESTORE' }
  | { type: 'RESET' };

/* ------------------------------------------------------------------ */
/* Reducer                                                            */
/* ------------------------------------------------------------------ */

const initialState: GenerationState = {
  status: 'idle',
  minimized: false
};

function reducer(state: GenerationState, action: Action): GenerationState {
  switch (action.type) {
    case 'START_REQUEST':
      return {
        status: 'in_progress',
        minimized: false,
        progress: undefined,
        result: undefined,
        error: undefined
      };
    case 'SET_BACKEND_MODE':
      return { ...state, backendMode: action.payload.mode };
    case 'PROGRESS_UPDATE':
      return { ...state, progress: action.payload.progress };
    case 'COMPLETE':
      return {
        ...state,
        status: 'completed',
        minimized: false,
        result: action.payload.result,
        progress: undefined
      };
    case 'ERROR':
      return {
        ...state,
        status: 'error',
        minimized: false,
        error: action.payload.error
      };
    case 'MINIMIZE':
      return { ...state, minimized: true };
    case 'RESTORE':
      return { ...state, minimized: false };
    case 'RESET':
      return initialState;
    default:
      // Exhaustive check – should never reach
      // @ts-expect-error
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Context & Provider                                                 */
/* ------------------------------------------------------------------ */

interface GenerationContextValue {
  state: GenerationState;
  startGeneration: (request: DetailedBrandRequest) => void;
  minimize: () => void;
  restore: () => void;
  reset: () => void;
}

const GenerationContext = createContext<GenerationContextValue | undefined>(
  undefined
);

export function GenerationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Keep refs to cancel ongoing intervals/timeouts if demo mode
  const demoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ----------------------------- helpers -------------------------- */

  const minimize = useCallback(() => {
    dispatch({ type: 'MINIMIZE' });
  }, []);

  const restore = useCallback(() => {
    dispatch({ type: 'RESTORE' });
  }, []);

  const reset = useCallback(() => {
    // Clean up demo timeout if still running
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
      demoTimeoutRef.current = null;
    }
    dispatch({ type: 'RESET' });
  }, []);

  /* ------------------------ startGeneration ----------------------- */

  const startGeneration = useCallback(
    async (request: DetailedBrandRequest) => {
      // Prevent starting another generation while one is active
      if (state.status === 'in_progress') return;

      dispatch({ type: 'START_REQUEST', payload: { request } });

      // Decide backend mode
      let backendMode: 'live' | 'demo' = 'live';
      try {
        await brandAPI.healthCheck();
        backendMode = 'live';
      } catch {
        backendMode = 'demo';
      }
      dispatch({ type: 'SET_BACKEND_MODE', payload: { mode: backendMode } });

      /* ---------- callbacks shared between live & demo ------------ */

      const handleProgress = (update: ProgressUpdate) => {
        dispatch({ type: 'PROGRESS_UPDATE', payload: { progress: update } });
      };

      const handleComplete = (result: BrandPackage) => {
        dispatch({ type: 'COMPLETE', payload: { result } });
      };

      const handleError = (errorMessage: string) => {
        dispatch({ type: 'ERROR', payload: { error: errorMessage } });
      };

      /* --------------------------- live --------------------------- */
      if (backendMode === 'live') {
        try {
          brandAPI.generateBrandPackage(
            request,
            handleProgress,
            handleComplete,
            handleError
          );
        } catch (err) {
          handleError(
            err instanceof Error ? err.message : 'Failed to start generation'
          );
        }
        return;
      }

      /* --------------------------- demo --------------------------- */
      demoTimeoutRef.current = brandAPI.simulateGeneration(
        request,
        handleProgress,
        handleComplete,
        handleError
      );
    },
    [state.status]
  );

  /* --------------------------- value ----------------------------- */

  const value: GenerationContextValue = {
    state,
    startGeneration,
    minimize,
    restore,
    reset
  };

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook                                                               */
/* ------------------------------------------------------------------ */

export function useGeneration(): GenerationContextValue {
  const ctx = useContext(GenerationContext);
  if (!ctx) {
    throw new Error(
      'useGeneration must be used within a GenerationProvider component'
    );
  }
  return ctx;
}