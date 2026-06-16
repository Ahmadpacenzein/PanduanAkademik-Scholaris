// src/screens/SettingsScreen.js
// Pengaturan aplikasi dengan AsyncStorage

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import storageManager from '../utils/storageManager';
import { useAppTheme } from '../theme/ThemeContext';

const SettingsScreen = () => {
  const { setDarkMode } = useAppTheme();
  const styles = createStyles();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const storedSettings = await storageManager.getSettings();
      setSettings(storedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates) => {
    const nextSettings = { ...settings, ...updates };
    setSettings(nextSettings);
    setSaving(true);

    try {
      const savedSettings = await storageManager.saveSettings(updates);
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const updateDarkMode = async (value) => {
    const nextSettings = { ...settings, darkMode: value };
    setSettings(nextSettings);
    setSaving(true);

    try {
      await setDarkMode(value);
    } catch (error) {
      console.error('Error saving dark mode:', error);
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const renderSwitchRow = (icon, title, subtitle, value, onValueChange) => (
    <View style={styles.settingRow}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={colors.primary}
        style={styles.settingIcon}
      />
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, typography.bodyMedium]}>
          {title}
        </Text>
        <Text style={[styles.settingSubtitle, typography.bodySmall]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={saving}
        trackColor={{
          false: colors.surfaceContainerHighest,
          true: colors.primaryContainer,
        }}
        thumbColor={value ? colors.primary : colors.outline}
      />
    </View>
  );

  const renderLanguageButton = (language, label) => {
    const isActive = settings?.language === language;

    return (
      <TouchableOpacity
        style={[
          styles.languageButton,
          isActive && styles.languageButtonActive,
        ]}
        onPress={() => updateSettings({ language })}
        disabled={saving}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.languageButtonText,
            typography.labelMedium,
            isActive && styles.languageButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="cog"
            size={40}
            color={colors.primary}
            style={styles.headerIcon}
          />
          <Text style={[styles.title, typography.headlineMedium]}>
            Pengaturan
          </Text>
          <Text style={[styles.subtitle, typography.bodyMedium]}>
            Kelola preferensi aplikasi
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Preferensi
          </Text>
          <View style={styles.sectionContent}>
            {renderSwitchRow(
              'bell',
              'Notifikasi',
              'Terima informasi akademik terbaru',
              settings.notifications,
              (value) => updateSettings({ notifications: value })
            )}
            {renderSwitchRow(
              'theme-light-dark',
              'Mode Gelap',
              'Ubah warna aplikasi',
              settings.darkMode,
              updateDarkMode
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, typography.titleLarge]}>
            Bahasa
          </Text>
          <View style={styles.languageContainer}>
            {renderLanguageButton('id', 'Indonesia')}
            {renderLanguageButton('en', 'English')}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="database-check"
              size={28}
              color={colors.success}
              style={styles.infoIcon}
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, typography.bodyMedium]}>
                Penyimpanan Aktif
              </Text>
              <Text style={[styles.settingSubtitle, typography.bodySmall]}>
                Profil, mata kuliah, dan pengaturan tersimpan di perangkat.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: colors.outlineVariant,
    borderBottomWidth: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: colors.onSurface,
    marginBottom: 4,
  },
  settingSubtitle: {
    color: colors.onSurfaceVariant,
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  languageButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.onPrimaryContainer,
  },
  languageButtonText: {
    color: colors.onSurfaceVariant,
  },
  languageButtonTextActive: {
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  infoIcon: {
    marginRight: 12,
  },
});

export default SettingsScreen;
