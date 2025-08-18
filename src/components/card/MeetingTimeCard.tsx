import { Users, Clock, TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import { FC } from 'react';

// Types stricts
type IconName = 'users' | 'clock' | 'trending-up' | 'calendar' | 'target' | 'activity';
type ColorSchemeName = 'green' | 'blue' | 'purple' | 'pink' | 'orange' | 'indigo' | 'cyan';

interface MeetingTimeCardProps {
    title?: string;
    value?: string;
    period?: string;
    colorScheme?: ColorSchemeName;
    icon?: IconName;
}

// Map des icônes avec typage
const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
    users: Users,
    clock: Clock,
    'trending-up': TrendingUp,
    calendar: Calendar,
    target: Target,
    activity: Activity,
};

// Map des couleurs avec typage
const colorSchemes: Record<ColorSchemeName, {
    bg: string;
    border: string;
    icon: string;
    title: string;
    value: string;
    period: string;
}> = {
    green: {
        bg: "bg-green-100",
        border: "border-green-200",
        icon: "text-green-700",
        title: "text-green-800",
        value: "text-green-900",
        period: "text-green-700"
    },
    blue: {
        bg: "bg-blue-100",
        border: "border-blue-200",
        icon: "text-blue-700",
        title: "text-blue-800",
        value: "text-blue-900",
        period: "text-blue-700"
    },
    purple: {
        bg: "bg-purple-100",
        border: "border-purple-200",
        icon: "text-purple-700",
        title: "text-purple-800",
        value: "text-purple-900",
        period: "text-purple-700"
    },
    pink: {
        bg: "bg-pink-100",
        border: "border-pink-200",
        icon: "text-pink-700",
        title: "text-pink-800",
        value: "text-pink-900",
        period: "text-pink-700"
    },
    orange: {
        bg: "bg-orange-100",
        border: "border-orange-200",
        icon: "text-orange-700",
        title: "text-orange-800",
        value: "text-orange-900",
        period: "text-orange-700"
    },
    indigo: {
        bg: "bg-indigo-100",
        border: "border-indigo-200",
        icon: "text-indigo-700",
        title: "text-indigo-800",
        value: "text-indigo-900",
        period: "text-indigo-700"
    },
    cyan: {
        bg: "bg-cyan-100",
        border: "border-cyan-200",
        icon: "text-cyan-700",
        title: "text-cyan-800",
        value: "text-cyan-900",
        period: "text-cyan-700"
    }
};

const MeetingTimeCard: FC<MeetingTimeCardProps> = ({
    title = "Temps passée en réunion",
    value = '4h',
    period = "Aujourd'hui",
    colorScheme = "green",
    icon = "users"
}) => {
    const IconComponent = iconMap[icon];
    const colors = colorSchemes[colorScheme];

    return (
        <div className={`${colors.bg} ${colors.border} rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] p-4`}>
            {/* Header icon & titre */}
            <div className="flex items-center gap-2 mb-3">
                <IconComponent className={`w-4 h-4 ${colors.icon}`} />
                <span className={`text-xs font-medium ${colors.title}`}>
                    {title}
                </span>
            </div>
            {/* Valeur */}
            <div className={`text-2xl font-bold ${colors.value}`}>
                {value}
            </div>
            {/* Période */}
            <div className={`text-xs ${colors.period}`}>
                {period}
            </div>
        </div>
    );
};

export default MeetingTimeCard;
