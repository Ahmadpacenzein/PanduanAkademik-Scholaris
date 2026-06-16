// src/components/CourseCard.js
// Reusable course card component untuk RecyclerView

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { useAppTheme } from '../theme/ThemeContext';

const CourseCard = ({ course, onPress }) => {
  useAppTheme();
  const styles = createStyles();
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: animatedValue }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Top Section - Color Bar & Title */}
        <View style={styles.cardTop}>
          <View style={styles.cardIconContainer}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={28}
              color={course.isEnrolled ? colors.success : colors.primary}
            />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text
              style={[styles.courseName, typography.titleLarge]}
              numberOfLines={2}
            >
              {course.name}
            </Text>
            <Text style={[styles.courseCode, typography.bodySmall]}>
              {course.code} • {course.credits} SKS
            </Text>
          </View>
          {course.isEnrolled && (
            <View style={styles.enrolledBadge}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color={colors.success}
              />
            </View>
          )}
        </View>

        {/* Middle Section - Lecturer & Schedule */}
        <View style={styles.cardMiddle}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="account"
              size={16}
              color={colors.onSurfaceVariant}
              style={styles.infoIcon}
            />
            <Text
              style={[styles.infoText, typography.bodySmall]}
              numberOfLines={1}
            >
              {course.lecturer}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={16}
              color={colors.onSurfaceVariant}
              style={styles.infoIcon}
            />
            <Text
              style={[styles.infoText, typography.bodySmall]}
              numberOfLines={1}
            >
              {course.schedule.split(',')[0]}
            </Text>
          </View>
        </View>

        {/* Bottom Section - Capacity */}
        <View style={styles.cardBottom}>
          <View style={styles.capacityInfo}>
            <Text style={[styles.capacityLabel, typography.labelSmall]}>
              Peserta: {course.registered}/{course.capacity}
            </Text>
            <View
              style={[
                styles.capacityIndicator,
                {
                  backgroundColor:
                    course.registered >= course.capacity
                      ? colors.error
                      : course.registered > course.capacity * 0.8
                        ? colors.warning
                        : colors.success,
                },
              ]}
            />
          </View>
          <View style={styles.capacityBar}>
            <View
              style={[
                styles.capacityBarFill,
                {
                  width: `${(course.registered / course.capacity) * 100}%`,
                  backgroundColor:
                    course.registered >= course.capacity
                      ? colors.error
                      : course.registered > course.capacity * 0.8
                        ? colors.warning
                        : colors.primary,
                },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = () => StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomColor: colors.outlineVariant,
    borderBottomWidth: 1,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  courseName: {
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseCode: {
    color: colors.onSurfaceVariant,
  },
  enrolledBadge: {
    paddingLeft: 8,
    paddingRight: 0,
  },
  cardMiddle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    opacity: 0.6,
  },
  infoText: {
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  cardBottom: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityLabel: {
    color: colors.onSurfaceVariant,
  },
  capacityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  capacityBar: {
    height: 4,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 2,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default CourseCard;
