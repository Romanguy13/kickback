import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, Text, View, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { GroupCardProps } from './EventGroups';
import { FB_AUTH } from '../../../firebaseConfig';
import GroupMembers from '../../resources/api/groupMembers';
import Users from '../../resources/api/users';
import Events from '../../resources/api/events';

// type GroupDetailsProps = StackScreenProps<
//     { GroupDetails: { group: GroupReturnModel } },
//     'GroupDetails'
// >;

export default function GroupDetails({ navigation, route }: { navigation: any; route: any }) {
  const { group }: GroupCardProps = route.params;
  const [topMembers, setTopMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const isFocused = useIsFocused();
  const backgroundChipColors = ['#D9D9D9', '#EC9090', '#9BEFE5', '#FFD464'];

  const idToName = async (id: string) => {
    const user = await new Users().get(id);
    return user.name;
  };

  useEffect(() => {
    const fetchData = async () => {
      const tempMembers = await new GroupMembers().getAll(group.id, 'groupId');
      console.log('Temp Members:', tempMembers);
      // const tempEvents = await new Events().getAll(group.id, 'gId');
      const promises = tempMembers.map(async (member) => {
        const name = await idToName(member.userId);
        return { id: member.userId, name };
      });

      // only take id and name field from tempMembers and store in tMembers
      // const tMembers = tempMembers.map((member) => ({ id: member.userId, name: member.name }));
      const tMembers = await Promise.all(promises);
      setTopMembers(tMembers);
      console.log('Top Members:', topMembers);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    const fetchData = async () => {
      const tempEvents = await new Events().getAll(group.id, 'gId');
      // const promises = tempEvents.map(async (event) => {
      //   const tempEvent = await idToEvent(event.id);
      //   return tempEvent;
      // });
      // const tEvents = await Promise.all(promises);
      setEvents(tempEvents);
      console.log('Events:', events);
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
                  {event.time}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
    justifyContent: 'flex-end',
    display: 'flex',
    backgroundColor: '#FF7000',
    height: 100,
  },
  backButton: {
    top: 0,
    justifyContent: 'center',
    width: 80,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFB',
    marginTop: 0,
    marginBottom: 8,
    marginLeft: 10,
    padding: 4,
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
});
