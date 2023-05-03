import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GroupMembers from "../../resources/api/groupMembers";
import {FB_AUTH} from "../../../firebaseConfig";
import Groups from "../../resources/api/groups";
import {GroupReturnModel} from "../../resources/schema/group.model";

interface EventGroupsProps {
  navigation: any;
}

export default function EventGroups({ navigation }: any) {
  const [groups, setGroups] = useState<GroupReturnModel[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const groupIds = await new GroupMembers().getAll(FB_AUTH.currentUser?.uid as string, 'userId');
      const groupsArr: GroupReturnModel[] = [];

      const promises = groupIds.map(async (group) => {
        const currGroup = await new Groups().get(group.groupId);
        groupsArr.push(currGroup as GroupReturnModel);
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
      <View style={styles.textContainer}>
        <Text style={styles.text}>Groups</Text>
      </View>
      {/* <NavBar navigation={navigation} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    padding: 30,
  },
  text: {
    color: '#FFFFFB',
    fontSize: 70,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
});
