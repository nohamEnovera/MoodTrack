export const getFirebaseErrorCode = (error: any): string => {
  const errorCode = error?.code || '';
  const cleanCode = errorCode.replace('auth/', '');
  
  switch (cleanCode) {
    case 'email-already-in-use':
    case 'invalid-email':
    case 'operation-not-allowed':
    case 'weak-password':
    case 'user-disabled':
    case 'user-not-found':
    case 'wrong-password':
    case 'popup-closed-by-user':
    case 'cancelled-popup-request':
      return cleanCode === 'popup-closed-by-user' ? 'popup-closed' : 
             cleanCode === 'cancelled-popup-request' ? 'cancelled' : 
             cleanCode;
    default:
      return 'default';
  }
};