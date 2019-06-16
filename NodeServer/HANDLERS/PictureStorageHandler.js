
async function ImageUploader(admin,picture){

    // Creates a storage ref 
    var storageRef = admin.storage().bucket("UserFiles");

    // Upload file
    // var task = await storageRef.put(picture);


    return "Done!"

}


module.exports = {
    ImageUploader:ImageUploader
}