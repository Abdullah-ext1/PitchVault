export const calculateTrendingScore = (score, ageInHours) => {
  return score / Math.pow(ageInHours + 2, 1.5);
};

export const getTrendingPipeline = () => {
  return [
    {
      $addFields: {
        ageInMillis: { $subtract: ["$$NOW", "$createdAt"] },
      },
    },
    {
      $addFields: {
        ageInHours: { $divide: ["$ageInMillis", 3600000] },
      },
    },
    {
      $addFields: {
        trendingScore: {
          $divide: [
            "$score",
            { $pow: [{ $add: ["$ageInHours", 2] }, 1.5] },
          ],
        },
      },
    },
    { $sort: { trendingScore: -1, _id: -1 } },
  ];
};
