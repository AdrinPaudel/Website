"use client";
import { useEffect } from "react";
import JsonData from "/data/Policies.json";
import { forEach, index } from "mathjs";


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

  let policies = [];

  JsonData["policies"].forEach((policy, index) => (
    policies.push({ policy: policy["policy"], min: policy["min"], max: policy["max"], minEntry: policy["minEntry"], maxEntry: policy["maxEntry"], minYears: policy["minYears"], maxYears: (age) =>  Math.min(policy["maxYa"] - age, policy["maxYb"]) }))
  );


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
  return "hello"
}
