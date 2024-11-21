import { useIntl } from 'react-intl';
import { Heart, Sun, Smile, Cloud, CloudRain } from 'lucide-react';

export function useTranslatedMoods() {
  const intl = useIntl();

  return [
    {
      icon: Heart,
      label: intl.formatMessage({ id: 'mood.amazing' }),
      color: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white',
      description: intl.formatMessage({ id: 'mood.description.amazing' }),
    },
    {
      icon: Sun,
      label: intl.formatMessage({ id: 'mood.good' }),
      color: 'bg-gradient-to-br from-amber-400 to-orange-400 text-white',
      description: intl.formatMessage({ id: 'mood.description.good' }),
    },
    {
      icon: Smile,
      label: intl.formatMessage({ id: 'mood.okay' }),
      color: 'bg-gradient-to-br from-emerald-400 to-teal-400 text-white',
      description: intl.formatMessage({ id: 'mood.description.okay' }),
    },
    {
      icon: Cloud,
      label: intl.formatMessage({ id: 'mood.meh' }),
      color: 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white',
      description: intl.formatMessage({ id: 'mood.description.meh' }),
    },
    {
      icon: CloudRain,
      label: intl.formatMessage({ id: 'mood.bad' }),
      color: 'bg-gradient-to-br from-violet-500 to-purple-500 text-white',
      description: intl.formatMessage({ id: 'mood.description.bad' }),
    },
  ];
}