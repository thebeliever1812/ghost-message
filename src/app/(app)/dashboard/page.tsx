import DashboardComponent from '@/components/Home/DashboardComponent';
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: "Ghost Message user area: dashboard and anonymous question pages.",
};

const Dashboard = () => {

    return (
        <DashboardComponent />
    )
}

export default Dashboard
