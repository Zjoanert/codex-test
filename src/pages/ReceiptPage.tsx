import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './ReceiptPage.css';

interface Item {
  name: string;
  price: number;
}

export default function ReceiptPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      recognizeImage(file);
    }
  };

  const recognizeImage = async (file: File) => {
    setProcessing(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, 'eng');
      parseText(text);
    } catch {
      // ignore errors
    } finally {
      setProcessing(false);
    }
  };

  const parseText = (text: string) => {
    const lines = text.split(/\r?\n/);
    const parsed: Item[] = [];
    let foundSubtotal: number | null = null;
    let foundTotal: number | null = null;

    for (const line of lines) {
      const priceMatch = line.match(/(\d+[.,]\d{2})/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(',', '.'));
        const lower = line.toLowerCase();
        if (lower.includes('subtotal')) {
          foundSubtotal = price;
        } else if (lower.includes('total')) {
          foundTotal = price;
        } else {
          const name = line.replace(priceMatch[0], '').trim();
          if (name) {
            parsed.push({ name, price });
          }
        }
      }
    }
    setItems(parsed);
    const calculatedSubtotal = parsed.reduce((s, i) => s + i.price, 0);
    setSubtotal(foundSubtotal ?? calculatedSubtotal);
    setTotal(foundTotal ?? foundSubtotal ?? calculatedSubtotal);
  };

  return (
    <div className="receipt-page">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {processing && <div className="processing">Processing...</div>}
      {items.length > 0 && (
        <div className="results">
          <ul className="item-list">
            {items.map((item, idx) => (
              <li key={idx} className="item">
                <label>
                  <input type="checkbox" />
                  <span className="item-name">{item.name}</span>
                </label>
                <span className="item-price">{item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="totals">
            <div className="subtotal">Subtotal: {subtotal?.toFixed(2)}</div>
            <div className="total">Total: {total?.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

