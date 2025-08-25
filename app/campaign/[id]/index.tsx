import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

// When user opens /campaign/[id], jump to the primary tab (Kingdoms)
export default function CampaignIndexRedirect() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <Redirect href={{ pathname: '/campaign/[id]/kingdoms', params: { id } }} />;
}