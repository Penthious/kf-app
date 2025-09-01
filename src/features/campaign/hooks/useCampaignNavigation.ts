import { useKnights } from '@/store/knights';
import { useMemo } from 'react';

export const useCampaignNavigation = () => {
  const { knightsById } = useKnights();

  const hasKnights = useMemo(() => {
    return Object.keys(knightsById).length > 0;
  }, [knightsById]);

  const getDefaultTab = () => {
    const tab = hasKnights ? 'kingdoms' : 'knights';
    console.log('useCampaignNavigation:', {
      hasKnights,
      tab,
      knightCount: Object.keys(knightsById).length,
    });
    return tab;
  };

  return {
    hasKnights,
    getDefaultTab,
  };
};
