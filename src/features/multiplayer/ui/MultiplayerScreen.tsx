import Button from '@/components/Button';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSessionJoining } from '../hooks/useSessionJoining';
import { useMultiplayer } from '../multiplayerStore';

type FormType = 'none' | 'create' | 'join';

export default function MultiplayerScreen() {
  const { tokens } = useThemeTokens();
  const {
    isConnected,
    isHost,
    sessionId,
    sessionName,
    connectionStatus,
    connectedDevices,
    createSession,
    joinSession,
    leaveSession,
    retryConnection,
    lastError,
  } = useMultiplayer();

  const {
    generateQRCodeData,
    validateSessionId,
    validateDeviceName,
    sanitizeDeviceName,
    copySessionId: copySessionIdToClipboard,
  } = useSessionJoining();

  const [formType, setFormType] = useState<FormType>('none');
  const [sessionNameInput, setSessionNameInput] = useState('');
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [deviceNameInput, setDeviceNameInput] = useState('');

  const handleCreateSession = () => {
    const sanitizedName = sanitizeDeviceName(sessionNameInput);
    if (!validateDeviceName(sanitizedName)) {
      Alert.alert('Error', 'Session name is required');
      return;
    }

    createSession(sanitizedName);
    setFormType('none');
    setSessionNameInput('');
  };

  const handleJoinSession = () => {
    const sanitizedId = sessionIdInput.trim();
    if (!validateSessionId(sanitizedId)) {
      Alert.alert('Error', 'Session ID is required');
      return;
    }

    joinSession(sanitizedId);
    setFormType('none');
    setSessionIdInput('');
  };

  const handleLeaveSession = () => {
    Alert.alert('Leave Session?', 'Are you sure you want to leave this multiplayer session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: leaveSession },
    ]);
  };

  const copySessionId = () => {
    if (sessionId) {
      copySessionIdToClipboard(sessionId);
    }
  };

  const renderDisconnectedState = () => (
    <View style={styles.container}>
      <Text style={[styles.title, { color: tokens.textPrimary }]}>Multiplayer</Text>
      <Text style={[styles.status, { color: tokens.textMuted }]}>Not Connected</Text>
      <Text style={[styles.description, { color: tokens.textMuted }]}>
        Create or join a multiplayer session to sync your game state across devices.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          label='Create Session'
          onPress={() => setFormType('create')}
          testID='create-session-button'
        />
        <Button
          label='Join Session'
          onPress={() => setFormType('join')}
          testID='join-session-button'
        />
      </View>
    </View>
  );

  const renderCreateSessionForm = () => (
    <Card>
      <Text style={[styles.formTitle, { color: tokens.textPrimary }]}>Create Session</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: tokens.textMuted,
            color: tokens.textPrimary,
            backgroundColor: tokens.surface,
          },
        ]}
        placeholder='Session Name'
        placeholderTextColor={tokens.textMuted}
        value={sessionNameInput}
        onChangeText={setSessionNameInput}
        testID='session-name-input'
      />
      <View style={styles.formButtons}>
        <Button label='Cancel' onPress={() => setFormType('none')} testID='cancel-button' />
        <Button label='Create' onPress={handleCreateSession} testID='create-session-submit' />
      </View>
    </Card>
  );

  const renderJoinSessionForm = () => (
    <Card>
      <Text style={[styles.formTitle, { color: tokens.textPrimary }]}>Join Session</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: tokens.textMuted,
            color: tokens.textPrimary,
            backgroundColor: tokens.surface,
          },
        ]}
        placeholder='Session ID'
        placeholderTextColor={tokens.textMuted}
        value={sessionIdInput}
        onChangeText={setSessionIdInput}
        testID='session-id-input'
      />
      <View style={styles.formButtons}>
        <Button label='Cancel' onPress={() => setFormType('none')} testID='cancel-button' />
        <Button label='Join' onPress={handleJoinSession} testID='join-session-submit' />
      </View>
    </Card>
  );

  const renderConnectedState = () => (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: tokens.textPrimary }]}>Multiplayer</Text>
      <Text style={[styles.status, { color: tokens.textMuted }]}>Connected</Text>

      <Card testID='session-info'>
        <Text style={[styles.sessionName, { color: tokens.textPrimary }]}>{sessionName}</Text>
        <Text style={[styles.sessionId, { color: tokens.textMuted }]}>Session ID: {sessionId}</Text>
        <Button label='Copy Session ID' onPress={copySessionId} testID='copy-session-id-button' />
      </Card>

      <Card testID='qr-code-container'>
        <Text style={[styles.qrTitle, { color: tokens.textPrimary }]}>
          Scan this QR code to join the session
        </Text>
        <View style={[styles.qrPlaceholder, { backgroundColor: tokens.surface }]}>
          <Text style={[styles.qrText, { color: tokens.textMuted }]}>QR Code</Text>
        </View>
        <Text style={[styles.qrSubtitle, { color: tokens.textMuted }]}>
          Or share this link: {generateQRCodeData(sessionId || '')}
        </Text>
      </Card>

      <Card testID='connected-devices'>
        <Text style={[styles.devicesTitle, { color: tokens.textPrimary }]}>
          Connected Devices ({connectedDevices.length})
        </Text>
        {connectedDevices.map((device, index) => (
          <View key={device.id} style={styles.deviceItem} testID='device-item'>
            <Text style={[styles.deviceName, { color: tokens.textPrimary }]}>
              {device.name} {device.isHost ? '(Host)' : ''}
            </Text>
          </View>
        ))}
      </Card>

      <Button label='Leave Session' onPress={handleLeaveSession} testID='leave-session-button' />
    </ScrollView>
  );

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connecting':
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: tokens.textMuted }]}>Connecting...</Text>
            <ActivityIndicator size='small' color={tokens.accent} testID='connection-spinner' />
          </View>
        );
      case 'reconnecting':
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: tokens.textMuted }]}>Reconnecting...</Text>
            <ActivityIndicator size='small' color={tokens.accent} testID='connection-spinner' />
          </View>
        );
      case 'error':
        return (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorTitle, { color: tokens.danger }]}>Connection Error</Text>
            <Text style={[styles.errorMessage, { color: tokens.textMuted }]}>{lastError}</Text>
            <Button
              label='Retry Connection'
              onPress={retryConnection}
              testID='retry-connection-button'
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bg }]}>
      {formType === 'create' && renderCreateSessionForm()}
      {formType === 'join' && renderJoinSessionForm()}

      {!isConnected && formType === 'none' && renderDisconnectedState()}
      {isConnected && renderConnectedState()}

      {renderConnectionStatus()}

      <View testID='connection-status-announcement' style={styles.srOnly}>
        {connectionStatus === 'connected' ? 'Connected to multiplayer session' : 'Not connected'}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  sessionName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionId: {
    fontSize: 14,
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  qrText: {
    fontSize: 16,
  },
  qrSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  devicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deviceItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  deviceName: {
    fontSize: 16,
  },
  statusContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  srOnly: {
    position: 'absolute',
    left: -10000,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
});
