// src/screens/CourseListScreen.js
// List semua mata kuliah dengan RecyclerView equivalent (FlatList)

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import  courseService  from '../services/courseService';
import storageManager from '../utils/storageManager';
import CourseCard from '../components/CourseCard';
import { ROUTES } from '../constants/routes';

const CourseListScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, enrolled, available

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, filterType]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadCourses();
    } finally {
      setRefreshing(false);
    }
  };

  const filterCourses = async () => {
    let result = [...courses];

    // Filter by type
    if (filterType === 'enrolled') {
      result = result.filter((c) => c.isEnrolled);
    } else if (filterType === 'available') {
      result = result.filter((c) => !c.isEnrolled && c.status === 'open');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.lecturer.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(result);
  };

  const handleCoursePress = (course) => {
    navigation.navigate(ROUTES.COURSE_DETAIL, { course });
  };

  const renderCourseCard = ({ item }) => (
    <CourseCard course={item} onPress={() => handleCoursePress(item)} />
  );

  const renderFilterButton = (type, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === type && styles.filterButtonActive,
      ]}
      onPress={() => setFilterType(type)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          typography.labelSmall,
          filterType === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.pageTitle, typography.headlineMedium]}>
              Mata Kuliah
            </Text>
            <Text style={[styles.pageSubtitle, typography.bodyMedium]}>
              Temukan dan daftar mata kuliah yang Anda inginkan
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(ROUTES.ADD_COURSE)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={colors.onPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={colors.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, typography.bodyMedium]}
          placeholder="Cari mata kuliah atau dosen..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterSection}>
        {renderFilterButton('all', 'Semua')}
        {renderFilterButton('enrolled', 'Diambil')}
        {renderFilterButton('available', 'Tersedia')}
      </View>

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="book-search"
            size={64}
            color={colors.outlineVariant}
          />
          <Text style={[styles.emptyStateTitle, typography.headlineSmall]}>
            Tidak ada mata kuliah
          </Text>
          <Text style={[styles.emptyStateText, typography.bodyMedium]}>
            {searchQuery
              ? 'Coba dengan kata kunci berbeda'
              : 'Tidak ada mata kuliah yang sesuai dengan filter'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    color: colors.onSurface,
    marginBottom: 4,
  },
  pageSubtitle: {
    color: colors.onSurfaceVariant,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginHorizontal: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.onSurface,
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.onSurfaceVariant,
  },
  filterButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default CourseListScreen;