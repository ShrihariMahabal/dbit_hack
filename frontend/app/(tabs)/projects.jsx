import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";

// Mock data remains unchanged
const dummyData = [
  {
    _id: "650f94bfc7e89f001d1e4e5a",
    name: "Solar Grid for Green Town",
    description: "A community-driven solar power project for Green Town.",
    targetAmount: 50000,
    raisedAmount: 32000,
    location: "Green Town, India",
    impactMetrics: {
      carbonReduction: "100 tons/year",
      householdsBenefited: 150,
      roi: "12%",
      trustScore: "8.5/10",
    },
    investors: ["Priya", "Rahul", "Anita", "+154 others"],
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9I5m26BeOtJX4wwWXvp0bD0go3kmRDx6RLQ&s",
    daysLeft: 15,
  },
  {
    _id: "650f94bfc7e89f001d1e4e5b",
    name: "Wind Energy Project",
    description: "A sustainable wind energy initiative.",
    targetAmount: 75000,
    raisedAmount: 50000,
    location: "Blue City, India",
    impactMetrics: {
      carbonReduction: "150 tons/year",
      householdsBenefited: 200,
      roi: "10%",
      trustScore: "9/10",
    },
    investors: ["Amit", "Neha", "Karan", "+230 others"],
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTK-W-QAu_Gpf7GW7m21q8wSPUMATtrlzw_w&s",
    daysLeft: 20,
  },
];

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusBarHeight = StatusBar.currentHeight || 20;

  const theme = {
    background: "#0a0f1a",
    surface: "#131d2a",
    primary: "#00b890",
    primaryTransparent: "rgba(0, 216, 160, 0.1)",
    inactive: "#7a8ca2",
    shadow: "#000",
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://192.168.106.235:5000/login/allprojects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text className="text-white mt-3">Loading Projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }
  const renderProgressBar = (progress) => {
    return (
      <View className="h-1 bg-white/10 rounded overflow-hidden">
        <View 
          className={`h-full bg-[${theme.primary}] rounded`}
          style={{ width: `${progress * 100}%` }}
        />
      </View>
    );
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: statusBarHeight + 20,
      }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-semibold text-white">
          Explore Projects
        </Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full border flex items-center justify-center"
          style={{
            borderColor: theme.primaryTransparent,
            backgroundColor: theme.primaryTransparent,
          }}
        >
          <Icon name="sliders" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {projects.map((project) => {
        const progress = project.raisedAmount / project.fundingGoal;
        return (
          <TouchableOpacity
            key={project._id}
            className="mb-6 rounded-xl overflow-hidden shadow-sm"
            style={{ backgroundColor: theme.surface }}
            onPress={() => {
              
              router.push({
                pathname: "/(tabs)/travel/projectdetails",
                params: { name: project.name },
              });
            }}
          >
            <View className="p-5">
              {/* Top Section */}
              <View className="mb-5">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xl font-semibold text-white flex-1 mr-4">
                    {project.name}
                  </Text>
                  <View
                    className="flex-row items-center px-2 py-1 rounded"
                    style={{
                      borderColor: theme.primaryTransparent,
                      backgroundColor: theme.primaryTransparent,
                    }}
                  >
                    <Icon name="shield" size={12} color={theme.primary} />
                    <Text className="ml-1 font-semibold" style={{ color: theme.primary }}>
                      {project.trustScore}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center mb-2.5">
                  <Icon name="map-pin" size={12} color={theme.inactive} />
                  <Text className="ml-1 text-sm" style={{ color: theme.inactive }}>
                    Mumbai, Maharashtra
                  </Text>
                </View>

                <Text 
                  className="text-sm leading-relaxed"
                  style={{ color: "#c3cfe2" }}
                >
                  {project.shortDescription}
                </Text>
              </View>

              {/* Image Section */}
              <View className="relative h-40 rounded-lg overflow-hidden mb-5">
                <Image
                  source={{ uri: project.imageUri }}
                  className="absolute w-full h-full"
                />
                <LinearGradient
                  colors={[
                    "rgba(15, 25, 36, 0)",
                    "rgba(15, 25, 36, 0.9)"
                  ]}
                  className="absolute bottom-0 left-0 right-0 h-20"
                />
                
                <View className="absolute bottom-3 left-3 flex-row gap-3">
                  <View
                    className="flex-row items-center px-2 py-1 rounded"
                    style={{ backgroundColor: "rgba(15, 25, 36, 0.7)" }}
                  >
                    <Icon name="users" size={12} color={theme.primary} />
                    <Text className="ml-1 text-xs text-white">
                      220
                    </Text>
                  </View>
                  
                  <View
                    className="flex-row items-center px-2 py-1 rounded"
                    style={{ backgroundColor: "rgba(15, 25, 36, 0.7)" }}
                  >
                    <Icon name="trending-up" size={12} color={theme.primary} />
                    <Text className="ml-1 text-xs text-white">
                      12%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Funding Section */}
              <View className="mb-5">
                <View className="flex-row items-baseline mb-2">
                  <Text className="text-lg font-bold text-white">
                    ₹{project.raisedAmount.toLocaleString()}
                  </Text>
                  <Text className="ml-1 text-sm" style={{ color: theme.inactive }}>
                    / ₹{project.fundingGoal.toLocaleString()}
                  </Text>
                </View>
                
                {renderProgressBar(progress)}

                <View className="flex-row justify-between items-center mt-4">
                  <View className="flex-row items-center">
                    <Icon name="clock" size={12} color={theme.inactive} />
                    <Text className="ml-1 text-sm" style={{ color: theme.inactive }}>
                      22 days left
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="flex-row gap-[-12px] w-9 h-6 relative">
                      {[0, 1, 2].map((index) => (
                        <View
                          key={index}
                          className="absolute w-6 h-6 rounded-full justify-center items-center"
                          style={{
                            right: index * 12,
                            backgroundColor: theme.surface,
                          }}
                        >
                          <Image
                            source={{
                              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmI57giWxjA-WXBTE7HIzLV0Y9YcEnxIyrCQ&s",
                            }}
                            className="w-5 h-5 rounded-full"
                          />
                        </View>
                      ))}
                    </View>
                    
                    <Text 
                      className="ml-3 text-sm"
                      style={{ color: theme.inactive }}
                    >
                      +220 others
                    </Text>
                  </View>
                </View>
              </View>

              {/* Details Button */}
              <TouchableOpacity
                className="rounded-lg py-3 px-6 flex-row justify-center items-center"
                style={{
                  backgroundColor: theme.primary,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/travel/projectdetails",
                    params: { name: project.name },
                  });
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: theme.background }}>
                  View Details
                </Text>
                <Icon name="arrow-right" size={16} color={theme.background} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ProjectList;