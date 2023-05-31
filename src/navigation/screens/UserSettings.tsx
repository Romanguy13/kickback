import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { FB_AUTH } from '../../../firebaseConfig';

export default function UserSettings({ navigation }: any) {
  // A screen that allows the user to change their email
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User | null>(FB_AUTH?.currentUser);
  const [userNewEmail, setUserNewEmail] = useState<string>('');
  const [userCurrentPassword, setUserCurrentPassword] = useState<string>('');
  const [userNewPassword, setUserNewPassword] = useState<string>('');
  const [userConfirmNewPassword, setUserConfirmNewPassword] = useState<string>('');

  const handleChangeNewEmail = (text: string) => {
    setUserNewEmail(text);
  };

  const handleChangeCurrentPassword = (text: string) => {
    setUserCurrentPassword(text);
  };

  const handleChangeNewPassword = (text: string) => {
    setUserNewPassword(text);
  };

  const handleChangeConfirmNewPassword = (text: string) => {
    setUserConfirmNewPassword(text);
  };

  const handleUpdate = async () => {
    if (userNewEmail !== '' && user !== null) {
      updateEmail(user, userNewEmail)
        .then(() => {
          setUser((prevUser: any) => ({
            ...prevUser,
            email: userNewEmail,
          }));
          Alert.alert('Email updated!');
          console.log('Email updated!');
        })
        .catch((error) => {
          Alert.alert('Email update failed.');
          console.log(error.code, error.message);
        });
    }
    if (
      userNewPassword !== '' &&
      userConfirmNewPassword !== '' &&
      userCurrentPassword !== '' &&
      user !== null
    ) {
      if (userNewPassword !== userConfirmNewPassword) {
        Alert.alert('Passwords do not match.');
        return;
      }
      const credentials = EmailAuthProvider.credential(user.email as string, userCurrentPassword);
      reauthenticateWithCredential(user, credentials)
        .then(() => {
          updatePassword(user, userNewPassword)
            .then(() => {
              Alert.alert('Password updated!');
              console.log('Password updated!');
            })
            .catch((error) => {
              Alert.alert('Password update failed.');
              console.log(error.code, error.message);
            });
        })
        .catch((error) => {
          Alert.alert('Password update failed.');
          console.log(error.code, error.message);
        });
    }
    setUserNewEmail('');
    setUserCurrentPassword('');
    setUserNewPassword('');
    setUserConfirmNewPassword('');
  };

  const handleLogout = () => {
    FB_AUTH?.signOut().then(() => {
      console.log('Logged out!');
      navigation.navigate('Welcome');
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      setUser(FB_AUTH?.currentUser);
    };
    fetchUser();
    setUserNewEmail('');
    setUserCurrentPassword('');
    setUserNewPassword('');
    setUserConfirmNewPassword('');
  }, [user, isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Pressable
          accessibilityLabel="Back"
          testID="back-button"
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={30} color="#FFFFFB" />
        </Pressable>
        <Pressable
          accessibilityLabel="Log Out"
          testID="log-out-button"
          onPress={() => {
            handleLogout();
          }}
          style={styles.logOutButton}
        >
          <Text style={{ color: '#FFFFFB', marginRight: 4 }}>Log Out</Text>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFB" />
        </Pressable>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.header}>User Settings</Text>
        <Text style={styles.subText}>{user?.email}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subText}>Change Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            testID="new-email-input"
            style={styles.input}
            onChangeText={handleChangeNewEmail}
            placeholder="New Email"
            placeholderTextColor="black"
            value={userNewEmail}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subText}>Change Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            testID="current-password-input"
            style={styles.input}
            placeholder="Confirm Current Password"
            placeholderTextColor="black"
            onChangeText={handleChangeCurrentPassword}
            value={userCurrentPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="black"
            testID="new-password-input"
            onChangeText={handleChangeNewPassword}
            value={userNewPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            testID="confirm-new-password-input"
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor="black"
            value={userConfirmNewPassword}
            secureTextEntry
            onChangeText={handleChangeConfirmNewPassword}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Pressable
          accessibilityLabel="Update Changes"
          testID="update-button"
          onPress={() => handleUpdate()}
          style={styles.updateButton}
        >
          <Text style={{ color: '#FFFFFB', marginRight: 4, fontWeight: 'bold' }}>
            Update Changes
          </Text>
          <Ionicons name="save-outline" size={20} color="#FFFFFB" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#FF7000',
    height: 100,
    paddingTop: 30,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFB',
    top: 0,
    width: 80,
    borderRadius: 20,
    borderWidth: 2,
    marginTop: 20,
    marginBottom: 10,
    marginRight: 20,
    marginLeft: 20,
  },
  logOutButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFB',
    top: 0,
    width: 120,
    borderRadius: 20,
    borderWidth: 2,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  updateButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FF7000',
    backgroundColor: '#FF7000',
    width: '100%',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  textContainer: {
    margin: 20,
    backgroundColor: '##FFFFFB',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 12,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
});
