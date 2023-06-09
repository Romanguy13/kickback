import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { StyleProp, Text, View } from 'react-native';
import { EventReturn, InviteeStatus } from '../resources/schema/event.model';
import { UserReturn } from '../resources/schema/user.model';

export default function InviteeStatusCard({
  currentMember,
  event,
  forPayment = false,
}: {
  currentMember: UserReturn;
  event: EventReturn;
  // eslint-disable-next-line react/require-default-props
  forPayment?: boolean;
}) {
  let isAttending;
  let icon: JSX.Element | null = null;

  if (!forPayment) {
    console.log('event', event);

    isAttending = event.inviteeStatus.find(
      (currInvitee: InviteeStatus) => currInvitee.id === currentMember.id
    );

    if (currentMember.id === event.hostId) {
      icon = <Ionicons name="star" size={25} color="#FF7000" />;
    } else if (!isAttending) {
      icon = <Ionicons name="help" size={25} color="#FF7000" />;
    } else if (isAttending.status) {
      icon = <Ionicons name="checkmark-sharp" size={25} color="#FF7000" />;
    } else if (isAttending.status === false) {
      icon = <Ionicons name="close-sharp" size={25} color="#FF7000" />;
    }
  } else {
    isAttending = event.paidStatus.find(
      (currInvitee: InviteeStatus) => currInvitee.id === currentMember.id
    );

    if (!isAttending) {
      icon = <Ionicons name="help" size={25} color="#FF7000" />;
    } else if (isAttending.status) {
      icon = <Ionicons name="checkmark-sharp" size={25} color="#FF7000" testID="paid-icon" />;
    } else if (isAttending.status === false) {
      icon = <Ionicons name="close-sharp" size={25} color="#FF7000" testID="unpaid-icon" />;
    }
  }

  // First check to see if the name has a space, if it does splt it and return the first name
  // If it doesn't have a space, return the name
  const firstName = currentMember.name.includes(' ')
    ? currentMember.name.split(' ')[0]
    : currentMember.name;

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
      <Text style={styles.usersText}>{firstName}</Text>
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
