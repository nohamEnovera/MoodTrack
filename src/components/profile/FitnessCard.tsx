import React from 'react';
import { useIntl } from 'react-intl';
import { 
  Dumbbell, 
  Sofa, 
  User, 
  Activity,
  Bike, 
  Flame,
  Plus
} from 'lucide-react';

interface FitnessCardProps {
  fitness: {
    level: string;
    activities: string;
    goals: string;
  };
  onChange: (field: string, value: string) => void;
}

const activityLevels = [
  {
    value: 'sedentary',
    icon: Sofa,
    labelKey: 'profile.fitness.level.sedentary',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    value: 'light',
    icon: User,
    labelKey: 'profile.fitness.level.light',
    gradient: 'from-green-400 to-emerald-400'
  },
  {
    value: 'moderate',
    icon: Activity,
    labelKey: 'profile.fitness.level.moderate',
    gradient: 'from-yellow-400 to-orange-400'
  },
  {
    value: 'very',
    icon: Bike,
    labelKey: 'profile.fitness.level.very',
    gradient: 'from-orange-400 to-red-400'
  },
  {
    value: 'extra',
    icon: Flame,
    labelKey: 'profile.fitness.level.extra',
    gradient: 'from-red-400 to-rose-400'
  }
];

export function FitnessCard({ fitness, onChange }: FitnessCardProps) {
  const intl = useIntl();
  const [showCustomActivity, setShowCustomActivity] = React.useState(false);
  const [customActivity, setCustomActivity] = React.useState('');

  const handleAddActivity = () => {
    if (customActivity.trim()) {
      const currentActivities = fitness.activities ? fitness.activities.split(',').map(a => a.trim()) : [];
      const newActivities = [...currentActivities, customActivity.trim()];
      onChange('activities', newActivities.join(', '));
      setCustomActivity('');
      setShowCustomActivity(false);
    }
  };

  const handleRemoveActivity = (activity: string) => {
    const currentActivities = fitness.activities.split(',').map(a => a.trim());
    const newActivities = currentActivities.filter(a => a !== activity);
    onChange('activities', newActivities.join(', '));
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {intl.formatMessage({ id: 'profile.fitness.title' })}
        </h3>
      </div>

      <div className="space-y-8">
        {/* Niveau d'activité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.fitness.level' })}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {activityLevels.map(({ value, icon: Icon, labelKey, gradient }) => (
              <button
                key={value}
                onClick={() => onChange('level', value)}
                className={`relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  fitness.level === value
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

        {/* Activités */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.fitness.activities' })}
          </label>
          <div className="space-y-4">
            {fitness.activities && (
              <div className="flex flex-wrap gap-2">
                {fitness.activities.split(',').map((activity, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <span>{activity.trim()}</span>
                    <button
                      onClick={() => handleRemoveActivity(activity.trim())}
                      className="hover:text-violet-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showCustomActivity ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  className="input-field flex-1"
                  placeholder={intl.formatMessage({ id: 'profile.fitness.activities.custom.placeholder' })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                />
                <button
                  onClick={handleAddActivity}
                  className="btn btn-primary"
                >
                  {intl.formatMessage({ id: 'profile.fitness.activities.add' })}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomActivity(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>{intl.formatMessage({ id: 'profile.fitness.activities.add' })}</span>
              </button>
            )}
          </div>
        </div>

        {/* Objectifs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: 'profile.fitness.goals' })}
          </label>
          <textarea
            value={fitness.goals}
            onChange={(e) => onChange('goals', e.target.value)}
            className="input-field h-24 resize-none"
            placeholder={intl.formatMessage({ id: 'profile.fitness.goals.placeholder' })}
          />
        </div>
      </div>
    </div>
  );
}