import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { EventReturn, InviteeStatus } from '../resources/schema/event.model';
import { UserReturn } from '../resources/schema/user.model';

export default function InviteeStatusCard({
  currentMember,
  event,
}: {
  currentMember: UserReturn;
  event: EventReturn;
}) {
  const isAttending: InviteeStatus | undefined = event.inviteeStatus.find(
    (currInvitee: InviteeStatus) => currInvitee.id === currentMember.id
  );

  console.log('isAttending', isAttending);

  let icon: JSX.Element | null = null;

  if (currentMember.id === event.hostId) {
    icon = <Ionicons name="star" size={25} color="#FF7000" />;
  } else if (!isAttending) {
    icon = <Ionicons name="help" size={25} color="#FF7000" />;
  } else if (isAttending.status) {
    icon = <Ionicons name="checkmark" size={25} color="#FF7000" />;
  } else if (isAttending.status === false) {
    icon = <Ionicons name="close" size={25} color="#FF7000" />;
  }

  return (
    <View
      key={currentMember.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
      }}
    >
      <Text style={styles.usersText}>{currentMember.name}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginRight: 10,
        }}
      >
        {icon}
      </View>
    </View>
  );
}

const styles: StyleProp<any> = {
  usersText: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'flex-end',
  },
};
