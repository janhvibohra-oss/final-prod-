const express = require('express');
const router = express.Router();

/**
 * @route   POST api/grants/match
 * @desc    Match business profile against available grants
 */
router.post('/match', (req, res) => {
  const { province, industry, employeeCount } = req.body;

  // 1. Mock Database of Grants (Replace with your full list of 200+)
  // In a professional setup, this would be imported from a separate JSON file.
  const allGrants = [
    { 
      id: 1, 
      name: "CDAP - Boost Your Business Technology", 
      amount: 15000, 
      province: "Federal", 
      industry: "All",
      minEmployees: 1
    },
    { 
      id: 2, 
      name: "Ontario Create: Interactive Digital Media Fund", 
      amount: 50000, 
      province: "Ontario", 
      industry: "Tech",
      minEmployees: 0
    },
    { 
      id: 3, 
      name: "BC Small Business BC Grant", 
      amount: 10000, 
      province: "British Columbia", 
      industry: "Small Business",
      minEmployees: 2
    }
  ];

  // 2. Matching Logic
  // We filter by Province (matching specific or Federal) AND Industry
  const matches = allGrants.filter(grant => {
    const provinceMatch = grant.province === "Federal" || grant.province === province;
    const industryMatch = grant.industry === "All" || grant.industry === industry;
    const sizeMatch = (employeeCount || 0) >= grant.minEmployees;

    return provinceMatch && industryMatch && sizeMatch;
  });

  // 3. Return the Matches
  if (matches.length === 0) {
    return res.status(200).json({
      message: "No specific matches found, but keep an eye on Federal programs!",
      matches: []
    });
  }

  res.status(200).json({
    totalMatches: matches.length,
    matches: matches
  });
});

module.exports = router;
