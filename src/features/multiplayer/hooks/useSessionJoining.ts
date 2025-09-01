import { useCallback } from 'react';

export const useSessionJoining = () => {
  const generateQRCodeData = useCallback((sessionId: string): string => {
    return `exp://localhost:8081/join/${sessionId}`;
  }, []);

  const validateSessionId = useCallback((sessionId: string): boolean => {
    return Boolean(sessionId && sessionId.length >= 8);
  }, []);

  const validateDeviceName = useCallback((name: string): boolean => {
    return Boolean(name && name.trim().length >= 2 && name.trim().length <= 50);
  }, []);

  const sanitizeDeviceName = useCallback((name: string): string => {
    return name.trim().replace(/\s+/g, ' ');
  }, []);

  const copySessionId = useCallback(async (sessionId: string) => {
    console.log('Copying session ID:', sessionId);
  }, []);

  return {
    generateQRCodeData,
    validateSessionId,
    validateDeviceName,
    sanitizeDeviceName,
    copySessionId,
  };
};
