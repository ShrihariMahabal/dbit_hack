import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  TextInput, 
  Alert, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const Account = () => {
  // User data state
  const [userData] = useState({
    name: "Anish Kumar",
    email: "anish.kumar@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Mumbai, Maharashtra",
    memberSince: "January 2023"
  });

  // Bill analysis form state
  const [modalVisible, setModalVisible] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [familySize, setFamilySize] = useState('');
  const [region, setRegion] = useState('');

  // Analysis results state
  const [billAnalysis, setBillAnalysis] = useState({
    electricity: null, // Initially set to null
    gas: null, // Initially set to null
  });

  // Function to pick an image from the gallery
  const pickImage = async (setImage) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Function to upload images and user data to the backend
  const uploadData = async () => {
    if (!image1 || !image2 || !familySize || !region) {
      Alert.alert('Error', 'Please upload both images and fill in all fields.');
      return;
    }

    const payload = {
      imagesBase64: [image1, image2],
      userData: {
        family_size: parseInt(familySize, 10),
        region: region,
      },
    };

    try {
      const response = await axios.post('http://localhost:8000/login/analyze-bills', payload);

      // Update the bill analysis state with the response data
      const [electricityResult, gasResult] = response.data;
      setBillAnalysis({
        electricity: electricityResult,
        gas: gasResult,
      });

      // Close the modal after successful submission
      setModalVisible(false);

      // Reset form fields
      setImage1(null);
      setImage2(null);
      setFamilySize('');
      setRegion('');

      Alert.alert('Success', 'Bills analyzed successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
      Alert.alert('Error', 'Failed to upload data. Please try again.');
    }
  };

  const getSustainabilityColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>{userData.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
        </View>
        
        <View style={styles.profileDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={20} color="#00b890" />
            <Text style={styles.detailText}>{userData.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#00b890" />
            <Text style={styles.detailText}>{userData.address}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#00b890" />
            <Text style={styles.detailText}>Member since: {userData.memberSince}</Text>
          </View>
        </View>
      </View>

      {/* Bill Analysis Button */}
      <TouchableOpacity 
        style={styles.analyzeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.analyzeButtonText}>Analyze New Bills</Text>
      </TouchableOpacity>

      {/* Bill Analysis Results */}
      <View style={styles.billsSection}>
        <Text style={styles.sectionTitle}>Your Bill Analysis</Text>
        
        {/* Electricity Bill Card */}
        {billAnalysis.electricity && (
          <View style={styles.billCard}>
            <View style={styles.billCardHeader}>
              <Ionicons name="flash-outline" size={24} color="#00b890" />
              <Text style={styles.billCardTitle}>Electricity Bill</Text>
            </View>
            
            <View style={styles.billCardContent}>
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Provider:</Text>
                <Text style={styles.billValue}>{billAnalysis.electricity.bill_provider}</Text>
              </View>
              
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Period:</Text>
                <Text style={styles.billValue}>{billAnalysis.electricity.billing_period}</Text>
              </View>
              
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Consumption:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.electricity.consumption.value} {billAnalysis.electricity.consumption.unit}
                </Text>
              </View>
              
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Amount:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.electricity.amount.currency} {billAnalysis.electricity.amount.value}
                </Text>
              </View>
              
              {/* Sustainability Score */}
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Sustainability Score</Text>
                <View style={styles.scoreWrapper}>
                  <View 
                    style={[
                      styles.scoreIndicator, 
                      { 
                        backgroundColor: getSustainabilityColor(billAnalysis.electricity.sustainability_score),
                        width: `${billAnalysis.electricity.sustainability_score}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.scoreValue}>{billAnalysis.electricity.sustainability_score}/100</Text>
              </View>
              
              {/* Key Insights */}
              <Text style={styles.insightsTitle}>Key Insights:</Text>
              {billAnalysis.electricity.key_insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>• {insight}</Text>
              ))}
              
              {/* Recommendations */}
              <Text style={styles.insightsTitle}>Recommendations:</Text>
              {billAnalysis.electricity.recommendations.map((rec, index) => (
                <Text key={index} style={styles.insightText}>• {rec}</Text>
              ))}
            </View>
          </View>
        )}
        
        {/* Gas Bill Card */}
        {billAnalysis.gas && (
          <View style={styles.billCard}>
            <View style={styles.billCardHeader}>
              <Ionicons name="flame-outline" size={24} color="#00b890" />
              <Text style={styles.billCardTitle}>Gas Bill</Text>
            </View>
            
            <View style={styles.billCardContent}>
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Provider:</Text>
                <Text style={styles.billValue}>{billAnalysis.gas.bill_provider}</Text>
              </View>
              
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Period:</Text>
                <Text style={styles.billValue}>{billAnalysis.gas.billing_period}</Text>
              </View>
              
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Consumption:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.gas.consumption.value} {billAnalysis.gas.consumption.unit}
                </Text>
              </View>
              
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Amount:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.gas.amount.currency} {billAnalysis.gas.amount.value}
                </Text>
              </View>
              
              {/* Sustainability Score */}
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Sustainability Score</Text>
                <View style={styles.scoreWrapper}>
                  <View 
                    style={[
                      styles.scoreIndicator, 
                      { 
                        backgroundColor: getSustainabilityColor(billAnalysis.gas.sustainability_score),
                        width: `${billAnalysis.gas.sustainability_score}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.scoreValue}>{billAnalysis.gas.sustainability_score}/100</Text>
              </View>
              
              {/* Key Insights */}
              <Text style={styles.insightsTitle}>Key Insights:</Text>
              {billAnalysis.gas.key_insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>• {insight}</Text>
              ))}
              
              {/* Recommendations */}
              <Text style={styles.insightsTitle}>Recommendations:</Text>
              {billAnalysis.gas.recommendations.map((rec, index) => (
                <Text key={index} style={styles.insightText}>• {rec}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Bill Analysis Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Analyze Your Utility Bills</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <Text style={styles.formLabel}>Upload Electricity Bill</Text>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={() => pickImage(setImage1)}
              >
                <Ionicons name="image-outline" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>
                  {image1 ? "Bill 1 Selected" : "Select Electricity Bill"}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.formLabel}>Upload Gas Bill</Text>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={() => pickImage(setImage2)}
              >
                <Ionicons name="image-outline" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>
                  {image2 ? "Bill 2 Selected" : "Select Gas Bill"}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.formLabel}>Family Size</Text>
              <TextInput
                placeholder="Enter number of family members"
                placeholderTextColor="#8A8D91"
                value={familySize}
                onChangeText={setFamilySize}
                keyboardType="numeric"
                style={styles.input}
              />
              
              <Text style={styles.formLabel}>Region</Text>
              <TextInput
                placeholder="Enter your region (e.g., Mumbai, Delhi)"
                placeholderTextColor="#8A8D91"
                value={region}
                onChangeText={setRegion}
                style={styles.input}
              />

              <Text style={styles.formLabel}>Carpet Area</Text>
                <TextInput
                  placeholder="Enter carpet area (square feet)"
                  placeholderTextColor="#8A8D91"
                  style={styles.input}
                />
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={uploadData}
                disabled={!image1 || !image2 || !familySize || !region}
              >
                <Text style={styles.submitButtonText}>Analyze Bills</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  
  // Profile Section
  profileSection: {
    backgroundColor: "#131d2a",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00b890",
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#fff",
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    color: "#8A8D91",
    marginTop: 4,
  },
  profileDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },
  
  // Analyze Button
  analyzeButton: {
    backgroundColor: "#00b890",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Bills Section
  billsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff",
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: "#131d2a",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  billCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#192539",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#243246",
  },
  billCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
    marginLeft: 10,
  },
  billCardContent: {
    padding: 16,
  },
  billInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: "#8A8D91",
  },
  billValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: '500',
  },
  scoreContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#8A8D91",
    marginBottom: 8,
  },
  scoreWrapper: {
    height: 8,
    backgroundColor: "#243246",
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    marginTop: 4,
    fontSize: 14,
    color: "#fff",
    textAlign: 'right',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
    lineHeight: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: "#131d2a",
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#192539",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#243246",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
  modalForm: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: "#fff",
    marginBottom: 8,
    marginTop: 16,
  },
  uploadButton: {
    backgroundColor: "#192539",
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "#243246",
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#192539",
    borderRadius: 8,
    padding: 16,
    color: "#fff",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#00b890",
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Account;