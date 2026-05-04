// Система рангов животных
const ANIMAL_RANKS = [
  { 
    animal: 'Ленивец', 
    emoji: '🦥', 
    minWpm: 0, 
    maxWpm: 15, 
    rank: 1,
    title: 'Начинающий',
    description: 'Даже ленивец иногда двигается быстрее! Но не сдавайся, практика - ключ к успеху.',
    color: '#8B7355' // Коричневый
  },
  { 
    animal: 'Улитка', 
    emoji: '🐌', 
    minWpm: 16, 
    maxWpm: 25, 
    rank: 2,
    title: 'Медленный',
    description: 'Ты двигаешься как улитка - медленно, но верно. Продолжай тренироваться!',
    color: '#D4A574' // Бежевый
  },
  { 
    animal: 'Черепаха', 
    emoji: '🐢', 
    minWpm: 26, 
    maxWpm: 35, 
    rank: 3,
    title: 'Неторопливый',
    description: 'Черепаха тоже не спешит, но всегда достигает цели. Ты на правильном пути!',
    color: '#4A7C59' // Зелёный
  },
  { 
    animal: 'Панда', 
    emoji: '🐼', 
    minWpm: 36, 
    maxWpm: 45, 
    rank: 4,
    title: 'Расслабленный',
    description: 'Как панда - уверенно и без лишней суеты. Хороший темп, становись быстрее!',
    color: '#2C2C2C' // Чёрно-белый
  },
  { 
    animal: 'Лиса', 
    emoji: '🦊', 
    minWpm: 46, 
    maxWpm: 55, 
    rank: 5,
    title: 'Хитрый',
    description: 'По-лисьи ловко и умно! Твои пальцы знают своё дело, продолжай в том же духе!',
    color: '#D2691E' // Оранжевый
  },
  { 
    animal: 'Орёл', 
    emoji: '🦅', 
    minWpm: 56, 
    maxWpm: 65, 
    rank: 6,
    title: 'Зоркий',
    description: 'Орлиный взгляд и быстрые крылья! Ты паришь над клавиатурой с невероятной скоростью.',
    color: '#8B4513' // Тёмно-коричневый
  },
  { 
    animal: 'Гепард', 
    emoji: '🐆', 
    minWpm: 66, 
    maxWpm: 75, 
    rank: 7,
    title: 'Быстрый',
    description: 'Скорость гепарда в твоих пальцах! Впечатляющий результат, почти рекорд!',
    color: '#DAA520' // Золотой
  },
  { 
    animal: 'Дракон', 
    emoji: '🐉', 
    minWpm: 76, 
    maxWpm: 90, 
    rank: 8,
    title: 'Легендарный',
    description: 'Ты извергаешь пламя скорости! Легендарный результат, достойный дракона.',
    color: '#FF4500' // Огненно-красный
  },
  { 
    animal: 'Феникс', 
    emoji: '🔥', 
    minWpm: 91, 
    maxWpm: Infinity, 
    rank: 9,
    title: 'Бог скорости',
    description: 'Восстань из пепла, Феникс! Твоя скорость недостижима для простых смертных!',
    color: '#FFD700' // Золотой с огнём
  }
];

// Получить ранг по WPM
export const getAnimalRank = (wpm) => {
  return ANIMAL_RANKS.find(rank => wpm >= rank.minWpm && wpm <= rank.maxWpm);
};

// Получить следующий ранг
export const getNextRank = (wpm) => {
  const currentRank = getAnimalRank(wpm);
  const currentIndex = ANIMAL_RANKS.findIndex(r => r.rank === currentRank.rank);
  return ANIMAL_RANKS[currentIndex + 1] || null;
};

export const getRankProgress = (wpm) => {
  const currentRank = getAnimalRank(wpm);
  const nextRank = getNextRank(wpm);
  
  if (!nextRank) return 100; // Максимальный ранг
  
  const range = currentRank.maxWpm - currentRank.minWpm;
  const progress = wpm - currentRank.minWpm;
  return Math.round((progress / range) * 100);
};

export default ANIMAL_RANKS;