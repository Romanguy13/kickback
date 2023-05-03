import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import GroupMembers from "../../resources/api/groupMembers";
import {FB_AUTH} from "../../../firebaseConfig";
import Groups from "../../resources/api/groups";
import {GroupReturnModel} from "../../resources/schema/group.model";
import GroupDetails from "./GroupDetails";

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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {groups.map((group) => (
            <Pressable style={styles.pressable} onPress={() => {
                navigation.navigate('GroupDetails', { group });
            }} >
                <Text style={styles.text}>{group.name}</Text>
            </Pressable>
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
  text: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
  pressable: {
    backgroundColor: '#FF7000',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFB',
    margin: 10,
  }
});
