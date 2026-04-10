import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../utils/authStore';

const COLORS = {
  primary: '#0d631b',
  primaryContainer: '#2e7d32',
  onPrimary: '#ffffff',
  secondaryColor: '#835400',
  secondaryContainer: '#fcab28',
  onSecondaryContainer: '#694300',
  surface: '#fafaf5',
  onSurface: '#1a1c19',
  onSurfaceVariant: '#40493d',
  surfaceContainerLow: '#f4f4ef',
  surfaceContainerLowest: '#ffffff',
  outlineVariant: '#bfcaba',
  error: '#ba1a1a',
  onPrimaryContainer: '#cbffc2',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.surface} />
      
      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('common.profile')}</Text>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingTop: insets.top + 80, 
          paddingBottom: 120,
          paddingHorizontal: 16
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlIRuYPtXS40CMsc5TbNYj3JimeY_wqIq9tgqM_7ojEimPIRWOt1tkPOBZx71lTX_rFKMlbwjDnN8OiXeQXzmbzUD4usniBiE9etVKGq7zjTLIhQ2U8bxnEJ721UP-UhPSkfwSjpMtsxeU9cPhlvQv6Lo5vNMlFHqmQzQbvBGFdSs5eLDxRgqBBAxNyZXCOe1FXMpq1PKqMqmxSdXrn-rLUAi8HEA9YExtAgwHlhmNA7xNdIOBJIxqf4lI6OcSdpQJl644OYt9gk-X' }} 
                style={styles.avatar}
              />
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={16} color={COLORS.onSecondaryContainer} />
            </View>
          </View>
          
          <View style={styles.profileInfoText}>
            <Text style={styles.userName}>{user?.name || t('role.ownerTitle')}</Text>
            <View style={styles.ratingLocationRow}>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={18} color={COLORS.primary} />
                <Text style={styles.ratingText}>{user?.rating || '0.0'}</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoContent}>
            <View style={styles.phoneGroup}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>+91 {user?.phone || ''}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={COLORS.onSecondaryContainer} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Action */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={async () => {
              await useAuthStore.getState().clearAuth();
              router.replace('/login');
            }}
          >
            <MaterialIcons name="logout" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>App Version 2.4.0 • Made for the Indian Heartland</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(250, 250, 245, 0.8)',
    borderBottomWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
  },
  backButton: {
    padding: 8,
    borderRadius: 100,
  },
  headerTitle: {
    marginLeft: 16,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 24,
    paddingTop: 24,
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBorder: {
    width: 128,
    height: 128,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.surfaceContainerLowest,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.secondaryContainer,
    padding: 8,
    borderRadius: 100,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  profileInfoText: {
    flex: 1,
    paddingBottom: 8,
  },
  userName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.onSurface,
    letterSpacing: -0.5,
  },
  ratingLocationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 99, 27, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  languageButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  languageButtonText: {
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  languageButtonTextActive: {
    color: '#ffffff',
  },
  infoSection: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
  },
  infoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  phoneGroup: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  editButtonText: {
    color: COLORS.onSecondaryContainer,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logoutSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    opacity: 0.5,
    marginTop: 16,
    fontWeight: '500',
  },
});
