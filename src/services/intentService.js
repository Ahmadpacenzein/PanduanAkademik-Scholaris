// src/services/intentService.js
// Service untuk handle implicit intents

import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import { Platform, Share, Alert } from 'react-native';

/**
 * Buka aplikasi telepon untuk menghubungi dosen
 * @param {string} phoneNumber - Nomor telepon dosen
 * @param {string} dosenName - Nama dosen (untuk log)
 */
export const callDosen = async (phoneNumber, dosenName) => {
  try {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(`tel:${phoneNumber}`);
    
  } catch (error) {
    Alert.alert('Error', `Tidak dapat membuka aplikasi telepon untuk ${dosenName}`);
    console.error('Call intent error:', error);
  }
};

/**
 * Buka WhatsApp untuk menghubungi dosen
 * @param {string} phoneNumber - Nomor WhatsApp dosen (format: 62812345678)
 * @param {string} message - Pesan default
 * @param {string} dosenName - Nama dosen
 */
export const whatsappDosen = async (phoneNumber, message = '', dosenName = 'Dosen') => {
  try {
    // Format nomor untuk WhatsApp (remove 0 at start, add 62)
    let formattedNumber = phoneNumber.replace(/^0/, '62');
    
    const text = message ? `Hello ${dosenName}, ${message}` : `Hello ${dosenName}`;
    const encodedMessage = encodeURIComponent(text);
    
    const url = Platform.OS === 'android'
      ? `whatsapp://send?phone=${formattedNumber}&text=${encodedMessage}`
      : `whatsapp://wa.me/${formattedNumber}?text=${encodedMessage}`;

    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      'WhatsApp tidak tersedia',
      'Pastikan WhatsApp sudah terinstall di device Anda',
      [{ text: 'OK' }]
    );
    console.error('WhatsApp intent error:', error);
  }
};

/**
 * Buka Google Maps untuk menampilkan lokasi kampus
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {string} label - Label lokasi
 */
export const openGoogleMaps = async (latitude, longitude, label = 'Campus Location') => {
  try {
    const url = Platform.OS === 'android'
      ? `geo:${latitude},${longitude}?q=${label}`
      : `maps://maps.google.com/maps?daddr=${latitude},${longitude}&label=${label}`;

    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback ke web maps
      const webUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat membuka Google Maps');
    console.error('Maps intent error:', error);
  }
};

/**
 * Kirim email
 * @param {string} email - Email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
export const sendEmail = async (email, subject = '', body = '') => {
  try {
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Tidak ada aplikasi email yang tersedia');
    }
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat membuka aplikasi email');
    console.error('Email intent error:', error);
  }
};

/**
 * Share mata kuliah ke social media
 * @param {string} courseName - Nama mata kuliah
 * @param {string} courseCode - Kode mata kuliah
 * @param {string} lecturer - Nama dosen
 */
export const shareCourseToBrowser = async (courseName, courseCode, lecturer) => {
  try {
    const message = `Saya sedang mengambil mata kuliah "${courseName}" (${courseCode}) dengan ${lecturer}. Aplikasi Scholaris - Panduan Akademik Mahasiswa.`;
    
    await Share.share({
      message: message,
      title: `Bagikan: ${courseName}`,
      url: 'https://play.google.com/store/apps/details?id=com.scholaris.app', // Play Store link (example)
    });
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat share mata kuliah');
    console.error('Share error:', error);
  }
};

/**
 * Browse ke website tertentu
 * @param {string} url - URL untuk dibuka
 */
export const openBrowser = async (url) => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Tidak dapat membuka URL ini');
    }
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat membuka browser');
    console.error('Browser intent error:', error);
  }
};

/**
 * Copy teks ke clipboard
 * @param {string} text - Teks untuk dicopy
 */
export const copyToClipboard = async (text) => {
  try {
    if (Platform.OS === 'web') {
      // Tidak didukung di web, gunakan workaround
      navigator.clipboard.writeText(text);
    } else {
      // Di React Native, gunakan Clipboard dari react-native
      const Clipboard = require('react-native').Clipboard;
      await Clipboard.setString(text);
    }
    Alert.alert('Berhasil', 'Teks telah dicopy ke clipboard');
  } catch (error) {
    console.error('Clipboard error:', error);
  }
};

export default {
  callDosen,
  whatsappDosen,
  openGoogleMaps,
  sendEmail,
  shareCourseToBrowser,
  openBrowser,
  copyToClipboard,
};