import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
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
          <Text style={styles.headerTitle}>Profile</Text>
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
            <Text style={styles.userName}>{user?.name || 'Owner'}</Text>
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
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Details Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bank Details</Text>
        </View>
        
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bankCard}
        >
          {/* Decorative Circle */}
          <View style={styles.bankCardDecorator} />
          
          <View style={styles.bankCardContent}>
            <View style={styles.bankFields}>
              <View style={styles.bankField}>
                <Text style={styles.bankLabel}>Bank Name</Text>
                <Text style={styles.bankValue}>State Bank of India</Text>
              </View>
              <View style={styles.bankField}>
                <Text style={styles.bankLabel}>Account Number</Text>
                <Text style={styles.bankValueMono}>•••• •••• •••• 1234</Text>
              </View>
              <View style={styles.bankField}>
                <Text style={styles.bankLabel}>IFSC Code</Text>
                <Text style={styles.bankValueSemi}>SBIN0001234</Text>
              </View>
            </View>
            <MaterialIcons name="account-balance" size={40} color="rgba(255,255,255,0.4)" />
          </View>
        </LinearGradient>

        {/* Home Address Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Home Address</Text>
        </View>
        
        <View style={styles.addressCard}>
          <View style={styles.addressIconWrapper}>
            <MaterialIcons name="home-filled" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.addressTextContent}>
            <Text style={styles.addressText}>
              {user?.address?.village ? `${user.address.village}, ` : ''}
              {user?.address?.street_address ? `${user.address.street_address}, ` : ''}
              {user?.address?.district || ''}{'\n'}
              {user?.address?.state || ''} {user?.address?.pincode ? `- ${user.address.pincode}` : ''}
            </Text>
            <Text style={styles.verifiedTag}>Verified Profile</Text>
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
            <Text style={styles.logoutText}>Logout from Account</Text>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
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
  bankCard: {
    borderRadius: 32,
    padding: 32,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  bankCardDecorator: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bankCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  bankFields: {
    gap: 24,
  },
  bankField: {
    gap: 4,
  },
  bankLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bankValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bankValueMono: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -1,
  },
  bankValueSemi: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.3)',
    gap: 16,
    marginBottom: 32,
  },
  addressIconWrapper: {
    backgroundColor: 'rgba(13, 99, 27, 0.1)',
    padding: 12,
    borderRadius: 16,
  },
  addressTextContent: {
    flex: 1,
    gap: 4,
  },
  addressText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.onSurface,
    lineHeight: 28,
  },
  verifiedTag: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
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
