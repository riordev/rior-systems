import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Calculator.css'; // Assuming the styles would be defined here

const BreakEvenROASCalculator = () => {
  const [price, setPrice] = useState(0);
  const [cogs, setCOGS] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [processingFee, setProcessingFee] = useState(2.9);
  const [otherFees, setOtherFees] = useState(0);

  const calculateROAS = () => {
    const totalFees = (parseFloat(processingFee) + parseFloat(otherFees)) / 100 * price;
    const breakEvenROAS = price / (price - cogs - shipping - totalFees);
    return breakEvenROAS;
  };

  const getColor = (roas) => {
    if (roas >= 2.5) return 'green';
    if (roas >= 1 && roas < 2.5) return 'yellow';
    return 'red';
  };

  const roas = calculateROAS();
  const color = getColor(roas);

  return (
    <div className="calculator">
      <h1>What's your true break-even ROAS?</h1>
      <p>Most Shopify brands get this wrong. Calculate yours in 30 seconds.</p>

      <form>
        <div>
          <label>Product selling price ($): </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>COGS — Cost of Goods Sold ($): </label>
          <input type="number" value={cogs} onChange={(e) => setCOGS(e.target.value)} />
        </div>
        <div>
          <label>Shipping cost ($): </label>
          <input type="number" value={shipping} onChange={(e) => setShipping(e.target.value)} />
        </div>
        <div>
          <label>Payment processing fee (%): </label>
          <input type="number" value={processingFee} onChange={(e) => setProcessingFee(e.target.value)} />
        </div>
        <div>
          <label>Other fees (%): </label>
          <input type="number" value={otherFees} onChange={(e) => setOtherFees(e.target.value)} />
        </div>
      </form>

      <motion.div className="results-card" style={{ backgroundColor: color }}>
        <h2>Your break-even ROAS is {roas.toFixed(2)}x</h2>
        <p>At 2.5x ROAS, you break even. Above = profit, below = loss.</p>
        <p>Industry average for your margin: Y.YYx</p>
      </motion.div>

      <div className="lead-capture">
        <h3>Want to track this automatically?</h3>
        <input type="email" placeholder="Enter your email" />
        <button>Send me the free tracking guide</button>
        <a href="/demo">Demo</a>
        <a href="#">Calendly</a>
      </div>
    </div>
  );
};

export default BreakEvenROASCalculator;