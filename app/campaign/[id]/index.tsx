import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CampaignIndexRedirect() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    useEffect(() => {
        if (id) router.replace(`/campaign/${id}/kingdoms`);
    }, [id]);

    return null;
}