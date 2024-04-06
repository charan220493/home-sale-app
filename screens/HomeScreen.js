// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import axios from 'axios';
import PropertyForm from './PropertyForm';

const HomeScreen = ({ navigation }) => {
  const [propertyListings, setPropertyListings] = useState([]);

  useEffect(() => {
    // Fetch property listings from the backend
    fetchPropertyListings();
  }, []);

  const fetchPropertyListings = async () => {
    try {
      const response = await axios.get('http://192.168.86.42:3000/listings');
      setPropertyListings(response.data);
    } catch (error) {
      console.error('Error fetching property listings:', error.message);
    }
  };

  return (
    <View style={styles.container}>

      <Button mode="contained" onPress={() => navigation.navigate("AddProperty")} style={styles.button}>
        Add Property
      </Button>

      <Text style={styles.header}>Property Listings</Text>
      <FlatList
        data={propertyListings}
        keyExtractor={(item) => item._id.toString()} // Assuming MongoDB _id field
        renderItem={({ item }) => (
          
          <View style={styles.listingContainer}>
            <Text>{item.address}</Text>
            <Text>PIN: {item.pinCode}</Text>
            <Text>Rs. {item.price}</Text>
            <Text>Type: {item.propertyType}</Text>
            <Text>Size: {item.propertySize}</Text>
            <Text>Unit: {item.propertySizeUnit}</Text>
            <Text>Description: {item.description}</Text>

            <View style={styles.imageContainer}>
              {item.images.map((imageUri, index) => (
                <Image key={index} source={{uri: imageUri}} style={styles.image} resizeMode="contain"/>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listingContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  imageContainer: {
    flex:1,
    marginTop: 8,
  },
  image: {
    width: 1600,
    height: 900,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default HomeScreen;
