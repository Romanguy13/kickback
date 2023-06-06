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

    try {
      file = await this.convertUriToFile(fileUri);
    } catch (e) {
      throw new Error(`Image Service: ${fileUri} gone wrong.`);
    }

    const uploadResult = await uploadBytes(storageRef, file);
    return uploadResult.metadata.fullPath;
  }

  // eslint-disable-next-line class-methods-use-this
  private async convertUriToFile(uri: string): Promise<Blob> {
    const response: Response = await fetch(uri);
    return response.blob();
  }
}
