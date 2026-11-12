import React from 'react';
import { 
  Heart, 
  Brain, 
  Smile, 
  Bone, 
  Stethoscope, 
  Activity, 
  Sparkles 
} from 'lucide-react';

const CATEGORY_MAP = {
  general: {
    label: 'General Medicine',
    class: 'badge-category-general',
    icon: Stethoscope,
  },
  cardiology: {
    label: 'Cardiology',
    class: 'badge-category-cardiology',
    icon: Heart,
  },
  dermatology: {
    label: 'Dermatology',
    class: 'badge-category-dermatology',
    icon: Sparkles,
  },
  neurology: {
    label: 'Neurology',
    class: 'badge-category-neurology',
    icon: Brain,
  },
  pediatrics: {
    label: 'Pediatrics',
    class: 'badge-category-pediatrics',
    icon: Smile,
  },
  orthopedics: {
    label: 'Orthopedics',
    class: 'badge-category-orthopedics',
    icon: Bone,
  },
};

const CategoryBadge = ({ category = 'General', size = 'sm', showIcon = true, className = '' }) => {
  const key = (category || 'General').toLowerCase().trim();
  const config = CATEGORY_MAP[key] || {
    label: category,
    class: 'badge-category-general',
    icon: Activity,
  };

  const IconComponent = config.icon;

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-[11px] px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide transition-colors ${config.class} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {showIcon && <IconComponent className="w-3 h-3 flex-shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};

export default CategoryBadge;

