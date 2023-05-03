import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GroupMembers from '../../resources/api/groupMembers';
import { FB_AUTH } from '../../../firebaseConfig';
import Groups from '../../resources/api/groups';
import { GroupReturnModel } from '../../resources/schema/group.model';
import GroupCard from '../../components/GroupCard';

export default function EventGroups({ navigation }: any) {
  const [groups, setGroups] = useState<GroupReturnModel[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const groupIds = await new GroupMembers().getAll(
        FB_AUTH.currentUser?.uid as string,
        'userId'
      );
      const groupsArr: GroupReturnModel[] = [];

      const promises = groupIds.map(async (group) => {
        const currGroup = await new Groups().get(group.groupId);
        groupsArr.push(currGroup as GroupReturnModel);
      });

      await Promise.all(promises);

      setGroups(groupsArr);
      console.log('Groups Arr:', groupsArr);
    };
    fetchData();
    console.log('Groups outside fetch:', groups);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} navigation={navigation} />
        ))}
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
