import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { GroupCardProps } from './EventGroups';

// type GroupDetailsProps = StackScreenProps<
//     { GroupDetails: { group: GroupReturnModel } },
//     'GroupDetails'
// >;

export default function GroupDetails({ navigation, route }: { navigation: any; route: any }) {
  const { group }: GroupCardProps = route.params;

  return (
    <View
      style={{
        flex: 1,
        marginTop: 60,
      }}
    >
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          backgroundColor: '#FF7000',
          borderRadius: 10,
          borderWidth: 2,
        }}
      >
        <Text>CLICK ME TO GO BACK PLEASE</Text>
      </Pressable>
      <View
        style={{
          marginTop: 30,
          padding: 30,
        }}
      >
        <Text>{group.name}</Text>
      </View>
    </View>
  );
}
