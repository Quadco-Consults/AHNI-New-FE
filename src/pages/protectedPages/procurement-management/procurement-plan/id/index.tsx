import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import ProcurementPlan from './ProcurementPlan'
import ProcurementMilestones from './ProcurementMilestones'
import LongArrowLeft from 'components/icons/LongArrowLeft'

type Props = {}

const ProcurementDetails = (props: Props) => {
    const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  };
  return (
    <div className='space-y-6 relative min-h-screen'>
        <button onClick={goBack} className="w-[3rem] absolute top-0 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center">
        <LongArrowLeft />
      </button>
        <Tabs defaultValue="procurement_plan">
        <div className="relative ml-16">
        <TabsList>
          <TabsTrigger value="procurement_plan">Procurement Plan</TabsTrigger>
          <TabsTrigger value="procurement_milestones">Procurement Milestones</TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="procurement_plan">
          <ProcurementPlan />
        </TabsContent>
        <TabsContent value="procurement_milestones">
          <ProcurementMilestones />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProcurementDetails