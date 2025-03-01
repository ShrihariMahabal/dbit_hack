import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
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
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';

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

// Function to create the pie chart paths
const createPieChartPath = (centerX, centerY, radius, startAngle, endAngle) => {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

// Carbon Savings Pie Chart Component
const CarbonSavingsPieChart = () => {
  // Carbon savings data
  const carbonData = [
    { category: 'Transport', percentage: 45, color: '#00b890' },
    { category: 'Shopping', percentage: 30, color: '#2a9d8f' },
    { category: 'Project Funding', percentage: 25, color: '#3a7ca5' }
  ];
  
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  
  let startAngle = 0;
  
  return (
    <View className="items-center justify-center my-4">
      <Text className="text-xl font-bold mb-4 text-[#e0e0e0] self-start">
        Carbon Savings Breakdown
      </Text>
      
      <Svg height="300" width="300">
        <Circle cx={centerX} cy={centerY} r={radius + 5} fill={COLORS.surface} />
        
        {/* Render pie slices */}
        {carbonData.map((item, index) => {
          const endAngle = startAngle + (item.percentage / 100) * 360;
          const pathData = createPieChartPath(centerX, centerY, radius, startAngle, endAngle);
          
          // Calculate position for the percentage label
          const midAngle = startAngle + (endAngle - startAngle) / 2;
          const midRad = (midAngle - 90) * Math.PI / 180;
          const labelRadius = radius * 0.65;
          const labelX = centerX + labelRadius * Math.cos(midRad);
          const labelY = centerY + labelRadius * Math.sin(midRad);
          
          // Save the end angle to use as the start angle for the next slice
          const currentStartAngle = startAngle;
          startAngle = endAngle;
          
          return (
            <G key={index}>
              <Path d={pathData} fill={item.color} />
              <SvgText
                x={labelX}
                y={labelY}
                fill="#ffffff"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {`${item.percentage}%`}
              </SvgText>
            </G>
          );
        })}
        
        {/* Center circle for donut effect */}
        <Circle cx={centerX} cy={centerY} r={radius * 0.4} fill={COLORS.surface} />
      </Svg>
      
      {/* Legend */}
      <View className="flex-row justify-around w-full mt-4">
        {carbonData.map((item, index) => (
          <View key={index} className="flex-row items-center">
            <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 6, marginRight: 6 }} />
            <Text className="text-[#e0e0e0] text-sm">{item.category}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

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
            <View className="h-12 w-12 rounded-full bg-white/15 border-2 border-white/20 items-center justify-center">
              <Text className="text-white text-lg font-semibold">IN</Text>
            </View>
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

          {/* Carbon Savings Breakdown Pie Chart (replacing Calendar Section) */}
          <CustomCard className="mb-6">
            <CarbonSavingsPieChart />
          </CustomCard>
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