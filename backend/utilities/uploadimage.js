const IMGUR_CLIENT_ID = '4a7ef9e565dbe94'; // Replace with your actual Imgur Client ID
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function uploadImage(file) {
  const clientId = IMGUR_CLIENT_ID;

  // Defensive: Accept either buffer or file object (multer)
  let fileBuffer;
  if (file && Buffer.isBuffer(file)) {
    fileBuffer = file;
  } else if (file && file.buffer && Buffer.isBuffer(file.buffer)) {
    fileBuffer = file.buffer;
  } else {
    throw new TypeError('Invalid file object: must be a Buffer or an object with a Buffer in .buffer');
  }

  // Convert buffer to base64 string for Imgur API
  const base64Image = fileBuffer.toString('base64');

  const formData = new FormData();
  formData.append('image', base64Image);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      console.log('Image uploaded:', data.data.link);
      return data.data.link;
    } else {
      console.error('Upload failed:', data);
      // Propagate error for better error handling
      throw data;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
