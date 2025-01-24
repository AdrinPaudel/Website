"use client";

import "./page.css";
import "../api/runai.js";
import papa from "papaparse";
import { useEffect, useState } from "react";
import DataFilter from "./DataFilter";
import Calculator from "../components/calculator/calculator";

const addonIndNames = {
  1: "Accidental Death Benefit",
  2: "Termrider",
  3.1: "Critical Illness Payout",
  3.2: "Critical Illness No Premium Pay",
  4: "Spouse Rider",
  5.1: "Disability Payout",
  5.2: "Disability No Premium Pay",
  6: "Child Education Rider",
  7: "Hospital Rider",
  8: "Time Extension Rider",
  9: "Funeral Expense Rider",
  10: "Employment Loss No Premium Rider",
  11: "Travel Add-on",
  12: "Premium Return in Term Life",
  65: "Loan Against Insured Amount",
  66: "Grace Period for Pay",
  67: "Discount for Salaried Employees",
  68: "Online Discount",
  69: "Free Annual Health Checkup Whole Body",
  70: "Free Lookup Period",
  71: "Policy Conversion",
};
const policyAddons = {
  1: [1, 2, 3.1, 5.2, 7, 10, 65, 66, 68, 70],
  2: [1, 2, 4, 6, 8, 11, 65, 67, 69, 71],
  3: [1, 2, 3.2, 5.1, 9, 11, 65, 66, 67, 70],
  4: [1, 2, 4, 7, 8, 10, 65, 68, 69, 71],
  5: [1, 2, 3.1, 6, 9, 10, 65, 66, 69, 70],
  6: [1, 2, 5.2, 7, 8, 11, 65, 67, 68, 71],
  7: [1, 2, 3.2, 6, 8, 10, 65, 66, 67, 69],
  8: [1, 2, 4, 5.1, 9, 11, 65, 68, 70, 71],
  9: [1, 2, 3.1, 7, 8, 11, 65, 66, 69, 71],
  10: [1, 2, 4, 6, 9, 10, 65, 67, 68, 70],
  11: [1, 2, 3.2, 5.2, 7, 11, 65, 66, 67, 71],
  12: [1, 2, 4, 6, 8, 9, 65, 68, 69, 70],
  13: [1, 2, 3.1, 6, 7, 11, 65, 66, 70, 71],
  14: [1, 2, 4, 5.1, 8, 10, 65, 67, 69, 70],
  15: [1, 2, 3.2, 6, 9, 10, 65, 66, 68, 71],
  16: [1, 2, 3.1, 7, 9, 12, 66, 68, 69, 71],
  17: [1, 2, 4, 8, 11, 12, 67, 68, 70, 71],
  18: [1, 2, 5.1, 6, 10, 12, 66, 67, 69, 70],
  19: [1, 2, 3.2, 8, 11, 12, 66, 68, 70, 71],
  20: [1, 2, 4, 6, 9, 12, 67, 69, 70, 71],
  21: [1, 2, 5.2, 7, 10, 12, 66, 67, 68, 69],
};

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
    const hardcodedData = [
      {
        "Add-on Number": "1",
        "Add-on Name": "Accidental Death Benefit",
        Costper1k: 1,
      },
      { "Add-on Number": "2", "Add-on Name": "Termrider", Costper1k: 5 },
      {
        "Add-on Number": "3.1",
        "Add-on Name": "Critical Illness Payout",
        Costper1k: 2,
      },
      {
        "Add-on Number": "3.2",
        "Add-on Name": "Critical Illness No Premium Pay",
        Costper1k: 1,
      },
      { "Add-on Number": "4", "Add-on Name": "Spouse Rider", Costper1k: 10 },
      {
        "Add-on Number": "5.1",
        "Add-on Name": "Disability Payout",
        Costper1k: 2,
      },
      {
        "Add-on Number": "5.2",
        "Add-on Name": "Disability No Premium Pay",
        Costper1k: 1,
      },
      {
        "Add-on Number": "6",
        "Add-on Name": "Child Education Rider",
        Costper1k: 1,
      },
      { "Add-on Number": "7", "Add-on Name": "Hospital Rider", Costper1k: 3 },
      {
        "Add-on Number": "8",
        "Add-on Name": "Time Extension Rider",
        Costper1k: 1,
      },
      {
        "Add-on Number": "9",
        "Add-on Name": "Funeral Expense Rider",
        Costper1k: 0.25,
      },
      {
        "Add-on Number": "10",
        "Add-on Name": "Employment Loss No Premium Rider",
        Costper1k: 10,
      },
      { "Add-on Number": "11", "Add-on Name": "Travel Add-on", Costper1k: 5 },
      {
        "Add-on Number": "12",
        "Add-on Name": "Premium Return in Term Life",
        Costper1k: 3,
      },
      {
        "Add-on Number": "65",
        "Add-on Name": "Loan Against Insured Amount",
        Costper1k: 0,
      },
      {
        "Add-on Number": "66",
        "Add-on Name": "Grace Period for Pay",
        Costper1k: 0,
      },
      {
        "Add-on Number": "67",
        "Add-on Name": "Discount for Salaried Employees",
        Costper1k: 0,
      },
      { "Add-on Number": "68", "Add-on Name": "Online Discount", Costper1k: 0 },
      {
        "Add-on Number": "69",
        "Add-on Name": "Free Annual Health Checkup Whole Body",
        Costper1k: 0,
      },
      {
        "Add-on Number": "70",
        "Add-on Name": "Free Lookup Period",
        Costper1k: 0,
      },
      {
        "Add-on Number": "71",
        "Add-on Name": "Policy Conversion",
        Costper1k: 0,
      },
    ];

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
        filteredData.map((policy, index) => (
          <div key={index} className="filteredPolicies">
            <h1>
              {policy.policyName}
              <span className="cardPolicyId">{policy.policy}</span>
            </h1>
            <div className="cardCompanyName">{policy.companyName}</div>
            <div className="cardCSR">
              CSR: {policy.csr ? policy.csr : "N/A"}
            </div><br/>
            {/* {selectedAddons.join(", ")}. AddonCost:{" "} */}
            <div className="cardCost">
              <div className="cardPremiumCost">
                Premium: {policy.premium ? policy.premium : "0"}
              </div>
              <div className="cardAddonCost">
                AddonCost: {policy.addonCost ? policy.addonCost : "0"}
              </div>
            </div>

            <div className="cardAddons">
              Addons:
              <div className="cardAddonsContent">
              {policyAddons[policy.policy].map((element, index) => {
                if (element < 65) {
                  return (
                    <div key={index} className="addonsNamesPaid">
                      {addonIndNames[element]}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="addonsNamesFree">
                      {addonIndNames[element]}
                    </div>
                  );
                }
              })}
              </div>
            </div>
          </div>
        ))
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
              // POLICY FILTERED CARDS
            }
            <div id="policyCards">{comparisonResult}</div>

            <div id="majorView">
              <h1> Choose an Add-on </h1>
              <div id="filterinfoicon">
                ⓘ
                <span id="filterinfo">
                  Click on a addon to filter the policies
                </span>
              </div>
              <h3> Free Add-on </h3>
              <div id="filterFree" className="filter">
                {addonData.map((addon, index) => {
                  if (
                    addon["Add-on Number"] != "" &&
                    addon["Costper1k"] == "0"
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
                    addon["Add-on Number"] != "" &&
                    addon["Costper1k"] != "0"
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
              <Calculator income={formData.income} insured_amount={formData.insuredAmount}></Calculator>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function calculateLoadingCharge(policyNumber, formData) {
  // Define the policy data and loading factors for each payment term
  const companyPolicies = {
    1: [1, 2, 3, 10, 11, 16, 17],
    2: [4, 5, 6, 12, 13, 18, 19],
    3: [7, 8, 9, 14, 15, 20, 21],
  };

  const paymentMethods = {
    1: { loading1: 1, loading2: 0.98, loading3: 0.97 }, // Yearly
    0.5: { loading1: 1.01, loading2: 1.0, loading3: 0.99 }, // Half-yearly
    0.25: { loading1: 1.03, loading2: 1.2, loading3: 1.0 }, // Quarterly
    0.083: { loading1: 1.07, loading2: 1.5, loading3: 1.2 }, // Monthly
  };

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
  const companyPolicies = {
    1: [1, 2, 3, 10, 11, 16, 17],
    2: [4, 5, 6, 12, 13, 18, 19],
    3: [7, 8, 9, 14, 15, 20, 21],
  };

  const rebateBrackets = [
    { min: 25000, max: 49000, rebate1: 0.5, rebate2: 0.25, rebate3: 1 },
    { min: 50000, max: 99000, rebate1: 1.0, rebate2: 0.5, rebate3: 1.25 },
    { min: 100000, max: 199000, rebate1: 1.5, rebate2: 1.0, rebate3: 1.75 },
    { min: 200000, max: Infinity, rebate1: 2.0, rebate2: 2.0, rebate3: 2.5 },
  ];

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
  const addonCosts = {
    1: 1, // Accidental Death Benefit
    2: 5, // Termrider
    3.1: 2, // Critical Illness Payout
    3.2: 1, // Critical Illness No Premium Pay
    4: 10, // Spouse Rider
    5.1: 2, // Disability Payout
    5.2: 1, // Disability No Premium Pay
    6: 1, // Child Education Rider
    7: 3, // Hospital Rider
    8: 1, // Time Extension Rider
    9: 0.25, // Funeral Expense Rider
    10: 10, // Employment Loss No Premium Rider
    11: 5, // Travel Add-on
    12: 3, // Premium Return in Term Life
    65: 0, // Loan Against Insured Amount
    66: 0, // Grace Period for Pay
    67: 0, // Discount for Salaried Employees
    68: 0, // Online Discount
    69: 0, // Free Annual Health Checkup Whole Body
    70: 0, // Free Lookup Period
    71: 0, // Policy Conversion
  };

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

  /*
  // Step 6: Get the total addon cost (using the calculateTotalAddonsCost function)
  const totalAddonCost = calculateTotalAddonsCost(selectedAddons, formData.insuredAmount);

  // Step 7: Divide the addon cost by the term (to get addon cost per term)
  const addonCostPerTerm = totalAddonCost / formData.term;

  // Step 8: Calculate the total premium (base premium + addon cost)
  const totalPremium = premiumPerTerm + addonCostPerTerm;
  */

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

  // console.log("ageRow", age, toplessTabRateData, ageRow)
  if (!ageRow) {
    console.error(`Age ${age} not found in the tab rate data for Money Back.`);
    return null; // Return null if the age isn't found
  }

  let termList = tabRateData[0];
  termList.splice(0, 1);
  const insuredTermPosition = Object.keys(termList).find(
    (val) => parseInt(termList[val]) == insuredTerm
  );

  // console.log("termList", age, toplessTabRateData, termList)
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

  // console.log("ageRow", age, toplessTabRateData, ageRow)
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

  // console.log("termList", age, toplessTabRateData, termList)
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

const policyData = [
  { policyNumber: 1, name: "Himalayan Life Endowment Plan", csr: 88.3 },
  { policyNumber: 2, name: "Himalayan Life Bachhat Beema Plan", csr: 92.1 },
  { policyNumber: 3, name: "Himalayan Life Sunaulo Bhabishya Plan", csr: 86.5 },
  { policyNumber: 4, name: "Lic Endowment Plan", csr: 89.2 },
  { policyNumber: 5, name: "Lic Unnat Plan", csr: 91.4 },
  { policyNumber: 6, name: "Lic Sajilo Beema Plan", csr: 94.0 },
  { policyNumber: 7, name: "Nepal Life Endowment Plan", csr: 87.7 },
  { policyNumber: 8, name: "Nepal Life Safalta Plan", csr: 90.3 },
  { policyNumber: 9, name: "Nepal Life Uttam Beema Plan", csr: 93.5 },
  { policyNumber: 10, name: "Himalayan Life Money Back Plan", csr: 85.6 },
  { policyNumber: 11, name: "Himalayan Life Bhabiswa Yojana Plan", csr: 92.8 },
  { policyNumber: 12, name: "Lic Money Back Plan", csr: 90.9 },
  { policyNumber: 13, name: "Lic Bhabishya Plan", csr: 89.6 },
  { policyNumber: 14, name: "Nepal Life Money Back Plan", csr: 91.1 },
  { policyNumber: 15, name: "Nepal Life Samriddhi Plan", csr: 94.4 },
  { policyNumber: 16, name: "Himalayan Life Term Life Plan", csr: 86.9 },
  { policyNumber: 17, name: "Himalayan Life Suraksha Beema Plan", csr: 93.1 },
  { policyNumber: 18, name: "Lic Term Life Plan", csr: 89.9 },
  { policyNumber: 19, name: "Lic Jeevan Suraksha Plan", csr: 95.0 },
  { policyNumber: 20, name: "Nepal Life Term Life Plan", csr: 87.2 },
  { policyNumber: 21, name: "Nepal Life Jeevan Shakti Plan", csr: 91.7 },
];

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


const companyPolicies = {
  1: "Himalayan Life",
  2: "Life Insurance Corporation Nepal",
  3: "Nepal Life",
};

const getCompanyName = (policyNumber) => {
  if (company1Policies.includes(policyNumber)) {
    return "Himalayan Life";
  } else if (company2Policies.includes(policyNumber)) {
    return "Life Insurance Corporation Nepal";
  } else if (company3Policies.includes(policyNumber)) {
    return "Nepal Life";
  }
  return "";
};

const getAddonName = (addonId) => {
  return addonData[addonId] || "";
};

// i had to remove this cz this made me pagal .. now this has to be re added
/*
setComparisonResult(
      filteredData.map((arr, index) => {
                  let policy_addons = arr["policy"] == 1 ? [1, 2, 3.1, 5.2, 7, 10, 65, 66, 68, 70] :
                    arr["policy"] == 2 ? [1, 2, 4, 6, 8, 11, 65, 67, 69, 71] :
                      arr["policy"] == 3 ? [1, 2, 3.2, 5.1, 9, 11, 65, 66, 67, 70] :
                        arr["policy"] == 4 ? [1, 2, 4, 7, 8, 10, 65, 68, 69, 71] :
                          arr["policy"] == 5 ? [1, 2, 3.1, 6, 9, 10, 65, 66, 69, 70] :
                            arr["policy"] == 6 ? [1, 2, 5.2, 7, 8, 11, 65, 67, 68, 71] :
                              arr["policy"] == 7 ? [1, 2, 3.2, 6, 8, 10, 65, 66, 67, 69] :
                                arr["policy"] == 8 ? [1, 2, 4, 5.1, 9, 11, 65, 68, 70, 71] :
                                  arr["policy"] == 9 ? [1, 2, 3.1, 7, 8, 11, 65, 66, 69, 71] :
                                    arr["policy"] == 10 ? [1, 2, 4, 6, 9, 10, 65, 67, 68, 70] :
                                      arr["policy"] == 11 ? [1, 2, 3.2, 5.2, 7, 11, 65, 66, 67, 71] :
                                        arr["policy"] == 12 ? [1, 2, 4, 6, 8, 9, 65, 68, 69, 70] :
                                          arr["policy"] == 13 ? [1, 2, 3.1, 6, 7, 11, 65, 66, 70, 71] :
                                            arr["policy"] == 14 ? [1, 2, 4, 5.1, 8, 10, 65, 67, 69, 70] :
                                              arr["policy"] == 15 ? [1, 2, 3.2, 6, 9, 10, 65, 66, 68, 71] :
                                                arr["policy"] == 16 ? [1, 2, 3.1, 7, 9, 12, 66, 68, 69, 71] :
                                                  arr["policy"] == 17 ? [1, 2, 4, 8, 11, 12, 67, 68, 70, 71] :
                                                    arr["policy"] == 18 ? [1, 2, 5.1, 6, 10, 12, 66, 67, 69, 70] :
                                                      arr["policy"] == 19 ? [1, 2, 3.2, 8, 11, 12, 66, 68, 70, 71] :
                                                        arr["policy"] == 20 ? [1, 2, 4, 6, 9, 12, 67, 69, 70, 71] : 
                                                           arr["policy"] == 21 ? [1, 2, 5.2, 7, 10, 12, 66, 67, 68, 69] : []

                    let newFilteredData = []

                    for (let j = 0; j < selectedAddons.length; j++) {
                      if (!policy_addons.includes(selectedAddons[j])) {
                          for(let k=0; k < filteredData.length; k++){
                            if (filteredData[k] != filteredData[i]){
                              newFilteredData.push(filteredData[k])
                            }
                          }                        
                        }
                    }
                    console.log("bot", newFilteredData)


                    let policy_num = arr["policy"]
                    const policies = {
                      1: "Himalayan Life Endowment Plan",
                      2: "Himalayan Life Bachhat Beema Plan",
                      3: "Himalayan Life Sunaulo Bhabishya Plan",
                      4: "Lic Endowment Plan",
                      5: "Lic Unnat Plan",
                      6: "Lic Sajilo Beema Plan",
                      7: "Nepal Life Endowment Plan",
                      8: "Nepal Life Safalta Plan",
                      9: "Nepal Life Uttam Beema Plan",
                      10: "Himalayan Life Money Back Plan",
                      11: "Himalayan Life Bhabiswa Yojana Plan",
                      12: "Lic Money Back Plan",
                      13: "Lic Bhabishya Plan",
                      14: "Nepal Life Money Back Plan",
                      15: "Nepal Life Samriddhi Plan",
                      16: "Himalayan Life Term Life Plan",
                      17: "Himalayan Life Suraksha Beema Plan",
                      18: "Lic Term Life Plan",
                      19: "Lic Jeevan Suraksha Plan",
                      20: "Nepal Life Term Life Plan",
                      21: "Nepal Life Jeevan Shakti Plan",
                    };

                    return (
                      <div key={index} className="filteredPolicies">
                        <div className="cardscompany">
                          {
                            <div className="policyName">{policies[policy_num]}</div>
                          }
                          <div className="cardscsr">{
                            (company1Policies.includes(policy_num)) ? 83 :
                              (company2Policies.includes(policy_num)) ? 95 :
                                (company3Policies.includes(policy_num)) ? 87 : 0
                          }
                          </div>
                          <span className="policyType">
                            {
                              (1 <= policy_num && policy_num <= 9) ? "Endowment" :
                                (10 <= policy_num && policy_num <= 15) ? "Money Back" :
                                  (16 <= policy_num && policy_num <= 21) ? "Term Life" : ""
                            }
                          </span>
                          <div className="cardspolicynum">{policy_num}</div>
                        </div>
                        <div className="companyName">
                          {
                            (company1Policies.includes(policy_num)) ? "Himalayan Life Insurance" :
                              (company2Policies.includes(policy_num)) ? "Life Insurance Corporation Nepal" :
                                (company3Policies.includes(policy_num)) ? "Nepal Life" : ""
                          }
                        </div>


                        <div className="cardspremium">Rs {Math.floor(arr["premium"] * 100) / 100} </div>
                        <div className="cardsaddons">
                          <span className="cardsaddonsTitle">Addons</span>
                          <div className="cardsaddonscontent">
                            {
                              policy_addons.map((addon, index) => {
                                let addonName = ""
                                if (addon == 1) {
                                  addonName = "Accident Death Benefit"
                                } else if (addon == 2) {
                                  addonName = "Termrider"
                                } else if (addon == 3) {
                                  addonName = "Critical Illness Payout"
                                } else if (addon == 4) {
                                  addonName = "Spouse Rider"
                                } else if (addon == 5) {
                                  addonName = "Disability Payout"
                                } else if (addon == 6) {
                                  addonName = "Child Education Rider"
                                } else if (addon == 7) {
                                  addonName = "Hospital Rider"
                                } else if (addon == 8) {
                                  addonName = "Time Extension Rider"
                                } else if (addon == 9) {
                                  addonName = "Funeral Expense Rider"
                                } else if (addon == 10) {
                                  addonName = "Employment Loss No Premium Rider"
                                } else if (addon == 11) {
                                  addonName = "Travel Add-on"
                                } else if (addon == 12) {
                                  addonName = "Premium Return in Term Life"
                                } else if (addon == 65) {
                                  addonName = "Loan Against Insured Amount"
                                } else if (addon == 66) {
                                  addonName = "Grace Period for Pay"
                                } else if (addon == 67) {
                                  addonName = "Discount for Salaried Employees"
                                } else if (addon == 68) {
                                  addonName = "Online Discount"
                                } else if (addon == 69) {
                                  addonName = "Free Annual Health Checkup Whole Body"
                                } else if (addon == 70) {
                                  addonName = "Free Lookup Period"
                                } else if (addon == 71) {
                                  addonName = "Policy Conversion"
                                }
                                return (addon > 65 ? <div id="addonPaid" key={index}> {addonName} </div>
                                  : <div id="addonFree" key={index}> {addonName} </div>)
                              })
                            }
                          </div>
                        </div>
                      </div>
                    )

                })
              )
*/
