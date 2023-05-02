import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
import NavBar from './NavBar';
import GroupMembers from "../resources/api/groupMembers";
import {FB_AUTH} from "../../firebaseConfig";
import Groups from "../resources/api/groups";

interface EventGroupsProps {
  navigation: any;
}

export default function EventGroups({ navigation }: any) {
  useEffect(() => {
    const fetchData = async () => {
      const groupIds = await new GroupMembers().getAll(FB_AUTH.currentUser?.uid as string, 'userId');
      const groups: Groups[] = [];
      groupIds.map(async (group) => {
        const groupData = await new Groups().get(group.groupId);

        // Only add to array if groupData is not null
        if (groupData) {
          groups.push(groupData as Groups);
        }
      });
    }

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.textContainer}>
        <Text style={styles.text}>Groups</Text>
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
    fontSize: 70,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
});
