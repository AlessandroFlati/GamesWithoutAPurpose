// Level progression and progress tracking system

export class LevelProgression {
  constructor(gameId) {
    this.gameId = gameId;
    this.storageKey = `gwap_progress_${gameId}`;
    this.progress = this.loadProgress();
  }

  loadProgress() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
    return {
      completedLevels: [],
      currentTopic: 0,
      currentLevel: 0,
      topicProgress: {}, // { topicId: { completed: [0,1,2,3,4], bestMoves: {}, bestTime: {} } }
      totalMoves: 0,
      totalTime: 0,
      achievements: []
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  isLevelCompleted(topicId, levelNumber) {
    if (!this.progress.topicProgress[topicId]) {
      return false;
    }
    return this.progress.topicProgress[topicId].completed.includes(levelNumber);
  }

  isLevelUnlocked(topicId, levelNumber) {
    // Tutorial (level 0) is always unlocked
    if (levelNumber === 0) {
      return true;
    }

    // Practice levels unlock sequentially after completing tutorial
    if (!this.progress.topicProgress[topicId]) {
      return false;
    }

    const completed = this.progress.topicProgress[topicId].completed;

    // Level 1 unlocks after tutorial
    if (levelNumber === 1) {
      return completed.includes(0);
    }

    // Other levels unlock after completing previous level
    return completed.includes(levelNumber - 1);
  }

  isTopicUnlocked(topicId) {
    // First topic is always unlocked
    if (topicId === 0) {
      return true;
    }

    // Other topics unlock after completing all levels of previous topic
    const prevTopicId = topicId - 1;
    const prevProgress = this.progress.topicProgress[prevTopicId];

    if (!prevProgress) {
      return false;
    }

    // Check if all 5 levels (0-4) are completed
    return prevProgress.completed.length >= 5;
  }

  completeLevel(topicId, levelNumber, moves, time) {
    if (!this.progress.topicProgress[topicId]) {
      this.progress.topicProgress[topicId] = {
        completed: [],
        bestMoves: {},
        bestTime: {}
      };
    }

    const topicProgress = this.progress.topicProgress[topicId];

    // Mark as completed
    if (!topicProgress.completed.includes(levelNumber)) {
      topicProgress.completed.push(levelNumber);
      topicProgress.completed.sort((a, b) => a - b);
    }

    // Update best scores
    const levelKey = levelNumber.toString();
    if (!topicProgress.bestMoves[levelKey] || moves < topicProgress.bestMoves[levelKey]) {
      topicProgress.bestMoves[levelKey] = moves;
    }
    if (!topicProgress.bestTime[levelKey] || time < topicProgress.bestTime[levelKey]) {
      topicProgress.bestTime[levelKey] = time;
    }

    // Update totals
    this.progress.totalMoves += moves;
    this.progress.totalTime += time;

    // Update current position
    this.progress.currentTopic = topicId;
    this.progress.currentLevel = levelNumber;

    this.saveProgress();
    this.checkAchievements(topicId, levelNumber, moves);
  }

  checkAchievements(topicId, levelNumber, moves) {
    const achievements = [];

    // First completion of any level
    if (topicId === 0 && levelNumber === 0 && !this.progress.achievements.includes('first_steps')) {
      achievements.push({
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first level'
      });
    }

    // Complete a topic
    const topicProgress = this.progress.topicProgress[topicId];
    if (topicProgress && topicProgress.completed.length === 5) {
      const achievementId = `topic_${topicId}_complete`;
      if (!this.progress.achievements.includes(achievementId)) {
        achievements.push({
          id: achievementId,
          name: 'Topic Master',
          description: `Complete all levels in topic ${topicId + 1}`
        });
      }
    }

    // Perfect solve (optimal moves - can be defined per level)
    // This is a placeholder - actual optimal moves would be defined in level data
    if (moves <= 3 && !this.progress.achievements.includes(`perfect_${topicId}_${levelNumber}`)) {
      achievements.push({
        id: `perfect_${topicId}_${levelNumber}`,
        name: 'Perfect Solution',
        description: `Solve level ${levelNumber + 1} in optimal moves`
      });
    }

    // Add new achievements to progress
    achievements.forEach(achievement => {
      if (!this.progress.achievements.includes(achievement.id)) {
        this.progress.achievements.push(achievement.id);
      }
    });

    return achievements;
  }

  getBestScore(topicId, levelNumber) {
    const topicProgress = this.progress.topicProgress[topicId];
    if (!topicProgress) {
      return { moves: null, time: null };
    }

    const levelKey = levelNumber.toString();
    return {
      moves: topicProgress.bestMoves[levelKey] || null,
      time: topicProgress.bestTime[levelKey] || null
    };
  }

  getTopicCompletion(topicId) {
    const topicProgress = this.progress.topicProgress[topicId];
    if (!topicProgress) {
      return 0;
    }
    return (topicProgress.completed.length / 5) * 100;
  }

  getTotalCompletion(totalTopics) {
    let completed = 0;
    const total = totalTopics * 5; // 5 levels per topic

    for (let i = 0; i < totalTopics; i++) {
      const topicProgress = this.progress.topicProgress[i];
      if (topicProgress) {
        completed += topicProgress.completed.length;
      }
    }

    return (completed / total) * 100;
  }

  resetProgress() {
    this.progress = {
      completedLevels: [],
      currentTopic: 0,
      currentLevel: 0,
      topicProgress: {},
      totalMoves: 0,
      totalTime: 0,
      achievements: []
    };
    this.saveProgress();
  }
}
