import React from 'react';
import { useIntl } from 'react-intl';
import { UserCircle, User, UserCircle2, Users } from 'lucide-react';

interface PersonalInfoCardProps {
  profile: {
    firstName: string;
    lastName: string;
    nickname: string;
    birthDate: string;
    height: string;
    weight: string;
    gender: string;
  };
  onChange: (field: string, value: string) => void;
}

const genderOptions = [
  {
    value: 'male',
    icon: User,
    label: 'male',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    value: 'female',
    icon: UserCircle2,
    label: 'female',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    value: 'other',
    icon: Users,
    label: 'other',
    gradient: 'from-violet-500 to-purple-500'
  }
];

export function PersonalInfoCard({ profile, onChange }: PersonalInfoCardProps) {
  const intl = useIntl();

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <UserCircle className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'profile.personal.title' })}
        </h3>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {intl.formatMessage({ id: 'profile.firstName' })}
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className="input-field"
              placeholder={intl.formatMessage({ id: 'profile.firstName.placeholder' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {intl.formatMessage({ id: 'profile.lastName' })}
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className="input-field"
              placeholder={intl.formatMessage({ id: 'profile.lastName.placeholder' })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {intl.formatMessage({ id: 'profile.nickname' })}
          </label>
          <input
            type="text"
            value={profile.nickname}
            onChange={(e) => onChange('nickname', e.target.value)}
            className="input-field"
            placeholder={intl.formatMessage({ id: 'profile.nickname.placeholder' })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {intl.formatMessage({ id: 'profile.birthDate' })}
            </label>
            <input
              type="date"
              value={profile.birthDate}
              onChange={(e) => onChange('birthDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {intl.formatMessage({ id: 'profile.height' })}
            </label>
            <input
              type="number"
              value={profile.height}
              onChange={(e) => onChange('height', e.target.value)}
              className="input-field"
              placeholder={intl.formatMessage({ id: 'profile.height.placeholder' })}
              min="0"
              max="300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {intl.formatMessage({ id: 'profile.weight' })}
            </label>
            <input
              type="number"
              value={profile.weight}
              onChange={(e) => onChange('weight', e.target.value)}
              className="input-field"
              placeholder={intl.formatMessage({ id: 'profile.weight.placeholder' })}
              min="0"
              max="500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.gender' })}
          </label>
          <div className="grid grid-cols-3 gap-4">
            {genderOptions.map(({ value, icon: Icon, label, gradient }) => (
              <button
                key={value}
                onClick={() => onChange('gender', value)}
                className={`relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  profile.gender === value
                    ? `bg-gradient-to-r ${gradient} text-white ring-2 ring-offset-2 ring-${gradient.split('-')[1]}`
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">
                  {intl.formatMessage({ id: `profile.gender.${label}` })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}