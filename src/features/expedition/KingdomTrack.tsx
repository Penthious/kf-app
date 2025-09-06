import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

interface TrackSegment {
  id: string;
  number: number;
  isSpecial?: boolean;
  isCurrent?: boolean;
  label?: string;
  icon?: string;
  isHuntSpace?: boolean;
  huntSpaceType?: 'single' | 'double';
}

interface KingdomTrackProps {
  title: string;
  segments: TrackSegment[];
  currentPosition: number;
  icon?: string;
  style?: 'threat' | 'time' | 'short';
  onSegmentPress?: (segmentNumber: number) => void;
}

export default function KingdomTrack({
  title,
  segments,
  currentPosition,
  icon,
  style = 'time',
  onSegmentPress,
}: KingdomTrackProps) {
  const getTrackColors = () => {
    switch (style) {
      case 'threat':
        return {
          background: '#2a1a0a',
          segment: '#8b4513',
          special: '#ffd700',
          current: '#666666',
          text: '#ffd700',
        };
      case 'time':
        return {
          background: '#0a1a2a',
          segment: '#1e3a5f',
          special: '#ffd700',
          current: '#666666',
          text: '#ffd700',
        };
      case 'short':
        return {
          background: '#1a0a0a',
          segment: '#5f1e1e',
          special: '#ffd700',
          current: '#666666',
          text: '#ffd700',
        };
      default:
        return {
          background: '#0a0a0a',
          segment: '#333333',
          special: '#ffd700',
          current: '#666666',
          text: '#ffd700',
        };
    }
  };

  const colors = getTrackColors();

  const showHuntSpaceAlert = (segment: TrackSegment) => {
    if (!segment.isHuntSpace) return;

    const isDouble = segment.huntSpaceType === 'double';
    const title = isDouble ? 'Double Hunt Space' : 'Single Hunt Space';
    const message = isDouble
      ? 'When the Threat marker moves to this space, each Encounter Monster on the Kingdom map moves 2 tiles toward the Party marker via the shortest path.'
      : 'When the Threat marker moves to this space, each Encounter Monster on the Kingdom map moves 1 tile toward the Party marker via the shortest path.';

    Alert.alert(title, message, [{ text: 'Got it!', style: 'default' }]);
  };

  const renderIcon = (iconType?: string) => {
    if (!iconType) return null;

    // Simple icon representations using text symbols
    const iconMap: Record<string, string> = {
      skull: '☠',
      crown: '♔',
      paw: '🐾',
      campfire: '🔥',
      flower: '❀',
      star: '⭐',
    };

    return <Text style={[styles.icon, { color: colors.text }]}>{iconMap[iconType] || '●'}</Text>;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Title and starting icon */}
      <View style={styles.header}>
        {renderIcon(icon)}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      {/* Track segments */}
      <View style={styles.track}>
        {segments.map((segment, index) => {
          const isCurrent = segment.number === currentPosition;
          const isSpecial = segment.isSpecial;

          let segmentColor = colors.segment;
          if (isCurrent) segmentColor = colors.current;
          if (isSpecial) segmentColor = colors.special;

          return (
            <View key={segment.id} style={styles.segmentContainer}>
              <Pressable
                onPress={() => {
                  if (segment.isHuntSpace) {
                    showHuntSpaceAlert(segment);
                  }
                  onSegmentPress?.(segment.number);
                }}
                style={({ pressed }) => [
                  styles.segment,
                  {
                    backgroundColor: segmentColor,
                    borderColor: colors.text,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.segmentNumber,
                    {
                      color: isCurrent || isSpecial ? '#000000' : colors.text,
                    },
                  ]}
                >
                  {segment.number}
                </Text>

                {/* Hunt space marker */}
                {segment.isHuntSpace && (
                  <View style={styles.huntMarker}>
                    <Text style={styles.huntIcon}>
                      {segment.huntSpaceType === 'double' ? '🐾🐾' : '🐾'}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Special labels */}
              {segment.label && (
                <Text style={[styles.label, { color: colors.text }]}>{segment.label}</Text>
              )}

              {/* Special icons above/below segments */}
              {segment.icon && (
                <View style={styles.specialIconContainer}>{renderIcon(segment.icon)}</View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    fontSize: 18,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  segmentContainer: {
    alignItems: 'center',
    marginHorizontal: 1,
    position: 'relative',
    height: 32,
    width: 40,
  },
  segment: {
    width: 36,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'left',
    position: 'absolute',
    top: 8,
    left: 42,
    width: 80,
  },
  specialIconContainer: {
    position: 'absolute',
    top: -8,
    alignItems: 'center',
  },
  huntMarker: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ffd700',
    borderRadius: 8,
    minWidth: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 2,
  },
  huntIcon: {
    fontSize: 6,
  },
});
