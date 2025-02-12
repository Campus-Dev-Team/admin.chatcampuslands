import { useState, useCallback } from 'react';

export const useSendProgress = () => {
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
    isInProgress: false
  });

  const startProgress = useCallback((total) => {
    setProgress({
      current: 0,
      total,
      completed: 0,
      failed: 0,
      isInProgress: true
    });
  }, []);

  const updateProgress = useCallback((status) => {
    setProgress(prev => ({
      ...prev,
      current: prev.current + 1,
      completed: status ? prev.completed + 1 : prev.completed,
      failed: status ? prev.failed : prev.failed + 1
    }));
  }, []);

  // Diferentes estrategias de simulación
  const strategies = {
    // Estrategia 1: Progreso constante
    constantProgress: async (total) => {
      for (let i = 0; i < total; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const isSuccess = Math.random() < 0.9;
        updateProgress(isSuccess);
      }
    },

    // Estrategia 2: Progreso con variación aleatoria
    randomVariationProgress: async (total) => {
      for (let i = 0; i < total; i++) {
        const randomDelay = 200 + Math.random() * 300;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        const isSuccess = Math.random() < 0.9;
        updateProgress(isSuccess);
      }
    },

    // Estrategia 3: Progreso no lineal
    nonLinearProgress: async (total) => {
      for (let i = 0; i < total; i++) {
        const progress = i / total;
        const delay = progress < 0.2 || progress > 0.8 
          ? 500
          : 200;
        await new Promise(resolve => setTimeout(resolve, delay));
        const isSuccess = Math.random() < 0.9;
        updateProgress(isSuccess);
      }
    },

    // Estrategia 4: Progreso por lotes
    batchProgress: async (total) => {
      let processed = 0;
      while (processed < total) {
        const batchSize = Math.min(
          3 + Math.floor(Math.random() * 3),
          total - processed
        );
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        for (let i = 0; i < batchSize; i++) {
          const isSuccess = Math.random() < 0.9;
          updateProgress(isSuccess);
        }
        
        processed += batchSize;
      }
    },

    // Estrategia 5: Progreso con variación adaptativa
    adaptiveProgress: async (total) => {
      let processed = 0;
      while (processed < total) {
        const progress = processed / total;
        let baseDelay = 300;
        
        if (progress < 0.1) baseDelay = 500;
        if (progress > 0.9) baseDelay = 400;
        
        const randomVariation = Math.random() * 200 - 100;
        const finalDelay = baseDelay + randomVariation;
        
        await new Promise(resolve => setTimeout(resolve, finalDelay));
        
        const isSuccess = Math.random() < 0.9;
        updateProgress(isSuccess);
        processed++;
      }
    }
  };

  const simulateProgress = useCallback(async (total) => {
    startProgress(total);
    
    // Seleccionar una estrategia aleatoria
    const strategyNames = Object.keys(strategies);
    const randomStrategy = strategyNames[Math.floor(Math.random() * strategyNames.length)];
    
    // console.log('Usando estrategia:', randomStrategy); // Para debug
    
    try {
      await strategies[randomStrategy](total);
    } catch (error) {
      console.error('Error en simulación:', error);
    }
  }, [startProgress, updateProgress]);

  const resetProgress = useCallback(() => {
    setProgress({
      current: 0,
      total: 0,
      completed: 0,
      failed: 0,
      isInProgress: false
    });
  }, []);

  return {
    progress,
    startProgress,
    updateProgress,
    simulateProgress,
    resetProgress
  };
};