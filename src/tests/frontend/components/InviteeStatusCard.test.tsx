import { render } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import InviteeStatusCard from '../../../components/InviteeStatusCard';
import { UserReturn } from '../../../resources/schema/user.model';
import { EventReturn } from '../../../resources/schema/event.model';

const currentMember: UserReturn = {
  id: '075',
  name: 'John Doe',
  email: 'jdoe@kickback.com',
  createdAt: Timestamp.fromDate(new Date()),
  updatedAt: Timestamp.fromDate(new Date()),
};

const event: EventReturn = {
  id: '123',
  name: 'Test Event',
  datetime: Timestamp.fromDate(new Date()),
  location: 'Test Location',
  gId: 'group-id',
  inviteeStatus: [],
  hostId: '777',
  createdAt: Timestamp.fromDate(new Date()),
  updatedAt: Timestamp.fromDate(new Date()),
};

const renderInviteeStatusCard = async () =>
  render(<InviteeStatusCard currentMember={currentMember} event={event} key={currentMember.id} />);

test('Renders Card - Attendee not in InviteeStatus Array', async () => {
  await renderInviteeStatusCard();
});
