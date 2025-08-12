// Categories data
export const CATEGORIES = [
    {id: 'all', name: 'All', icon: '📋', color: '#6B7280'},
    {id: 'work', name: 'Work', icon: '💼', color: '#3B82F6'},
    {id: 'personal', name: 'Personal', icon: '👤', color: '#10B981'},
    {id: 'health', name: 'Health', icon: '🏃', color: '#F59E0B'},
    {id: 'learning', name: 'Learning', icon: '📚', color: '#8B5CF6'},
    {id: 'other', name: 'Others', icon: '⚙️', color: '#8B5CF6'},
];

// Priority colors
export const PRIORITY_COLORS = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
    default: '#6B7280'
};

// Date utilities
export const formatDate = (dateString) => {
    if (!dateString) return 'No due date';

    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `${diffDays} days left`;
    return `${Math.abs(diffDays)} days ago`;
};

// Get current date formatted
export const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return {day, month, year};
};

// Task filtering utility
export const filterTasks = (tasks, searchQuery, selectedCategory) => {
    return tasks.filter(task => {
        const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' ||
            (task.category || '').toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });
};

// Task statistics calculator
export const calculateTaskStats = (tasks) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const pendingTasks = totalTasks - completedTasks;

    return {completedTasks, totalTasks, pendingTasks};
};