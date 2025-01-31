'use server'
import fs from 'fs';
import path from 'path';

export const handlePremiumUpdate = async (formData, premiumValuePromise) => {
  const premiumValue = await premiumValuePromise;
  const updatedData = {
    data1: {
      "Age": parseInt(formData.age),
      "Income": parseInt(formData.income),
      'Premium Amount': (premiumValue),
      'Insured Years': parseInt(formData.insuredTerm),
      'Insurance Type':1,
      'Payment Type': parseInt(formData.type),
      'Insured Amount': parseInt(formData.insuredAmount),
    }
  };
  console.log(updatedData);
  
const filePath = path.join(process.cwd(), 'AI', 'data', 'userData.json');
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
};