import { useState, useCallback } from 'react';

export const useSendProgress = () => {
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
    isInProgress: false
  });

  // Inicializar el progreso
  const startProgress = useCallback((total) => {
    setProgress({
      current: 0,
      total,
      completed: 0,
      failed: 0,
      isInProgress: true
    });
  }, []);

  // Actualizar el progreso (para usar con respuesta del backend)
  const updateProgress = useCallback((status) => {
    setProgress(prev => ({
      ...prev,
      current: prev.current + 1,
      completed: status ? prev.completed + 1 : prev.completed,
      failed: status ? prev.failed : prev.failed + 1
    }));
  }, []);

  // Simular progreso (temporal)
  const simulateProgress = useCallback(async (total) => {
    startProgress(total);
    
    for (let i = 0; i < total; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const isSuccess = Math.random() < 0.9;
      updateProgress(isSuccess);
    }
  }, [startProgress, updateProgress]);

  // Resetear el progreso
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

export default useSendProgress;