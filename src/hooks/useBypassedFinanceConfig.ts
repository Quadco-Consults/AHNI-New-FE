/**
 * CUSTOM HOOK FOR BYPASSED FINANCE CONFIGURATION DATA
 *
 * This hook attempts to bypass permission filtering to get complete finance config data
 */

import { useState, useEffect } from 'react';
import { attemptUnrestrictedConfigFetch, type BypassedAPIResponse } from '@/utils/bypassPermissionFiltering';

interface FinanceConfigData {
  budgetLines: any[];
  costCategories: any[];
  costInputs: any[];
  fcoNumbers: any[];
  fundingSources: any[];
  interventionAreas: any[];
}

interface UseBypassedFinanceConfigResult {
  data: FinanceConfigData;
  isLoading: boolean;
  errors: Record<string, any>;
  sources: Record<string, string>;
}

export function useBypassedFinanceConfig(): UseBypassedFinanceConfigResult {
  const [data, setData] = useState<FinanceConfigData>({
    budgetLines: [],
    costCategories: [],
    costInputs: [],
    fcoNumbers: [],
    fundingSources: [],
    interventionAreas: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [sources, setSources] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllConfigs = async () => {
      setIsLoading(true);
      console.log("🚀 Starting comprehensive finance config bypass fetch...");

      const configEndpoints = [
        { key: 'budgetLines', endpoint: '/finance/budget-lines/', name: 'Budget Lines' },
        { key: 'costCategories', endpoint: '/finance/cost-categories/', name: 'Cost Categories' },
        { key: 'costInputs', endpoint: '/finance/cost-inputs/', name: 'Cost Inputs' },
        { key: 'fcoNumbers', endpoint: '/finance/fco-numbers/', name: 'FCO Numbers' },
        { key: 'fundingSources', endpoint: '/project/funding-sources/', name: 'Funding Sources' },
        { key: 'interventionAreas', endpoint: '/program/intervention-areas/', name: 'Intervention Areas' }
      ];

      const newData: FinanceConfigData = {
        budgetLines: [],
        costCategories: [],
        costInputs: [],
        fcoNumbers: [],
        fundingSources: [],
        interventionAreas: []
      };

      const newErrors: Record<string, any> = {};
      const newSources: Record<string, string> = {};

      for (const config of configEndpoints) {
        try {
          console.log(`🔍 Fetching ${config.name}...`);
          const result: BypassedAPIResponse = await attemptUnrestrictedConfigFetch(
            config.endpoint,
            config.name
          );

          if (result.success) {
            // Extract results from the response
            const results = result.data?.data?.results || result.data?.results || [];
            newData[config.key as keyof FinanceConfigData] = results;
            newSources[config.key] = result.source;
            console.log(`✅ ${config.name}: ${results.length} items from ${result.source}`);
          } else {
            // Even if bypass failed, use whatever data we got
            const results = result.data?.data?.results || result.data?.results || [];
            newData[config.key as keyof FinanceConfigData] = results;
            newSources[config.key] = result.source || 'failed';
            newErrors[config.key] = result.error;
            console.warn(`⚠️ ${config.name}: Only ${results.length} items (permission filtered)`);
          }
        } catch (error) {
          console.error(`❌ Failed to fetch ${config.name}:`, error);
          newErrors[config.key] = error;
          newSources[config.key] = 'error';
        }
      }

      setData(newData);
      setErrors(newErrors);
      setSources(newSources);
      setIsLoading(false);

      console.log("🎯 Comprehensive finance config fetch complete:");
      console.log("Data:", newData);
      console.log("Sources:", newSources);
      console.log("Errors:", newErrors);
    };

    fetchAllConfigs();
  }, []);

  return { data, isLoading, errors, sources };
}