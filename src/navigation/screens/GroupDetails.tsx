import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
    <View
      style={{
        marginTop: 60,
      }}
    >
      <Pressable
        accessibilityLabel="Back"
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: 150,
          alignItems: 'center',
          borderRadius: 20,
          borderWidth: 2,
          borderColor: '#000000',
          margin: 20,
          padding: 10,
        }}
      >
        <Ionicons name="arrow-back-outline" size={30} color="#000000" />
        <Text accessibilityLabel="Groups" style={{ fontSize: 20, fontWeight: 'bold' }}>
          Groups
        </Text>
      </Pressable>
      <View
        style={{
          marginTop: 30,
          padding: 30,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
            }}
          >
            {group.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          {topMembers.map((member) => (
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
                  backgroundColor: '#D9D9D9',
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
        <Pressable
          onPress={() => {
            navigation.navigate('TabBar', {
              screen: 'Creation',
              params: { topMembers, groupId: group.id },
            });
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 2,
            marginHorizontal: '10%',
            borderColor: '#000000',
            margin: 20,
            padding: 10,
          }}
        >
          <Ionicons name="add-outline" size={30} color="#000000" />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Group Event</Text>
        </Pressable>

        <Text
          style={{
            fontSize: 20,
          }}
        >
          Group Events
        </Text>
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          {events.map((event) => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                marginHorizontal: '10%',
                borderWidth: 2,
                borderColor: '#000000',
                borderRadius: 20,
                padding: 10,
              }}
              key={event.id}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}
              >
                {event.name}
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 22,
                  marginLeft: 10,
                }}
              >
                {event.time}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
