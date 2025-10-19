# Dashboard Creation Prompt

Create a responsive wellness dashboard with the following specifications:

## Overall Layout

- 5 cards total arranged in a 3-row grid layout
- Fully mobile responsive design
- Modern, clean UI with consistent spacing and styling
- Use CSS Grid or Flexbox for layout management

## Row 1: Feature Cards (2 cards side-by-side)

Create two feature introduction cards, each containing:

- **Logo/Icon**: Relevant icon or small logo at the top
- **Title**: Clear, descriptive heading
- **Navigation Button**: Prominent CTA button
- **Description**: Brief 2-3 line explanation of the feature
- **Usage Tips**: 3 bullet points explaining "How to use better" or best practices
- **Styling**: Card-based design with hover effects, consistent padding

## Row 2: Interactive Tools (2 cards side-by-side)

### Card 1: Meditation Music Player

- **Playlist Display**: Show list of meditation tracks with titles and durations
- **Music Controls**: Full functionality including:
  - Play/Pause button
  - Previous/Next track buttons
  - Progress bar with seek functionality
  - Volume control
  - Current track display with time remaining/elapsed
- **UI**: Player controls positioned at bottom of card
- **Sample Tracks**: Include 4-5 placeholder meditation tracks

### Card 2: Time Management Calendar

- **Calendar View**: Monthly calendar display showing current month
- **Basic Functionality**:
  - Navigate between months
  - Highlight current day
  - Click to select dates
  - Basic event/task indicators
- **Time Management Features**:
  - Simple task list for selected date
  - Add/remove tasks functionality
  - Time blocking visual indicators
- **Responsive**: Calendar should adapt to card size

## Row 3: Daily Journaling (1 full-width card)

### Left Side: Previous Entries

- **Journal History**: Scrollable list of previous journal entries
- **Entry Preview**: Show date and first few lines of each entry
- **Search/Filter**: Basic filtering by date or keyword
- **Click to View**: Expand previous entries for full reading

### Right Side: Today's Journal

- **Current Date**: Display today's date prominently
- **Text Editor**: Rich text area for writing today's journal
- **Auto-Save**: Implement automatic saving every 30 seconds or on text change
- **Word Count**: Display current word count
- **Save Indicator**: Visual feedback when auto-save occurs

## Technical Requirements

- **Framework**: Use React with TypeScript
- **Styling**: Modern CSS with CSS Variables for theming, Tailwind CSS, shadCN library
- **Storage**: Use localStorage for data persistence (journal entries, playlists, calendar events)
- **Responsive Breakpoints**:
  - Mobile: Stack all cards vertically
  - Tablet: 2x2 grid for first 4 cards, full-width for journal
  - Desktop: Layout as specified above
- **Icons**: Use a consistent icon library Lucide
- **Colors**: Use a cohesive color scheme with proper contrast ratios

## Functionality Details

- **Music Player**: Implement basic HTML5 audio controls with custom styling
- **Calendar**: Create interactive calendar with date selection and basic event management
- **Journal**: Implement debounced auto-save, local storage persistence
- **Navigation**: Smooth scrolling between sections if needed
- **Loading States**: Add loading indicators where appropriate

## Design Guidelines

- Clean, slick, modern, minimalist design with plenty of whitespace
- Consistent card shadows and border radius
- Hover effects and smooth transitions
- Accessible color contrast and focus states
- Mobile-first responsive design approach

Create a fully functional page with placeholder content and ensure all interactive elements work properly. Include comments in the code explaining key functionality and responsive behavior.
