/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import { FaArrowsAltH } from "react-icons/fa";
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '/app/all-users', // url
    icon: <CurrencyDollarIcon className={iconClasses}/>, // icon component
    name: 'All Users', // name that appear in Sidebar
  },
  {
    path: '/app/competitions', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'Competitions', // name that appear in Sidebar
  },
  {
    path: '/app/learning-management', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'Learning Management', // name that appear in Sidebar
  },
  {
    path: '/app/assessment-management', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'Assessment Management', // name that appear in Sidebar
  },
  {
    path:"/app/fetch-scores",
    name:"Quiz Results"
  },
  {
    path:"/app/feedback",
    name:"Feedback"
  },
  {
    path:"/app/flashcard",
    name:"FlashCard"
  },
  {
    path:"/app/timed-challenge",
    name:"Timed Challenge"
  },
 
  {
    path: '/app/addOns', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'AddOns', // name that appear in Sidebar
  },
  {
    path: '/app/settings-billing', // url
    icon: <FaArrowsAltH className={iconClasses}/>, // icon component
    name: 'Transactions', // name that appear in Sidebar
  },
  {
    path: '/app/community-management', // url
    icon: <FaArrowsAltH className={iconClasses}/>, // icon component
    name: 'Community', // name that appear in Sidebar
  },
  {
    path: '/app/interest-page', // url
    icon: <FaArrowsAltH className={iconClasses}/>, // icon component
    name: 'Interest', // name that appear in Sidebar
  },
 
  // {
  //   path: '/app/charts', // url
  //   icon: <ChartBarIcon className={iconClasses}/>, // icon component
  //   name: 'Analytics', // name that appear in Sidebar
  // },
 
  {
    path: '/app/calendar', // url
    icon: <CalendarDaysIcon className={iconClasses}/>, // icon component
    name: 'Calendar', // name that appear in Sidebar
  },


  
]

export default routes


