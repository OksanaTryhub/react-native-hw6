import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView, {Marker} from 'react-native-maps'

const MapScreen = ({ route }) => {
  const { latitude, longitude } = route.params.location.coordinates;
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006
        }}>
        
        <Marker coordinate={ {latitude, longitude}} />

      </MapView>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex:1
    
  },
  map: {
    flex:1
  }
})