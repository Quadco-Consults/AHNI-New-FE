# TanStack Query Controllers Migration - Modules

This document summarizes the completed migration of all remaining module services from RTK Query to TanStack Query controllers.

## Completed Migrations

### Admin Module (`/src/features/modules/controllers/admin/`)
1. **assetConditionController.ts** - Asset Conditions CRUD operations
2. **assetTypeController.ts** - Asset Types CRUD operations

### Contracts & Grants Module (`/src/features/modules/controllers/cg/`)
1. **preAwardQuestionController.ts** - Pre-award Questions CRUD operations

### Procurement Module (`/src/features/modules/controllers/procurement/`)
1. **lotController.ts** - Lots CRUD operations
2. **prequalificationCategoryController.ts** - Prequalification Categories CRUD operations
3. **prequalificationCriteriaController.ts** - Prequalification Criteria CRUD operations
4. **questionnaireController.ts** - Questionnaires CRUD operations
5. **solicitationEvaluationCriteriaController.ts** - Solicitation Evaluation Criteria CRUD operations

### Program Module (`/src/features/modules/controllers/program/`)
1. **facilityController.ts** - Facilities CRUD operations
2. **interventionAreaController.ts** - Intervention Areas CRUD operations
3. **riskCategoryController.ts** - Risk Categories CRUD operations
4. **supervisionCategoryController.ts** - Supervision Categories CRUD operations
5. **supervisionCriteriaController.ts** - Supervision Criteria CRUD operations

### Project Module (`/src/features/modules/controllers/project/`)
1. **beneficiaryController.ts** - Beneficiaries CRUD operations
2. **documentTypeController.ts** - Document Types CRUD operations
3. **fundingSourceController.ts** - Funding Sources CRUD operations
4. **partnerController.ts** - Partners CRUD operations

## TypeScript Types Created

All corresponding TypeScript interfaces have been created in `/src/features/modules/types/`:

- **admin/index.ts** - AssetConditionData, AssetTypeData types
- **cg/index.ts** - PreAwardQuestionData types
- **procurement/index.ts** - Lot, Prequalification, Questionnaire, Solicitation types
- **program/index.ts** - Facility, InterventionArea, RiskCategory, Supervision types  
- **project/index.ts** - Beneficiary, DocumentType, FundingSource, Partner types

## Controller Pattern

All controllers follow the established TanStack Query pattern:

### GET Operations (Queries)
```typescript
export const useGetAllEntitiesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<EntityData>>({
    queryKey: ["entities", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/endpoint/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};
```

### CREATE/UPDATE/DELETE Operations (Mutations)
```typescript
export const CreateEntityManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EntityData,
    Error,
    EntityFormValues
  >({
    endpoint: "/endpoint/",
    queryKey: ["entities"],
    isAuth: true,
    method: "POST",
  });

  const createEntity = async (details: EntityFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Entity creation error:", error);
    }
  };

  return { createEntity, data, isLoading, isSuccess, error };
};
```

## Backward Compatibility

All controllers maintain backward compatibility with legacy RTK Query exports:

```typescript
// Legacy RTK Query style exports
export const useGetAllEntitiesQuery = useGetAllEntitiesManager;

export const useAddEntityMutation = () => {
  const { createEntity, data, isLoading, isSuccess, error } = CreateEntityManager();
  return [createEntity, { data, isLoading, isSuccess, error }] as const;
};
```

## Usage Examples

### Using the New Controllers

```typescript
import { 
  useGetAllAssetConditionsManager,
  CreateAssetConditionManager
} from '@/features/modules/controllers/admin';

// In a React component
const MyComponent = () => {
  // GET data
  const { data: assetConditions, isLoading } = useGetAllAssetConditionsManager({
    page: 1,
    size: 10,
    search: "active"
  });

  // CREATE mutation
  const { createAssetCondition, isLoading: creating } = CreateAssetConditionManager();

  const handleCreate = async (formData) => {
    await createAssetCondition(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {assetConditions?.results.map(condition => (
        <div key={condition.id}>{condition.name}</div>
      ))}
      <button onClick={() => handleCreate({ name: "New Condition" })}>
        {creating ? "Creating..." : "Create"}
      </button>
    </div>
  );
};
```

### Using Legacy Imports (Backward Compatibility)

```typescript
import { 
  useGetAllAssetConditionQuery,
  useAddAssetConditionMutation
} from '@/features/modules/controllers/admin';

// Legacy RTK Query style usage still works
const { data, isLoading } = useGetAllAssetConditionQuery({ page: 1, size: 10 });
const [createAssetCondition, { isLoading: creating }] = useAddAssetConditionMutation();
```

## File Structure

```
/src/features/modules/
├── controllers/
│   ├── admin/
│   │   ├── assetConditionController.ts
│   │   ├── assetTypeController.ts
│   │   └── index.ts
│   ├── cg/
│   │   ├── preAwardQuestionController.ts
│   │   └── index.ts
│   ├── procurement/
│   │   ├── lotController.ts
│   │   ├── prequalificationCategoryController.ts
│   │   ├── prequalificationCriteriaController.ts
│   │   ├── questionnaireController.ts
│   │   ├── solicitationEvaluationCriteriaController.ts
│   │   └── index.ts
│   ├── program/
│   │   ├── facilityController.ts
│   │   ├── interventionAreaController.ts
│   │   ├── riskCategoryController.ts
│   │   ├── supervisionCategoryController.ts
│   │   ├── supervisionCriteriaController.ts
│   │   └── index.ts
│   ├── project/
│   │   ├── beneficiaryController.ts
│   │   ├── documentTypeController.ts
│   │   ├── fundingSourceController.ts
│   │   ├── partnerController.ts
│   │   └── index.ts
│   └── index.ts (exports all controllers)
└── types/
    ├── admin/index.ts
    ├── cg/index.ts
    ├── procurement/index.ts
    ├── program/index.ts
    ├── project/index.ts
    └── index.ts (exports all types)
```

## Migration Complete

All 17 remaining module services have been successfully migrated to TanStack Query controllers with:

✅ Full CRUD operations (GET, CREATE, UPDATE, DELETE)  
✅ Type safety with comprehensive TypeScript interfaces  
✅ Backward compatibility with legacy RTK Query exports  
✅ Consistent controller patterns  
✅ Proper error handling and loading states  
✅ Query key management for cache invalidation  

The migration maintains 100% backward compatibility while providing the improved performance and developer experience of TanStack Query.