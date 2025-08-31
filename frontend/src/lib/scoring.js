/**
 * Calculates a normalized score out of 300 points for location viability
 */
export const calculateLocationScore = (location, analysisData = null) => {
  // Get individual component scores
  const transportScore =
    location.transport_score || analysisData?.transport_score || 65;
  const powerScore = location.power_score || analysisData?.power_score || 70;
  const waterScore = location.water_score || analysisData?.water_score || 60;

  // Technical risk factors (from backend)
  const techRisk =
    analysisData?.technical_risk_assessment?.overall_risk_score || 35;
  const performanceScore =
    100 - (analysisData?.technical_risk_assessment?.performance_risk || 25);
  const maintenanceScore =
    100 - (analysisData?.technical_risk_assessment?.maintenance_risk || 40);

  // Calculate weighted average (total points: 300)
  const infrastructureWeight = 0.4; // 120 points
  const technicalWeight = 0.3; // 90 points
  const operationalWeight = 0.3; // 90 points

  const infrastructureScore = (transportScore + powerScore + waterScore) / 3;
  const technicalScore = 100 - techRisk;
  const operationalScore = (performanceScore + maintenanceScore) / 2;

  const totalScore =
    (infrastructureScore * infrastructureWeight +
      technicalScore * technicalWeight +
      operationalScore * operationalWeight) *
    3; // Scale to 300 points

  return Math.round(totalScore);
};

/**
 * Gets the color class for a score
 */
export const getScoreColor = (score) => {
  if (score >= 200) return "text-green-600 bg-green-50";
  if (score >= 150) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
};

/**
 * Gets the label for a score
 */
export const getScoreLabel = (score) => {
  if (score >= 200) return "Viable";
  if (score >= 150) return "Moderate";
  return "Challenging";
};

/**
 * Gets the risk level for a score
 */
export const getRiskLevel = (score) => {
  if (score >= 200) return "Low";
  if (score >= 150) return "Moderate";
  return "High";
};
