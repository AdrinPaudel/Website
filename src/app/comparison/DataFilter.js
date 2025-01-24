"use client";
import { useEffect } from "react";

export default function DataFilter(data) {
  // Log all user data to check what is being passed from page.js
  // console.log("User data before filtering:", data);

  // Convert relevant fields from string to number for proper comparison
  const age = data.age;
  const income = data.income;
  const insuredTerm = data.insuredTerm;
  const type = data.type;
  const insuredAmount = data.insuredAmount;
  // const {
  //   age,
  //   income,
  //   insuredTerm,
  //   type,
  //   insuredAmount,
  // ) = ( data["age"], data["income"], data["insuredTerm"], data["type"], data["insuredAmount"] };

  // Convert to number where necessary
  const userAge = Number(age); // Convert to number, fallback to dob if age is missing
  const userIncome = Number(income); // Convert income to number
  const userInsuredTerm = Number(insuredTerm); // Convert insuredTerm to number
  const userType = Number(type); // Convert type to number if needed
  const userInsuredAmount = Number(insuredAmount); // New insuredAmount field


  const policies = [
    { policy: 1, min: 200000, max: 5000000, minEntry: 18, maxEntry: 60, minYears: 5, maxYears: (age) => Math.min(70 - age, 52) },
    { policy: 2, min: 300000, max: 7500000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(70 - age, 50) },
    { policy: 3, min: 250000, max: 6000000, minEntry: 18, maxEntry: 60, minYears: 5, maxYears: (age) => Math.min(70 - age, 45) },
    { policy: 4, min: 300000, max: 8000000, minEntry: 18, maxEntry: 60, minYears: 5, maxYears: (age) => Math.min(70 - age, 40) },
    { policy: 5, min: 200000, max: 5000000, minEntry: 18, maxEntry: 60, minYears: 5, maxYears: (age) => Math.min(70 - age, 50) },
    { policy: 6, min: 400000, max: 10000000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(70 - age, 52) },
    { policy: 7, min: 300000, max: 9000000, minEntry: 20, maxEntry: 60, minYears: 5, maxYears: (age) => Math.min(70 - age, 50) },
    { policy: 8, min: 250000, max: 7000000, minEntry: 20, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(70 - age, 50) },
    { policy: 9, min: 300000, max: 10000000, minEntry: 20, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(70 - age, 30) },
    { policy: 10, min: 500000, max: 15000000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(65 - age, 25), exactTerms: [15, 20, 25] },
    { policy: 11, min: 400000, max: 12000000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(65 - age, 20), exactTerms: [15, 20] },
    { policy: 12, min: 600000, max: 16000000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 25), exactTerms: [15, 20, 25] },
    { policy: 13, min: 350000, max: 10000000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(65 - age, 20), exactTerms: [15, 20] },
    { policy: 14, min: 450000, max: 13000000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(65 - age, 25), exactTerms: [15, 20, 25] },
    { policy: 15, min: 500000, max: 14000000, minEntry: 18, maxEntry: 55, minYears: 5, maxYears: (age) => Math.min(65 - age, 20), exactTerms: [15, 20] },
    { policy: 16, min: 400000, max: 12000000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 30) },
    { policy: 17, min: 250000, max: 9000000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 30) },
    { policy: 18, min: 350000, max: 10000000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 30) },
    { policy: 19, min: 300000, max: 8500000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 30) },
    { policy: 20, min: 500000, max: 12000000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 30) },
    { policy: 21, min: 600000, max: 13000000, minEntry: 18, maxEntry: 55, minYears: 10, maxYears: (age) => Math.min(65 - age, 30) },
  ];

  // Log the policies before filtering
  // console.log("Policies before filtering:", policies);

  const filteredPolicies = policies
    .filter((policy) => {
      if (userType === 0) return true; // No specific type, consider all policies
      if (userType === 1 && policy.policy >= 1 && policy.policy <= 9) return true; // Endowment type
      if (userType === 2 && policy.policy >= 10 && policy.policy <= 15 && policy.exactTerms?.includes(userInsuredTerm)) return true; // MoneyBack type, specific terms only
      if (userType === 3 && policy.policy >= 16 && policy.policy <= 21) return true; // Term Life type
      return false;
    })
    .filter((policy) => {
      // Apply age, insured amount, and term filters
      const maxYearsAllowed = policy.maxYears(userAge);
      return (
        userAge >= policy.minEntry &&
        userAge <= policy.maxEntry &&
        userInsuredAmount >= policy.min && // Compare insured amount
        userInsuredAmount <= policy.max && // Compare insured amount
        userInsuredTerm >= policy.minYears &&
        userInsuredTerm <= maxYearsAllowed
      );
    });

  // Log filtered policies to see which are available
  // console.log("Available Policies after Filtering:", filteredPolicies);

  return filteredPolicies
}
