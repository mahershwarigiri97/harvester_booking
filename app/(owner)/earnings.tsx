import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../utils/authStore';

const COLORS = {
  primary: '#0d631b',
  onPrimary: '#ffffff',
  onSurface: '#1a1c19',
  onSurfaceVariant: '#40493d',
  surfaceContainerLow: '#f4f4ef',
  surfaceContainerLowest: '#ffffff',
  secondaryContainer: '#ffddb5',
  onSecondaryContainer: '#694300',
};

const CHART_DATA: Record<string, any> = {
  Today: {
    total: '₹4,500',
    change: '8% vs yesterday',
    title: "Today's Hourly Overview",
    range: 'Oct 24, 2026',
    bars: [
      { label: '6 AM', h: '20%', active: false },
      { label: '9 AM', h: '45%', active: false },
      { label: '12 PM', h: '75%', active: false },
      { label: '3 PM', h: '95%', active: true },
      { label: '6 PM', h: '60%', active: false },
      { label: '9 PM', h: '30%', active: false },
    ],
    jobs: [
      { id: 101, name: 'Baljit Singh', date: 'Today', type: 'Wheat Harvesting', amount: '+₹4,500', status: 'Settled' },
    ]
  },
  Weekly: {
    total: '₹28,400',
    change: '12% from last month',
    title: 'Weekly Overview',
    range: 'Oct 18 - Oct 24',
    bars: [
      { label: 'Mon', h: '45%', active: false },
      { label: 'Tue', h: '65%', active: false },
      { label: 'Wed', h: '35%', active: false },
      { label: 'Thu', h: '85%', active: true },
      { label: 'Fri', h: '55%', active: false },
      { label: 'Sat', h: '75%', active: false },
      { label: 'Sun', h: '25%', active: false },
    ],
    jobs: [
      { id: 201, name: 'Baljit Singh', date: '24 Oct', type: 'Wheat Harvesting', amount: '+₹4,500', status: 'Settled' },
      { id: 202, name: 'Gurnam Sidhu', date: '23 Oct', type: 'Soil Prep', amount: '+₹2,800', status: 'Settled' },
      { id: 203, name: 'Rajesh Kumar', date: '22 Oct', type: 'Paddy Harvest', amount: '+₹8,200', status: 'Pending' },
    ]
  },
  Monthly: {
    total: '₹1,42,000',
    change: '15% vs last month',
    title: 'Monthly Overview',
    range: 'October 2026',
    bars: [
      { label: 'W1', h: '65%', active: false },
      { label: 'W2', h: '85%', active: false },
      { label: 'W3', h: '70%', active: false },
      { label: 'W4', h: '90%', active: true },
    ],
    jobs: [
      { id: 301, name: 'Sukhdev Sidhu', date: '20 Oct', type: 'Paddy Harvest', amount: '+₹12,400', status: 'Settled' },
      { id: 302, name: 'Aarav Gupta', date: '15 Oct', type: 'Soil Prep', amount: '+₹8,800', status: 'Settled' },
      { id: 303, name: 'Manpreet Gill', date: '10 Oct', type: 'Wheat Harvesting', amount: '+₹15,000', status: 'Settled' },
      { id: 304, name: 'Pritam Singh', date: '5 Oct', type: 'Potato Sowing', amount: '+₹7,200', status: 'Settled' },
    ]
  }
};

export default function EarningsDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Weekly');

  const { data: serverBookings, isLoading } = useQuery({
    queryKey: ['bookings', 'owner', 'earnings'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await authApi.getMyBookings(user.id, 'owner');
      return res.data.data || [];
    },
    enabled: !!user?.id,
  });

  const completedBookings = useMemo(() => {
    return (serverBookings || []).filter((b: any) => b.status === 'completed');
  }, [serverBookings]);

  const totalEarnings = useMemo(() => {
    return completedBookings.reduce((sum: number, b: any) => sum + (b.price || 0), 0);
  }, [completedBookings]);

  const recentJobs = useMemo(() => {
    return completedBookings.slice(0, 10).map((b: any) => ({
      id: b.id,
      name: b.customer_name || b.farmer?.name || 'Unknown Farmer',
      date: new Date(b.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      type: b.crop_type || 'Harvesting',
      amount: `+₹${b.price?.toLocaleString()}`,
      status: 'Settled',
    }));
  }, [completedBookings]);

  // For charts, we'll use limited mock data or simplify for now since we don't have deep history logic yet
  const data = useMemo(() => CHART_DATA[activeTab] || CHART_DATA.Weekly, [activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fafaf5" />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="menu" size={24} color={COLORS.primary} />
            <Text style={styles.headerTitle}>Earnings Dashboard</Text>
          </View>
          <View style={styles.profileCircle}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7dJZ5HeKKTOGfqrmlieN5H9M0GmzN64V-wnQSgZ8ZqWnW-UUYrugTKS-hfryBpjalLZYI5crwxepBhqmodYsZvM-5YYWCO6EPjc0R3pu65i7raW2rejoccqUsd8CrzvSCywNA_uxDDcgrb1UYAotb3vJrJCPKXnebjdoLEW5chtnYNyL7NSy05Tl7rEg4E2reMJkCZukB4v_eUk3mzEBuIPmtlZEXN65mFtbGu6Ovjzxtl1EuATCsjup-oyCzUN0XN5Bb_dQ8C0Hl' }}
              style={styles.fullImage}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 80, paddingBottom: 120, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total Earnings (Completed Jobs)</Text>
          <Text style={styles.heroAmount}>₹{totalEarnings.toLocaleString()}</Text>
          <View style={styles.tag}>
            <MaterialIcons name="check-circle" size={14} color={COLORS.primary} />
            <Text style={styles.tagText}>{completedBookings.length} Finished Projects</Text>
          </View>
        </View>

        {/* Tab Filter */}
        <View style={styles.tabContainer}>
          {['Today', 'Weekly', 'Monthly'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{data.title}</Text>
          <Text style={styles.sectionRange}>{data.range}</Text>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {data.bars.map((bar: any, idx: number) => (
              <View key={`${activeTab}-bar-${idx}`} style={styles.barItem}>
                <View 
                  style={[
                    styles.bar, 
                    { height: bar.h }, 
                    bar.active ? styles.barActive : styles.barInactive
                  ]} 
                />
                <Text style={[styles.barLabel, bar.active && { color: COLORS.primary }]}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Jobs List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <View style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
          </View>
        </View>

        <View style={{ gap: 12 }}>
          {recentJobs.length === 0 ? (
            <View className="items-center py-10">
              <MaterialIcons name="info-outline" size={32} color={COLORS.onSurfaceVariant} />
              <Text className="text-on-surface-variant mt-2 font-body">No completed jobs yet</Text>
            </View>
          ) : (
            recentJobs.map((job: any) => (
              <View key={`job-${job.id}`} style={styles.jobCard}>
                <View style={styles.jobLeft}>
                  <View style={[styles.jobIcon, styles.jobIconSettled]}>
                    <MaterialIcons name="agriculture" size={24} color={COLORS.onSecondaryContainer} />
                  </View>
                  <View>
                    <Text style={styles.jobName}>{job.name}</Text>
                    <Text style={styles.jobDetails}>{job.date} • {job.type}</Text>
                  </View>
                </View>
                <View style={styles.jobRight}>
                  <Text style={styles.jobAmount}>{job.amount}</Text>
                  <View style={[styles.statusBadge, styles.statusSettled]}>
                    <Text style={styles.statusText}>{job.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf5' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: '#fafaf5', borderBottomWidth: 1, borderColor: 'rgba(191, 202, 186, 0.4)' },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: COLORS.primary, letterSpacing: -0.5 },
  profileCircle: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#bfcaba' },
  fullImage: { width: '100%', height: '100%' },
  heroCard: { backgroundColor: '#ffffff', borderRadius: 32, padding: 32, alignItems: 'center', marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 24 },
  heroLabel: { color: COLORS.onSurfaceVariant, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  heroAmount: { fontSize: 48, fontWeight: '900', color: COLORS.onSurface, marginTop: 8, letterSpacing: -1 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(13, 99, 27, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100, marginTop: 16 },
  tagText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f4f4ef', borderRadius: 16, padding: 6, marginBottom: 24 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabButtonActive: { backgroundColor: '#ffffff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  tabText: { fontSize: 14, fontWeight: 'bold', color: COLORS.onSurfaceVariant },
  tabTextActive: { color: COLORS.primary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingHorizontal: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.onSurface },
  sectionRange: { fontSize: 12, fontWeight: '600', color: COLORS.onSurfaceVariant },
  chartCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 32, elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 24 },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingHorizontal: 12 },
  barItem: { flex: 1, alignItems: 'center', gap: 6 },
  bar: { width: 24, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  barActive: { 
    backgroundColor: '#0d631b', 
    shadowColor: '#0d631b', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 8 
  },
  barInactive: { backgroundColor: 'rgba(13, 99, 27, 0.08)' },
  barLabel: { fontSize: 11, fontWeight: '800', color: COLORS.onSurfaceVariant, marginTop: 4 },
  viewAll: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  jobCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#ffffff', borderRadius: 24, elevation: 1, shadowColor: '#000', shadowOpacity: 0.01, shadowRadius: 8 },
  jobLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  jobIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  jobIconSettled: { backgroundColor: '#ffddb5' },
  jobIconPending: { backgroundColor: '#e8e8e3' },
  jobName: { fontSize: 16, fontWeight: 'bold', color: COLORS.onSurface },
  jobDetails: { fontSize: 13, color: COLORS.onSurfaceVariant, fontWeight: '500' },
  jobRight: { alignItems: 'flex-end' },
  jobAmount: { fontSize: 18, fontWeight: '900', color: COLORS.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  statusSettled: { backgroundColor: '#f4f4ef' },
  statusPending: { backgroundColor: '#ffddb5' },
  statusText: { fontSize: 10, fontWeight: '900', color: COLORS.onSurfaceVariant, letterSpacing: 0.5 },
});
