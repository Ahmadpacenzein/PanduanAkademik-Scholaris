import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import courseService from '../services/courseService';
import { ROUTES } from '../constants/routes';
import { useAppTheme } from '../theme/ThemeContext';

const AddCourseScreen = ({ route, navigation }) => {
  useAppTheme();
  const styles = createStyles();
  const isEditMode = route.params?.course ? true : false;
  const existingCourse = route.params?.course || null;

  const [formData, setFormData] = useState({
    name: existingCourse?.name || '',
    code: existingCourse?.code || '',
    credits: existingCourse?.credits?.toString() || '3',
    lecturer: existingCourse?.lecturer || '',
    lecturerEmail: existingCourse?.lecturerEmail || '',
    lecturerPhone: existingCourse?.lecturerPhone || '',
    description: existingCourse?.description || '',
    syllabus: existingCourse?.syllabus?.join('\n') || '',
    schedule: existingCourse?.schedule || '',
    room: existingCourse?.room || '',
    capacity: existingCourse?.capacity?.toString() || '30',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama mata kuliah harus diisi';
    if (!formData.code.trim()) newErrors.code = 'Kode mata kuliah harus diisi';
    if (!formData.credits || isNaN(formData.credits) || parseInt(formData.credits) < 1)
      newErrors.credits = 'SKS harus berupa angka positif';
    if (!formData.lecturer.trim()) newErrors.lecturer = 'Nama dosen harus diisi';
    if (!formData.lecturerEmail.trim()) newErrors.lecturerEmail = 'Email dosen harus diisi';
    if (!formData.lecturerPhone.trim()) newErrors.lecturerPhone = 'Telepon dosen harus diisi';
    if (!formData.description.trim()) newErrors.description = 'Deskripsi harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validasi Gagal', 'Harap lengkapi semua field yang wajib');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        credits: parseInt(formData.credits),
        capacity: parseInt(formData.capacity),
        syllabus: formData.syllabus
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        await courseService.updateCourse(existingCourse.id, submitData);
        Alert.alert('Berhasil', 'Mata kuliah berhasil diupdate', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        await courseService.addCourse(submitData);
        Alert.alert('Berhasil', 'Mata kuliah berhasil ditambahkan', [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.COURSES }),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Gagal', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const renderInput = (label, field, placeholder, multiline = false, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, typography.labelMedium]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          typography.bodyMedium,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
      />
      {errors[field] && (
        <Text style={[styles.errorText, typography.bodySmall]}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name={isEditMode ? 'pencil' : 'plus'}
            size={40}
            color={colors.primary}
            style={styles.headerIcon}
          />
          <Text style={[styles.title, typography.headlineMedium]}>
            {isEditMode ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
          </Text>
          <Text style={[styles.subtitle, typography.bodyMedium]}>
            {isEditMode
              ? 'Update informasi mata kuliah'
              : 'Tambahkan mata kuliah baru ke sistem'}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Informasi Mata Kuliah
          </Text>

          {renderInput('Nama Mata Kuliah', 'name', 'Masukkan nama mata kuliah')}
          {renderInput('Kode Mata Kuliah', 'code', 'Contoh: IF401')}

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('SKS', 'credits', '3', false, 'numeric')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('Kapasitas', 'capacity', '30', false, 'numeric')}
            </View>
          </View>

          {renderInput('Deskripsi', 'description', 'Masukkan deskripsi mata kuliah...', true)}
          {renderInput('Materi Pembelajaran', 'syllabus', 'Tulis satu materi per baris (Opsional)', true)}
        </View>

        {/* Schedule Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Jadwal & Lokasi
          </Text>

          {renderInput('Jadwal', 'schedule', 'Contoh: Senin 13:00 - 14:40 (Opsional)')}
          {renderInput('Ruangan', 'room', 'Contoh: 3C.2.08 Gedung C (Opsional)')}
        </View>

        {/* Lecturer Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Informasi Dosen
          </Text>

          {renderInput('Nama Dosen', 'lecturer', 'Masukkan nama dosen')}
          {renderInput('Email Dosen', 'lecturerEmail', 'Masukkan email dosen', false, 'email-address')}
          {renderInput('Telepon Dosen', 'lecturerPhone', 'Masukkan nomor telepon', false, 'phone-pad')}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, typography.labelMedium, { color: colors.primary }]}>
            Batal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.7}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text style={[styles.buttonText, typography.labelMedium]}>
              {isEditMode ? 'Update' : 'Tambahkan'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    color: colors.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.onSurface,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.onSurface,
  },
  multilineInput: {
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  bottomSpacer: {
    height: 96,
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
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  buttonText: {
    color: colors.onPrimary,
  },
});

export default AddCourseScreen;
