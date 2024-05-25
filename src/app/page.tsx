"use client"
import Image from "next/image";
import { useState } from "react";
import axios from 'axios';
export default function Home() {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState('')
  const [category, setCategory] = useState('')
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true)
    try {
      
      const response = await axios.post("https://predict-stock-lovat.vercel.app/predict",{category});
      setPrediction(response.data.prediction)
    } catch (error) {
      console.log(error)
      setPrediction("error occured")
    };
    setLoading(false)
  }


  return (
    <main>
      <div className="top mt-[5rem] ml-[23rem]">
        <h1 className="text-white">Enter your Stock</h1>
        <div className="inputV flex ">

          <form onSubmit={handleSubmit}>
            <input
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button className="submitBtn ml-[2rem] text-black">
          {loading? 'Loading..' : 'Submit'}

            </button>
          </form>
        </div>
      {prediction  &&(
        <div className="box">
          <p className="predict p-4">{prediction}</p>
        </div>
      )
}
      </div>

      <div className="instructions">
        <h1 className="ml-[23rem] mt-[3rem]">Instructions</h1>
        <ul className="ml-[23rem] ul-1">
          <li>You can get advice for the following stocks-apple,microsoft,nvdia,google and amazon</li>
          <li>The correct way to get desired output is-</li>
          <li>Enter the Ticker symbol for the stock</li>
          <li>Google: GOOGL</li>
          <li>Microsoft: MSFT</li>
          <li> Amazon: AMZN</li>
          <li>NVIDIA : NVDA</li>
          <li>Apple : AAPL</li>
          <li>This is for project purposes only</li>
          <li>If you find it amazing, we will take some other stocks also</li>

        </ul>

      </div>
      <div className="h-24 w-3">
     
      </div>
    </main>
  );
}
