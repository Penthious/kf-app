import { ImageHandler } from '@/expo-utils/image-handler';
import type { Gear } from '@/models/gear';
import { useGear } from '@/store/gear';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useGearImageHandling = () => {
  const { setGearImage, removeGearImage } = useGear();

  const handleGearCamera = async (gear: Gear) => {
    try {
      console.log('Camera button pressed for:', gear.name);

      // Request camera permission first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos of your gear.'
        );
        return;
      }

      console.log('Camera permission granted, launching camera...');

      // Launch camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Captured asset:', asset);

        const fileName = `gear_${gear.id}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(asset.uri, fileName);
        setGearImage(gear.id, savedUri);
        console.log('Image saved for', gear.name);
      } else {
        console.log('No photo taken or camera was canceled');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleGearGallery = async (gear: Gear) => {
    try {
      console.log('Gallery button pressed for:', gear.name);

      // Launch image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Selected asset:', asset);

        const fileName = `gear_${gear.id}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(asset.uri, fileName);
        setGearImage(gear.id, savedUri);
        console.log('Image saved for', gear.name);
      } else {
        console.log('No image selected or picker was canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleGearDelete = (gear: Gear) => {
    // TODO: Add confirmation dialog
    removeGearImage(gear.id);
    console.log('Image deleted for', gear.name);
  };

  return {
    handleGearCamera,
    handleGearGallery,
    handleGearDelete,
  };
};
