import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const LineChartComponent = () => {
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        data: [10, 25, 18, 30, 22], // Example applications received per day
        color: (opacity = 1) => `rgba(0, 255, 125, ${opacity})`, 
        strokeWidth: 3, // Line thickness
      },
    ],
  };

  const COLORS = {
    background: "#0a0f1a",
    surface: "#131d2a",
    primary: '#00d8a0',
    text: '#ffffff'
  };

  return (
    <View style={styles.container}>
    
      <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ data: [20, 25, 28, 32, 36, 34.5] }]
              }}
              width={350}
              height={200}
              chartConfig={{
                backgroundColor: COLORS.surface,
                backgroundGradientFrom: COLORS.surface,
                backgroundGradientTo: COLORS.surface,
                color: (opacity = 1) => `rgba(0, 255, 155, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
              }}
              bezier
              
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    // paddingTop: 25,
    borderRadius: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default LineChartComponent;
