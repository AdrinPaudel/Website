import pandas as pd
import json
import sys
import numpy as np
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LinearRegression
dataFeatures = sys.argv[1]
try:
    with open('AI/data/userData.json', 'r') as file:
        jsondata = json.load(file)
except Exception as e:
    print(f'failed to read file : {e}')
# Lad the data

data = pd.read_csv('AI/data.csv')

# # Select features
featuresarr = ['Age','Income','Insurance Type','Premium Amount','Insured Years','Payment Type','Insured Amount','Percentage of Payment']
features = [feature for feature in featuresarr if feature in jsondata[dataFeatures]]

payment_type = {
        'yearly':1.0,
        'half_yearly': 0.5,
        'quarterly': 0.25,  
        'monthly': 0.083
        }
data['Payment Type'] = data['Payment Type'].map(payment_type)

X = data[features[:-1]].values  
y = data['Percentage of Payment'].values   
# Scale the features
scaler_x = StandardScaler()
X_scaled = scaler_x.fit_transform(X)
# Create polynomial features and fit model
poly_features = PolynomialFeatures(degree=2)
X_poly = poly_features.fit_transform(X_scaled)
model = LinearRegression()
model.fit(X_poly, y)

# Function to make predictions

def predict_insurance_payment(age, income, premium, insured_years, payment_type, insured_amount):
    new_data = np.array([[age, income, premium, insured_years, payment_type, insured_amount]])
    new_data_scaled = scaler_x.transform(new_data)
    new_data_poly = poly_features.transform(new_data_scaled)
    return model.predict(new_data_poly)[0]
with open('AI//data/userData.json', 'r') as file:
    data = json.load(file)
prediction = predict_insurance_payment(data[dataFeatures]['Age'], data[dataFeatures]['Income'], data[dataFeatures]['Premium Amount'], data[dataFeatures]['Insured Years'], data[dataFeatures]['Payment Type'], data[dataFeatures]['Insured Amount'])

print(prediction)
