// All components mapping with path for internal routes

import { lazy } from 'react'
// import InterestPage from '../pages/protected/InterestPage'

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
const AssessmentManagement = lazy(() => import('../pages/protected/AssessmentManagement'))
const AddQuiz = lazy(() => import('../pages/protected/AddQuiz'))
const AddCourse = lazy(() => import('../pages/protected/AddCourse'))
const AllQuizzes = lazy(() => import('../pages/protected/AllQuizzes'))
const AllCourses = lazy(() => import('../pages/protected/AllCourses'))
const LearningManagement = lazy(() => import('../pages/protected/LearningManagement'))
const CommunityManagement = lazy(() => import('../pages/protected/CommunityManagement'))
const AddGroup = lazy(() => import('../pages/protected/AddGroups'))
const QuizDetails = lazy(() => import('../pages/protected/QuizDetails'))
const CourseDetails = lazy(() => import('../pages/protected/CourseDetails'))
const InterestPage = lazy(() => import('../pages/protected/InterestPage'))
const AddInterest = lazy(() => import('../pages/protected/AddInterest'))
const AllInterest = lazy(() => import('../pages/protected/AllInterest'))
const EditCompetition = lazy(() => import('../pages/protected/EditCompetition'))
const QuizScores = lazy(() => import('../pages/protected/QuizScores'))
const singleCoursePage = lazy(() => import('../pages/protected/SingleCourseDetail'))
const AllCommunities = lazy(() => import('../pages/protected/AllCommunities'))
const GroupDetails = lazy(() => import('../pages/protected/GroupDetails'))
const Feedback = lazy(() => import('../pages/protected/Feedback'))
const AddCourseModule = lazy(() => import('../pages/protected/AddCourseModule'))






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
  {
    path: '/assessment-management',
    component: AssessmentManagement,
  },
  {
    path:'/edit-competition',
    component:EditCompetition
  },
  {
    path: '/learning-management',
    component: LearningManagement,
  },
  {
    path: '/quiz-details',
    component: QuizDetails,
  },
  {
    path: '/course-details',
    component: CourseDetails,
  },
  {
    path: '/add-quiz',
    component: AddQuiz,
  },
  {
    path: '/add-group',
    component: AddGroup,
  },
  {
    path: '/add-course',
    component: AddCourse,
  },
  {
    path: '/interest-page',
    component: InterestPage,
  },
  {
    path: '/add-interest',
    component: AddInterest,
  },
  {
    path: '/all-interest',
    component: AllInterest,
  },
  {
    path: '/all-groups',
    component: AllCommunities,
  },
  {
    path: '/group-details',
    component: GroupDetails,
  },
  {
    path: '/community-management',
    component: CommunityManagement,
  },
  {
    path: '/quizzes',
    component: AllQuizzes,
  },
  {
    path: '/courses',
    component: AllCourses,
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
    path:"/fetch-scores",
    component: QuizScores
  },
  {
    path:"/add-module",
    component: AddCourseModule
  },
  {
    path:"/feedback",
    component: Feedback
  },
  {
    path:"/single-course",
    component:singleCoursePage
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
