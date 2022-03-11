import { Text, Stack } from "@fluentui/react"
import { IChecklistDocument } from "../model/IChecklistDocument"
import Ft3asRadarChart from "./charts/Ft3asRadarChart"


interface IFt3asChartsProps {
    checklistDoc?: IChecklistDocument
}
export default function Ft3asCharts(props: IFt3asChartsProps) {
    return (
        <Stack>
            {props.checklistDoc ?
                (<Ft3asRadarChart checklistDoc={props.checklistDoc} />) :
                (<Text variant={'xLarge'} >No document selected</Text>)}
        </Stack>)
}