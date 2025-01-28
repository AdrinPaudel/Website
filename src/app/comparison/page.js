"use client";

import "./page.css";
import "../api/runai.js";
import papa from "papaparse";
import { useEffect, useState } from "react";
import DataFilter from "./DataFilter";
import Calculator from "../components/calculator/calculator";
import hardcodedData from "/data/hardcodedData.json"; // Adjust the path if needed
import addonIndNames from "/data/addonIndNames.json"; // Adjust the path if needed
import policyAddons from "/data/policyAddons";
import policyData from "/data/policyData.json"; // Adjust the path if needed
import addonCosts from "/data/addonCosts.json"; // Adjust the path if needed
import companyPolicies from "/data/companyPolicies.json";
import paymentMethods from "/data/paymentMethods.json";
import rebateBrackets from "/data/rebateBrackets.json";
import policiesData from "/data/Policies.json";

const company1Policies = [1, 2, 3, 10, 11, 16, 17];
const company2Policies = [4, 5, 6, 12, 13, 18, 19];
const company3Policies = [7, 8, 9, 14, 15, 20, 21];

export default function Compare() {
  const [showComparisonPage, setShowComparisonPage] = useState(true);

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [addonData, setAddonData] = useState([]);
  const [comparisonResult, setComparisonResult] = useState([]);

  function handleButtonClick(_) {
    setShowComparisonPage(!showComparisonPage);
    getData();
  }

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    insuredAmount: "",
    income: "",
    // type: "",
    // gender: "",
    // phoneNumber: "",
    // dob: "",
    insuredTerm: "",
    // occupation: "",
  });

  function getData() {
    const nameElement = document.getElementById("nameField");
    const insuredTerm = nameElement.parentElement.children[1].value;
    const insuredAmount = nameElement.parentElement.children[2].value;
    const income = nameElement.parentElement.children[3].value;
    const term = document.querySelector('input[name="term"]:checked')?.value;
    const gender = document.querySelector(
      'input[name="gender"]:checked'
    )?.value;

    const type = document.querySelector('input[name="type"]:checked')?.value;
    const age =
      nameElement.parentElement.parentElement.children[1].children[3].value;
    if (
      nameElement.value != "" &&
      age != "" &&
      insuredAmount != "" &&
      income != "" &&
      insuredTerm != "" &&
      gender != ""
    ) {
      // Retrieve the parent elements and their children correctly
      const phoneNumber = nameElement.parentElement.children[4].value;

      const occupation =
        nameElement.parentElement.parentElement.children[1].children[4].value;

      // Update the state with form data
      setFormData({
        name: nameElement.value, // Correctly get the value
        insuredTerm, //10, 15...
        insuredAmount,
        income,
        type: (type == 1) | (type == 2) | (type == 3) ? type : 0,
        gender,
        phoneNumber,
        age,
        term, //yly, hly, mly,...
        occupation,
      });
    }
  }

  useEffect(() => {

    setAddonData(hardcodedData);

    let term = document.getElementById("preselect");
    term.click();
  }, []);

  useEffect(() => {
    console.log(formData);

    if (formData.name !== "") {
      let filteredData = DataFilter(formData);

      // Process each policy
      filteredData = filteredData
        .map((policyData) => {
          const policyNumber = policyData.policy;

          // Check if the policy has all the selected add-ons
          const hasAllAddons = selectedAddons.every((addon) =>
            hasAddonForPolicy(policyNumber, parseFloat(addon))
          );

          if (!hasAllAddons) {
            return null; // Exclude this policy if it doesn't match the add-ons
          }

          // Calculate premium and add-on cost for policies that match
          const premium = calculatePremium(formData, policyNumber);
          const addoncost = calculateTotalAddonsCost(selectedAddons, formData);

          // Get CSR, Policy Name, and Company Name using functions and mappings
          const csr = getCsrByPolicyNumber(policyNumber);
          const policyName = getPolicyNameByPolicyNumber(policyNumber);

          // Determine the company name based on policy number
          let companyName = "";
          if (company1Policies.includes(policyNumber)) {
            companyName = "Himalayan Life";
          } else if (company2Policies.includes(policyNumber)) {
            companyName = "Life Insurance Corporation Nepal";
          } else if (company3Policies.includes(policyNumber)) {
            companyName = "Nepal Life";
          }

          return {
            ...policyData,
            premium,
            addonCost: addoncost,
            csr, // Adding CSR to the policy object
            policyName, // Adding Policy Name to the policy object
            companyName, // Adding Company Name to the policy object
          };
        })
        .filter(Boolean); // Remove null entries (policies that don't match)

      // Update the comparison result

      setComparisonResult(
        filteredData.map((policy, index) => {
          const policyDetails = policiesData.policies.find((p) => p.policy === policy.policy);
          const minAmount = policyDetails?.min || "N/A";
          const maxAmount = policyDetails?.max || "N/A";
          const minEntryAge = policyDetails?.minEntry || "N/A";
          const maxEntryAge = policyDetails?.maxEntry || "N/A";
          const minYears = policyDetails?.minYears || "N/A";
          const maxYearsA = policyDetails?.maxYa || "N/A";
          const maxYearsB = policyDetails?.maxYb || "N/A";
      
          // Custom description based on policy type
          let policyTypeDetails = "";
          if (policy.policy >= 1 && policy.policy <= 9) {
            policyTypeDetails = "The return of the money with premium and additional profit is at the end of the term, and the amount depends on the market rate.";
          } else if ([10, 12, 14].includes(policy.policy)) {
            policyTypeDetails =
              "This policy returns 15% at 5 years, 25% at 10 years, and 60% at 15 years for a 15-year plan. For 20- and 25-year plans, the return rates adjust accordingly.";
          } else if ([11, 13, 15].includes(policy.policy)) {
            policyTypeDetails =
              "This policy returns 25% at 5 years, 25% at 10 years, and 50% at 15 years for a 15-year plan. Adjusted percentages for longer plans.";
          } else if (policy.policy >= 16 && policy.policy <= 21) {
            policyTypeDetails = "This is a term life insurance plan with no maturity benefit.";
          }
      
          return (


<div className="filteredPolicies">
  <h1>
    {policy.policyName}
    <span className="cardPolicyId">{policy.policy}</span>
  </h1>
  <div className="cardCompanyName">{policy.companyName}</div>
  <div className="cardCSR">CSR: {policy.csr || "N/A"}</div>
  <div className="cardCost">
    <div className="cardPremiumCost">Premium: रु {policy.premium || "0"}</div>
  </div>
  <div className="cardCost">
  <div className="cardAddonCost">AddonCost: रु {policy.addonCost || "0"}</div>
  </div>

 
  <h3 className="detailsTitle">Policy Details</h3>
  <div className="policyDetails hiddenDetails">
    <p>
      This {policy.policyName} is offered by {policy.companyName}.
    </p>
    <p>
      The minimum insured amount for this plan is रु{minAmount} with a maximum of रु{maxAmount}.
    </p>
    <p>
      The minimum entry age is {minEntryAge} years with a maximum entry age of {maxEntryAge} years.
    </p>
    <p>
      The policy term ranges from {minYears} years to {maxYearsA} (or {maxYearsB}) years.
    </p>
    <p>{policyTypeDetails}</p>
    <p>
      This plan can be taken by visiting any closest {policy.companyName} branch or contacting agents of {policy.companyName}.
    </p>
  </div>

  {/* Policy Add-ons */}
  <h3 className="addonsTitle">Policy Add-ons</h3>
  <div className="cardAddons hiddenAddons">
    <div className="cardAddonsContent">
      {policyAddons[policy.policy]?.length > 0 ? (
        policyAddons[policy.policy].map((element, index) => {
          if (element < 65) {
            return (
              <div key={index} className="addonsNamesPaid">
                {addonIndNames[element] || "Unknown Add-on"}
              </div>
            );
          } else {
            return (
              <div key={index} className="addonsNamesFree">
                {addonIndNames[element] || "Unknown Add-on"}
              </div>
            );
          }
        })
      ) : (
        <div>No Add-ons Available</div>
      )}
    </div>
  </div>
</div>
          );
        })
      );
      
    }
  }, [formData, selectedAddons]);

  const handleAddonChange = (event) => {
    const addonNumber = event.target.id;

    // If checkbox is checked, add to array; if unchecked, remove from array
    setSelectedAddons((prevSelectedAddons) =>
      event.target.checked
        ? [...prevSelectedAddons, addonNumber]
        : prevSelectedAddons.filter((addon) => addon !== addonNumber)
    );
  };

  // start where not to change
  return (
    <>
      {showComparisonPage ? (
        <div id="compareContainer">
          <div className="compareContents" id="searchPlans">
            <h1>
              <span id="searchSpan">Search</span>
              <span id="planSpan">Plans</span>
            </h1>
            <p className="fattext">
              Choosing the right plan can be a crucial decision for your needs,
              whether you’re an individual, a small business, or a large
              enterprise. To help you make the best choice, we’ve outlined the
              key features and benefits of each of our plans below. Compare and
              select the plan that suits you best.
            </p>
          </div>

          <div className="surrounddatafields">
            <form className="compareContents" id="endowmentdatafields">
              <div id="datafieldLeft">
                <input
                  type="text"
                  placeholder="Name"
                  id="nameField"
                  className="optional"
                />
                <input
                  type="text"
                  placeholder="Insured Term"
                  id="insuredTermField"
                />
                <input
                  type="text"
                  placeholder="Insured Amount"
                  id="insuredAmmountField"
                />
                <input type="text" placeholder="Income" id="incomeField" />
                <input
                  type="text"
                  placeholder="Phone Number(optional)"
                  id="phoneField"
                  className="optional"
                />
              </div>
              <div id="datafieldRight">
                <span id="gender">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="optional"
                  />{" "}
                  Male
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="optional"
                  />{" "}
                  Female
                </span>
                <span id="type">
                  <input type="radio" name="type" value="1" /> Endowment
                  <input type="radio" name="type" value="3" /> Term Life
                  <input type="radio" name="type" value="2" /> Money Back
                  <input type="radio" name="type" value="0" /> All
                </span>

                <span id="term">
                  <input type="radio" name="term" value="0.083" /> Monthly
                  <input type="radio" name="term" value="0.25" /> Quarterly
                  <input type="radio" name="term" value="0.5" /> Half-Yearly
                  <input
                    id="preselect"
                    type="radio"
                    name="term"
                    value="1"
                    aria-checked="true"
                  />{" "}
                  Yearly
                </span>
                <input type="text" placeholder="Age" id="ageField" />
                <input
                  type="text"
                  placeholder="Occupation(optional)"
                  id="occupationField"
                  className="optional"
                />
                <button
                  className="mainButton"
                  onClick={handleButtonClick}
                  type="button"
                >
                  Compare
                </button>
              </div>
            </form>
          </div>

          <div id="chooseBreak"></div>
        </div>
      ) : (
        <>
          <div className="comparisonView">
            {
              // POLICY FILTERED CARD
            }
            <div id="policyCards">{comparisonResult}</div>
            <div id="majorView">
              <h1> Choose an Add-on </h1>
              <div id="filterinfoicon" onClick={() => window.location.href = '/addonsdetails'}>
                ⓘ
                <span id="filterinfo">
                  Click on a addon to filter the policies
                </span>
              </div>
              <h3> Free Add-on </h3>
              <div id="filterFree" className="filter">
                {addonData.map((addon, index) => {
                  if (
                    addon["Add-on Number"] > 60
                  ) {
                    return (
                      <div key={index} className="filterAddons">
                        <input
                          type="checkbox"
                          name={addon["Add-on Name"]}
                          id={addon["Add-on Number"]}
                          onChange={handleAddonChange}
                        />
                        <label htmlFor={addon["Add-on Number"]}>
                          {addon["Add-on Name"]}
                        </label>
                      </div>
                    );
                  }
                })}
              </div>
              <h3> Paid Add-on </h3>
              <div id="filterFree" className="filter">
                {addonData.map((addon, index) => {
                  if (
                    addon["Add-on Number"] < 64
                  ) {
                    return (
                      <div key={index} className="filterAddons">
                        <input
                          type="checkbox"
                          name={addon["Add-on Name"]}
                          id={addon["Add-on Number"]}
                          onChange={handleAddonChange}
                        />
                        <label htmlFor={addon["Add-on Number"]}>
                          {addon["Add-on Name"]}
                        </label>
                      </div>
                    );
                  }
                })}
              </div>
              <a href="/yearslasting" style={{ textDecoration: 'none', cursor: 'pointer' }}>
  <Calculator income={formData.income} insured_amount={formData.insuredAmount} />
</a>

            </div>
          </div>
        </>
      )}
    </>
  );
}

function calculateLoadingCharge(policyNumber, formData) {
  // Define the policy data and loading factors for each payment term

  // Step 1: Find which company the policy belongs to
  let companyId = null;
  for (let company in companyPolicies) {
    if (companyPolicies[company].includes(policyNumber)) {
      companyId = parseInt(company);
      break;
    }
  }

  // If companyId is not found, return 0 or handle the case accordingly
  if (!companyId) {
    console.error("Company not found for this policy.");
    return 0;
  }

  // Step 2: Get the loading charge factors based on the payment term (FormData.term)
  const loadingFactors = paymentMethods[formData.term]; // Get loading factors based on FormData.term
  if (!loadingFactors) {
    console.error("Invalid term value.");
    return 0;
  }

  let loadingCharge;

  // Step 3: Apply the correct loading factor based on company
  if (companyId === 1) {
    loadingCharge = loadingFactors.loading1; // Company 1 uses loading1
  } else if (companyId === 2) {
    loadingCharge = loadingFactors.loading2; // Company 2 uses loading2
  } else if (companyId === 3) {
    loadingCharge = loadingFactors.loading3; // Company 3 uses loading3
  }

  return loadingCharge; // Return the calculated loading charge
}

function calculateRebate(policyNumber, formData) {
  // Define the company policies and the rebate brackets

  // Step 1: Find which company the policy belongs to
  let companyId = null;
  for (let company in companyPolicies) {
    if (companyPolicies[company].includes(policyNumber)) {
      companyId = parseInt(company);
      break;
    }
  }

  // Step 2: Find the correct rebate based on insured amount
  let rebate = 0;

  // Loop through the rebate brackets and find the appropriate rebate
  for (let bracket of rebateBrackets) {
    if (
      formData.insuredAmount >= bracket.min &&
      formData.insuredAmount <= bracket.max
    ) {
      // Step 3: Get the correct rebate based on company
      if (companyId === 1) {
        rebate = bracket.rebate1;
      } else if (companyId === 2) {
        rebate = bracket.rebate2;
      } else if (companyId === 3) {
        rebate = bracket.rebate3;
      }
      break;
    }
  }

  // Step 4: Check if the policy number is in the special set (10, 11, 12, 13, 14, 15)
  if ([10, 11, 12, 13, 14, 15].includes(policyNumber)) {
    rebate = rebate / 20;
  }

  // Return the final rebate amount
  return rebate;
}

function calculateTotalAddonsCost(selectedAddons, formData) {
  // Define the addon costs (addon number -> cost per 1k)

  // Step 1: Initialize total addon cost
  let totalAddonCost = 0;

  // Step 2: Loop through the selected addons and sum the costs
  selectedAddons.forEach((addon) => {
    if (addonCosts[addon]) {
      totalAddonCost += addonCosts[addon];
    }
  });

  // Step 3: Multiply by insured amount, divide by 10000
  let calculatedAddonCost = (totalAddonCost * formData.insuredAmount) / 10000;

  calculatedAddonCost = calculatedAddonCost / formData.term;

  // Return the total calculated addon cost
  return calculatedAddonCost;
}

async function calculatePremium(formData, policyNumber) {
  // const tabRate = 1000
  // const [tabRate, setTabRate] = useState(1000);

  // Step 1: Get the tab rate from the csvs and calculate it for the respective policies
  let tabRate = await calculateTabRate(
    policyNumber,
    formData.age,
    formData.insuredTerm
  ); // Brought from the db
  console.log(tabRate);
  // tabRatePromise.then(val => setTabRate(val))

  // Step 2: Get the loading charge using the provided loading charge function
  const loadingCharge = calculateLoadingCharge(policyNumber, formData);

  // Step 3: Get the rebate value using the provided rebate function
  const rebate = calculateRebate(formData.insuredAmount, policyNumber);

  // Step 4: Multiply by insured amount and divide by 1000
  const premiumBase =
    (tabRate * loadingCharge * (formData.insuredAmount - rebate)) / 1000;

  // Step 5: Divide by the term (to get the premium per term)
  const premiumPerTerm = premiumBase / formData.term;

  // Return both the premium base and total premium with addons
  return Math.round(premiumPerTerm*100)/100;
}

function findTabRateForEndowment(tabRateData, age, insuredTerm) {
  const toplessTabRateData = tabRateData.slice(1);
  const ageRow = toplessTabRateData
    .find((row) => parseInt(row[0]) == age)
    .slice(1);

  if (!ageRow) {
    console.error(`Age ${age} not found in the tab rate data for Endowment.`);
    return null; // Return null if the age isn't found
  }

  let termList = tabRateData[0];
  termList.splice(0, 1);
  const insuredTermPosition = Object.keys(termList).find(
    (val) => parseInt(termList[val]) == insuredTerm
  );

  if (!insuredTermPosition) {
    console.error(
      `Insured term ${insuredTerm} not found in the tab rate data for Endowment.`
    );
    return null; // Return null if the insured term isn't found
  }

  return parseFloat(ageRow[insuredTermPosition]);
}

// Function to find the Tab Rate for Money Back policies
function findTabRateForMoneyBack(tabRateData, age, insuredTerm) {
  const toplessTabRateData = tabRateData.slice(1);
  const ageRow = toplessTabRateData
    .find((row) => parseInt(row[0]) == age)
    .slice(1);

  if (!ageRow) {
    console.error(`Age ${age} not found in the tab rate data for Money Back.`);
    return null; // Return null if the age isn't found
  }

  let termList = tabRateData[0];
  termList.splice(0, 1);
  const insuredTermPosition = Object.keys(termList).find(
    (val) => parseInt(termList[val]) == insuredTerm
  );

  if (!insuredTermPosition) {
    console.error(
      `Insured term ${insuredTerm} not found in the tab rate data for Money Back.`
    );
    return null; // Return null if the insured term isn't found
  }

  return parseFloat(ageRow[insuredTermPosition]);
}

// Function to find the Tab Rate for Term Life policies
function findTabRateForTermLife(tabRateData, rowVal, columnVal) {
  const toplessTabRateData = tabRateData.slice(1);
  const ageRow = toplessTabRateData
    .find((row) => parseInt(row[0]) == rowVal)
    .slice(1);

  if (!ageRow) {
    console.error(
      `Age ${rowVal} not found in the tab rate data for Money Back.`
    );
    return null; // Return null if the age isn't found
  }

  let termList = tabRateData[0];
  termList.splice(0, 1);
  const insuredTermPosition = Object.keys(termList).find(
    (val) => parseInt(termList[val]) == columnVal
  );

  if (!insuredTermPosition) {
    console.error(
      `Insured term ${columnVal} not found in the tab rate data for Money Back.`
    );
    return null; // Return null if the insured term isn't found
  }

  return parseFloat(ageRow[insuredTermPosition]);
}

// Function to calculate the Tab Rate based on the policy type
async function calculateTabRate(policyNumber, age, insuredTerm) {
  const tabRateData = await fetchTabRateData(policyNumber);

  if (!tabRateData) {
    return null;
  }

  // Determine policy type
  if (policyNumber >= 1 && policyNumber <= 9) {
    // Endowment
    return findTabRateForEndowment(tabRateData, age, insuredTerm);
  } else if (policyNumber >= 10 && policyNumber <= 15) {
    // Money Back
    return findTabRateForMoneyBack(tabRateData, age, insuredTerm);
  } else if (policyNumber >= 16 && policyNumber <= 21) {
    // Term Life
    return findTabRateForTermLife(tabRateData, age, policyNumber);
  } else {
    console.error(`Invalid policy number ${policyNumber}.`);
    return null;
  }
}

// Fetch the Tab Rate data based on policy type
async function fetchTabRateData(policyNumber) {
  let url = `/AllPolicy/${policyNumber}.csv`;

  try {
    const response = await fetch(url);
    const csvData = await response.text();
    const parsedData = papa.parse(csvData, { skipEmptyLines: true });
    console.log("ParsedData", parsedData);
    return parsedData.data;
  } catch (error) {
    console.error(
      `Failed to fetch data for policy number ${policyNumber}:`,
      error
    );
    return null;
  }
}

// Function to check if a policy has the selected addon
const hasAddonForPolicy = (policyNumber, addonId) => {
  const addons = policyAddons[policyNumber];
  return addons && addons.includes(addonId) ? 1 : 0;
};

// Function to get CSR by policy number
const getCsrByPolicyNumber = (policyNumber) => {
  const policy = policyData.find((p) => p.policyNumber === policyNumber);
  return policy ? policy.csr : null; // Return CSR or null if not found
};

// Function to get Policy Name by policy number
const getPolicyNameByPolicyNumber = (policyNumber) => {
  const policy = policyData.find((p) => p.policyNumber === policyNumber);
  return policy ? policy.name : null; // Return name or null if not found
};
