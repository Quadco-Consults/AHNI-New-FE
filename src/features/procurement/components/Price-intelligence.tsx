"use client";

import React, { useState } from "react";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetAllPriceIntelligence, useGetSinglePriceIntelligence } from "@/features/procurement/controllers/priceIntelligenceController";
import BreadcrumbCard from "@/components/Breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

const RatingCircle = ({ showInner }: { showInner?: boolean }) => {
  return (
    <p className='w-[24px] p-1 flex justify-center items-center h-[24px] rounded-full border-[#DEA004] border'>
      {showInner && (
        <p className='w-[12px] h-[12px] rounded-full border-[#DEA004] border-t-2 border-l-2'></p>
      )}
    </p>
  );
};

const PriceIntelligence = () => {
  // State for modal
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get price intelligence data
  const { data, isLoading, error } = useGetAllPriceIntelligence({ page: 1, size: 20 });

  // Get single item details when modal is open
  const { data: itemDetailsData, isLoading: isItemLoading, error: itemDetailsError } = useGetSinglePriceIntelligence(
    selectedItemId as string,
    !!selectedItemId
  );

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Price Intelligence", icon: false },
  ];

  if (isLoading) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <div className="text-red-500 p-4">Failed to load data. Please try again later.</div>
      </div>
    );
  }

  // Extract data safely
  const items = data?.data?.results || [];


  // Handle item click to open modal
  const handleItemClick = (itemId: string) => {
    console.log("🔍 Item clicked:", itemId);
    setSelectedItemId(itemId);
    setIsModalOpen(true);
    console.log("🔍 Modal should open now. State:", { selectedItemId: itemId, isModalOpen: true });
  };


  if (!items || items.length === 0) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <div className="text-gray-500 p-4">No price intelligence data available.</div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='grid grid-cols-2 gap-6'>
        {items.map((price: any) => (
          <Card
            key={price?.item_id || price?.id}
            className='h-[275px] relative hover:shadow-lg transition-shadow duration-200'
          >
            <button
              onClick={() => handleItemClick(price?.item_id || price?.id)}
              className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              type="button"
            />
            <div className='flex flex-col justify-between h-full pointer-events-none'>
              <div className='space-y-2 w-[70%]'>
                <div className="flex items-center justify-between">
                  <h2 className='text-lg font-semibold'>
                    {price?.item_name || price?.name || 'Unknown Item'}
                  </h2>
                  <Icon icon="ph:eye-duotone" className="text-blue-500 text-lg" />
                </div>
                <p className='text-sm leading-6'>
                  {price?.item_description || price?.description || 'No description available'}
                </p>
                <p className='text-xs text-blue-600 font-medium'>
                  Click to view details & price history
                </p>
              </div>
              <div className='space-y-4'>
                <div className='grid grid-cols-5 w-[40%]'>
                  <RatingCircle showInner />
                  <RatingCircle showInner />
                  <RatingCircle showInner />
                  <RatingCircle />
                  <RatingCircle />
                </div>
                <div className='flex items-center justify-between w-full'>
                  <div className='w-[50%] space-y-2'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-light'>
                        <span className='font-bold'>
                          ₦{Number(price?.min_price || 0).toLocaleString()}
                        </span>{" "}
                        Min
                      </p>
                      <p className='text-sm font-light'>
                        <span className='font-bold'>
                          ₦{Number(price?.max_price || 0).toLocaleString()}
                        </span>{" "}
                        Max
                      </p>
                    </div>
                    <Progress
                      value={0}
                      className='w-full h-4'
                    />
                  </div>
                  <div>
                    <Button className='bg-[#1A9B3E]'>
                      ₦{Number(price?.avg_price || 0).toLocaleString()}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Item Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon icon="ph:info-duotone" className="text-blue-600" />
              Item Details & Price History
            </DialogTitle>
          </DialogHeader>


          {isItemLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : itemDetailsData?.data ? (
            <ItemDetailsContent itemData={itemDetailsData.data} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load item details
              <p className="text-xs mt-2">Item ID: {selectedItemId}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component to display item details and price history
const ItemDetailsContent = ({ itemData }: { itemData: any }) => {
  console.log("🔍 Item Details Data Structure:", {
    fullData: itemData,
    availableFields: itemData ? Object.keys(itemData) : null,
    categoryField: itemData?.category,
    uomField: itemData?.uom,
    allFields: itemData
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | string) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Item Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon icon="ph:package-duotone" className="text-blue-600" />
            Item Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Item Name</label>
              <p className="text-gray-900">{itemData?.item_name || itemData?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-900">{itemData?.item_description || itemData?.description || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <p className="text-gray-900">{
                itemData?.category ||
                itemData?.item_category ||
                itemData?.category_name ||
                itemData?.type ||
                'N/A'
              }</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Unit of Measure</label>
              <p className="text-gray-900">{
                itemData?.uom ||
                itemData?.unit ||
                itemData?.unit_of_measure ||
                itemData?.measurement_unit ||
                'N/A'
              }</p>
            </div>

            {/* Additional fields if available */}
            {itemData?.item_code && (
              <div>
                <label className="text-sm font-medium text-gray-600">Item Code</label>
                <p className="text-gray-900">{itemData.item_code}</p>
              </div>
            )}

            {itemData?.brand && (
              <div>
                <label className="text-sm font-medium text-gray-600">Brand</label>
                <p className="text-gray-900">{itemData.brand}</p>
              </div>
            )}

            {itemData?.model && (
              <div>
                <label className="text-sm font-medium text-gray-600">Model</label>
                <p className="text-gray-900">{itemData.model}</p>
              </div>
            )}

            {itemData?.manufacturer && (
              <div>
                <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                <p className="text-gray-900">{itemData.manufacturer}</p>
              </div>
            )}

            {(itemData?.created_at || itemData?.date_created) && (
              <div>
                <label className="text-sm font-medium text-gray-600">Date Added</label>
                <p className="text-gray-900">{formatDate(itemData.created_at || itemData.date_created)}</p>
              </div>
            )}

            {(itemData?.updated_at || itemData?.date_updated) && (
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">{formatDate(itemData.updated_at || itemData.date_updated)}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon icon="ph:chart-line-duotone" className="text-green-600" />
            Price Summary
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Minimum</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(itemData?.min_price)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(itemData?.avg_price)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Maximum</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(itemData?.max_price)}</p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Price Range</span>
                <span>{formatCurrency(itemData?.min_price)} - {formatCurrency(itemData?.max_price)}</span>
              </div>
              <Progress
                value={50}
                className="h-2"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600">Total Records</span>
              <Badge variant="secondary">
                {itemData?.history?.length || Object.values(itemData?.source_prices || {}).flat().length || 0} entries
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Price History & Sources */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="ph:clock-countdown-duotone" className="text-purple-600" />
          Price History & Sources
        </h3>

        {(() => {
          // Combine both history and source_prices data
          const allPriceData: Array<{
            price: number;
            source: string;
            date: string;
            type: string;
            key: string;
          }> = [];

          // Add data from history array
          if (itemData?.history && itemData.history.length > 0) {
            itemData.history.forEach((hist: any, index: number) => {
              allPriceData.push({
                price: hist.price,
                source: hist.source || 'Direct',
                date: hist.date,
                type: 'History',
                key: `hist-${index}`
              });
            });
          }

          // Add data from source_prices object
          if (itemData?.source_prices) {
            Object.entries(itemData.source_prices).forEach(([source, prices]: [string, any]) => {
              if (Array.isArray(prices)) {
                prices.forEach((priceEntry: any, index: number) => {
                  allPriceData.push({
                    price: priceEntry.price,
                    source: source,
                    date: priceEntry.created_datetime,
                    type: 'Source',
                    key: `source-${source}-${index}`
                  });
                });
              }
            });
          }

          // Sort by date (newest first)
          allPriceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          return allPriceData.length > 0 ? (
            <div className="space-y-4">
              {/* Sources Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {Object.entries(itemData?.source_prices || {}).map(([source, prices]: [string, any]) => (
                  <div key={source} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-gray-700 capitalize">{source}</p>
                    <p className="text-xs text-gray-500">{Array.isArray(prices) ? prices.length : 0} records</p>
                    {Array.isArray(prices) && prices.length > 0 && (
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(prices[prices.length - 1]?.price || 0)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* All Price Records */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPriceData.slice(0, 12).map((record) => (
                  <div key={record.key} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">{formatCurrency(record.price)}</p>
                        <p className="text-sm text-gray-600 capitalize">{record.source}</p>
                      </div>
                      <Badge
                        variant={record.type === 'Source' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {record.type}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{record.date ? formatDate(record.date) : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span className="capitalize">{record.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {allPriceData.length > 12 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing 12 of {allPriceData.length} price records
                  </p>
                </div>
              )}

              {/* Enhanced Price Trend Analysis */}
              <div className="mt-6 space-y-4">
                {/* Basic Trend Indicators */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Price Trend Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:trend-up" className="text-red-500" />
                      <span>Highest: {formatCurrency(itemData?.max_price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:trend-down" className="text-green-500" />
                      <span>Lowest: {formatCurrency(itemData?.min_price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:chart-bar" className="text-blue-500" />
                      <span>Market Avg: {formatCurrency(itemData?.avg_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Price Change Management */}
                {(() => {
                  // Calculate price trends
                  const sortedPrices = allPriceData
                    .filter(record => record.price && record.date)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                  if (sortedPrices.length < 2) return null;

                  const latestPrice = sortedPrices[sortedPrices.length - 1];
                  const previousPrice = sortedPrices[sortedPrices.length - 2];
                  const oldestPrice = sortedPrices[0];

                  const recentChange = latestPrice.price - previousPrice.price;
                  const recentChangePercent = ((recentChange / previousPrice.price) * 100);
                  const overallChange = latestPrice.price - oldestPrice.price;
                  const overallChangePercent = ((overallChange / oldestPrice.price) * 100);

                  const priceVolatility = (() => {
                    if (sortedPrices.length < 3) return 0;
                    const prices = sortedPrices.map(p => p.price);
                    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                    const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
                    return Math.sqrt(variance) / avg * 100; // Coefficient of variation
                  })();

                  const getTrendIcon = (change: number) => {
                    if (change > 5) return { icon: "ph:trend-up", color: "text-red-500", label: "Rising Fast" };
                    if (change > 0) return { icon: "ph:arrow-up", color: "text-orange-500", label: "Increasing" };
                    if (change < -5) return { icon: "ph:trend-down", color: "text-green-500", label: "Declining Fast" };
                    if (change < 0) return { icon: "ph:arrow-down", color: "text-blue-500", label: "Decreasing" };
                    return { icon: "ph:minus", color: "text-gray-500", label: "Stable" };
                  };

                  const recentTrend = getTrendIcon(recentChangePercent);
                  const overallTrend = getTrendIcon(overallChangePercent);

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Recent Price Changes */}
                      <div className="p-4 bg-white border rounded-lg">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Icon icon="ph:clock-countdown" className="text-purple-600" />
                          Recent Price Changes
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Latest vs Previous:</span>
                            <div className="flex items-center gap-2">
                              <Icon icon={recentTrend.icon} className={recentTrend.color} />
                              <span className={`font-medium ${recentChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {recentChange >= 0 ? '+' : ''}{formatCurrency(recentChange)} ({recentChangePercent.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Overall Trend:</span>
                            <div className="flex items-center gap-2">
                              <Icon icon={overallTrend.icon} className={overallTrend.color} />
                              <span className={`font-medium ${overallChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {overallChange >= 0 ? '+' : ''}{formatCurrency(overallChange)} ({overallChangePercent.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Price Volatility:</span>
                            <Badge variant={priceVolatility > 20 ? "destructive" : priceVolatility > 10 ? "default" : "secondary"}>
                              {priceVolatility.toFixed(1)}% {priceVolatility > 20 ? "High" : priceVolatility > 10 ? "Medium" : "Low"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Price Management Alerts */}
                      <div className="p-4 bg-white border rounded-lg">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Icon icon="ph:warning-circle" className="text-yellow-600" />
                          Price Management Alerts
                        </h5>
                        <div className="space-y-2">
                          {recentChangePercent > 10 && (
                            <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
                              <Icon icon="ph:warning" className="text-red-500 mt-0.5" width={16} height={16} />
                              <div>
                                <p className="text-sm font-medium text-red-800">High Price Increase</p>
                                <p className="text-xs text-red-600">Recent price increased by {recentChangePercent.toFixed(1)}%</p>
                              </div>
                            </div>
                          )}
                          {priceVolatility > 20 && (
                            <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                              <Icon icon="ph:chart-line" className="text-yellow-500 mt-0.5" width={16} height={16} />
                              <div>
                                <p className="text-sm font-medium text-yellow-800">High Volatility</p>
                                <p className="text-xs text-yellow-600">Price fluctuates significantly</p>
                              </div>
                            </div>
                          )}
                          {latestPrice.price > (itemData?.avg_price * 1.2) && (
                            <div className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                              <Icon icon="ph:trend-up" className="text-orange-500 mt-0.5" width={16} height={16} />
                              <div>
                                <p className="text-sm font-medium text-orange-800">Above Market Average</p>
                                <p className="text-xs text-orange-600">Current price is 20%+ above average</p>
                              </div>
                            </div>
                          )}
                          {recentChangePercent <= 5 && overallChangePercent <= 5 && priceVolatility <= 10 && (
                            <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
                              <Icon icon="ph:check-circle" className="text-green-500 mt-0.5" width={16} height={16} />
                              <div>
                                <p className="text-sm font-medium text-green-800">Price Stable</p>
                                <p className="text-xs text-green-600">No significant price changes detected</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Icon icon="ph:chart-line-down" className="mx-auto text-4xl mb-2" />
              <p>No price history or sources available for this item</p>
            </div>
          );
        })()}
      </Card>

      {/* Price Management Recommendations */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon icon="ph:lightbulb-duotone" className="text-yellow-600" />
          Price Management Recommendations
        </h3>
        {(() => {
          const recommendations = [];
          const currentPrice = itemData?.avg_price || 0;
          const maxPrice = itemData?.max_price || 0;
          const minPrice = itemData?.min_price || 0;
          const priceRange = maxPrice - minPrice;
          const priceVariance = priceRange / minPrice * 100;

          // Generate recommendations based on price analysis
          if (priceVariance > 30) {
            recommendations.push({
              type: "warning",
              icon: "ph:warning-circle",
              title: "High Price Variance",
              description: "Consider establishing supplier agreements to stabilize pricing",
              action: "Negotiate long-term contracts with preferred suppliers"
            });
          }

          if (currentPrice > (minPrice * 1.5)) {
            recommendations.push({
              type: "info",
              icon: "ph:magnifying-glass",
              title: "Alternative Sourcing",
              description: "Current prices are significantly above minimum recorded",
              action: "Explore alternative suppliers or bulk purchasing options"
            });
          }

          if (maxPrice > (minPrice * 2)) {
            recommendations.push({
              type: "success",
              icon: "ph:chart-bar",
              title: "Price Monitoring",
              description: "Set up automated alerts for price changes >10%",
              action: "Implement price monitoring and threshold alerts"
            });
          }

          recommendations.push({
            type: "info",
            icon: "ph:calendar-check",
            title: "Regular Review",
            description: "Schedule quarterly price reviews and market analysis",
            action: "Set calendar reminders for price benchmarking"
          });

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  rec.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  rec.type === 'success' ? 'bg-green-50 border-green-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start gap-3">
                    <Icon
                      icon={rec.icon}
                      className={`mt-1 ${
                        rec.type === 'warning' ? 'text-yellow-600' :
                        rec.type === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`}
                    />
                    <div>
                      <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                      <p className="text-xs font-medium text-gray-800">{rec.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </Card>

      {/* Additional Information */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon icon="ph:info-duotone" className="text-indigo-600" />
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {itemData?.specifications && (
            <div>
              <label className="text-sm font-medium text-gray-600">Specifications</label>
              <p className="text-gray-900">{itemData.specifications}</p>
            </div>
          )}
          {itemData?.tags && (
            <div>
              <label className="text-sm font-medium text-gray-600">Tags</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {(Array.isArray(itemData.tags) ? itemData.tags : [itemData.tags]).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {itemData?.supplier_info && (
            <div>
              <label className="text-sm font-medium text-gray-600">Supplier Information</label>
              <p className="text-gray-900">{itemData.supplier_info}</p>
            </div>
          )}
        </div>
      </Card>

      {/* All Available Data Fields (Debug) */}
      <Card className="p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon icon="ph:database-duotone" className="text-gray-600" />
          All Available Data Fields
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {itemData && Object.entries(itemData).map(([key, value]) => {
            // Skip complex objects and arrays for now
            if (typeof value === 'object' && value !== null) {
              if (Array.isArray(value)) {
                return (
                  <div key={key} className="p-2 bg-white rounded border">
                    <label className="text-xs font-medium text-gray-600 capitalize block">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-xs text-gray-800">
                      Array with {value.length} items
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={key} className="p-2 bg-white rounded border">
                    <label className="text-xs font-medium text-gray-600 capitalize block">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-xs text-gray-800">
                      Object with {Object.keys(value).length} fields
                    </p>
                  </div>
                );
              }
            }

            return (
              <div key={key} className="p-2 bg-white rounded border">
                <label className="text-xs font-medium text-gray-600 capitalize block">
                  {key.replace(/_/g, ' ')}
                </label>
                <p className="text-xs text-gray-800 break-words">
                  {String(value) || 'N/A'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default PriceIntelligence;