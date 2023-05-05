import { Pressable, View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { GroupCardProps } from '../navigation/screens/EventGroups';

export default function GroupCard({ item }: { item: GroupCardProps }) {
  const { group, navigation } = item;

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
