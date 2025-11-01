/**
 * Utility functions to calculate averages and statistics from keyword data
 */

export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

export const findMostSearchedKeyword = (data) => {
  if (!data || data.length === 0) return null;
  
  // Count occurrences of each keyword
  const keywordCounts = {};
  data.forEach((item) => {
    const keyword = item.keyword || "";
    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
  });

  // Find keyword with highest count
  let maxCount = 0;
  let mostSearched = null;
  
  Object.entries(keywordCounts).forEach(([keyword, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostSearched = keyword;
    }
  });

  return mostSearched;
};

export const calculateStats = (data) => {
  if (!data || data.length === 0) {
    return {
      totalKeywords: 0,
      averageSEOScore: 0,
      averageLength: 0,
      mostSearched: null,
    };
  }

  const seoScores = data
    .map((item) => item.seoScore)
    .filter((score) => typeof score === "number" && !isNaN(score));
  
  const lengths = data
    .map((item) => item.averageLength)
    .filter((length) => typeof length === "number" && !isNaN(length));

  return {
    totalKeywords: data.length,
    averageSEOScore: parseFloat(calculateAverage(seoScores)),
    averageLength: parseFloat(calculateAverage(lengths)),
    mostSearched: findMostSearchedKeyword(data),
  };
};

