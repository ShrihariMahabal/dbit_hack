import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Theme colors
const COLORS = {
  background: "#0a0f1a",
  surface: "#131d2a",
  primary: '#00b890',
  secondary: '#2a9d8f',
  tertiary: '#3a7ca5',
  text: '#e0e0e0',
  gray: {
    100: 'rgba(255, 255, 255, 0.08)',
    200: 'rgba(255, 255, 255, 0.12)',
    300: 'rgba(255, 255, 255, 0.16)',
  }
};

// Challenge Card Component
const ChallengeCard = ({ title, progress, total, icon, color }) => {
  const progressPercentage = (progress / total) * 100;
  
  return (
    <View className="bg-[#131d2a] rounded-2xl p-5 mb-4 border border-white/10 shadow-lg">
      <View className="flex-row items-center mb-3">
        <View className={`w-10 h-10 rounded-full mr-3 items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
          {icon}
        </View>
        <Text className="text-[#e0e0e0] text-lg font-medium flex-1">{title}</Text>
        <Text className="text-[#00b890] font-bold">{progress}/{total}</Text>
      </View>
      
      {/* Progress bar */}
      <View className="h-3 bg-white/10 rounded-full w-full overflow-hidden mt-2">
        <View 
          className="h-full rounded-full" 
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: color
          }}
        />
      </View>
    </View>
  );
};

// Leaderboard User Row Component
const LeaderboardRow = ({ rank, name, avatar, carbonSaved, isCurrentUser }) => {
  return (
    <View className={`flex-row items-center p-4 ${isCurrentUser ? 'bg-[#00b890]/10 rounded-xl' : ''}`}>
      <Text className="text-[#e0e0e0] font-bold text-lg w-8">{rank}</Text>
      
      <View className="w-10 h-10 rounded-full bg-gray-700 mr-3 items-center justify-center overflow-hidden">
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-full h-full" />
        ) : (
          <Text className="text-white font-bold">{name.charAt(0)}</Text>
        )}
      </View>
      
      <Text className="text-[#e0e0e0] flex-1 font-medium">{name}</Text>
      
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="leaf" size={16} color={COLORS.primary} />
        <Text className="text-[#e0e0e0] ml-1 font-bold">{carbonSaved} kg</Text>
      </View>
    </View>
  );
};

// Main Component
export default function ChallengesLeaderboard() {
  const [activeTab, setActiveTab] = useState('challenges');
  
  // Sample challenges data
  const challenges = [
    { 
      id: 1, 
      title: "Public Transport Trips", 
      progress: 3, 
      total: 5, 
      icon: <MaterialCommunityIcons name="bus" size={24} color={COLORS.primary} />,
      color: COLORS.primary
    },
    { 
      id: 2, 
      title: "Eco-friendly Products", 
      progress: 4, 
      total: 10, 
      icon: <MaterialCommunityIcons name="shopping-outline" size={24} color={COLORS.secondary} />,
      color: COLORS.secondary
    },
    { 
      id: 3, 
      title: "Renewable Energy Projects", 
      progress: 2, 
      total: 3, 
      icon: <MaterialCommunityIcons name="solar-power" size={24} color={COLORS.tertiary} />,
      color: COLORS.tertiary 
    },
    { 
      id: 4, 
      title: "Utility Savings", 
      progress: 45, 
      total: 100, 
      icon: <MaterialCommunityIcons name="lightning-bolt" size={24} color="#f59e0b" />,
      color: "#f59e0b"
    },
    { 
      id: 5, 
      title: "Daily Steps", 
      progress: 7500, 
      total: 10000, 
      icon: <FontAwesome5 name="walking" size={20} color="#3b82f6" />,
      color: "#3b82f6"
    },
  ];
  
  // Sample leaderboard data
  const leaderboard = [
    { id: 1, name: "Emma S.", rank: 1, carbonSaved: 342.8, avatar: null },
    { id: 2, name: "Mike T.", rank: 2, carbonSaved: 328.5, avatar: null },
    { id: 3, name: "Deep", rank: 3, carbonSaved: 314.2, avatar: null, isCurrentUser: true },
    { id: 4, name: "Sarah P.", rank: 4, carbonSaved: 295.1, avatar: null },
    { id: 5, name: "John D.", rank: 5, carbonSaved: 287.3, avatar: null },
    { id: 6, name: "Lisa K.", rank: 6, carbonSaved: 271.6, avatar: null },
    { id: 7, name: "Alex M.", rank: 7, carbonSaved: 258.9, avatar: null },
    { id: 8, name: "Priya S.", rank: 8, carbonSaved: 249.5, avatar: null },
    { id: 9, name: "Thomas R.", rank: 9, carbonSaved: 232.8, avatar: null },
    { id: 10, name: "Olivia L.", rank: 10, carbonSaved: 221.4, avatar: null },
  ];
  
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      
      <View className="px-5 py-4 mt-10">
        <Text className="text-2xl font-pbold text-[#e0e0e0] mb-6">Impact Dashboard</Text>
        
        {/* Tab Switcher */}
        <View className="flex-row bg-[#131d2a] p-1 rounded-full mb-6 border border-white/10">
          <TouchableOpacity
            className={`flex-1 py-2.5 px-4 rounded-full flex-row items-center justify-center ${activeTab === 'challenges' ? 'bg-[#00b890]' : ''}`}
            onPress={() => setActiveTab('challenges')}
          >
            <MaterialCommunityIcons name="trophy-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text className={`font-medium ${activeTab === 'challenges' ? 'text-white' : 'text-white/60'}`}>Challenges</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-2.5 px-4 rounded-full flex-row items-center justify-center ${activeTab === 'leaderboard' ? 'bg-[#00b890]' : ''}`}
            onPress={() => setActiveTab('leaderboard')}
          >
            <MaterialCommunityIcons name="podium" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text className={`font-medium ${activeTab === 'leaderboard' ? 'text-white' : 'text-white/60'}`}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Challenges Tab Content */}
      {activeTab === 'challenges' && (
        <ScrollView className="flex-1 px-5">
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#e0e0e0] text-lg font-semibold">Your Active Challenges</Text>
              <TouchableOpacity>
                <Text className="text-[#00b890]">See All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Challenge Summary Card */}
            <LinearGradient
              colors={['#00b890', '#00a583', '#008c73']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-5 rounded-2xl mb-6"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white/80 text-sm mb-1">This Month</Text>
                  <Text className="text-white text-2xl font-bold">57.4 kg</Text>
                  <Text className="text-white/80 mt-1">Carbon Saved</Text>
                </View>
                
                <View className="h-16 w-16 bg-white/20 rounded-full items-center justify-center">
                  <MaterialCommunityIcons name="leaf" size={30} color="#fff" />
                </View>
              </View>
              
              <View className="mt-4 pt-4 border-t border-white/20 flex-row justify-between">
                <View>
                  <Text className="text-white/80 text-xs">Progress</Text>
                  <Text className="text-white font-semibold mt-1">62%</Text>
                </View>
                
                <View>
                  <Text className="text-white/80 text-xs">Target</Text>
                  <Text className="text-white font-semibold mt-1">90 kg</Text>
                </View>
                
                <View>
                  <Text className="text-white/80 text-xs">Badges</Text>
                  <Text className="text-white font-semibold mt-1">3</Text>
                </View>
              </View>
            </LinearGradient>
            
            {/* Challenge Cards */}
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                title={challenge.title}
                progress={challenge.progress}
                total={challenge.total}
                icon={challenge.icon}
                color={challenge.color}
              />
            ))}
          </View>
        </ScrollView>
      )}
      
      {/* Leaderboard Tab Content */}
      {activeTab === 'leaderboard' && (
        <ScrollView className="flex-1">
          <View className="px-5 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#e0e0e0] text-lg font-semibold">Top Carbon Savers</Text>
              <TouchableOpacity>
                <Text className="text-[#00b890]">Monthly</Text>
              </TouchableOpacity>
            </View>
            
            {/* Top 3 Users */}
            <View className="flex-row justify-around py-6 mb-4">
              {/* 2nd Place */}
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-[#131d2a] border-2 border-[#C0C0C0] items-center justify-center">
                  <Text className="text-white font-bold text-lg">{leaderboard[1].name.charAt(0)}</Text>
                </View>
                <View className="items-center mt-2 bg-[#131d2a] px-3 py-1 rounded-lg">
                  <Text className="text-[#C0C0C0] text-xs font-medium">2nd Place</Text>
                  <Text className="text-white font-bold">{leaderboard[1].carbonSaved} kg</Text>
                </View>
              </View>
              
              {/* 1st Place */}
              <View className="items-center mb-4">
                <View className="w-20 h-20 rounded-full bg-[#131d2a] border-2 border-[#FFD700] items-center justify-center">
                  <Text className="text-white font-bold text-xl">{leaderboard[0].name.charAt(0)}</Text>
                </View>
                <View className="items-center mt-2 bg-[#131d2a] px-3 py-1 rounded-lg">
                  <Text className="text-[#FFD700] text-xs font-medium">1st Place</Text>
                  <Text className="text-white font-bold">{leaderboard[0].carbonSaved} kg</Text>
                </View>
              </View>
              
              {/* 3rd Place */}
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-[#131d2a] border-2 border-[#CD7F32] items-center justify-center">
                  <Text className="text-white font-bold text-lg">{leaderboard[2].name.charAt(0)}</Text>
                </View>
                <View className="items-center mt-2 bg-[#131d2a] px-3 py-1 rounded-lg">
                  <Text className="text-[#CD7F32] text-xs font-medium">3rd Place</Text>
                  <Text className="text-white font-bold">{leaderboard[2].carbonSaved} kg</Text>
                </View>
              </View>
            </View>
            
            {/* Leaderboard List */}
            <View className="bg-[#131d2a] rounded-2xl overflow-hidden border border-white/10">
              <View className="py-3 px-4 bg-black/20 flex-row">
                <Text className="text-white/60 font-medium w-8">#</Text>
                <Text className="text-white/60 font-medium flex-1">User</Text>
                <Text className="text-white/60 font-medium">Carbon Saved</Text>
              </View>
              
              {leaderboard.map(user => (
                <LeaderboardRow 
                  key={user.id} 
                  rank={user.rank} 
                  name={user.name} 
                  avatar={user.avatar} 
                  carbonSaved={user.carbonSaved} 
                  isCurrentUser={user.isCurrentUser}
                />
              ))}
            </View>
            
            {/* Your Ranking Card */}
            <View className="bg-[#131d2a] p-4 rounded-2xl mt-6 border border-white/10">
              <Text className="text-white/60 font-medium mb-3">Your Position</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-[#00b890]/20 mr-3 items-center justify-center">
                    <Text className="text-[#00b890] font-bold text-xl">3</Text>
                  </View>
                  <View>
                    <Text className="text-white font-semibold">Top 5%</Text>
                    <Text className="text-white/60 text-sm">of all users</Text>
                  </View>
                </View>
                
                <TouchableOpacity className="bg-[#00b890] px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}