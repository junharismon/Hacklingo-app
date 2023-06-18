import { collection, addDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

export default async function createGroupChat(groupName, userEmails, groupLanguage) {
  const groupData = {
    groupName,
    groupLanguage,
    createdAt: new Date(),
    members: userEmails,
  };

  try {
    const docRef = await addDoc(collection(database, 'groupChats'), groupData);
    console.log('Group chat created successfully with ID: ', docRef.id);
  } catch (error) {
    console.error('Error creating group chat:', error);
  }
}