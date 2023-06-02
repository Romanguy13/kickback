import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import Users from '../../resources/api/users';
import { UpdatedUser } from '../../resources/schema/user.model';
import { FB_AUTH } from '../../../firebaseConfig';

export default function UserSettings({ navigation }: any) {
  // A screen that allows the user to change their email
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(FB_AUTH?.currentUser);
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [userNewEmail, setUserNewEmail] = useState<string>('');
  const [userCurrentPassword, setUserCurrentPassword] = useState<string>('');
  const [userNewPassword, setUserNewPassword] = useState<string>('');
  const [userConfirmNewPassword, setUserConfirmNewPassword] = useState<string>('');

  const changeModalVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const handleChangeDisplayName = (text: string) => {
    setUserDisplayName(text);
  };

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
    if (userDisplayName !== '' && user !== null) {
      const id = await new Users().getUserDbIdByEmail(user.email as string);
      const updatedUser: UpdatedUser = {
        name: userDisplayName,
      };
      await new Users().edit(id as string, updatedUser);
      Alert.alert('Name updated!');
      console.log('Name updated!');
    }
    if (userNewEmail !== '' && user !== null) {
      const id = await new Users().getUserDbIdByEmail(user.email as string);
      const updatedUser: UpdatedUser = {
        email: userNewEmail.toLowerCase(),
      };
      await new Users().edit(id as string, updatedUser);
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
    setUserDisplayName('');
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
            changeModalVisibility();
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
        <Text style={styles.subText}>Change Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            testID="new-name-input"
            style={styles.input}
            onChangeText={handleChangeDisplayName}
            placeholder="New Name"
            placeholderTextColor="black"
            value={userDisplayName}
          />
        </View>
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
      <Modal testID="logout-modal" visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={handleLogout}
                testID="log-out-confirm-button"
              >
                <Text style={styles.closeButtonText}>Log Out</Text>
              </Pressable>
              <Pressable style={styles.closeButton} onPress={changeModalVisibility}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#272222',
    width: '80%',
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    color: '#FFFFFB',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF7000',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFB',
  },
});
