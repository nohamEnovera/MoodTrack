import React from 'react';
import { useIntl } from 'react-intl';
import { Utensils, Apple, Leaf, Fish, Coffee, AlertCircle } from 'lucide-react';

interface DietaryCardProps {
  diet: {
    type: string;
    restrictions: string;
    goals: string;
  };
  onChange: (field: string, value: string) => void;
}

const dietTypes = [
  {
    value: 'omnivore',
    icon: Utensils,
    labelKey: 'profile.diet.type.omnivore',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    value: 'vegetarian',
    icon: Apple,
    labelKey: 'profile.diet.type.vegetarian',
    gradient: 'from-emerald-500 to-green-500'
  },
  {
    value: 'vegan',
    icon: Leaf,
    labelKey: 'profile.diet.type.vegan',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    value: 'pescatarian',
    icon: Fish,
    labelKey: 'profile.diet.type.pescatarian',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    value: 'other',
    icon: Coffee,
    labelKey: 'profile.diet.type.other',
    gradient: 'from-violet-500 to-purple-500'
  }
];

const commonRestrictions = [
  'gluten',
  'lactose',
  'nuts',
  'eggs',
  'soy',
  'shellfish'
];

export function DietaryCard({ diet, onChange }: DietaryCardProps) {
  const intl = useIntl();
  const [showCustomRestriction, setShowCustomRestriction] = React.useState(false);
  const [customRestriction, setCustomRestriction] = React.useState('');

  const handleAddRestriction = () => {
    if (customRestriction.trim()) {
      const currentRestrictions = diet.restrictions ? diet.restrictions.split(',').map(r => r.trim()) : [];
      const newRestrictions = [...currentRestrictions, customRestriction.trim()];
      onChange('restrictions', newRestrictions.join(', '));
      setCustomRestriction('');
      setShowCustomRestriction(false);
    }
  };

  const handleRemoveRestriction = (restriction: string) => {
    const currentRestrictions = diet.restrictions.split(',').map(r => r.trim());
    const newRestrictions = currentRestrictions.filter(r => r !== restriction);
    onChange('restrictions', newRestrictions.join(', '));
  };

  const handleToggleRestriction = (restriction: string) => {
    const currentRestrictions = diet.restrictions ? diet.restrictions.split(',').map(r => r.trim()) : [];
    if (currentRestrictions.includes(restriction)) {
      handleRemoveRestriction(restriction);
    } else {
      const newRestrictions = [...currentRestrictions, restriction];
      onChange('restrictions', newRestrictions.join(', '));
    }
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <Utensils className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'profile.diet.title' })}
        </h3>
      </div>

      <div className="space-y-8">
        {/* Type de régime */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.diet.type' })}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {dietTypes.map(({ value, icon: Icon, labelKey, gradient }) => (
              <button
                key={value}
                onClick={() => onChange('type', value)}
                className={`relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  diet.type === value
                    ? `bg-gradient-to-r ${gradient} text-white ring-2 ring-offset-2 ring-${gradient.split('-')[1]}`
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-center">
                  {intl.formatMessage({ id: labelKey })}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Restrictions alimentaires */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.diet.restrictions' })}
          </label>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {commonRestrictions.map(restriction => (
                <button
                  key={restriction}
                  onClick={() => handleToggleRestriction(restriction)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    diet.restrictions?.includes(restriction)
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {restriction}
                </button>
              ))}
              <button
                onClick={() => setShowCustomRestriction(true)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
              >
                + {intl.formatMessage({ id: 'profile.diet.restrictions.add' })}
              </button>
            </div>

            {showCustomRestriction && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customRestriction}
                  onChange={(e) => setCustomRestriction(e.target.value)}
                  className="input-field flex-1"
                  placeholder={intl.formatMessage({ id: 'profile.diet.restrictions.custom.placeholder' })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRestriction()}
                />
                <button
                  onClick={handleAddRestriction}
                  className="btn btn-primary"
                >
                  {intl.formatMessage({ id: 'profile.diet.restrictions.add' })}
                </button>
              </div>
            )}

            {diet.restrictions && (
              <div className="flex flex-wrap gap-2">
                {diet.restrictions.split(',').map((restriction, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <span>{restriction.trim()}</span>
                    <button
                      onClick={() => handleRemoveRestriction(restriction.trim())}
                      className="hover:text-violet-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Objectifs nutritionnels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.diet.goals' })}
          </label>
          <div className="relative">
            <textarea
              value={diet.goals}
              onChange={(e) => onChange('goals', e.target.value)}
              className="input-field h-24 resize-none pl-10"
              placeholder={intl.formatMessage({ id: 'profile.diet.goals.placeholder' })}
            />
            <AlertCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}