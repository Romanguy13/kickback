import { Pressable, View, Text } from 'react-native';
import React from 'react';
import { GroupReturnModel } from '../resources/schema/group.model';

interface GroupCardProps {
  group: GroupReturnModel;
  navigation: any;
}

export default function GroupCard({ group, navigation }: GroupCardProps) {
  return (
    <Pressable
      style={styles.pressable}
      onPress={() => {
        navigation.navigate('GroupDetails', { group });
      }}
    >
      <Text>{group.name}</Text>
    </Pressable>
  );
}

const styles = {
  pressable: {
    backgroundColor: '#FF7000',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFB',
    margin: 10,
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
  text: {},
};
