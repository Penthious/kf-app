import { ImageHandler } from '@/expo-utils/image-handler';
import type { Gear } from '@/models/gear';
import { useGear } from '@/store/gear';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useGearImageHandling = () => {
  const { setGearImage, removeGearImage } = useGear();

  const handleGearCamera = async (gear: Gear) => {
    try {
      // Request camera permission first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos of your gear.'
        );
        return;
      }

      // Launch camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const fileName = `gear_${gear.id}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(asset.uri, fileName);
        setGearImage(gear.id, savedUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleGearGallery = async (gear: Gear) => {
    try {
      // Launch image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const fileName = `gear_${gear.id}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(asset.uri, fileName);
        setGearImage(gear.id, savedUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleGearDelete = (gear: Gear) => {
    // TODO: Add confirmation dialog
    removeGearImage(gear.id);
  };

  return {
    handleGearCamera,
    handleGearGallery,
    handleGearDelete,
  };
};
