import { StyleSheet, Pressable, View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { GroupCardProps } from '../navigation/screens/EventGroups';
import { UserModel } from '../resources/schema/user.model';

export default function GroupCard({ item }: { item: GroupCardProps }) {
  const { group, navigation, events, topMembers, extraMembers } = item;
  const backgroundChipColors = ['#D9D9D9', '#EC9090', '#9BEFE5', '#FFD464'];
  let groupName: string = group.name;
  console.log('Group name length: ', groupName.length);

  // Sets a trimmed version of group name, if larger than 15 characters
  if (groupName.length >= 17) {
    groupName = `${groupName.substring(0, 15)}...`;
  }

  return (
    <Pressable
      style={styles.pressable}
      onPress={() => {
        navigation.navigate('GroupDetails', { group });
      }}
    >
      <Text style={styles.header}>{groupName}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {topMembers.map((user: UserModel, i: number) => (
          <View
            style={[styles.avatarChip, { backgroundColor: backgroundChipColors[i] }]}
            key={user.email}
          >
            <Text style={styles.avatarChipText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
        ))}
        {extraMembers > 0 && (
          <View style={[styles.avatarChip, { backgroundColor: '#FFB1F7' }]}>
            <Text style={styles.avatarChipText}>+{extraMembers}</Text>
          </View>
        )}
      </View>
      <Text style={{ textAlign: 'center' }}>{events.length} Events Together</Text>
    </Pressable>
  );
}

const styles = {
  pressable: {
    alignSelf: 'center',
    justifySelf: 'center',
    backgroundColor: '#FFFFFB',
    borderRadius: 10,
    borderTopColor: '#FF7000',
    borderTopWidth: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#272222',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    width: '90%',
    shadowColor: '#272222',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation property for Android
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#272222',
    textAlign: 'center',
  },
  avatarChip: {
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
    width: 50,
    height: 50,
    padding: 5,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarChipText: {
    color: '#272222',
    fontSize: 32,
    fontWeight: 'bold',
  },
};
