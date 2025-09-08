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

// Map des icônes
const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
    users: Users,
    clock: Clock,
    'trending-up': TrendingUp,
    calendar: Calendar,
    target: Target,
    activity: Activity,
};

// Map des couleurs avec fond noir en dark mode
const colorSchemes: Record<ColorSchemeName, {
    bg: string;
    border: string;
    icon: string;
    title: string;
    value: string;
    period: string;
}> = {
    green: {
        bg: "bg-green-100 dark:bg-black",
        border: "border-green-200 dark:border-green-700",
        icon: "text-green-700 dark:text-green-400",
        title: "text-green-800 dark:text-green-300",
        value: "text-green-900 dark:text-green-200",
        period: "text-green-700 dark:text-green-500"
    },
    blue: {
        bg: "bg-blue-100 dark:bg-black",
        border: "border-blue-200 dark:border-blue-700",
        icon: "text-blue-700 dark:text-blue-400",
        title: "text-blue-800 dark:text-blue-300",
        value: "text-blue-900 dark:text-blue-200",
        period: "text-blue-700 dark:text-blue-500"
    },
    purple: {
        bg: "bg-purple-100 dark:bg-black",
        border: "border-purple-200 dark:border-purple-700",
        icon: "text-purple-700 dark:text-purple-400",
        title: "text-purple-800 dark:text-purple-300",
        value: "text-purple-900 dark:text-purple-200",
        period: "text-purple-700 dark:text-purple-500"
    },
    pink: {
        bg: "bg-pink-100 dark:bg-black",
        border: "border-pink-200 dark:border-pink-700",
        icon: "text-pink-700 dark:text-pink-400",
        title: "text-pink-800 dark:text-pink-300",
        value: "text-pink-900 dark:text-pink-200",
        period: "text-pink-700 dark:text-pink-500"
    },
    orange: {
        bg: "bg-orange-100 dark:bg-black",
        border: "border-orange-200 dark:border-orange-700",
        icon: "text-orange-700 dark:text-orange-400",
        title: "text-orange-800 dark:text-orange-300",
        value: "text-orange-900 dark:text-orange-200",
        period: "text-orange-700 dark:text-orange-500"
    },
    indigo: {
        bg: "bg-indigo-100 dark:bg-black",
        border: "border-indigo-200 dark:border-indigo-700",
        icon: "text-indigo-700 dark:text-indigo-400",
        title: "text-indigo-800 dark:text-indigo-300",
        value: "text-indigo-900 dark:text-indigo-200",
        period: "text-indigo-700 dark:text-indigo-500"
    },
    cyan: {
        bg: "bg-cyan-100 dark:bg-black",
        border: "border-cyan-200 dark:border-cyan-700",
        icon: "text-cyan-700 dark:text-cyan-400",
        title: "text-cyan-800 dark:text-cyan-300",
        value: "text-cyan-900 dark:text-cyan-200",
        period: "text-cyan-700 dark:text-cyan-500"
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
        <div
            className={`${colors.bg} ${colors.border} border rounded-2xl shadow-md hover:shadow-lg transition-colors duration-300 transform hover:scale-[1.02] p-4`}
        >
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
