export interface UserProfile {
  firstName: string;
  lastName: string;
  nickname: string;
  birthDate: string;
  height: string;
  weight: string;
  gender: string;
  bio: string;
  diet: {
    type: string;
    restrictions: string;
    goals: string;
  };
  fitness: {
    level: string;
    activities: string;
    goals: string;
  };
  sleep: {
    average: string;
    quality: string;
    bedtime: string;
    waketime: string;
  };
}