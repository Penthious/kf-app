import { useKnights } from '@/store/knights';
import { useMemo } from 'react';

export const useCampaignNavigation = () => {
  const { knightsById } = useKnights();

  const hasKnights = useMemo(() => {
    return Object.keys(knightsById).length > 0;
  }, [knightsById]);

  const getDefaultTab = () => {
    return hasKnights ? 'kingdoms' : 'knights';
  };

  return {
    hasKnights,
    getDefaultTab,
  };
};
