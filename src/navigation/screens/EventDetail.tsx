import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupMembers from '../../resources/api/groupMembers';
import Users from '../../resources/api/users';

function EventDetail({ route, navigation }: any) {
  const { event } = route.params;

  const [topMembers, setTopMembers] = useState<any[]>([]);

  const idToName = async (id: string) => {
    const user = await new Users().get(id);
    return user.name;
  };

  useEffect(() => {
    const fetchData = async () => {
      const tempMembers = await new GroupMembers().getAll(event.gId, 'groupId');
      console.log('Temp Members:', tempMembers);

      const promises = tempMembers.map(async (member) => {
        const name = await idToName(member.userId);
        return { id: member.userId, name };
      });

      const tMembers = await Promise.all(promises);
      setTopMembers(tMembers);
      console.log('Top Members:', topMembers);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>{event.name}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.datetimeContainer}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={40} color="white" />
          </Pressable>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{event.date}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{event.time}</Text>
          </View>
          {/* <View style={styles.voteContainer}>
            <Pressable style={styles.voteButton}>
              <Text>Yes</Text>
            </Pressable>
            <Pressable style={styles.voteButton}>
              <Text>No</Text>
            </Pressable>
          </View> */}
        </View>
        <View style={styles.locationpeopleContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitleText}>{event.location}</Text>
          </View>
          <View style={styles.usersContainer}>
            <ScrollView style={styles.usersScroll}>
              {topMembers.map((member) => (
                <Text key={member.userId} style={styles.usersText}>
                  {member.name}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  topContainer: {
    backgroundColor: '#FF7000',
    height: '16%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#FFFFFB',
    fontSize: 60,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  backButton: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFB',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 20,
    marginBottom: 2,
  },
  datetimeContainer: {
    backgroundColor: '#272222',
    width: '30%',
    flexDirection: 'column',
  },
  dateContainer: {
    width: '100%',
    justifyContent: 'center',
    top: 120,
  },
  dateText: {
    color: '#FFFFFB',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  timeContainer: {
    width: '100%',
    justifyContent: 'center',
    top: 130,
  },
  timeText: {
    color: '#FFFFFB',
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  voteContainer: {
    width: '100%',
    justifyContent: 'center',
    top: 220,
  },
  voteButton: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFB',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 40,
  },
  locationpeopleContainer: {
    backgroundColor: '#FFFFFB',
    width: '70%',
    flexDirection: 'column',
  },
  locationContainer: {
    width: '100%',
    top: 90,
    alignItems: 'center',
  },
  locationTitleText: {
    color: '#272222',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  locationText: {
    color: '#272222',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  usersContainer: {
    display: 'flex',
    backgroundColor: '#272222',
    width: '70%',
    height: '30%',
    alignSelf: 'center',
    top: 150,
    borderRadius: 20,
  },
  usersScroll: {
    width: '100%',
  },
  usersText: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 20,
    marginHorizontal: 20,
    justifyContent: 'flex-end',
  },
});

export default EventDetail;
