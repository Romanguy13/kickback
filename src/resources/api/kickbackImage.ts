import { ref, getDownloadURL, FirebaseStorage, uploadBytes } from 'firebase/storage';
import { FB_STORAGE } from '../../../firebaseConfig';

export default class KickbackImage {
  protected readonly storage: FirebaseStorage;

  constructor(storage?: FirebaseStorage) {
    this.storage = storage || FB_STORAGE;
  }

  public async downloadImage(image: string): Promise<string> {
    const storageRef = ref(this.storage, image);
    let url: string;

    try {
      url = await getDownloadURL(storageRef);
    } catch (err) {
      throw new Error(`Image Service: ${image} does not exist.`);
    }

    return url;
  }

  public async uploadImage(fileUri: string, fileName: string): Promise<string> {
    const storageRef = ref(this.storage, fileName);
    let file: Blob;
    console.log('file is ', fileUri);
    try {
      // this line is crapping out
      file = await this.convertUriToFile(fileUri);
      console.log('back from function');
    } catch (e) {
      throw new Error(`Image Service: ${fileUri} gone wrong.`);
    }

    // DO NOT REMOVE THE PRINT STATEMENTS BELOW
    console.log('uploading image');
    console.log('file is ', file);
    console.log('storageRef is ', storageRef);
    const uploadResult = await uploadBytes(storageRef, file);
    console.log('returning to function');
    return uploadResult.metadata.fullPath;
  }

  // eslint-disable-next-line class-methods-use-this
  private async convertUriToFile(uri: string): Promise<Blob> {
    // this is where it's crapping out
    console.log('string is', uri);
    const response = await fetch(uri);
    console.log('response ');
    return response.blob();
  }
}
