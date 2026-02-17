# UNIFIED MOBILE APP - ROLE-BASED ARCHITECTURE

**Platform:** React Native (iOS & Android)  
**Users:** Farmers + Village Admins (Role-Based Access)  
**Purpose:** Single app serving both farmers and village administrators with role-specific features

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Role-Based Architecture](#role-based-architecture)
3. [Authentication & Role Detection](#authentication--role-detection)
4. [Navigation Structure](#navigation-structure)
5. [Screen Organization](#screen-organization)
6. [Shared vs Role-Specific Components](#shared-vs-role-specific-components)
7. [API Access Control](#api-access-control)
8. [Implementation Guide](#implementation-guide)

---

## OVERVIEW

Instead of building two separate mobile apps (one for farmers, one for admins), we're building a **single unified mobile app** that adapts its UI and functionality based on the user's role.

### Why Unified App?

✅ **Single Codebase** - Easier maintenance and updates  
✅ **Shared Components** - Reuse common UI elements  
✅ **Consistent Experience** - Same look and feel for all users  
✅ **Single Distribution** - One app on Play Store/App Store  
✅ **Role Upgrades** - Easy to upgrade farmer to admin without new app  
✅ **Reduced Development Time** - Build once, deploy for all roles

### App Count: 2 Apps Total
1. **Mobile App (React Native)** - Unified app with role-based features
2. **Developer App (React Web)** - System monitoring and control

---

## ROLE-BASED ARCHITECTURE

### User Roles

#### 1. FARMER ROLE
- Default role for most users
- Focus on personal farm management
- Access to own data only
- Limited village-level visibility

**Key Features:**
- Dashboard with personal water needs
- My farms management
- Irrigation scheduling
- Water credits wallet
- Personal irrigation history

#### 2. ADMIN ROLE
- Village administrators and agriculture officers
- Village-wide data access
- Management and monitoring capabilities
- Approval and configuration powers

**Key Features:**
- Village dashboard with analytics
- All farmers list and monitoring
- Water source management
- Wastage and anomaly detection
- Simulation engine
- Approval system

---

## AUTHENTICATION & ROLE DETECTION

### Login Flow

```
1. User Opens App
   ↓
2. Splash Screen (checks stored auth)
   ↓
3. If Not Logged In → Role-Based Auth Screen
   ├─ Language Selector (Dropdown: English/Hindi/Marathi)
   ├─ Phone Number Input (+91)
   └─ Continue Button
   ↓
4. OTP Verification (Same Screen)
   ├─ Enter 6-digit OTP
   ├─ Verify Button
   └─ Resend OTP (after 30s)
   ↓
5. Backend Authenticates
   ↓
6. Response includes:
   - JWT Token
   - User Profile
   - User Role (FARMER or ADMIN)
   ↓
7. App Stores Role in:
   - Redux Store (authSlice)
   - AsyncStorage (persistence)
   - JWT Token Payload
   ↓
8. Navigate to Role-Specific Dashboard (Bento Grid Hub)
   ↓
9. User interacts with Bento tiles to navigate
```

### JWT Token Structure

```json
{
  "user_id": "user_123",
  "phone": "+919876543210",
  "name": "Ramesh Kumar",
  "role": "FARMER",  // or "ADMIN"
  "village_id": "village_001",
  "iat": 1708185600,
  "exp": 1708272000
}
```

### Role Storage

```typescript
// Redux Store
interface AuthState {
  isAuthenticated: boolean;
  user: User;
  role: 'FARMER' | 'ADMIN';
  token: string;
}

// AsyncStorage
await AsyncStorage.setItem('userRole', role);
await AsyncStorage.setItem('authToken', token);
```

---

## NAVIGATION STRUCTURE

### Root Navigator (RootNavigator.tsx)

```typescript
const RootNavigator = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  // Route based on role selected at login
  switch (role) {
    case 'FARMER':
      return <FarmerDashboard />; // Bento Style Hub
    case 'ADMIN':
      return <AdminDashboard />; // Bento Style Hub
    default:
      return <AuthStack />;
  }
};
```

### Hub-and-Spoke Navigation Pattern

**No Bottom Tabs - Dashboard is the Central Hub**

All screens are accessed from the main dashboard (hub) and return back to it. This simplifies navigation and reduces complexity.

```
        ┌─ My Farms
        │
        ├─ Irrigation Details
        │
Dashboard ─ Water Usage
(Hub)   │
        ├─ Alerts
        │
        └─ Weather
```

### Farmer Dashboard (Bento Grid - Hub)

**Replaced Bottom Tabs with Bento Grid Dashboard**

The dashboard uses a modern Bento grid layout with different sized cards/tiles for each major feature:

```
┌──────────────────────────────────┐
│  Farmer Dashboard (Bento Style)  │
├──────────────────────────────────┤
│                                  │
│  ┌────────┐  ┌────────────────┐ │
│  │ Farms  │  │  Irrigation    │ │
│  │ Tile   │  │  Details Tile  │ │
│  └────────┘  └────────────────┘ │
│                                  │
│  ┌──────────────┐  ┌──────────┐ │
│  │ Usage History│  │ Weather  │ │
│  │ Tile         │  │ Tile     │ │
│  └──────────────┘  └──────────┘ │
│                                  │
│  ┌────────┐                     │
│  │ Alerts │                     │
│  └────────┘                     │
└──────────────────────────────────┘
```

**Farmer Main Screens (from Dashboard):**
1. **Dashboard** (Bento Grid Hub) - Central navigation
2. **My Farms** - Farm management
3. **Irrigation Details** - Daily water recommendations
4. **Water Usage History** - Usage reports
5. **Alerts** - Notifications and alerts
6. **Weather Overview** - Weather forecast
7. **Profile** - Settings and account

### Admin Dashboard (Bento Grid - Hub)

**Replaced Bottom Tabs with Bento Grid Dashboard**

```
┌──────────────────────────────────┐
│   Admin Dashboard (Bento Style)  │
├──────────────────────────────────┤
│                                  │
│  ┌────────────┐  ┌────────────┐ │
│  │  Water     │  │  Village   │ │
│  │  Allocation│  │  Analytics │ │
│  └────────────┘  └────────────┘ │
│                                  │
│  ┌────────────┐  ┌────────────┐ │
│  │ Reservoir  │  │  Farmer    │ │
│  │  Status    │  │  Mgmt      │ │
│  └────────────┘  └────────────┘ │
│                                  │
│  ┌──────────────────────────┐   │
│  │      Profile             │   │
│  └──────────────────────────┘   │
└──────────────────────────────────┘
```

**Admin Main Screens (from Dashboard):**
1. **Dashboard** (Bento Grid Hub) - Central navigation
2. **Water Allocation** - Manage daily allocation
3. **Village Analytics** - Reports and insights
4. **Reservoir Status** - Water source monitoring
5. **Farmer Management** - User management
6. **Profile** - Settings and account

---

## SCREEN ORGANIZATION

### Folder Structure

```
src/
├── screens/
│   ├── auth/                    # Shared authentication screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── OTPScreen.tsx
│   │
│   ├── shared/                  # Shared across all roles
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── HelpScreen.tsx
│   │
│   ├── farmer/                  # Farmer-specific screens
│   │   ├── FarmerDashboard.tsx
│   │   ├── MyFarmsScreen.tsx
│   │   ├── FarmDetailsScreen.tsx
│   │   ├── AddFarmScreen.tsx
│   │   ├── IrrigationScheduleScreen.tsx
│   │   ├── WaterPredictionScreen.tsx
│   │   ├── LogIrrigationScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   └── IrrigationHistoryScreen.tsx
│   │
│   └── admin/                   # Admin-specific screens
│       ├── AdminDashboard.tsx
│       ├── VillageWaterStatus.tsx
│       ├── FarmersListScreen.tsx
│       ├── FarmerDetailsScreen.tsx
│       ├── WaterAllocationScreen.tsx
│       ├── WastageReportsScreen.tsx
│       ├── AnomalyDetectionScreen.tsx
│       ├── SimulationEngineScreen.tsx
│       ├── AnalyticsScreen.tsx
│       └── WaterSourcesScreen.tsx
```

### Screen Count Summary

**Shared Screens (Both Roles):** 8 screens
- Splash
- Login
- Register
- OTP
- Profile
- Settings
- Notifications
- Help & Support

**Farmer-Only Screens:** 11 screens
- Farmer Dashboard
- My Farms
- Add/Edit Farm
- Farm Details
- Add/Edit Crop
- Irrigation Schedule
- Water Prediction
- Log Irrigation
- Wallet (Credits)
- Irrigation History
- Weather Forecast

**Admin-Only Screens:** 13 screens
- Admin Dashboard
- Village Water Status
- Water Allocation
- Farmers List
- Farmer Details
- Wastage Reports
- Anomaly Detection
- Crop Recommendations
- Simulation Engine
- Run Simulation
- Water Sources Management
- Analytics & Reports
- Approval Requests

**Total Unique Screens:** 32 screens

---

## SHARED VS ROLE-SPECIFIC COMPONENTS

### Shared Components (Both Roles)

```typescript
components/
├── shared/
│   ├── CustomButton.tsx         // Buttons
│   ├── CustomInput.tsx          // Text inputs
│   ├── CustomDropdown.tsx       // Dropdowns
│   ├── LoadingSpinner.tsx       // Loading indicator
│   ├── EmptyState.tsx           // No data state
│   ├── ErrorMessage.tsx         // Error display
│   ├── Card.tsx                 // Card container
│   ├── Header.tsx               // Screen header
│   ├── DatePicker.tsx           // Date picker
│   ├── TimePicker.tsx           // Time picker
│   └── NotificationCard.tsx     // Notification item
```

### Farmer-Specific Components

```typescript
components/
├── farmer/
│   ├── FarmCard.tsx             // Farm display card
│   ├── CropCard.tsx             // Crop info card
│   ├── ScheduleCard.tsx         // Schedule item
│   ├── WeatherCard.tsx          // Weather display
│   ├── CreditTransaction.tsx    // Credit history item
│   └── IrrigationHistoryCard.tsx // History record
```

### Admin-Specific Components

```typescript
components/
├── admin/
│   ├── WaterStatusCard.tsx      // Water status display
│   ├── FarmerCard.tsx           // Farmer info card
│   ├── AllocationCard.tsx       // Allocation item
│   ├── WastageIncidentCard.tsx  // Wastage report
│   ├── AnomalyCard.tsx          // Anomaly display
│   ├── SimulationCard.tsx       // Simulation result
│   ├── WaterSourceCard.tsx      // Water source
│   ├── Chart.tsx                // Analytics charts
│   └── StatCard.tsx             // Statistics card
```

---

## API ACCESS CONTROL

### Role-Based Endpoints

#### Public Endpoints (No Auth)
```
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/register
```

#### Farmer Endpoints (FARMER role)
```
GET  /farms                      // User's farms only
POST /farms
PUT  /farms/:id
GET  /crops/by-farm/:farmId      // User's crops only
POST /crops
POST /irrigation/predict         // For user's farms only
POST /irrigation/log             // For user's farms only
GET  /irrigation/schedule        // User's schedule only
GET  /credits/balance            // User's credits only
GET  /weather/current
```

#### Admin Endpoints (ADMIN role)
```
GET  /admin/dashboard/summary
GET  /admin/village/water-status
GET  /admin/farmers              // All farmers
GET  /admin/farmers/:id
GET  /admin/allocations
GET  /admin/wastage/incidents
GET  /admin/anomalies
GET  /admin/simulations
POST /admin/simulations/run
GET  /admin/water-sources
POST /admin/water-sources
GET  /admin/requests             // Approval requests
PUT  /admin/requests/:id/approve
```

#### Shared Endpoints (Both Roles)
```
GET  /users/profile
PUT  /users/profile
GET  /notifications
PUT  /notifications/:id/read
```

### Middleware Role Check

```javascript
// Backend middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user; // From JWT
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

// Usage
router.get('/admin/farmers', 
  authenticate, 
  requireRole(['ADMIN']), 
  getFarmers
);
```

---

## IMPLEMENTATION GUIDE

### Step 1: Authentication Setup

```typescript
// authSlice.ts
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: 'FARMER' | 'ADMIN' | null;
  token: string | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
    }
  }
});
```

### Step 2: Custom Hook for Role

```typescript
// useRole.ts
import { useSelector } from 'react-redux';

export const useRole = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  
  const isFarmer = role === 'FARMER';
  const isAdmin = role === 'ADMIN';
  
  return {
    role,
    isFarmer,
    isAdmin
  };
};

// Usage in components
const MyComponent = () => {
  const { isFarmer, isAdmin } = useRole();
  
  return (
    <View>
      {isFarmer && <FarmerFeature />}
      {isAdmin && <AdminFeature />}
    </View>
  );
};
```

### Step 3: Protected Routes

```typescript
// RoleProtectedScreen.tsx
const RoleProtectedScreen = ({ 
  allowedRoles, 
  children 
}: RoleProtectedScreenProps) => {
  const { role } = useRole();
  
  if (!allowedRoles.includes(role)) {
    return <UnauthorizedScreen />;
  }
  
  return <>{children}</>;
};

// Usage
<RoleProtectedScreen allowedRoles={['ADMIN']}>
  <AdminDashboard />
</RoleProtectedScreen>
```

### Step 4: API Client with Role

```typescript
// apiClient.ts
import axios from 'axios';
import { store } from './store';

const api = axios.create({
  baseURL: 'https://api.example.com',
});

api.interceptors.request.use((config) => {
  const { token, role } = store.getState().auth;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-User-Role'] = role; // Optional
  }
  
  return config;
});

export default api;
```

### Step 5: Conditional Navigation

```typescript
// App.tsx
const App = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : role === 'FARMER' ? (
        <FarmerNavigator />
      ) : (
        <AdminNavigator />
      )}
    </NavigationContainer>
  );
};
```

---

## BENEFITS OF UNIFIED APP

### For Development
✅ Single codebase to maintain  
✅ Shared components reduce duplication  
✅ Consistent styling and UX  
✅ Easier to implement shared features  
✅ Single CI/CD pipeline

### For Users
✅ Single app download  
✅ Consistent experience  
✅ Role upgrades without new app  
✅ Smaller app size (shared code)  
✅ Same update cycle

### For Business
✅ Reduced development cost  
✅ Faster time to market  
✅ Single app listing on stores  
✅ Unified analytics  
✅ Easier A/B testing

---

## SECURITY CONSIDERATIONS

### Role Validation
- ✅ Always verify role on backend
- ✅ Don't trust client-side role checks
- ✅ Include role in JWT token
- ✅ Validate role on every API call
- ✅ Log role-based access attempts

### Role Switching Prevention
- ❌ Users cannot change their own role
- ❌ No role selection at login
- ✅ Role assigned at registration
- ✅ Role upgrades only by system admin
- ✅ Role changes logged in audit log

### Data Isolation
- Farmers see only their own data
- Admins see village-wide data
- Backend enforces data access rules
- No client-side data filtering only

---

## TESTING STRATEGY

### Role-Based Tests

```typescript
describe('Role-Based Navigation', () => {
  it('should show farmer dashboard for farmer role', () => {
    const { getByText } = render(
      <App initialRole="FARMER" />
    );
    expect(getByText('My Farms')).toBeTruthy();
  });

  it('should show admin dashboard for admin role', () => {
    const { getByText } = render(
      <App initialRole="ADMIN" />
    );
    expect(getByText('Village Dashboard')).toBeTruthy();
  });

  it('should not allow farmer to access admin screens', () => {
    const { queryByText } = render(
      <App initialRole="FARMER" />
    );
    expect(queryByText('Water Sources')).toBeNull();
  });
});
```

---

## MIGRATION PATH

### From Current Plan
Currently documented: 2 separate apps (farmer + admin)  
**New Plan:** 1 unified app with role-based access

### Existing Documentation
- ✅ Farmer App UI Architecture (farmer-app-ui-architecture.md)
- ✅ Admin App UI Architecture (admin-app-ui-architecture.md)

**Use these docs as reference:**
- Farmer doc → Farmer screens and features
- Admin doc → Admin screens and features
- Merge into single unified app

### No Wasted Work
All existing documentation is still valid:
- All screens are implemented
- All APIs are documented
- All wireframes are ready
- Just organized differently in code

---

## SUMMARY

**Before:** 3 apps (Farmer Mobile + Admin Mobile + Developer Web)  
**Now:** 2 apps (Unified Mobile with Roles + Developer Web)

**Architecture:** Single React Native app with:
- Role-based authentication
- Dynamic navigation
- Conditional rendering
- Shared + role-specific screens
- Backend role validation

**Result:** Simpler, more maintainable, faster to build! 🚀

---

**END OF UNIFIED MOBILE APP ARCHITECTURE**
