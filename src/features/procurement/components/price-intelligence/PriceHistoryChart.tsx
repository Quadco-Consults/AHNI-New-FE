"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface PriceDataPoint {
  date: string;
  price: number;
  source: string;
  formattedDate?: string;
}

interface PriceHistoryChartProps {
  sourcePrices: {
    [key: string]: { price: number; created_datetime: string }[];
  };
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export default function PriceHistoryChart({ sourcePrices, minPrice, maxPrice, avgPrice }: PriceHistoryChartProps) {
  // Transform source prices into chart data
  const prepareChartData = () => {
    const allDataPoints: PriceDataPoint[] = [];

    // Collect all data points from all sources
    Object.entries(sourcePrices).forEach(([source, prices]) => {
      if (Array.isArray(prices)) {
        prices.forEach((priceEntry) => {
          allDataPoints.push({
            date: priceEntry.created_datetime,
            price: priceEntry.price,
            source: source,
          });
        });
      }
    });

    // Sort by date
    allDataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Format dates for display
    return allDataPoints.map((point) => ({
      ...point,
      formattedDate: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
      }),
    }));
  };

  const chartData = prepareChartData();

  // Calculate price trend
  const calculateTrend = () => {
    if (chartData.length < 2) return { trend: 'stable', percentage: 0 };

    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const percentageChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    return {
      trend: percentageChange > 5 ? 'rising' : percentageChange < -5 ? 'falling' : 'stable',
      percentage: Math.abs(percentageChange),
    };
  };

  const trend = calculateTrend();

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{formatCurrency(data.price)}</p>
          <p className="text-xs text-gray-600 capitalize">{data.source}</p>
          <p className="text-xs text-gray-500">{data.formattedDate}</p>
        </div>
      );
    }
    return null;
  };

  // Source color mapping
  const sourceColors: { [key: string]: string } = {
    "Vendor Bid": "#10b981", // Green
    "Purchase Order": "#f59e0b", // Orange
    "Market Survey": "#8b5cf6", // Purple
  };

  if (chartData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No price history data available to display chart</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trend Summary */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Price Trend Over Time
        </h4>
        <div className="flex items-center gap-2">
          {trend.trend === 'rising' && (
            <Badge variant="destructive" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Rising {trend.percentage.toFixed(1)}%
            </Badge>
          )}
          {trend.trend === 'falling' && (
            <Badge className="bg-green-600 gap-1">
              <TrendingDown className="h-3 w-3" />
              Falling {trend.percentage.toFixed(1)}%
            </Badge>
          )}
          {trend.trend === 'stable' && (
            <Badge variant="secondary" className="gap-1">
              <Activity className="h-3 w-3" />
              Stable
            </Badge>
          )}
        </div>
      </div>

      {/* Line Chart */}
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tickFormatter={(value) => `₦${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              domain={[Math.floor(minPrice * 0.9), Math.ceil(maxPrice * 1.1)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorPrice)"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Price Lines Reference */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-xs text-red-600 font-medium mb-1">Minimum</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(minPrice)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-600 font-medium mb-1">Average</p>
          <p className="text-lg font-bold text-blue-700">{formatCurrency(avgPrice)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-xs text-green-600 font-medium mb-1">Maximum</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(maxPrice)}</p>
        </div>
      </div>

      {/* Source Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.keys(sourcePrices).map((source) => (
          <div key={source} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sourceColors[source] || '#6b7280' }}
            />
            <span className="text-gray-700 capitalize">{source}</span>
            <Badge variant="secondary" className="text-xs">
              {sourcePrices[source]?.length || 0}
            </Badge>
          </div>
        ))}
      </div>

      {/* Chart Insights */}
      <Card className="p-4 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2 font-medium">Chart Insights:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Total data points: {chartData.length}</li>
          <li>• Price range: {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}</li>
          <li>• Price variance: {formatCurrency(maxPrice - minPrice)} ({((maxPrice - minPrice) / minPrice * 100).toFixed(1)}%)</li>
          <li>
            • Most recent price: {formatCurrency(chartData[chartData.length - 1].price)}
            {' '}from {chartData[chartData.length - 1].source.toLowerCase()}
          </li>
        </ul>
      </Card>
    </div>
  );
}
