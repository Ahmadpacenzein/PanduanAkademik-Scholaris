// src/screens/HomeScreen.js
// Main home screen dengan bottom navigation dan welcome message

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import  studentService  from '../services/studentService';
import  courseService  from '../services/courseService';
import storageManager from '../utils/storageManager';
import CourseCard from '../components/CourseCard';
import { MOCK_QUICK_MENU } from '../constants/mockData';
import { ROUTES } from '../constants/routes';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentData, coursesData] = await Promise.all([
        studentService.getStudentProfile(),
        courseService.getEnrolledCourses(),
      ]);
      setStudent(studentData);
      setEnrolledCourses(coursesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleQuickMenuPress = (menuItem) => {
    // Handle quick menu navigation
    console.log('Quick menu pressed:', menuItem.id);
  };

  const handleCoursePress = (course) => {
    navigation.navigate(ROUTES.COURSE_DETAIL, { course });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, typography.bodyLarge]}>
              Assalamu'alaikum,
            </Text>
            <Text style={[styles.studentName, typography.headlineMedium]}>
              {student?.name || 'Mahasiswa'}
            </Text>
          </View>
         <View style={styles.studentAvatar}>
            <Image
                source={require('../../assets/images/profil.png')}
                style={{
                width: 60,
                zIndex: 1,
                height: 60,
                borderRadius: 30,
                }}
            />
        </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, typography.bodySmall]}>
                NIM
              </Text>
              <Text style={[styles.infoValue, typography.titleSmall]}>
                {student?.id}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, typography.bodySmall]}>
                Semester
              </Text>
              <Text style={[styles.infoValue, typography.titleSmall]}>
                {student?.semester}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, typography.bodySmall]}>
                IPK
              </Text>
              <Text style={[styles.infoValue, typography.titleSmall]}>
                {student?.gpa}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Menu Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Menu Cepat
          </Text>
          
          <View style={styles.quickMenuGrid}>
            {MOCK_QUICK_MENU.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.quickMenuItem]}
                onPress={() => handleQuickMenuPress(item)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={28}
                  color={item.color}
                  style={styles.quickMenuIcon}
                />
                <Text
                  style={[styles.quickMenuLabel, typography.labelSmall]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enrolled Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, typography.titleLarge]}>
              Mata Kuliah Saya
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.COURSES)}
              activeOpacity={0.7}
            >
              <Text style={[styles.seeAll, typography.labelMedium]}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          {enrolledCourses.length > 0 ? (
            <FlatList
              data={enrolledCourses.slice(0, 3)}
              renderItem={({ item }) => (
                <CourseCard
                  course={item}
                  onPress={() => handleCoursePress(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={48}
                color={colors.outlineVariant}
              />
              <Text
                style={[styles.emptyStateText, typography.bodyMedium]}
              >
                Belum ada mata kuliah yang diambil
              </Text>
              <TouchableOpacity
                style={styles.emptyStateCTA}
                onPress={() => navigation.navigate(ROUTES.COURSES)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.emptyStateCTAText, typography.labelMedium]}
                >
                  Daftar Mata Kuliah
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Announcements Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Pengumuman
          </Text>
          <View style={styles.announcementCard}>
            <View style={styles.announcementBadge}>
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={colors.error}
              />
            </View>
            <View style={styles.announcementContent}>
              <Text style={[styles.announcementTitle, typography.titleSmall]}>
                Pendaftaran Mata Kuliah
              </Text>
              <Text
                style={[styles.announcementText, typography.bodySmall]}
                numberOfLines={2}
              >
                Pendaftaran mata kuliah semester depan dibuka mulai hari Senin
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.outline}
            />
          </View>
        </View>
      </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  studentName: {
    color: colors.onSurface,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 2,
  },
  infoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.onSurface,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.outlineVariant,
  },
  section: {
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.onSurface,
    fontWeight: '600',
    bottom: 4,
  },
  seeAll: {
    color: colors.primary,
  },
  quickMenuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickMenuItem: {
    width: (width - 40 - 12) / 2,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  quickMenuIcon: {
    marginBottom: 12,
  },
  quickMenuLabel: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  emptyStateText: {
    color: colors.onSurfaceVariant,
    marginTop: 12,
    marginBottom: 24,
  },
  emptyStateCTA: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  emptyStateCTAText: {
    color: colors.onPrimary,
  },
  announcementCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  announcementBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    color: colors.onSurface,
    marginBottom: 4,
  },
  announcementText: {
    color: colors.onSurfaceVariant,
  },
});

export default HomeScreen;