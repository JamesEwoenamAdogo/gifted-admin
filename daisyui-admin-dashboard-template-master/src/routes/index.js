// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const CompetitionDetails = lazy(() => import('../pages/protected/details'))
const AddOnsDetails = lazy(() => import('../pages/protected/details copy'))
const AddOns = lazy(() => import('../pages/protected/AddOns'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))
const UserDetails = lazy(() => import('../pages/protected/userDetails'))
const AddOnsInput = lazy(() => import('../pages/protected/AddOnsInput'))
const ExamsDetails = lazy(() => import('../pages/protected/examDetails'))
// const AssessmentManagement = lazy(() => import('../pages/protected/LearningManagement'))
const LearningManagement = lazy(() => import('../pages/protected/Instructor/index'))



const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
    path: '/addOns',
    component: AddOns,
  },
  {
    path: '/competitions',
    component: Leads,
  },
  {
    path:'/details',
    component: CompetitionDetails,

  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  // {
  //   path: '/assessment-management',
  //   component: AssessmentManagement,
  // },
  {
    path: '/learning-management',
    component: LearningManagement,
  },
  {
    path: '/all-users',
    component: Transactions,
  },
  {
    path: '/user-details',
    component: UserDetails,
  },
  {
    path: '/exam-details',
    component: ExamsDetails,
  },
  {
    path:"/addons-input",
    component: AddOnsInput
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/features',
    component: DocFeatures,
  },
  {
    path: '/components',
    component: DocComponents,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/addons-details',
    component: AddOnsDetails,
  },

]

export default routes
