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
    const tab = hasActiveKnights ? 'kingdoms' : 'knights';
    console.log('useCampaignNavigation:', {
      campaignId,
      hasActiveKnights,
      tab,
      campaignMembers: campaignId ? campaigns[campaignId]?.members?.length || 0 : 0,
      activeMembers: campaignId
        ? campaigns[campaignId]?.members?.filter(m => m.isActive).length || 0
        : 0,
    });
    return tab;
  };

  return {
    hasActiveKnights,
    getDefaultTab,
  };
};
