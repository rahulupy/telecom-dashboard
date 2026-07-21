import Card from "../common/Card";

const activities = [
  "Officer opened case",
  "Map refreshed",
  "Alert generated",
  "Search radius updated",
];

export default function ActivityPanel() {
  return (
    <Card title="Activity Feed">
      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="border-b pb-2 text-gray-700"
          >
            {activity}
          </li>
        ))}
      </ul>
    </Card>
  );
}