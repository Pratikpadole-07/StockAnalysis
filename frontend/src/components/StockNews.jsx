import React, { useEffect, useState } from "react";
import { getStockNews } from "../api/api";

export default function StockNews({ symbol }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    load();
  }, [symbol]);

  const load = async () => {
    try {
      const res = await getStockNews(symbol);
      setNews(res.data.data || []);
    } catch {
      setNews([]);
    }
  };

  const sentimentColor = (s) =>
    s === "positive" ? "text-green-400"
    : s === "negative" ? "text-red-400"
    : "text-yellow-300";

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Market News</h2>

      {news.length === 0 ? (
        <p className="text-gray-400">No recent news found.</p>
      ) : (
        <div className="space-y-4">
          {news.map((n, i) => (
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              className="block bg-gray-800/40 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
            >
              <h3 className="font-bold text-lg">{n.headline}</h3>
              <p className="opacity-70 text-sm">{new Date(n.datetime).toLocaleString()}</p>
              <p className="mt-2 text-sm">{n.summary}</p>
              <span className={`mt-2 inline-block text-xs font-bold ${sentimentColor(n.sentiment)}`}>
                {n.sentiment.toUpperCase()}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
