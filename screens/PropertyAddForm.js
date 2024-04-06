export default function Add() {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);
  
    const [camera, setCamera] = useState(null);
    const [imageUri, setImageUri] = useState([]);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [imageArray, setImageArray] = useState([]);
  
    const takePicture = async () => {
      if (camera) {
        const data = await camera.takePictureAsync(null);
        console.log(data.uri);
        setImageUri(data.uri);
        setImageArray([...imageArray, data.uri]);
      }
    };
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
  
      console.log(result.uri);
      if (!result.cancelled) {
        setImageArray([...imageArray, result.uri]);
      }
    };
  
    return (
      <View style={styles.container}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
        />
  
        {imageArray.length > 0 && (
          <View style={{ height: 110 }}>
            <FlatList
              horizontal
              data={imageArray}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: 100, height: 100, borderRadius: 10, margin: 5 }}
                />
              )}
            />
          </View>
        )}
        <Button title={'Take Picture'} onPress={takePicture} />
        <Button title={'Gallery'} onPress={pickImage} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    fixedRatio: {
      flex: 1,
    },
  });