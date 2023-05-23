import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, Dimensions, PixelRatio } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import GroupMembers from '../../resources/api/groupMembers';
import { FB_AUTH } from '../../../firebaseConfig';
import Groups from '../../resources/api/groups';
import { GroupMemberModel, GroupReturnModel } from '../../resources/schema/group.model';
import GroupCard from '../../components/GroupCard';
import Events from '../../resources/api/events';
import { UserModel, UserReturn } from '../../resources/schema/user.model';
import Users from '../../resources/api/users';
import { EventModel, EventReturn } from '../../resources/schema/event.model';

export interface GroupCardProps {
  group: GroupReturnModel;
  events: EventReturn[];
  topMembers: UserModel[];
  extraMembers: number;
  navigation: any;
}

export default function EventGroups({ navigation }: any) {
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const isFocused = useIsFocused();
  // const [lastGroup, setLastGroup] = useState<GroupReturnModel | undefined>(undefined);
  // const [loadMore, setLoadMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const groupsArr: GroupCardProps[] = [];

      // new GroupMembers()
      //   .getAllLimit(FB_AUTH.currentUser?.uid as string, 'userId', lastGroup)
      //   .then((groupIds) => groupIds.map((group) => new Groups().get(group.groupId)))
      //   .then((promises) => Promise.all(promises))
      //   .then((returnedGroups) => {
      //     console.log('Returned Groups:', returnedGroups);
      //     returnedGroups.map((group) =>
      //       setGroups((prev) => [
      //         ...prev,
      //         {
      //           group: group as GroupReturnModel,
      //           navigation,
      //         },
      //       ])
      //     );
      //     setLastGroup(groups[groups.length - 1].group as GroupReturnModel);
      //     console.log('Last Group:', lastGroup);
      //     setLoadMore(false);
      //     console.log('Groups Arr:', groups.length);
      //   });

      const groupIds: GroupMemberModel[] = (await new GroupMembers().getAll(
        FB_AUTH.currentUser?.uid as string,
        'userId'
      )) as GroupMemberModel[];

      // Get all groups that the user is a member of
      const promises = groupIds.map(async (group) => {
        const currGroup = await new Groups().get(group.groupId);

        // Get the amount of members in the group
        const members = (await new GroupMembers().getAll(
          group.groupId,
          'groupId'
        )) as GroupMemberModel[];

        // Get the top 4 members of the group
        const tempMembers = [...members];
        if (tempMembers.length >= 4) tempMembers.splice(0, members.length - 4);
        const innerPromise = tempMembers.map(async (member) => {
          const user = await new Users().get(member.userId);
          return user as UserModel;
        });

        // Wait for the inner promise to finish
        const tempUsers: UserModel[] = await Promise.all(innerPromise);

        // Get the amount of events in the group
        const events = await new Events().getAll(group.groupId, 'gId');

        groupsArr.push({
          group: currGroup as GroupReturnModel,
          navigation,
          events: events as EventReturn[],
          topMembers: tempUsers as UserModel[],
          extraMembers: members.length > 4 ? members.length - 4 : 0,
        });
      });

      await Promise.all(promises);

      setGroups(groupsArr);

      if (groupsArr.length > 0) {
        console.log('Here are some of the data for the Group');
        console.log('Groups:', groupsArr[0].group);
        console.log('Events:', groupsArr[0].events);
        console.log('Top Members:', groupsArr[0].topMembers);
        console.log('Extra Members:', groupsArr[0].extraMembers);
        console.log('---------------------------------------');
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.header}>Groups</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={groups}
          renderItem={GroupCard}
          // onEndReached={() => setLoadMore(true)}
          onEndReachedThreshold={0.01}
          style={{
            display: 'flex',
          }}
        />
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const fontScale = PixelRatio.getFontScale();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  listContainer: {
    display: 'flex',
    width: '100%',
    height: '78%',
    alignSelf: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
});
