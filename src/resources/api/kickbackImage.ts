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

  public async uploadImage(file: File, fileName: string): Promise<string> {
    const storageRef = ref(this.storage, fileName);

    const a = await uploadBytes(storageRef, file);
    console.log('Upload Result:', a);

    return '';
  }
}
