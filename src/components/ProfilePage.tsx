import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { useIntl } from 'react-intl';
import { auth, db } from '../lib/firebase';
import { ref, get, set } from 'firebase/database';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { BiographyCard } from './profile/BiographyCard';
import { DietaryCard } from './profile/DietaryCard';
import { FitnessCard } from './profile/FitnessCard';
import { SleepCard } from './profile/SleepCard';
import { SaveButton } from './profile/SaveButton';
import { ProfileToolbar } from './profile/ProfileToolbar';
import type { UserProfile } from '../types/profile';

const initialProfile: UserProfile = {
  firstName: '',
  lastName: '',
  nickname: '',
  birthDate: '',
  height: '',
  weight: '',
  gender: '',
  bio: '',
  diet: {
    type: '',
    restrictions: '',
    goals: ''
  },
  fitness: {
    level: '',
    activities: '',
    goals: ''
  },
  sleep: {
    average: '',
    quality: '',
    bedtime: '',
    waketime: ''
  }
};

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [currentSection, setCurrentSection] = useState('toolbar.personal');
  const intl = useIntl();

  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.currentUser) return;

      const profileRef = ref(db, `users/${auth.currentUser.uid}/profile`);
      try {
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const profileRef = ref(db, `users/${auth.currentUser.uid}/profile`);
      await set(profileRef, profile);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleBioChange = (value: string) => {
    setProfile(prev => ({ ...prev, bio: value }));
  };

  const handleDietChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      diet: { ...prev.diet, [field]: value }
    }));
  };

  const handleFitnessChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      fitness: { ...prev.fitness, [field]: value }
    }));
  };

  const handleSleepChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      sleep: { ...prev.sleep, [field]: value }
    }));
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'toolbar.personal':
        return (
          <PersonalInfoCard 
            profile={profile} 
            onChange={handlePersonalInfoChange} 
          />
        );
      case 'toolbar.bio':
        return (
          <BiographyCard 
            bio={profile.bio} 
            onChange={handleBioChange} 
          />
        );
      case 'toolbar.diet':
        return (
          <DietaryCard 
            diet={profile.diet} 
            onChange={handleDietChange} 
          />
        );
      case 'toolbar.fitness':
        return (
          <FitnessCard 
            fitness={profile.fitness} 
            onChange={handleFitnessChange} 
          />
        );
      case 'toolbar.sleep':
        return (
          <SleepCard 
            sleep={profile.sleep} 
            onChange={handleSleepChange} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 lg:py-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto ">
        {/* Desktop Layout */}
        <div className="hidden lg:space-y-4 lg:block">
          <PersonalInfoCard 
            profile={profile} 
            onChange={handlePersonalInfoChange} 
          />
          <BiographyCard 
            bio={profile.bio} 
            onChange={handleBioChange} 
          />
          <DietaryCard 
            diet={profile.diet} 
            onChange={handleDietChange} 
          />
          <FitnessCard 
            fitness={profile.fitness} 
            onChange={handleFitnessChange} 
          />
          <SleepCard 
            sleep={profile.sleep} 
            onChange={handleSleepChange} 
          />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {renderSection()}
        </div>

        <SaveButton 
          isSaving={isSaving}
          saveStatus={saveStatus}
          onSave={handleSave}
        />
      </div>

      {/* Mobile Toolbar */}
      <ProfileToolbar 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
    </div>
  );
}