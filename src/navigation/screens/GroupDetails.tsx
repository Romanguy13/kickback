import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { StyleSheet, Pressable, Text, View, ScrollView, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { GroupCardProps } from './EventGroups';
import { FB_AUTH } from '../../../firebaseConfig';
import GroupMembers from '../../resources/api/groupMembers';
import Users from '../../resources/api/users';
import Events from '../../resources/api/events';
import { UserReturn } from '../../resources/schema/user.model';
import { EventReturn } from '../../resources/schema/event.model';
import { GroupMemberModel } from '../../resources/schema/group.model';
import Groups from '../../resources/api/groups';

export default function GroupDetails({ navigation, route }: { navigation: any; route: any }) {
  const { group }: GroupCardProps = route.params;
  const [topMembers, setTopMembers] = useState<UserReturn[]>([]);
  const [events, setEvents] = useState<EventReturn[]>([]);
  const isFocused = useIsFocused();
  const backgroundChipColors = ['#D9D9D9', '#EC9090', '#9BEFE5', '#FFD464'];
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const changeGroupName = async () => {
    await new Groups().edit(group.id, { name: groupName });
    group.name = groupName;
    closeModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      const tempMembers = (await new GroupMembers().getAll(
        group.id,
        'groupId'
      )) as GroupMemberModel[];

      console.log('Temp Members:', tempMembers);

      const promises: Promise<UserReturn>[] = tempMembers.map(
        (member: GroupMemberModel) => new Users().get(member.userId) as Promise<UserReturn>
      );

      // only take id and name field from tempMembers and store in tMembers
      const tMembers = await Promise.all(promises);
      setTopMembers(tMembers);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    const fetchData = async () => {
      const tempEvents = (await new Events().getAll(group.id, 'gId')) as EventReturn[];
      const sortedEvents = tempEvents.sort((a: EventReturn, b: EventReturn) => {
        const aDate = moment(a.datetime.toDate());
        const bDate = moment(b.datetime.toDate());
        return aDate.isAfter(bDate) ? 1 : -1;
      });
      setEvents(sortedEvents);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

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
        <Pressable style={styles.editButton} onPress={openModal}>
          <Ionicons name="create-outline" size={30} color="#FFFFFB" />
        </Pressable>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{group.name}</Text>
      </View>
      <View
        style={{
          marginTop: 10,
          padding: 20,
          paddingBottom: 0,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.text}>Members</Text>
        </View>
        <ScrollView style={styles.userScroll}>
          <View
            style={{
              flexDirection: 'column',
            }}
          >
            {topMembers.map((member, i) => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
                key={member.id}
              >
                <View
                  style={{
                    borderRadius: 50,
                    backgroundColor: backgroundChipColors[i % 4],
                    width: 50,
                    height: 50,
                    padding: 5,
                    marginTop: 12,
                    marginBottom: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  key={member.id}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginTop: 22,
                    marginLeft: 10,
                  }}
                >
                  {member.name} {member.id === FB_AUTH.currentUser?.uid ? '(Me)' : undefined}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <Pressable
          onPress={() => {
            navigation.navigate('TabBar', {
              screen: 'Creation',
              params: { topMembers, groupId: group.id },
            });
          }}
          style={styles.groupEventButton}
        >
          <Ionicons name="add-outline" size={30} color="#FFFFFB" />
          <Text style={styles.groupEventButtonText}>Group Event</Text>
        </Pressable>
        <Text style={styles.text}>Group Events</Text>
        <ScrollView horizontal>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
            }}
          >
            {events.map((event) => (
              <View style={styles.eventCards} key={event.id}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    paddingLeft: 10,
                    paddingRight: 10,
                    textAlign: 'center',
                  }}
                >
                  {event.name}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    paddingBottom: 10,
                    textAlign: 'center',
                  }}
                >
                  {moment(event.datetime.toDate()).format('MMM Do YYYY, h:mm a')}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Edit Group Name:</Text>
              <TextInput style={styles.modalInputBox} onChangeText={(text) => setGroupName(text)}>
                <Text style={styles.modalInput}>{group.name}</Text>
              </TextInput>
              <View style={styles.modalButtonContainer}>
                <Pressable style={styles.closeButton} onPress={changeGroupName}>
                  <Text style={styles.closeButtonText}>Done</Text>
                </Pressable>
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'flex-start',
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
  editButton: {
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
    marginLeft: 200,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  userScroll: {
    height: 330,
  },
  groupEventButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: '10%',
    backgroundColor: '#FF7000',
    margin: 20,
    padding: 10,
  },
  groupEventButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFFFFB',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  eventCards: {
    height: 150,
    alignSelf: 'center',
    justifySelf: 'center',
    backgroundColor: '#FFFFFB',
    borderRadius: 10,
    borderTopColor: '#FF7000',
    borderTopWidth: 30,
    margin: 0,
    marginRight: 20,
    marginBottom: 60,
    color: '#272222',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    paddingBottom: 30,
    shadowColor: '#272222',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation property for Android
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
  modalInputBox: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    padding: 5,
  },
  modalInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#272222',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    padding: 5,
  },
});
