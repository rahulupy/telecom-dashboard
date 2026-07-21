import Card from "../common/Card";
import { getTimeline } from "../../services/timelineService";

export default function TimelinePanel() {
  const timeline = getTimeline();

  return (
    <Card title="Timeline">
      <div className="space-y-4">
        {timeline.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border-l-4 border-blue-600 pl-4"
          >
            <div className="text-sm text-gray-500 w-16">
              {item.time}
            </div>

            <div>
              <p className="font-medium">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}