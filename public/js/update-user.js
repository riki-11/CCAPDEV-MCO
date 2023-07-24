const userPhotoBuffer = new Uint8Array(0); // Default empty buffer

function bufferToDataURL(buffer) {
  const byteArray = new Uint8Array(buffer);
  const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Change the type as needed
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}

async function setProfilePhoto() {
  try {
    const photoDataURL = await bufferToDataURL(userPhotoBuffer);
    const profilePhotoDiv = document.getElementById('profilePhotoDiv');
    profilePhotoDiv.style.backgroundImage = `url('${photoDataURL}')`;
  } catch (error) {
    console.error('Error loading the profile photo:', error);
  }
}

setProfilePhoto();
