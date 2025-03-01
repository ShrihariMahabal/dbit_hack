import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";

// Updated color scheme - consider centralizing COLORS if used in multiple components
const COLORS = {
  background: "#0a0f1a",
  surface: "#131d2a",
  primary: "#00d1b2",
  text: "#e0e0e0",
  gray: {
    100: "rgba(255, 255, 255, 0.08)",
    200: "rgba(255, 255, 255, 0.12)",
    300: "rgba(255, 255, 255, 0.16)",
  },
};

const styles = StyleSheet.create({
  challengeCard: {
    width: "100%",
    backgroundColor: "#131d2a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  challengeTitle: {
    color: "#e0e0e0",
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
  },
  challengeProgressText: {
    color: "#00b890",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
    width: "0%", // Initialize width to 0
  },
  stepCountText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

const Walking = ({ title, iconColor }) => {
  const [stepCount, setStepCount] = useState(1000); // Start from 1000 steps
  const lastY = useRef(0);
  const isCounting = useRef(false);
  const lastTimestamp = useRef(0);
  const dataBuffer = useRef([]);
  const progressPercentage = (stepCount / 10000) * 100; // Example total steps as 10000
  const color = iconColor || "#3b82f6";

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      const result = await Accelerometer.isAvailableAsync();
      if (result) {
        Accelerometer.setUpdateInterval(100);
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const timestamp = new Date().getTime();

          dataBuffer.current.push(y);
          if (dataBuffer.current.length > 10) {
            dataBuffer.current.shift();
          }

          const smoothedY =
            dataBuffer.current.reduce((sum, value) => sum + value, 0) /
            dataBuffer.current.length;

          // More sensitive threshold - decreased from 0.2 to 0.1
          const threshold = 0.1 + Math.abs(smoothedY - lastY.current) * 0.5;

          if (
            Math.abs(smoothedY - lastY.current) > threshold &&
            !isCounting.current &&
            timestamp - lastTimestamp.current > 500
          ) {
            isCounting.current = true;
            lastY.current = smoothedY;
            lastTimestamp.current = timestamp;
            setStepCount((prevStepCount) => prevStepCount + 1);

            setTimeout(() => {
              isCounting.current = false;
            }, 300);
          }
        });
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View
          style={[
            styles.challengeIconContainer,
            { backgroundColor: `${color}20` },
          ]}
        >
          <FontAwesome5 name="walking" size={20} color={color} />
        </View>
        <Text style={styles.challengeTitle}>{title}</Text>
        {/* Removed progress/total text - displaying step count below progress bar now */}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%`, backgroundColor: color },
          ]}
        />
      </View>

      <Text style={styles.stepCountText}>Steps: {stepCount}</Text>
    </View>
  );
};

export default Walking;
