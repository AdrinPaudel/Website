import json
import sys
import poly2
def main(data_features):
    # Load and preprocess training data
    X, y = poly2.load_and_preprocess_data('AI/data.csv')
    
    # Evaluate model performance
    poly2.evaluate_model(X, y)
    
    # Train final model
    scaler, poly, model = poly2.train_prediction_model(X, y)
    
    # Load user data
    with open('AI/data/userData.json', 'r') as file:
        user_data = json.load(file)[data_features]
    
    # Make prediction
    prediction = poly2.predict_percentage(scaler, poly, model, user_data)
    print(prediction)

if __name__ == "__main__":
    main(sys.argv[1])