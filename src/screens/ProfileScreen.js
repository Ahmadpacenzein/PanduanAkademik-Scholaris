// src/screens/ProfileScreen.js
// Profil mahasiswa dengan contact dan location intents

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
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
import  studentService  from '../services/studentService';
import storageManager from '../utils/storageManager';
import * as intentService from '../services/intentService';

const ProfileScreen = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await studentService.getStudentProfile();
      setStudent(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallStudent = () => {
    if (student?.phone) {
      intentService.callDosen(student.phone, student.name);
    }
  };

  const handleEmailStudent = () => {
    if (student?.email) {
      intentService.sendEmail(
        student.email,
        'Pesan untuk ' + student.name,
        ''
      );
    }
  };

  const handleWhatsappStudent = () => {
    if (student?.phone) {
      intentService.whatsappDosen(student.phone, '', student.name);
    }
  };

  const handleOpenCampusLocation = () => {
    if (student?.campus_location) {
      const { latitude, longitude, name } = student.campus_location;
      intentService.openGoogleMaps(latitude, longitude, name);
    }
  };

  const renderProfileSection = (title, content) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, typography.titleLarge]}>
        {title}
      </Text>
      <View style={styles.sectionContent}>
        {content}
      </View>
    </View>
  );

  const renderInfoRow = (label, value, icon = null, onPress = null) => (
    <TouchableOpacity
      style={[styles.infoRow, onPress && styles.infoRowTouchable]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={colors.primary}
          style={styles.infoIcon}
        />
      )}
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, typography.bodySmall]}>
          {label}
        </Text>
        <Text
          style={[styles.infoValue, typography.bodyMedium]}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
      {onPress && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.outline}
        />
      )}
    </TouchableOpacity>
  );

  const renderContactButton = (icon, label, onPress) => (
    <TouchableOpacity
      style={styles.contactButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={colors.primary}
        style={styles.contactButtonIcon}
      />
      <Text style={[styles.contactButtonText, typography.labelSmall]}>
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

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.errorText, typography.bodyMedium]}>
          Gagal memuat profil
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
                source={require('../../assets/images/profil.jpg')}
                style={{
                width: 60,
                zIndex: 1,
                height: 60,
                borderRadius: 30,
                }}
            />
          </View>
          <Text style={[styles.studentName, typography.headlineSmall]}>
            {student.name}
          </Text>
          <Text style={[styles.studentId, typography.bodyMedium]}>
            {student.id}
          </Text>
        </View>

        {/* Academic Information */}
        {renderProfileSection(
          'Informasi Akademik',
          <>
            {renderInfoRow('Program Studi', student.major)}
            {renderInfoRow('Semester', student.semester.toString())}
            {renderInfoRow('IPK', student.gpa.toString())}
            {renderInfoRow('Fakultas', student.faculty)}
          </>
        )}

        {/* Contact Information */}
        {renderProfileSection(
          'Informasi Kontak',
          <>
            {renderInfoRow(
              'Email',
              student.email,
              'email',
              () => handleEmailStudent()
            )}
            {renderInfoRow(
              'Telepon',
              student.phone,
              'phone',
              () => handleCallStudent()
            )}
          </>
        )}

        {/* Contact Actions */}
        {/* {renderProfileSection(
          'Hubungi',
          <View style={styles.contactButtonsRow}>
            {renderContactButton('phone', 'Telepon', handleCallStudent)}
            {renderContactButton('whatsapp', 'WhatsApp', handleWhatsappStudent)}
            {renderContactButton('email', 'Email', handleEmailStudent)}
          </View>
        )} */}

        {/* Campus Information */}
        {student.campus_location && renderProfileSection(
          'Informasi Kampus',
          <>
            {renderInfoRow('Universitas', student.university)}
            {renderInfoRow(
              'Lokasi Kampus',
              student.campus_location.name,
              'map-marker',
              () => handleOpenCampusLocation()
            )}
            {renderInfoRow('Alamat', student.campus_location.address)}
          </>
        )}

        {/* Campus Location Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={handleOpenCampusLocation}
            activeOpacity={0.7}
          >
            
            <Text style={[styles.mapButtonText, typography.labelMedium]}>
              <MaterialCommunityIcons
              name="map"
              size={15}
              color={colors.onPrimary}
              style={styles.mapButtonIcon}
              padding={2}
            />
              Buka di Google Maps
            </Text>
            
          </TouchableOpacity>
        </View>

        {/* University Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Tentang Universitas
          </Text>
          <View style={styles.universityCard}>
            <MaterialCommunityIcons
              name="school"
              size={48}
              color={colors.primary}
              style={styles.universityIcon}
            />
            <Text
              style={[styles.universityName, typography.headlineSmall]}
            >
              {student.university}
            </Text>
            <Text style={[styles.universityDescription, typography.bodySmall]}>
              Membentuk generasi pemimpin Indonesia yang berkarakter dan berprestasi
            </Text>
          </View>
        </View>

        {/* Additional Settings */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingsItem}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.settingsLabel, typography.bodyMedium]}>
              Notifikasi
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.outline}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsItem}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.settingsLabel, typography.bodyMedium]}>
              Pengaturan
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.outline}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingsItem, styles.lastSettingsItem]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.settingsLabel, typography.bodyMedium]}>
              Tentang Aplikasi
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.outline}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    opacity: 0.15,
  },
  studentName: {
    color: colors.onSurface,
    marginBottom: 4,
  },
  studentId: {
    color: colors.onSurfaceVariant,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.onSurface,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: colors.outlineVariant,
    borderBottomWidth: 1,
  },
  infoRowTouchable: {
    paddingRight: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.onSurface,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  mapButtonIcon: {
    marginRight: 8,
  },
  mapButtonText: {
    color: colors.onPrimary,
    flex: 1,
    textAlign: 'center',
  },
  universityCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  universityIcon: {
    marginBottom: 12,
  },
  universityName: {
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  universityDescription: {
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: colors.outlineVariant,
    borderBottomWidth: 1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  lastSettingsItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  settingsLabel: {
    color: colors.onSurface,
    flex: 1,
    marginLeft: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ProfileScreen;