# TaskFlow - App Pages & Features

## 🏠 Main Navigation Structure

### Tab Navigation (Bottom Tabs)
1. **Home** - Main task dashboard
2. **Tasks** - Full task management
3. **Reminders** - Notification settings
4. **Statistics** - Progress tracking
5. **Settings** - App configuration

---

## 📱 Detailed Screen Breakdown

### 1. **Home Screen** (`HomeScreen.tsx`)
- **Purpose:** Main dashboard with quick overview
- **Features:**
  - Today's tasks summary
  - Quick add task button
  - Recent tasks preview
  - Progress ring/chart
  - Weather widget (optional)
  - Motivational quote
- **Navigation:** Entry point, links to all other screens

### 2. **Task Management Screens**

#### **Tasks List Screen** (`TasksScreen.tsx`)
- **Features:**
  - All tasks with filtering options
  - Search functionality
  - Sort by: date, priority, category
  - Swipe actions (complete, edit, delete)
  - Bulk actions
  - Category tabs

#### **Add Task Screen** (`AddTaskScreen.tsx`)
- **Features:**
  - Task title and description
  - Category selection
  - Priority level (High, Medium, Low)
  - Due date picker
  - Reminder settings
  - Subtasks creation
  - Attachment support (optional)

#### **Edit Task Screen** (`EditTaskScreen.tsx`)
- **Features:**
  - Modify existing task details
  - Update reminders
  - Change priority/category
  - Add notes/comments
  - History of changes

#### **Task Detail Screen** (`TaskDetailScreen.tsx`)
- **Features:**
  - Full task information
  - Subtasks list
  - Comments/notes section
  - Attachment preview
  - Related tasks
  - Activity timeline

### 3. **Reminders Screen** (`RemindersScreen.tsx`)
- **Features:**
  - All active reminders
  - Reminder types:
    - Time-based (specific time)
    - Location-based (GPS)
    - Recurring reminders
  - Notification settings
  - Snooze options
  - Custom notification sounds

### 4. **Categories Screen** (`CategoriesScreen.tsx`)
- **Features:**
  - Create/edit categories
  - Color coding system
  - Category statistics
  - Default categories:
    - Work
    - Personal
    - Health
    - Learning
    - Shopping
    - Bills

### 5. **Statistics Screen** (`StatisticsScreen.tsx`)
- **Features:**
  - Task completion charts
  - Weekly/Monthly progress
  - Category-wise breakdown
  - Productivity trends
  - Achievement badges
  - Export reports

### 6. **Search Screen** (`SearchScreen.tsx`)
- **Features:**
  - Global search across all tasks
  - Filter by multiple criteria
  - Recent searches
  - Search suggestions
  - Advanced filters

### 7. **Settings Screen** (`SettingsScreen.tsx`)
- **Features:**
  - **Appearance:**
    - Dark/Light theme toggle
    - Font size adjustment
    - Color scheme selection
  - **Notifications:**
    - Push notification settings
    - Notification sounds
    - Quiet hours
  - **Data Management:**
    - Backup/Restore
    - Export data
    - Clear completed tasks
  - **About:**
    - App version
    - Privacy policy
    - Terms of service

---

## 🎨 Key UI Components

### Navigation Components
- **Bottom Tab Bar** - Main navigation
- **Header Bar** - Screen titles and actions
- **Drawer Menu** - Secondary navigation (optional)

### Task Components
- **TaskItem** - Individual task display
- **TaskList** - List of tasks with virtualization
- **TaskForm** - Add/Edit task form
- **TaskFilter** - Filtering options
- **TaskStats** - Progress indicators

### Interactive Elements
- **FloatingActionButton** - Quick add task
- **SwipeActions** - Task actions (complete, edit, delete)
- **DateTimePicker** - Date/time selection
- **CategoryPicker** - Category selection
- **PrioritySelector** - Priority level selection

### Feedback Components
- **Loading States** - Skeleton screens
- **Empty States** - No tasks illustrations
- **Success/Error Messages** - Toast notifications
- **Progress Indicators** - Loading bars and spinners

---

## 🔄 User Flow Examples

### Adding a New Task
1. Tap FloatingActionButton or "Add Task"
2. Fill task details (title, description)
3. Select category and priority
4. Set due date and reminders
5. Save task
6. Return to task list with new task visible

### Completing a Task
1. Swipe right on task item
2. Tap checkmark
3. Task moves to completed state
4. Statistics update
5. Optional celebration animation

### Setting Reminders
1. Navigate to Reminders screen
2. Tap "Add Reminder"
3. Choose reminder type (time/location)
4. Set specific parameters
5. Configure notification preferences
6. Save reminder