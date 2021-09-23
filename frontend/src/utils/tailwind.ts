export function tailwingBgColorizer(value: string): string {
  let bgCol: string;
  switch (value) {
    //roles
    case "verifier":
      bgCol = "bg-purple-400";
      break;

    case "prover":
      bgCol = "bg-red-600";
      break;

    //status colors
    case "created":
      bgCol = "bg-gray-400";
      break;

    case "proposed":
      bgCol = "bg-blue-600";
      break;

    case "requested":
      bgCol = "bg-yellow-600";
      break;

    case "submitted":
      bgCol = "bg-green-400";
      break;

    default:
      break;
  }
  return bgCol;
}
