import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// Check if ImagePicker is properly imported
console.log('ImagePicker import check:', typeof ImagePicker);
console.log('ImagePicker methods:', Object.keys(ImagePicker || {}));

export interface ImageResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export class ImageHandler {
  private static readonly COMPRESSION_QUALITY = 0.8;
  private static readonly MAX_WIDTH = 1024;
  private static readonly MAX_HEIGHT = 1024;

  /**
   * Request camera permissions
   */
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      console.log('Requesting camera permissions...');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  /**
   * Request media library permissions
   */
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      console.log('Requesting media library permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  /**
   * Take a photo using the camera
   */
  static async takePhoto(): Promise<ImageResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos of your gear.'
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const compressedImage = await this.compressImage(asset.uri);
        return {
          uri: compressedImage.uri,
          width: compressedImage.width,
          height: compressedImage.height,
          type: 'image/jpeg',
          fileName: `gear_${Date.now()}.jpg`,
        };
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

    /**
   * Pick an image from the gallery
   */
  static async pickFromGallery(): Promise<ImageResult | null> {
    try {
      console.log('Starting gallery picker...');
      
      // Check if ImagePicker is available
      if (!ImagePicker) {
        console.error('ImagePicker is not available');
        Alert.alert('Error', 'Image picker is not available on this device.');
        return null;
      }
      
      console.log('ImagePicker is available, skipping permissions for now...');
      // Temporarily skip permission check to isolate the issue
      // const hasPermission = await this.requestMediaLibraryPermissions();
      // console.log('Gallery permission:', hasPermission);
      
      // if (!hasPermission) {
      //   Alert.alert(
      //     'Gallery Permission Required',
      //     'Please grant gallery permission to select photos of your gear.'
      //   );
      //   return null;
      // }

      console.log('Launching image library...');
      let result;
      try {
        console.log('About to call launchImageLibraryAsync...');
        // Try with minimal options first
        result = await ImagePicker.launchImageLibraryAsync();
        console.log('Basic picker result:', result);
        
        // If basic picker doesn't work, try with options
        if (!result || result.canceled) {
          console.log('Trying with options...');
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });
          console.log('Picker result with options:', result);
        }
      } catch (pickerError) {
        console.error('ImagePicker launch error:', pickerError);
        Alert.alert('Error', 'Failed to open image picker. Please try again.');
        return null;
      }

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Selected asset:', asset);
        
        const compressedImage = await this.compressImage(asset.uri);
        return {
          uri: compressedImage.uri,
          width: compressedImage.width,
          height: compressedImage.height,
          type: 'image/jpeg',
          fileName: `gear_${Date.now()}.jpg`,
        };
      } else {
        console.log('No image selected or picker was canceled');
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    }
  }

  /**
   * Compress and resize an image
   */
  static async compressImage(uri: string): Promise<ImageResult> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: this.MAX_WIDTH,
              height: this.MAX_HEIGHT,
            },
          },
        ],
        {
          compress: this.COMPRESSION_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        type: 'image/jpeg',
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      // Return original image if compression fails
      return { uri, width: 0, height: 0 };
    }
  }

  /**
   * Save image to app's document directory
   */
  static async saveImageToDocuments(uri: string, fileName: string): Promise<string> {
    try {
      const documentsDir = FileSystem.documentDirectory;
      if (!documentsDir) {
        throw new Error('Documents directory not available');
      }

      const fileUri = `${documentsDir}${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      return fileUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  /**
   * Delete image from app's document directory
   */
  static async deleteImage(fileName: string): Promise<void> {
    try {
      const documentsDir = FileSystem.documentDirectory;
      if (!documentsDir) {
        throw new Error('Documents directory not available');
      }

      const fileUri = `${documentsDir}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Share an image
   */
  static async shareImage(uri: string, title: string = 'Gear Image'): Promise<void> {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/jpeg',
          dialogTitle: title,
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image.');
    }
  }

  /**
   * Get file size in MB
   */
  static async getFileSize(uri: string): Promise<number> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && 'size' in fileInfo) {
        return fileInfo.size / (1024 * 1024);
      }
      return 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }

  /**
   * Check if image exists
   */
  static async imageExists(fileName: string): Promise<boolean> {
    try {
      const documentsDir = FileSystem.documentDirectory;
      if (!documentsDir) return false;

      const fileUri = `${documentsDir}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      return fileInfo.exists;
    } catch (error) {
      console.error('Error checking image existence:', error);
      return false;
    }
  }
}
