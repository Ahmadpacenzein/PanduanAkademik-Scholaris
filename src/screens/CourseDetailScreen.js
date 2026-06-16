// src/screens/CourseDetailScreen.js
// Detail mata kuliah dengan implicit intents

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import  courseService  from '../services/courseService';
import  studentService  from '../services/studentService';
import storageManager from '../utils/storageManager';
import * as intentService from '../services/intentService';
import { ROUTES } from '../constants/routes';

const CourseDetailScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(course.isEnrolled);

  React.useEffect(() => {
    const syncEnrollmentStatus = async () => {
      try {
        const updatedCourse = await storageManager.getCourseById(course.id);
        if (updatedCourse) {
          setEnrollmentStatus(updatedCourse.isEnrolled);
        }
      } catch (error) {
        console.error('Error syncing enrollment status:', error);
      }
    };

    syncEnrollmentStatus();
  }, [course.id]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const studentId = await studentService.getStudentId();
      const result = await courseService.enrollCourse(course.id, studentId);
      setEnrollmentStatus(true);
      await storageManager.updateCourseEnrollment(course.id, true);
      Alert.alert('Berhasil', result.message, [
  {
    text: 'Kembali ke Beranda',
    onPress: () =>
      navigation.navigate(ROUTES.MAIN_TABS, {
        screen: ROUTES.HOME,
      }),
  },
  {
    text: 'Lihat Mata Kuliah Lainnya',
    onPress: () =>
      navigation.navigate(ROUTES.MAIN_TABS, {
        screen: ROUTES.COURSES,
      }),
  },
]);
    } catch (error) {
      Alert.alert('Gagal', error.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    Alert.alert(
      'Konfirmasi',
      `Apakah Anda yakin ingin membatalkan pendaftaran ${course.name}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Lanjutkan',
          style: 'destructive',
          onPress: async () => {
            setIsUnenrolling(true);
            try {
              const studentId = await studentService.getStudentId();
              const result = await courseService.unenrollCourse(course.id, studentId);
              setEnrollmentStatus(false);
              await storageManager.updateCourseEnrollment(course.id, false);
              Alert.alert('Berhasil', result.message);
            } catch (error) {
              Alert.alert('Gagal', error.message);
            } finally {
              setIsUnenrolling(false);
            }
          },
        },
      ]
    );
  };

const handleCallLecturer = () => {
  intentService.callDosen(
    course.lecturerPhone,
    course.lecturer
  );
};

const handleWhatsappLecturer = () => {
  intentService.whatsappDosen(
    course.lecturerPhone,
    `Halo, saya ingin menanyakan tentang mata kuliah ${course.name}`,
    course.lecturer
  );
};

const handleEmailLecturer = () => {
  intentService.sendEmail(
    course.lecturerEmail,
    `Pertanyaan tentang ${course.name}`,
    `Halo ${course.lecturer},\n\nSaya ingin menanyakan tentang mata kuliah ${course.name}.`
  );
};

  const handleShareCourse = () => {
    intentService.shareCourseToBrowser(course.name, course.code, course.lecturer);
  };

  const renderInfoItem = (icon, label, value) => (
    <View style={styles.infoItem}>
      <View style={styles.infoItemLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={colors.primary}
          style={styles.infoIcon}
        />
        <Text style={[styles.infoLabel, typography.bodySmall]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.infoValue, typography.bodyMedium]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );

  const renderActionButton = (icon, label, onPress, variant = 'primary') => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === 'secondary' && styles.actionButtonSecondary,
        variant === 'danger' && styles.actionButtonDanger,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={
          variant === 'primary'
            ? colors.onPrimary
            : variant === 'danger'
              ? colors.error
              : colors.primary
        }
        style={styles.actionButtonIcon}
      />
      <Text
        style={[
          styles.actionButtonText,
          typography.labelMedium,
          variant === 'primary' && { color: colors.onPrimary },
          variant === 'secondary' && { color: colors.primary },
          variant === 'danger' && { color: colors.error },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.courseIcon,
              { backgroundColor: course.isEnrolled ? colors.primary : colors.primaryContainer },
            ]}
          >
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={40}
              color={course.isEnrolled ? colors.onPrimary : colors.primary}
            />
          </View>
          <Text style={[styles.courseName, typography.headlineSmall]}>
            {course.name}
          </Text>
          <Text style={[styles.courseCode, typography.bodyMedium]}>
            {course.code} • {course.credits} SKS
          </Text>
          {enrollmentStatus && (
            <View style={styles.enrolledBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.enrolledText, typography.labelSmall]}>
                Sudah Diambil
              </Text>
            </View>
          )}
        </View>

        {/* Course Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Deskripsi
          </Text>
          <Text style={[styles.description, typography.bodyMedium]}>
            {course.description}
          </Text>
        </View>

        {/* Lecturer Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Informasi Dosen
          </Text>
          {renderInfoItem('account', 'Dosen Pengampu', course.lecturer)}
          {renderInfoItem('email', 'Email', course.lecturerEmail)}
          {renderInfoItem('phone', 'Telepon', course.lecturerPhone)}
        </View>

        {/* Course Schedule & Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Jadwal & Lokasi
          </Text>
          {renderInfoItem('calendar', 'Jadwal', course.schedule)}
          {renderInfoItem('map-marker', 'Ruangan', course.room)}
        </View>

        {/* Course Capacity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Kapasitas
          </Text>
          <View style={styles.capacityContainer}>
            <View style={styles.capacityInfo}>
              <Text style={[styles.capacityLabel, typography.bodySmall]}>
                Peserta
              </Text>
              <Text style={[styles.capacityValue, typography.titleLarge]}>
                {course.registered}/{course.capacity}
              </Text>
            </View>
            <View style={styles.capacityBar}>
              <View
                style={[
                  styles.capacityBarFill,
                  { width: `${(course.registered / course.capacity) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Syllabus */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Materi Pembelajaran
          </Text>
          {course.syllabus.map((item, index) => (
            <View key={index} style={styles.syllabusItem}>
              <View style={styles.syllabusNumber}>
                <Text style={[styles.syllabusNumberText, typography.labelSmall]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.syllabusText, typography.bodyMedium]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Hubungi Dosen
          </Text>
          <View style={styles.contactButtonsRow}>
  <TouchableOpacity
    style={styles.contactButton}
    onPress={handleCallLecturer}
    activeOpacity={0.7}
  >
    <MaterialCommunityIcons
      name="phone"
      size={24}
      color={colors.primary}
      style={styles.contactButtonIcon}
    />
    <Text style={[styles.contactButtonText, typography.labelSmall]}>
      Telepon
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.contactButton}
    onPress={handleWhatsappLecturer}
    activeOpacity={0.7}
  >
    <MaterialCommunityIcons
      name="whatsapp"
      size={24}
      color={colors.primary}
      style={styles.contactButtonIcon}
    />
    <Text style={[styles.contactButtonText, typography.labelSmall]}>
      WhatsApp
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.contactButton}
    onPress={handleEmailLecturer}
    activeOpacity={0.7}
  >
    <MaterialCommunityIcons
      name="email"
      size={24}
      color={colors.primary}
      style={styles.contactButtonIcon}
    />
    <Text style={[styles.contactButtonText, typography.labelSmall]}>
      Email
    </Text>
  </TouchableOpacity>
</View>

<TouchableOpacity
  style={styles.shareButton}
  onPress={handleShareCourse}
  activeOpacity={0.7}
>
  <MaterialCommunityIcons
    name="share-variant"
    size={20}
    color={colors.primary}
    style={{ marginRight: 8 }}
  />
  <Text style={[styles.actionButtonText, typography.labelMedium]}>
    Bagikan Mata Kuliah
  </Text>
</TouchableOpacity>
          
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Enrollment Button (Fixed at bottom) */}
      <View style={styles.footer}>
        {enrollmentStatus ? (
          <TouchableOpacity
            style={[styles.enrollButton, styles.enrollButtonDanger]}
            onPress={handleUnenroll}
            disabled={isUnenrolling}
            activeOpacity={0.7}
          >
            {isUnenrolling ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={colors.error}
                  style={styles.buttonIcon}
                />
                <Text style={[styles.enrollButtonText, { color: colors.error }]}>
                  Batalkan Pendaftaran
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={handleEnroll}
            disabled={isEnrolling || course.registered >= course.capacity}
            activeOpacity={0.7}
          >
            {isEnrolling ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={colors.onPrimary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.enrollButtonText}>
                  {course.registered >= course.capacity
                    ? 'Mata Kuliah Penuh'
                    : 'Daftar Sekarang'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  courseIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseName: {
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  courseCode: {
    color: colors.onSurfaceVariant,
    marginBottom: 12,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryFixed,
    borderRadius: 20,
    marginTop: 8,
  },
  enrolledText: {
    color: colors.onPrimaryFixed,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.onSurface,
    marginBottom: 12,
  },
  description: {
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: colors.outlineVariant,
    borderBottomWidth: 1,
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    color: colors.onSurfaceVariant,
  },
  infoValue: {
    color: colors.onSurface,
    flex: 1,
    textAlign: 'right',
  },
  capacityContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  capacityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  capacityLabel: {
    color: colors.onSurfaceVariant,
  },
  capacityValue: {
    color: colors.primary,
  },
  capacityBar: {
    height: 8,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 4,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  syllabusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  syllabusNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  syllabusNumberText: {
    color: colors.onPrimaryFixed,
  },
  syllabusText: {
    color: colors.onSurface,
    flex: 1,
    paddingTop: 6,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButtonsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.outlineVariant,
  paddingVertical: 8,
},

contactButton: {
  alignItems: 'center',
  flex: 1,
  paddingVertical: 12,
},

contactButtonIcon: {
  marginBottom: 8,
},

contactButtonText: {
  color: colors.onSurface,
  textAlign: 'center',
},

shareButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 12,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: colors.surfaceContainerLowest,
  borderWidth: 1,
  borderColor: colors.outlineVariant,
},
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryFixed,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
  },
  actionButtonDanger: {
    backgroundColor: colors.errorContainer,
    borderColor: colors.error,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: colors.primary,
  },
  bottomSpacer: {
    height: 70,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopColor: colors.outlineVariant,
    borderTopWidth: 1,
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  enrollButtonDanger: {
    backgroundColor: colors.errorContainer,
  },
  buttonIcon: {
    marginRight: 8,
  },
  enrollButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseDetailScreen;