import { FC, useEffect, useState } from 'react';
import '../styles/card.css';
import { Visit } from '../types/visit';
import { useStudents } from '../providers/StudentsProvider';
import { BarChart } from '@mui/x-charts/BarChart';

type GroupVisitsProps = {
    groupId: string;
    visits: Visit[];
    visitPlan: number;
    disciplineName: string;
}

const GroupVisits: FC<GroupVisitsProps> = ({ groupId, visits, visitPlan, disciplineName}) => {
    const { getStudentsByGroup } = useStudents();
    const [dataSet, setDataSet] = useState<{ student: string; visit: number }[]>([]);

    useEffect(() => {
        getStudentsByGroup(groupId)
            .then((students) => {
                if (students?.length) {
                    setDataSet(students?.map((s) => ({ student: `${s.name} ${s.surname}`, visit: visits.filter(v => v.studentId === s.id).length })));
                }
            })
    }, [groupId]);

    const getColor = (percent: number, start: number, end: number): string => {
        const a = percent / 100,
            b = (end - start) * a,
            c = b + start;

        return 'hsl(' + c + ', 100%, 50%)';
    }

    return (
        <BarChart
            margin={{ left: 100 }}
            dataset={dataSet}
            yAxis={[{ scaleType: 'band', dataKey: 'student', colorMap: { type: 'ordinal', colors: dataSet.map((set) => getColor((set.visit / (visitPlan / 100)), 0, 120)) } }]}
            series={[{ dataKey: 'visit', label: `${disciplineName} visits` }]}
            layout="horizontal"
            xAxis={[
                {
                    label: `${disciplineName} visit plan`,
                    max: visitPlan,
                    tickInterval: Array.from(Array(visitPlan + 1).keys()),
                    valueFormatter: (v) => Math.floor(v).toString(),
                },
            ]}
            height={600}
        />
    );
};

export default GroupVisits;