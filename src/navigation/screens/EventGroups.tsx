import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import GroupMembers from '../../resources/api/groupMembers';
import { FB_AUTH } from '../../../firebaseConfig';
import Groups from '../../resources/api/groups';
import { GroupMemberModel, GroupReturnModel } from '../../resources/schema/group.model';
import GroupCard from '../../components/GroupCard';
import Events from '../../resources/api/events';
import { UserModel } from '../../resources/schema/user.model';
import Users from '../../resources/api/users';

export interface GroupCardProps {
  group: GroupReturnModel;
  events: Events[];
  topMembers: UserModel[];
  extraMembers: number;
  navigation: any;
}

export default function EventGroups({ navigation }: any) {
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const [lastGroup, setLastGroup] = useState<GroupReturnModel | undefined>(undefined);
  const [loadMore, setLoadMore] = useState<boolean>(true);

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
        const members = await new GroupMembers().getAll(group.groupId, 'groupId');

        // Get the top 3 members of the group
        const topMembers: UserModel[] = [];
        const innerPromise = members.map(async (member, i) => {
          // Break out of the loop after 3 members
          if (i > 3) return false;

          const user = await new Users().get(member.userId);
          topMembers.push(user as UserModel);
          return true;
        });

        // Wait for the inner promise to finish
        await Promise.all(innerPromise);

        // Get the amount of events in the group
        const events = await new Events().getAll(group.groupId, 'gId');

        groupsArr.push({
          group: currGroup as GroupReturnModel,
          navigation,
          events: events as Events[],
          topMembers,
          extraMembers: members.length > 3 ? members.length - 3 : 0,
        });
      });

      await Promise.all(promises);

      setGroups(groupsArr);

      console.log('Here are some of the data for the Group');
      console.log('Groups:', groupsArr[0].group);
      console.log('Events:', groupsArr[0].events);
      console.log('Top Members:', groupsArr[0].topMembers);
      console.log('Extra Members:', groupsArr[0].extraMembers);
      console.log('---------------------------------------');
    };
    fetchData();
    console.log('Groups outside fetch:', groups.length);
  }, [loadMore]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <FlatList
          data={groups}
          renderItem={GroupCard}
          onEndReached={() => setLoadMore(true)}
          onEndReachedThreshold={0.01}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  textContainer: {
    padding: 30,
  },
});
