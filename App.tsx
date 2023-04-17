import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text 
        style={{
          color: '#654321',
          fontSize: 30,
          fontWeight: 'bold',
        }
      }>
        KickBack
      </Text>
      <Pressable
        onPress={() => console.log('Pressed')}
        style={{
          backgroundColor: '#654321',
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          elevation: 3,
        }}
      >
        <Text
          style={{
            color: '#FFA500',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Create Event
        </Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
