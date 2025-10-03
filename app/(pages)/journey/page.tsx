import { Timeline } from "@/components/extended/timeline";
import { journey_data } from "~/data/journey";


export default function JourneyPage() {

    return  <Timeline data={journey_data} />
}