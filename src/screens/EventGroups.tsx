import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
import NavBar from './NavBar';
import GroupMembers from "../resources/api/groupMembers";
import {FB_AUTH} from "../../firebaseConfig";
import Groups from "../resources/api/groups";
import {GroupModel, GroupReturnModel} from "../resources/schema/group.model";
import GroupCard from "../components/GroupCard";

interface EventGroupsProps {
  navigation: any;
}

export default function EventGroups({ navigation }: any) {
  const [groups, setGroups] = useState<GroupReturnModel[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const groupIds = await new GroupMembers().getAll(FB_AUTH.currentUser?.uid as string, 'userId');
      const groupsArr: GroupReturnModel[] = [];

      const promises = groupIds.map(async (groupId) => {
        const group = await new Groups().get(groupId.groupId);
        groupsArr.push(group as GroupReturnModel);
      });

      await Promise.all(promises);

      setGroups(groupsArr);
      console.log('Groups Arr:', groupsArr)
    }

    fetchData();
  }, []);

  console.log('Groups:', groups);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.textContainer}>
        <Text style={styles.text}>No groups yet!</Text>
        {groups.map((group: GroupReturnModel) => (
            <GroupCard key={group.id} group={group} navigation={navigation} />
        ))}
        <Text style={styles.text}>No groups yet!</Text>
      </ScrollView>
      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7000',
  },
  textContainer: {
    padding: 30,
  },
  text: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
});
