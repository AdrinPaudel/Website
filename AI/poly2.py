import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import cross_val_score, train_test_split

def load_and_preprocess_data(csv_path):
    # Read and preprocess data
    data = pd.read_csv(csv_path)
    
    # Map categorical features
    payment_type_map = {'yearly': 1.0, 'half_yearly': 0.5, 'quarterly': 0.25, 'monthly': 0.083}
    insurance_type_map = {'Endowment': 1.0}
    
    data['Payment Type'] = data['Payment Type'].map(payment_type_map)
    data['Insurance Type'] = data['Insurance Type'].map(insurance_type_map)
    
    # Separate features and target
    features = ['Age', 'Income', 'Insurance Type', 'Premium Amount', 
                'Insured Years', 'Payment Type', 'Insured Amount']
    X = data[features]
    y = data['Percentage of Payment']
    
    return X, y

def train_prediction_model(X, y):
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Polynomial features
    poly = PolynomialFeatures(degree=2, include_bias=False)
    X_poly = poly.fit_transform(X_scaled)
    
    # Use Ridge regression for regularization
    model = Ridge(alpha=1.0)
    model.fit(X_poly, y)
    
    return scaler, poly, model

def predict_percentage(scaler, poly, model, input_data):
    # Prepare input data
    input_df = pd.DataFrame([input_data])
    
    # Scale and transform input
    input_scaled = scaler.transform(input_df)
    input_poly = poly.transform(input_scaled)
    
    # Predict and clip result
    prediction = model.predict(input_poly)[0]
    return max(0, min(prediction, 100))

def evaluate_model(X, y):
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Polynomial features
    poly = PolynomialFeatures(degree=2, include_bias=False)
    X_poly = poly.fit_transform(X_scaled)
    
    # Perform cross-validation
    model = Ridge(alpha=1.0)
    scores = cross_val_score(model, X_poly, y, cv=5, scoring='neg_mean_absolute_error')
    
    # print("Cross-validation MAE scores:", -scores)
    # print("Mean MAE:", -scores.mean())

