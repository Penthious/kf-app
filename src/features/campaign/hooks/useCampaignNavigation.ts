import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useMemo } from 'react';

export const useCampaignNavigation = (campaignId?: string) => {
  const { knightsById } = useKnights();
  const { campaigns } = useCampaigns();

  const hasActiveKnights = useMemo(() => {
    if (!campaignId) return false;

    const campaign = campaigns[campaignId];
    if (!campaign) return false;

    // Check if the campaign has any active knights
    return campaign.members.some(member => member.isActive);
  }, [campaignId, campaigns]);

  const getDefaultTab = () => {
    return hasActiveKnights ? 'kingdoms' : 'knights';
  };

  return {
    hasActiveKnights,
    getDefaultTab,
  };
};
