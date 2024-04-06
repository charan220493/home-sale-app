// PropertyForm.js
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const PropertyForm = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [propertySize, setPropertySize] = useState('');
  const [propertySizeUnit, setPropertySizeUnit] = useState('');
  const [images, setImages] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(null); // Index of the cover image
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const resetForm = () => {
    // Reset form state
    setAddress('');
    setPinCode('');
    setPrice('');
    setBedrooms('');
    setBathrooms('');
    setDescription('');
    setPropertyType('apartment');
    setPropertySize('');
    setPropertySizeUnit('');
    setImages([]);
    setCoverImageIndex(null);
    setSnackbarVisible(false);
    setSubmitSuccess(false);
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      console.log('Permission to access camera roll is required!');
      return;
    }
  
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };
  
    const result = await ImagePicker.launchImageLibraryAsync(options);
  
    if (!result.canceled) {
      setImages([...images, result.uri]);
      if (images.length === 0) {
        // Set the first image as cover image if it's the only image
        setCoverImageIndex(0);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Adjust cover image index if the removed image was the cover image
    if (index === coverImageIndex) {
      setCoverImageIndex(null);
    }
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('address', address);
      formData.append('pinCode', pinCode);
      formData.append('price', price);
      formData.append('bedrooms', bedrooms);
      formData.append('bathrooms', bathrooms);
      formData.append('description', description);
      formData.append('propertyType', propertyType);
      formData.append('propertySize', propertySize);
      formData.append('propertySizeUnit', propertySizeUnit);
      images.forEach((images, index) => {
        formData.append(`images`, {
          uri: images,
          type: 'jpeg', // Adjust the MIME type as needed
          name: `images${index}.jpg`,
        });
      });
      formData.append('coverImageIndex', coverImageIndex);

      console.log('form data created')
      console.log(formData)

      const response = await fetch('http://192.168.86.39:3000/listings', {
        method: 'POST',
        body: formData,
      });


      console.log('after calling backend')
      

      if (response.ok) {
        setSubmitSuccess(true); // Set submit success state
        console.log('Property details submitted successfully');
        // Clear form and images after successful submission
        /*setPropertyDetails({
          address: '',
          pinCode: '',
          price: '',
          bedrooms: '',
          bathrooms: '',
          description: '',
          propertyType: '',
          propertySize: '',
          propertySizeUnit: '',
        });*/

        //resetForm()

      } else {
        console.error('Failed to submit property details');
      }
    } catch (error) {
      console.error('Error submitting property details:', error);
    }
  };

  const handleSubmit = () => {
    if (!address || !pinCode || !price || !bedrooms || !bathrooms || !description || !propertyType || !propertySize || !propertySizeUnit || images.length === 0) {
      setSnackbarVisible(true);
      return;
    }

    const propertyData = {
      address,
      pinCode: parseInt(pinCode),
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms, 10),
      bathrooms: parseInt(bathrooms, 10),
      description,
      propertyType,
      propertySize,
      propertySizeUnit,
      images,
      coverImageIndex: parseInt(coverImageIndex, 10),
    };

    onSubmit(propertyData);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={styles.input}
      />
      <TextInput
        label="Pin Code"
        value={pinCode}
        onChangeText={(text) => setPinCode(text)}
        style={styles.input}
      />
      <TextInput
        label="Price (Rupees)"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Bedrooms"
        value={bedrooms}
        onChangeText={(text) => setBedrooms(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Bathrooms"
        value={bathrooms}
        onChangeText={(text) => setBathrooms(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={propertyType}
          onValueChange={(itemValue) => setPropertyType(itemValue)}
        >
          <Picker.Item label="Apartment" value="apartment" />
          <Picker.Item label="Independent House" value="independent_house" />
          <Picker.Item label="Land" value="land" />
          {/* Add more property types as needed */}
        </Picker>
      </View>

      <TextInput
        label="Property Area"
        value={propertySize}
        onChangeText={(text) => setPropertySize(text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          label="Unit"
          selectedValue={propertySizeUnit}
          onValueChange={(itemValue) => setPropertySizeUnit(itemValue)}
        >
          <Picker.Item label="Square Yards" value="sq_yards" />
          <Picker.Item label="Square Feet" value="sq_feet" />
        </Picker>
      </View>

      <Button mode="contained" onPress={handleImagePicker} style={styles.button}>
        Select Property Images
      </Button>

      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageItem}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCoverImageIndex(index)}
              style={[
                styles.coverButton,
                { backgroundColor: index === coverImageIndex ? 'green' : 'gray' },
              ]}
            >
              <Text style={styles.coverButtonText}>
                {index === coverImageIndex ? 'Cover Image' : 'Set as Cover'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Add Listing
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        Please fill out all fields, including at least one image.
      </Snackbar>

      {submitSuccess && (
        <View style={styles.successContainer}>
          <Image source={require('../assets/check_symbol.png')} style={styles.thumbsUpIcon} />
          <Text style={styles.successText}>Property submitted successfully!</Text>
          <Button mode="contained" onPress={resetForm} style={styles.button}>
            Return to Home
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (existing styles)

  button: {
    marginTop: 16,
  },

  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },

  imageItem: {
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 4,
    borderRadius: 4,
  },

  removeButtonText: {
    color: 'red',
  },

  coverButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'gray',
    padding: 4,
    borderRadius: 4,
  },

  coverButtonText: {
    color: 'white',
  },
});

export default PropertyForm;
