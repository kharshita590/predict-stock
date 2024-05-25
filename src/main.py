import pandas as pd
from catboost import CatBoostClassifier, Pool
from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class StockCategory(BaseModel):
    category:str
    
data = pd.read_csv('/Users/akhileshkumar/Desktop/stock-prediction/stock/predict/src/cat.csv', header=None)
data.columns = ['category', 'Close', 'SMA', 'EMA', 'RSI', 'MACD Line', 'Signal Line', 'MACD Histogram', 'advice']


data = data[['category', 'advice']]
data.fillna(0, inplace=True)  


data['stock'] = data['category'].astype('category')


X = data['category'].values.reshape(-1,1)
y = data['advice']


cat_features = [0]  
train_pool = Pool(data=X, label=y, cat_features=cat_features)


model = CatBoostClassifier(iterations=1000, depth=6, learning_rate=0.1, loss_function='MultiClass')
model.fit(train_pool, verbose=False)


predictions = model.predict(X)


def predict_stock_advice(stock_category):
    stock_data = pd.DataFrame([stock_category], columns=['category'])
    stock_data['category'] = stock_data['category'].astype('category')
    stock_data = stock_data['category'].to_numpy().reshape(-1, 1)
    stock_pool = Pool(data=stock_data,cat_features=cat_features)
    prediction = model.predict(stock_pool)
    return prediction


# stock_category = 'AAPL'  
# print(f'Prediction for {stock_category}: {prediction}')

@app.post("/predict")
async def predict(data:StockCategory):
    try:
        prediction = predict_stock_advice(data.category)
        return {"prediction":prediction.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=8002)   