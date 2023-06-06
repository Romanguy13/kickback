import * as fs from 'fs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'jest-fetch-mock';
import KickbackImage from '../../resources/api/kickbackImage';

jest.mock('firebase/storage');

beforeEach(() => {
  fetchMock.resetMocks();
});

const kickbackImage = new KickbackImage();

test('Able to upload an image', async () => {
  (ref as jest.Mock).mockReturnValue({
    id: 'randomRefId',
  });

  fetchMock.mockResponseOnce(
    JSON.stringify({ blob: () => fs.readFileSync('src/tests/resources/testImage.png') })
  );

  (uploadBytes as jest.Mock).mockResolvedValue({
    metadata: {
      fullPath: 'randomName',
    },
  });

  const returnedId: string = await kickbackImage.uploadImage('randomUri', 'randomName');
  expect(returnedId).toEqual('randomName');
});

test('Uploading an image with a bad uri', async () => {
  (ref as jest.Mock).mockReturnValue({
    id: 'randomRefId',
  });
  fetchMock.dontMockOnce();

  await expect(kickbackImage.uploadImage('randomUri', 'randomName')).rejects.toThrow(
    'Image Service: randomUri gone wrong.'
  );
});

test('Able to download an image', async () => {
  (ref as jest.Mock).mockReturnValue({
    id: 'randomRefId',
  });

  (getDownloadURL as jest.Mock).mockResolvedValue('randomName');

  const returnedId: string = await kickbackImage.downloadImage('randomName');
  expect(returnedId).toEqual('randomName');
});

test('Unable to download an image', async () => {
  (ref as jest.Mock).mockReturnValue({
    id: 'randomRefId',
  });

  (getDownloadURL as jest.Mock).mockRejectedValue('randomName');

  await expect(kickbackImage.downloadImage('randomName')).rejects.toThrow(
    'Image Service: randomName does not exist.'
  );
});
