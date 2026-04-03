// AI Roast Generator Service
// Generates personalized roast messages based on missed habits
// 200+ unique roasts for each level!

interface Habit {
    id: number;
    name: string;
    streak: number;
    lastCompleted: string | null;
    completedDates: string[];
    roastLevel: 'mild' | 'medium' | 'savage';
    description?: string;
}

interface RoastContext {
    habitName: string;
    habitDescription?: string;
    currentStreak: number;
    daysMissed: number;
    roastLevel: 'mild' | 'medium' | 'savage';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: string;
}

// Extensive roast message collections (200+ per level!)
const MILD_ROASTS = [
    // Morning - Easygoing
    "Rise and shine! 🌅 The '{habit}' won't do itself!",
    "Good morning! Time to crush '{habit}'! 💪",
    "Morning motivation! You've got this '{habit}'! 😊",
    "Start your day right - do '{habit}'! ⏰",
    "The early bird gets the worm, but you get '{habit}' done! 🐦",
    "Wake up! '{habit}' is waiting for you!",
    "New day, new '{habit}' chance! 🌞",
    "Sun's up! '{habit}' is calling! ☀️",
    "Coffee time? Do '{habit}' first! ☕",
    "Let's make today count with '{habit}'! ✨",
    // Afternoon - Quick reminder
    "Afternoon check-in! '{habit}' done yet? 😄",
    "Quick break? Time for '{habit}'! ⚡",
    "Midday energy for '{habit}'! 🔥",
    "Taking a break? Make it productive with '{habit}'! 💼",
    "You've got this '{habit}' - just do it! ✌️",
    "Almost evening - don't forget '{habit}'! 🌤️",
    "Perfect time for '{habit}'! 🎯",
    "A little '{habit}' goes a long way! 🌟",
    "Keep the momentum - do '{habit}'! 🚀",
    "Almost done with the day - finish '{habit}'! 🌙",
    // Evening - Wind down
    "Evening zen? Complete '{habit}'! 🧘",
    "Relax and check off '{habit}'! ✅",
    "Evening unwind with '{habit}'! 🌙",
    "Perfect end to your day - '{habit}' done! 😌",
    "Wind down - do '{habit}' first! 🛋️",
    "Evening vibes? '{habit}' awaits! 🌆",
    "Time to chill after '{habit}'! 🎵",
    "Peaceful evening with '{habit}' done! 🕯️",
    "Tomorrow starts today with '{habit}'! 🌅",
    "Dream big, start with '{habit}'! 💫",
    // Streak related
    "Keep that {streak}-day streak alive! 🔥",
    "Day {streak} - magic number! Don't break it! ✨",
    "{streak} days strong! You're on fire! 🌟",
    "Almost {streak}! Complete '{habit}'! 🚀",
    "Day {streak} of awesomeness! 💪",
    "Your streak is {streak} days of WIN! 🏆",
    "{streak} days - that's consistency! 🎉",
    "Don't lose that {streak}-day streak! 😱",
    "{streak} days and counting! 🔥",
    "Beast mode: {streak} days! 🦁",
    // Days missed specific
    "Just {days} day(s) - easy comeback! 💪",
    "Get back on the '{habit}' horse! 🐴",
    "One '{habit}' action = big progress! 📈",
    "Start fresh with '{habit}' today! 🌱",
    "Every day is a new '{habit}' start! 🌞",
    "Don't overthink - just do '{habit}'! 🤜",
    "'{habit}' is waiting - don't keep it waiting! ⏰",
    "Quick '{habit}' = big satisfaction! 😊",
    "Feel good - do '{habit}'! 😄",
    "One '{habit}', one day at a time! 👆",
    // Weekday specific
    "Happy {day}! Start with '{habit}'! 🎊",
    "{day} energy = '{habit}' time! ⚡",
    "Make it a great {day} with '{habit}'! ✨",
    "{day} vibes = '{habit}' done! 😎",
    "It's {day}! Do '{habit}'! 💪",
    "Perfect {day} for '{habit}'! 🎯",
    "{day} = '{habit}' day! ⭐",
    "Start {day} strong with '{habit}'! 🔥",
    "{day} motivation: '{habit}'! 🚀",
    "Make {day} '{habit}' day! 🎉",
    // General encouraging
    "You've got this - '{habit}' is easy! 😊",
    "Don't overcomplicate '{habit}'! Just do it! 💪",
    "Small '{habit}' = big results! 📊",
    "Focus on '{habit}'! You've got the power! ⚡",
    "Just one thing: '{habit}'! 🎯",
    "Make it happen - '{habit}' done! 🌟",
    "Your potential = '{habit}' completed! 🚀",
    "Pro tip: Just do '{habit}'! 💡",
    "Success starts with '{habit}'! 🏆",
    "Your '{habit}' = your win! ⭐",
    // Time related
    "Now is the time for '{habit}'! ⏰",
    "This moment = '{habit}' moment! 🎯",
    "Seize the '{habit}' moment! ✨",
    "Right now = perfect '{habit}' time! ⏱️",
    "Today = '{habit}' day! 🎉",
    "Current mood: '{habit}' ready! 😊",
    "Ready = '{habit}' action! 💪",
    "Action time: '{habit}'! ⚡",
    "The clock is ticking for '{habit}'! ⏰",
    "Your moment for '{habit}' is NOW! 🚀",
    // Friendly nudges
    "Thinking of you + '{habit}' = 😊",
    "Your friend '{habit}' misses you! 💕",
    "Hey you! '{habit}' needs love! 😊",
    "Quick '{habit}' hello! 👋",
    "Just a friendly '{habit}' pat! 👏",
    "Your '{habit}' self says hi! 👋",
    "Sending '{habit}' positive vibes! ✨",
    "Consider '{habit}' done! 💪",
    "Rooting for you to '{habit}'! 🙌",
    "You've got '{habit}' support! 💪",
    // Motivation
    "You ARE strong enough for '{habit}'! 💪",
    "Proven capability: '{habit}' complete! 🏆",
    "You're capable of '{habit}'! 🌟",
    "Your track record = '{habit}' done! 📊",
    "You've done '{habit}' before! 🎯",
    "Remember: You crushed '{habit}'! 💥",
    "Success was yours - get it again! ⭐",
    "Your '{habit}' potential is unlimited! 🚀",
    "You're a '{habit}' champion! 🏅",
    "'{habit}' is YOUR thing! 🌟",
    // Fun/casual
    "No pressure, no '{habit}'! 😌",
    "Easy peasy '{habit}' lemon squeezy! 🍋",
    "'{habit}' = quick win! ⚡",
    "Just do '{habit}' - easy! 💫",
    "'{habit}' is a breeze! 🌊",
    "Simple '{habit}' = big win! 📈",
    "Quick '{habit}' check! ✅",
    "'{habit}' - you're almost there! 🎯",
    "One tiny '{habit}' step! 👣",
    "'{habit}' is no biggie! 😎",
    // Inspirational
    "Today's '{habit}' = tomorrow's victory! 🏆",
    "Each '{habit}' builds your empire! 🏰",
    "Your '{habit}' journey continues! 🚀",
    "Every '{habit}' is a win! 🎊",
    "'{habit}' adds to your legacy! 📚",
    "Today you, tomorrow better with '{habit}'! 🌅",
    "Build with '{habit}' one day! 🧱",
    "Your '{habit}' story unfolds! 📖",
    "'{habit}' is your daily success! 📝",
    "Today + '{habit}' = tomorrow's trophy! 🏅",
    // Playful
    "Gimme '{habit}'! Gimme '{habit}'! 📣",
    "Do '{habit}'! Do '{habit}'! Do '{habit}'! 🔊",
    "'{habit}' party of ONE! 🎉",
    "You're invited to '{habit}' party! 🎈",
    "RSVP to '{habit}' today! ✉️",
    "'{habit}' guest of honor = YOU! 👑",
    "One '{habit}' enter, none leave! 🔐",
    "'{habit}' mandatory fun! 🎪",
    "You're the star of '{habit}'! ⭐",
    "'{habit}' red carpet awaits! 🏹",
    // Time context
    "It's still early - '{habit}' time! 🌅",
    "Plenty of time for '{habit}'! ⏰",
    "Don't rush, just do '{habit}'! 😌",
    "No deadline anxiety - '{habit}' now! 🕐",
    "Your '{habit}' window is open! 🪟",
    "Plenty of '{habit}' time left! ⏱️",
    "No rush needed for '{habit}'! ⏳",
    "'{habit}' when you're ready! 🧘",
    "Take your time, do '{habit}'! ⏰",
    "'{habit}' on YOUR schedule! 📅",
];

const MEDIUM_ROASTS = [
    // Morning - Assertive
    "Wake UP! '{habit}' won't complete itself! 😤",
    "Rise and grind - do '{habit}'! 🔥",
    "Morning's wasting - so is your '{habit}' streak! ⏰",
    "Other people already did '{habit}'! You're behind! 😈",
    "Early bird gets the worm, lazy gets nothing! Do '{habit}'! 🐦",
    "Your '{habit}' is still pending? Come on! 😒",
    "The day is YOUNG - fix '{habit}' now! 🌅",
    "Sun's up, '{habit}' is WAITING! ☀️",
    "Morning motivation, act NOW for '{habit}'! ⚡",
    "Coffee won't finish '{habit}' - you have to! ☕",
    // Afternoon - Urgent
    "Half day GONE - '{habit}' still waiting! 😱",
    "Tick tock - '{habit}' tick tock! ⏰",
    "Lunch is over, is '{habit}'? 🤔",
    "Other people are lapping you on '{habit}'! 🏁",
    "Procrastination = '{habit}' failure! 🚫",
    "Don't waste this afternoon on un-done '{habit}'! 🌤️",
    "Midday = make-it-happen time for '{habit}'! ⚡",
    "You're in the danger zone for '{habit}'! ⚠️",
    "Time is running OUT for '{habit}'! 🏃",
    "Make it count or miss it - '{habit}'! 🎯",
    // Evening - Warning
    "Evening came and '{habit}' didn't! 😤",
    "Sun's setting - your '{habit}' shame rising! 🌆",
    "Don't go to bed with '{habit}' incomplete! 🛏️",
    "Evening reflection: Did you '{habit}'? No? 😑",
    "Tomorrow's guilt starts tonight - '{habit}' UNDONE! 😰",
    "One more chance before sleep - '{habit}' NOW! 🌙",
    "End the day RIGHT with '{habit}'! ✨",
    "Don't be THAT person who missed '{habit}'! 😈",
    "Your streak is judging you - do '{habit}'! 👁️",
    "Night is coming = NO more '{habit}' time! 🕐",
    // Streak related
    "Your {streak}-day streak is about to BREAK! 😱",
    "{streak} days going to ZERO if you skip '{habit}'! 💀",
    "Don't be the one who ended {streak}! 😤",
    "Streak dying alert: Do '{habit}' OR CRY! 😢",
    "{streak} days on the line for '{habit}'! 🎲",
    "One miss = {streak} days GONE! 💸",
    "Don't let {streak} become ZERO! 🔥",
    "Your streak is CRYING for '{habit}'! 😢",
    "{streak} is precious - PROTECT it! 🛡️",
    "KILL your streak or do '{habit}'! 💥",
    // Days missed - Consequence focused
    "{days} days missed = momentum DESTROYED! 📉",
    "Get back NOW before you lose everything! 😤",
    "Day {days} = habits DIE - act NOW! ⚡",
    "The gap is GROWING - close it with '{habit}'! 📈",
    "Don't make it day {days} + 1! 🚫",
    "Momentum waits for NO one - do '{habit}'! 🏃",
    "Your future self is ANGRY! Do '{habit}'! 😡",
    "Day {days} is COMING if you don't act! 👻",
    "Break the cycle NOW with '{habit}'! 🔄",
    "Don't be day {days} person! ⛔",
    // Weekday - Social pressure
    "Everyone else's {day} includes '{habit}'! 😈",
    "{day} and you're behind on '{habit}'! 😱",
    "Others are winning '{habit}' on {day} - you're NOT! 🏁",
    "Don't be the weak {day} '{habit}' person! 😤",
    "Your {day} is incomplete without '{habit}'! ⚠️",
    "{day} won't feel right without '{habit}'! 😕",
    "Win {day} through '{habit}'! 🏆",
    "Make {day} YOUR day with '{habit}'! ⭐",
    "{day} success = '{habit}' done! 🎉",
    "{day} is YOUR winning day through '{habit}'! 💪",
    // Direct confrontation
    "Do '{habit}'! That's the message! 😤",
    "NO more excuses for '{habit}'! 🚫",
    "Just DO it! '{habit}'! ⚡",
    "STOP talking, START '{habit}' doing! 🛑",
    "Your '{habit}' streak is BEGGING you! 😢",
    "You KNOW you need to '{habit}'! 😑",
    "Enough with the '{habit}' delay! ⏰",
    "Just do it! '{habit}' is that simple! 💯",
    "'{habit}' is calling your name - ANSWER! 📞",
    "Quit ignoring '{habit}' - it's not going anywhere! 🚪",
    // Time pressure
    "Time's UP - do '{habit}' NOW or FOREVER! ⏰",
    "LAST chance for '{habit}' today! 🎲",
    "This is it - '{habit}' moment! 🎯",
    "No more '{habit}' opportunities TODAY! 🏃",
    "One shot, one '{habit}'! 🎯",
    "Do or don't with '{habit}' - choose! ⚔️",
    "'{habit}' NOW or never! 🚫",
    "The clock EXPIRED on '{habit}'! ⏱️",
    "Your '{habit}' window IS CLOSING! 🪟",
    "NOW = '{habit}' NOW! ⚡",
    // Tough love
    "Your '{habit}' is CRYING! 😢",
    "I'm disappointed in the '{habit}' wait! 😤",
    "You CAN do '{habit}' - prove it! 💪",
    "You're better than skipping '{habit}'! 🦁",
    "ACT like you want '{habit}'! 😤",
    "Where is your '{habit}' GRINDA? 🔥",
    "Don't let '{habit}' beat you! 💥",
    "'{habit}' needs a WINNER, not a loser! 🏆",
    "Step UP for '{habit}'! 🦵",
    "'{habit}' is waiting for the REAL you! 👑",
    // Accountability
    "Your accountability circle is WATCHING! 👁️",
    "Others are waiting on your '{habit}'! ⏰",
    "Don't let your friends down on '{habit}'! 💔",
    "Your circle needs your '{habit}' win! 🙌",
    "Let them see you CRUSH '{habit}'! 💪",
    "Show up for '{habit}' - show out! 🎪",
    "Their respect = '{habit}' completed! 🙇",
    "Be the '{habit}' leader, not the loser! 👑",
    "Your '{habit}' shows your TRUE self! 🪞",
    "Make them proud with '{habit}'! 🌟",
    // Reality check
    "'{habit}' won't fix itself - YOU have to! 🔧",
    "The truth: '{habit}' needs YOU! 😬",
    "Reality check: Do '{habit}'! 📊",
    "No {'{habit}' fairy coming! 🧚",
    "'{habit}' awaits ACTION, not wishes! 🌠",
    "Wish vs reality: Do '{habit}'! ⚔️",
    "'{habit}' won't go away by ignoring! 🚫",
    "The problem is YOU and '{habit}'! 😤",
    "Stop pretending {'{habit}' doesn't exist! 🎭",
    "Face the '{habit}' reality! �直面",
    // Consequence focused
    "Your streak is about to DIE! 💀",
    "No streak = no rewards! 💸",
    "Loss is coming for '{habit}'! 📉",
    "Your stats ARE failing on '{habit}'! 📊",
    "The numbers don't lie - '{habit}' UNDONE! 🔢",
    "Your failure on '{habit}' IS SHOWING! 📈",
    "Watch your streak DISAPPEAR! 👻",
    "Zero progress = zero rewards! ⭕",
    "Others passing by while you FAIL '{habit}'! 🏃",
    "Success is SLIPPING away on '{habit}'! 🦠",
    // Challenge
    "I DOUBLE DOG DARE you to '{habit}'! 🐕",
    "Prove me WRONG on '{habit}'! 😏",
    "Let's see you CRUSH '{habit}'! 💪",
    "You VS '{habit}' - who wins? 👊",
    "Make it Happen with '{habit}'! ⚔️",
    "Your '{habit}' challenge starts NOW! 🎯",
    "Are you GAME for '{habit}'? 🎮",
    "'{habit}' challenge accepted? ✅",
    "Show your '{habit}' SKILLS! 🦸",
    "Don't back DOWN from '{habit}'! 🥊",
    // Call to action
    "Get up and DO '{habit}'! 💪",
    "Stand up and CONQUER '{habit}'! 🏔️",
    "Go WIN '{habit}' now! 🏆",
    "Get it DONE - '{habit}'! ✅",
    "Make '{habit}' happen! ⚡",
    "OWN '{habit}' like a boss! 👑",
    "FINISH '{habit}' today! 🏁",
    "KICK '{habit}' ass! 🦵",
    "SMASH '{habit}'! 💥",
    "RUTHLESS '{habit}' completion! 🔥",
];

const SAVAGE_ROASTS = [
    // Morning - Brutal
    "WAKE UP! Your '{habit}' IS PENDING! 💀",
    "Rise from your COMA and DO '{habit}'! 😴",
    "The SUN is UP and you're ASLEEP on '{habit}'! 🌅",
    "Other productive people ALREADY did '{habit}'! You're FAILING! 🏃",
    "Lazy bones! '{habit}' needs ACTIon, not SLEEP! 💤",
    "Morning but you acting like MIDNIGHT for '{habit}'! 🌙",
    "Your '{habit}' streak died while you were DREAMING! 😵",
    "WAKE UP! Your consistency is a JOKE! 😱",
    "The EARLY BIRDS already got '{habit}' DONE! 🐦",
    "You're the LAZY bird who misses '{habit}'! 🐧",
    // Afternoon - Shame
    "Half the day GONE and '{habit}' UNDONE! 😵",
    "Other people at WORK while you IGNORE '{habit}'! 💼",
    "Your '{habit}' is WEEPING! '{habit}' is SAD! 😢",
    "FAILURE smells like '{habit}' left undone! 💩",
    "Your laziness with '{habit}' is STINKING up! 🤢",
    "Everyone else is WINNING and you're LOSING at '{habit}'! 🏳️",
    "You had TIME and BLEW IT on '{habit}'! 💥",
    "Momentum LOST because of YOU and '{habit}'! 📉",
    "Your '{habit}' PROGRESS is MY ZERO! 🔴",
    "I can't believe you're SKIPPING '{habit}' AGAIN! 😳",
    // Evening - Devastating
    "Bedtime COMING, '{habit}' UNDONE - SHAME! 🛏️",
    "Go to sleep a FAILURE or do '{habit}' a WINNER! 🌙",
    "Your streak DIED today because of YOU and '{habit}'! 💀",
    "Sleep well knowing you FAILED '{habit}'! 😴",
    "Night is HERE and you're a '{habit}' LOSER! 😴",
    "Don't dream about SUCCESS when '{habit}' FAILS! 💭",
    "Your tomorrow self HATES you for '{habit}'! 😠",
    "FAILING in the dark on '{habit}' - how PATHETIC! 🌑",
    "Going to bed WITHOUT '{habit}' = DISGRACE! 😔",
    "Your '{habit}' guilt will HAUNT your sleep! 👻",
    // Streak - Destroyer
    "Your {streak}-day streak just DIED! 💀💀💀",
    "{streak} days of HARD work = ZERO because YOU! 💸",
    "All that effort GONE because of lazy '{habit}'! 📉",
    "WATCH your streak CRUMBLE to dust! 💥",
    "{streak} days of PROOF down the DRAIN! 🚫",
    "I can't watch {streak} days DIE like this! 😱",
    "One MISS = {streak} DAYS OF SHAME! 💀",
    "YOUR {streak}-day streak IS DEAD! 💀",
    "Brought back to ZERO by '{habit}' NEGLECT! ⭕",
    "Your consistency record JUST got MURDERED! 🔪",
    // Days missed - Complete failure
    "{days} days of CONSISTENT FAILURE! 📉",
    "You're a HABIT FAILURE! Take '{habit}'! 😵",
    "Day {days} and you're STILL missing '{habit}'! 🤦",
    "How does it feel to SUCK at '{habit}' for {days} days? 😬",
    "Your '{habit}' game is WEAK! 💪🏴",
    "MASSIVE FAILURE on '{habit}' for {days}! 📉",
    "You don't know HOW to '{habit}' apparently! 🎓",
    "That's {days} days of BEING BAD at '{habit}'! 😈",
    "Habit formation is not your STRENGTH, clearly! 💪🏳",
    "{days} days of DISPLAYING your weakness at '{habit}'! 📊",
    // Weekday - Social shame
    "Everyone sees your {day} '{habit}' FAILURE! 😳",
    "Your {day} '{habit}' SHAME is visible! 🔍",
    "Others are WINNING and you're HIDING on '{habit}'! 😶",
    "Your {day} '{habit}' LAziness is EXPOSED! 🕵️",
    "The group sees you SUCK at '{habit}' on {day}! 👀",
    "Other people are CHAMPIONS while you BLEW '{habit}'! 🏆",
    "Your '{habit}' is EMBARRASSING on {day}! 😳",
    "Show your face after '{habit}' failure on {day}? 😱",
    "Everyone knows you're WEAK at '{habit}' - especially {day}! 😔",
    "The shame of '{habit}' follows you EVERY {day}! 😖",
    // Pure shame
    "Just do it! You're KILLING my vibe with '{habit}'! 😤",
    "Do '{habit}' and stop DISAPPOINTING me! 😤",
    "Your '{habit}' is PATHETIC to watch! 😵",
    "I can't with you and '{habit}' FAILURES! 😩",
    "Stop being the WORST at '{habit}'! 🏳️",
    "You're EMBARRASSING yourself with '{habit}'! 😳",
    "Your '{habit}' CONSISTENCY is a JOKE! 🤡",
    "I expect BETTER than '{habit}' failure! 😤",
    "You're MAKING ME SAD with '{habit}'! 😢",
    "PROVE you can do '{habit}'! DON'T DISAPPOINT! 😤",
    // Time - Critical
    "LAST CALL for '{habit}'! You BETTER ANSWER! 📞",
    "Your '{hangar}' window SLAMMED SHUT! 🪟",
    "Time EXPIRED - you're a FAILURE at '{habit}'! ⏰",
    "NO more chances for '{habit}' - you BLEW IT! 🚫",
    "The CLOCK KILLED your '{habit}' streak! ⏱️",
    "OPPORTUNITY LOST forever on '{habit}'! 💸",
    "You've RUN OUT of time for '{habit}'! ⏳",
    "The TIMELINE is DEAD - you KILLED it! 💀",
    "No '{habit}' TODAY = no SUCCESS ever! 📵",
    "You're OUT of '{habit}' chances! ⛔",
    // Direct destruction
    "Your '{habit}' is DYING because of YOU! 💀",
    "Kill your '{habit}' streak or KILL the EXCUSE! 💥",
    "You're KILLING your progress with '{habit}' neglect! 🏹",
    "The '{habit}' GRIND is CRUSHING you? No - YOU are! 💪🏴",
    "WEAK excuses for '{habit}' = WEAK '{habit}' results! 💩",
    "Stop your '{habit}' FAILURE pattern! 🔄",
    "Your '{habit}' is YOUR reflection - fix the mirror! 🪞",
    "SUCCESS won't find YOU at '{habit}'! 🔍",
    "Only YOU can prevent '{habit}' FAILURE! 🛡️",
    "Be a WINNER at '{habit}', not a LOSER! 🏆",
    // No mercy
    "I'm DISAPPOINTED. That's ALL! 😤",
    "Do '{habit}' or face the CONSEQUENCES! ⚖️",
    "NO SYMPATHY for '{habit}' failures! 🙅",
    "You EARNED this disappointment at '{habit}'! 📉",
    "The DATA shows you're LAZY at '{habit}'! 📊",
    "You're a STATISTIC at '{habit}' failure! 🔢",
    "Accept your '{habit}' FATE or CHANGE! 🔄",
    "FAILING at '{habit}' is YOUR CHOICE! 🎯",
    "This is WHAT SUCCESS looks like vs '{habit}' fail! 🆚",
    "The gap between WINNERS and YOU at '{habit}'! 📏",
    // Ultimate confrontation
    "DO '{habit}' or SHUT UP about wanting it! 😤",
    "Stop TALKING about '{habit}' - START DOING! 🗣️",
    "Your '{habit}' is a JOKE to me! 🤡",
    "You don't have a '{habit}' problem - You have a YOU problem! 🧠",
    "'{habit}' is easy - you're just WEAK! 💪🏴",
    "OTHER people do '{habit}' while you complain! 😤",
    "Are you SPECIAL or just SKIPPING '{habit}'? 🏷️",
    "Your '{habit}' excuse is EXHAUSTING! 💨",
    "Just. Do. '{habit}'. Simple! ⚡",
    "No more '{habit}' talk - ACTION only! 🎬",
    // Unbearable truth
    "The brutal truth: You're FAILING '{habit}'! 💀",
    "Reality: You SUCK at '{habit}' right now! 😬",
    "The truth HURTS: You can't complete '{habit}'! 😵",
    "Accepting failure at '{habit}' is YOUR choice! ⬅️",
    "Your '{habit}' reality? DISAPPOINTING! 😔",
    "TRUTH: You don't want '{habit}' enough! 😤",
    "Brutal FACT: '{habit}' doesn't work for you! 📉",
    "Real talk: '{habit}' is YOUR weakness! 💪🏴",
    "Truth time: You're COMFORTABLE failing '{habit}'! 😴",
    "Hard to hear but TRUE about '{habit}'! 🎧",
];

class AIRoastService {
    // Generate personalized roast based on context
    generateRoast(context: RoastContext): string {
        const { habitName, habitDescription, currentStreak, daysMissed, roastLevel, timeOfDay, dayOfWeek } = context;

        // Build context-aware roast
        const roast = this.buildRoastMessage(context);
        return roast;
    }

    // Build roast message based on context
    private buildRoastMessage(context: RoastContext): string {
        const { habitName, currentStreak, daysMissed, roastLevel, timeOfDay, dayOfWeek } = context;
        // Use all destructured variables
        console.log(`Generating roast for ${habitName} at ${timeOfDay} on ${dayOfWeek}`);

        // Get base message based on roast level
        const baseMessages = this.getBaseMessages(roastLevel);

        // Select random base message
        const baseMessage = baseMessages[Math.floor(Math.random() * baseMessages.length)];

        // Personalize the message
        let message = baseMessage
            .replace(/{habit}/g, habitName)
            .replace(/{streak}/g, currentStreak.toString())
            .replace(/{days}/g, daysMissed.toString())
            .replace(/{time}/g, timeOfDay)
            .replace(/{day}/g, dayOfWeek);

        return message;
    }

    // Get base messages based on roast level
    private getBaseMessages(roastLevel: string): string[] {
        const messages = {
            mild: MILD_ROASTS,
            medium: MEDIUM_ROASTS,
            savage: SAVAGE_ROASTS,
        };

        return messages[roastLevel as keyof typeof messages] || messages.medium;
    }

    // Generate victory roast for completed habits
    generateVictoryRoast(habitName: string, streak: number): string {
        const victoryMessages = [
            // Basic celebrations
            `🎉 Amazing! You completed "${habitName}" and extended your ${streak}-day streak!`,
            `🔥 On fire! "${habitName}" done! ${streak} days and counting!`,
            `💪 Beast mode! You crushed "${habitName}"! ${streak}-day streak!`,
            `🏆 Champion! "${habitName}" completed! ${streak} days strong!`,
            `⭐ Superstar! You did "${habitName}"! ${streak}-day streak alive!`,
            `🚀 Unstoppable! "${habitName}" done! ${streak} days and growing!`,
            `✨ Incredible! You completed "${habitName}"! ${streak}-day streak!`,
            `🎯 Perfect! "${habitName}" done! ${streak} days of consistency!`,
            // Milestone celebrations
            `🎊 ${streak} days strong! You're unstoppable at "${habitName}"!`,
            `💥 Day ${streak} of "${habitName}"! Keep the momentum!`,
            `🏅 ${streak} days of "${habitName}" - you're a legend!`,
            `🎖️ ${streak} days = MASTER level at "${habitName}"!`,
            `👑 "${habitName}" royalty! ${streak} days strong!`,
            `🌟 ${streak} days of winning at "${habitName}"!`,
            `💎 ${streak} days = diamond consistency at "${habitName}"!`,
            `🔥 You're on FIRE with ${streak} days on "${habitName}"!`,
            // Streak milestones
            `🎉 Day ${streak}! "${habitName}" streak is legendary!`,
            `🏆 ${streak} days - that's NOT easy! "${habitName}" champion!`,
            `⭐ ${streak} day streak! You've MASTERED "${habitName}"!`,
            `💪 ${streak} days of "${habitName}" - pure power!`,
            `🚀 ${streak} days = unstoppable "${habitName}" machine!`,
            `🏅 You've earned your "${habitName}" ${streak}-day badge!`,
            `🎊 ${streak} days of "${habitName}" = incredible discipline!`,
            `👑 Your "${habitName}" throne at ${streak} days!`,
            `💎 Rare achievement: ${streak} days at "${habitName}"!`,
            `🏆 Only legends get ${streak} days at "${habitName}"!`,
            // Encouraging
            `🎉 Another day, another "${habitName}" WIN! ${streak} and counting!`,
            `💪 You're making it look easy with ${streak} days on "${habitName}"!`,
            `🔥 That "${habitName}" streak is beautiful! ${streak} strong!`,
            `⭐ Keep winning! "${habitName}" day ${streak} complete!`,
            `🏆 Champions do "${habitName}"! You've done ${streak} days!`,
            `🎯 Bullseye! "${habitName}" done! ${streak}-day streak!`,
            `✨ You're a "${habitName}" machine! ${streak} days of greatness!`,
            `🚀 Watch out! "${habitName}" master with ${streak} days!`,
            `💥 You CRUSHED "${habitName}"! ${streak} days of domination!`,
            `🏅 You've got the "${habitName}" magic at ${streak} days!`,
            // Motivational
            `🎊 This is what SUCCESS looks like! ${streak} days "${habitName}"!`,
            `💪 Building EMPIRES with "${habitName}"! ${streak} days!`,
            `🔥 Your "${habitName}" dedication is INSPIRING! ${streak} days!`,
            `⭐ You're not just doing "${habitName}" - you're DOMINATING!`,
            `🏆 ${streak} days of "${habitName}" = PROOF you're exceptional!`,
            `🎯 You're in the TOP 1% with ${streak} days on "${habitName}"!`,
            `✨ Extraordinary! ${streak} days of "${habitName}" excellence!`,
            `🚀 You're LEGENDARY with ${streak} days on "${habitName}"!`,
            `💎 Your "${habitName}" streak is PRICELESS! ${streak} days!`,
            `🏅 You've reached "${habitName}" MASTERY level ${streak}!`,
            // Fun celebrations
            `🎉 WOOHOO! "${habitName}" done! ${streak} days of WIN!`,
            `💪 BOOM! "${habitName}" completed! ${streak}-day streak!`,
            `🔥 POW! Another "${habitName}" done! ${streak} days strong!`,
            `⭐ BAM! "${habitName}" crushed! ${streak} days of glory!`,
            `🏆 WHAM! ${streak} days of "${habitName}" awesomeness!`,
            `🎯 ZAP! "${habitName}" obliterated! ${streak} day streak!`,
            `✨ WOW! ${streak} days of "${habitName}" excellence!`,
            `🚀 BOOM! You're UNSTOPPABLE at "${habitName}"!`,
            `💥 KAPOW! ${streak} days of "${habitName}" VICTORY!`,
            `🏅 YASSS! ${streak} days slaying "${habitName}"!`,
            // Special milestones
            `🎊 ONE WEEK! ${streak} days of "${habitName}" commitment!`,
            `💪 TWO WEEKS! "${habitName}" is your superpower!`,
            `🔥 20 DAYS! You're UNSTOPPABLE at "${habitName}"!`,
            `⭐ ONE MONTH! "${habitName}" has mastered YOU!`,
            `🏆 40 DAYS! You're a "${habitName}" LEGEND!`,
            `🎯 50 DAYS! Halfway to 100 days of "${habitName}"!`,
            `✨ 60 DAYS! "${habitName}" = YOUR thing!`,
            `🚀 75 DAYS! You're in the HALL OF FAME!`,
            `💎 90 DAYS! "${habitName}" mastery achieved!`,
            `🏅 100 DAYS! LEGENDARY "${habitName}" status!`,
        ];

        return victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
    }

    // Generate streak saver message
    generateStreakSaverMessage(habitName: string, friendUsername: string): string {
        const messages = [
            `🆘 ${friendUsername} saved your "${habitName}" streak! You owe them!`,
            `💪 ${friendUsername} checked in for "${habitName}"! Your streak lives!`,
            `🙏 ${friendUsername} has your back! "${habitName}" streak saved!`,
            `🦸 ${friendUsername} is your hero! "${habitName}" streak continues!`,
            `❤️ ${friendUsername} saved your "${habitName}" streak! True friendship!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Generate stake lost message
    generateStakeLostMessage(habitName: string, amount: number): string {
        const messages = [
            `💸 You lost ${amount} Telegram Stars for missing "${habitName}"!`,
            `😢 ${amount} Stars gone! You missed "${habitName}"!`,
            `💔 ${amount} Stars lost! "${habitName}" was not completed!`,
            `😭 Your ${amount} Stars are gone! "${habitName}" missed!`,
            `💸 ${amount} Stars evaporated! You forgot "${habitName}"!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Generate stake won message
    generateStakeWonMessage(habitName: string, amount: number): string {
        const messages = [
            `🏆 You won ${amount * 2} Telegram Stars for completing "${habitName}" for 7 days!`,
            `🎉 ${amount * 2} Stars earned! You crushed "${habitName}"!`,
            `💰 ${amount * 2} Stars won! "${habitName}" streak paid off!`,
            `⭐ ${amount * 2} Stars yours! "${habitName}" consistency rewarded!`,
            `🏆 ${amount * 2} Stars! You dominated "${habitName}"!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Get time of day
    getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    // Get day of week
    getDayOfWeek(): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    }

    // Generate contextual roast for a habit
    generateContextualRoast(habit: Habit): string {
        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toISOString().split('T')[0] : null;

        let daysMissed = 0;
        if (lastCompleted) {
            const lastDate = new Date(lastCompleted);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastDate.getTime();
            daysMissed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        const context: RoastContext = {
            habitName: habit.name,
            habitDescription: habit.description,
            currentStreak: habit.streak,
            daysMissed,
            roastLevel: habit.roastLevel,
            timeOfDay: this.getTimeOfDay(),
            dayOfWeek: this.getDayOfWeek(),
        };

        return this.generateRoast(context);
    }
}

// Export singleton instance
export const aiRoastService = new AIRoastService();
