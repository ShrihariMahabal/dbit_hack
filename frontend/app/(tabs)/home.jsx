import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import LineChartComponent from '@/components/LineChart';
import ProjectCarousel from '@/components/ProjectCarousel';
import { router } from 'expo-router';

// Updated color scheme
const COLORS = {
  background: "#0a0f1a",
  surface: "#131d2a",
  primary: '#00d1b2',
  text: '#e0e0e0',
  gray: {
    100: 'rgba(255, 255, 255, 0.08)',
    200: 'rgba(255, 255, 255, 0.12)',
    300: 'rgba(255, 255, 255, 0.16)',
  }
};

const CustomCard = ({ children, className = '' }) => (
  <View className={`bg-[${COLORS.surface}] rounded-3xl shadow-lg p-5 border border-[${COLORS.gray[100]}] ${className}`}>
    {children}
  </View>
);

export default function Home() {
  const WEBHOOK_URL = 'https://piyanshu.app.n8n.cloud/webhook/7e474783-7445-43b6-a753-c9ce141e082c';
  const scrollY = useSharedValue(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleConfirm = async () => {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
      });

      Alert.alert('Success', `Event added for ${selectedDate}`);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add event');
    }
  };

  const busyDates = {
    '2025-02-10': { selected: true, selectedColor: "#064e3b" },
    '2025-02-15': { selected: true, selectedColor: "#064e3b" },
  };

  const portfolioStats = {
    totalInvested: 250000,
    totalReturns: 45000,
    carbonOffset: 34.5,
    projectCount: 12
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1 mt-4"
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#00d1b2', '#00b890', '#009b76', COLORS.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.3, 0.6, 1]}
          className="px-5 pt-8 pb-12"
        >
          {/* Profile Section */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white/80 text-xl font-pmedium tracking-wide mt-6">Welcome Back!</Text>
              <Text className="text-white text-2xl font-pbold tracking-wide mt-1">Deep</Text>
            </View>
            <TouchableHighlight 
              onPress={() => router.push('../userpage')}
              className="h-12 w-12 rounded-full bg-white/15 border-2 border-white/20 items-center justify-center">
              <Text className="text-white text-lg font-semibold">IN</Text>
            </TouchableHighlight>
          </View>

          {/* Stats Cards */}
          <View className="space-y-4">
            {/* Second Card */}
            <View className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-[#00d1b2] bg-opacity-20 mr-3 items-center justify-center">
                    <Text className="text-[#00d1b2] text-xl">🌱</Text>
                  </View>
                  <View>
                    <Text className="text-white/60 text-sm font-psemibold">Carbon Offset</Text>
                    <Text className="text-white text-xl font-bold mt-1">
                      {portfolioStats.carbonOffset}kg
                    </Text>
                  </View>
                </View>
                <View className="bg-[#00d1b2]/20 px-3 py-1 rounded-full">
                  <Text className="text-[#00d1b2] font-medium">+12.3%</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="px-5">
          {/* Stats Section */}
          <View className="mt-4 mb-2">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-[#e0e0e0]">
                Your Stats
              </Text>
              <Text className="text-sm text-[#00d1b2]">
                View All
              </Text>
            </View>
            <View className="flex-1 overflow-visible">
              <ProjectCarousel />
            </View>
          </View>

          {/* Carbon Impact */}
          <CustomCard className="mb-6 mt-4">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white/60 text-sm mb-1">Total Impact</Text>
                <Text className="text-lg font-bold text-white">Carbon Impact</Text>
              </View>
              <View className="bg-[#00d1b2]/20 px-3 py-1 rounded-full">
                <Text className="text-[#00d1b2] font-medium">+12.5%</Text>
              </View>
            </View>

            {/* Chart Container */}
            <View className="w-full overflow-hidden">
              <LineChartComponent className="w-full" />
            </View>
          </CustomCard>

          {/* Calendar Section */}
          <View className="mt-6 mb-4">
            <Text className="text-xl font-bold mb-4 text-[#e0e0e0]">
              Upcoming Meetings
            </Text>
            <Calendar
              theme={{
                backgroundColor: COLORS.surface,
                calendarBackground: COLORS.surface,
                textSectionTitleColor: 'rgba(255,255,255,0.6)',
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.text,
                arrowColor: COLORS.primary,
                monthTextColor: COLORS.text,
                textDisabledColor: 'rgba(255,255,255,0.2)',
              }}
              markedDates={busyDates}
            />
          </View>

          {/* Add Event Button */}
          <TouchableOpacity
            className="bg-[#00d1b2] p-3 rounded-lg mb-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-center font-bold">Add Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Event Popup Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#131d2a] p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-2 text-white">Select Event Date</Text>

            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                ...busyDates,
                [selectedDate]: { selected: true, selectedColor: COLORS.primary },
              }}
              theme={{
                backgroundColor: COLORS.surface,
                calendarBackground: COLORS.surface,
                textSectionTitleColor: 'rgba(255,255,255,0.6)',
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.text,
                arrowColor: COLORS.primary,
                monthTextColor: COLORS.text,
                textDisabledColor: 'rgba(255,255,255,0.2)',
              }}
            />

            {/* Confirmation Buttons */}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#00d1b2] px-4 py-2 rounded-lg"
                onPress={handleConfirm}
                disabled={!selectedDate}
              >
                <Text className="text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}