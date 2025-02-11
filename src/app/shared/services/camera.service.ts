import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private _storage: AngularFireStorage,
  ) { }

  async takePicture():Promise<any> {
    return await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
  };

  async selectPicture():Promise<any> {
    return await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    })
  }

  async uploadPhotoToCloudStorage(bucket:string, imageData: any) {
    const { dataUrl, format } = imageData;
    const randomNumber = Math.floor(Math.random() * 10000);
    const fileName = `${new Date().getTime()}_${randomNumber}.${format}`;
    const filePath = `${bucket}/${fileName}`;
    const blob = this.dataURItoBlob(dataUrl);
    const uploadTask = this._storage.upload(filePath, blob, { contentType: `image/${format}` });
    return uploadTask;
  }

  dataURItoBlob(dataURI: string): Blob {    
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  async deleteAsset(storagePath: string): Promise<void> {
    const storage = getStorage();
    const storageRef = ref(storage, storagePath);
    return await deleteObject(storageRef);
  }
  
}
