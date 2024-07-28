export default function Article({ type, value, otherVal, svg }) {
  return (
    <div className="flex max-md:flex-col items-end justify-between rounded-lg gap-4">
      <div>
        <p className="text-sm text-gray-500">{type}</p>

        <p className="text-2xl font-medium text-gray-900">{value}</p>
      </div>

      <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
        {svg}
        <span className="text-xs font-medium"> {otherVal} </span>
      </div>
    </div>
  );
}
